import numpy as np
import cv2
from collections import deque
import time
import threading
import speech_recognition as sr

clear_requested = False

def voice_listener():
    global clear_requested
    recognizer = sr.Recognizer()
    mic = sr.Microphone()
    while True:
        with mic as source:
            try:
                audio = recognizer.listen(source, timeout=3)
                command = recognizer.recognize_google(audio).lower()
                print(f"🎙️ Heard: {command}")
                if "clear" in command:
                    clear_requested = True
            except:
                pass

# === Drawing Color Buttons ===
colors = [(255, 0, 0), (0, 255, 0), (0, 0, 255), (0, 255, 255)]
colorIndex = 0
kernel = np.ones((5, 5), np.uint8)

# === Color Buffers ===
bpoints = [deque(maxlen=1024)]
gpoints = [deque(maxlen=1024)]
rpoints = [deque(maxlen=1024)]
ypoints = [deque(maxlen=1024)]
blue_index = green_index = red_index = yellow_index = 0

# === Paint Window Setup ===
paintWindow = np.zeros((471, 636, 3)) + 255
buttons = [(40, "CLEAR"), (160, "BLUE"), (275, "GREEN"), (390, "RED"), (505, "YELLOW")]
for x, label in buttons:
    color = (0, 0, 0) if label == "CLEAR" else colors[buttons.index((x, label)) - 1]
    cv2.rectangle(paintWindow, (x, 1), (x + 100, 65), color, -1)
    cv2.putText(paintWindow, label, (x + 10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 
                (255, 255, 255) if label != "CLEAR" else (0, 0, 0), 2)
cv2.namedWindow('Paint', cv2.WINDOW_AUTOSIZE)

# === Start Voice Listener ===
threading.Thread(target=voice_listener, daemon=True).start()

# === Start Webcam ===
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    frame = cv2.flip(frame, 1)
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    # 🎤 Voice: Clear Canvas
    if clear_requested:
        print("🧹 Canvas cleared via voice!")
        clear_requested = False
        bpoints = [deque(maxlen=1024)]
        gpoints = [deque(maxlen=1024)]
        rpoints = [deque(maxlen=1024)]
        ypoints = [deque(maxlen=1024)]
        blue_index = green_index = red_index = yellow_index = 0
        paintWindow[67:,:,:] = 255

    # === Draw Top Buttons on Frame ===
    for x, label in buttons:
        color = (122, 122, 122) if label == "CLEAR" else colors[buttons.index((x, label)) - 1]
        cv2.rectangle(frame, (x, 1), (x + 100, 65), color, -1)
        cv2.putText(frame, label, (x + 10, 35), cv2.FONT_HERSHEY_SIMPLEX, 0.5, 
                    (255,255,255) if label != "CLEAR" else (0,0,0), 2)

    # 🎯 Detect Pink Object (Hardcoded HSV Range)
    lower_pink = np.array([140, 100, 100])
    upper_pink = np.array([170, 255, 255])

    mask = cv2.inRange(hsv, lower_pink, upper_pink)
    mask = cv2.erode(mask, kernel, iterations=1)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    mask = cv2.dilate(mask, kernel, iterations=1)

    contours, _ = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    center = None

    if contours:
        cnt = sorted(contours, key=cv2.contourArea, reverse=True)[0]
        ((x, y), radius) = cv2.minEnclosingCircle(cnt)
        cv2.circle(frame, (int(x), int(y)), int(radius), (255, 0, 255), 2)  # 💡 Circle is pink too
        M = cv2.moments(cnt)
        if M["m00"] != 0:
            center = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))

        # === If touching button area ===
        if center and center[1] <= 65:
            if 40 <= center[0] <= 140:
                bpoints = [deque(maxlen=1024)]
                gpoints = [deque(maxlen=1024)]
                rpoints = [deque(maxlen=1024)]
                ypoints = [deque(maxlen=1024)]
                blue_index = green_index = red_index = yellow_index = 0
                paintWindow[67:, :, :] = 255
            elif 160 <= center[0] <= 255:
                colorIndex = 0
            elif 275 <= center[0] <= 370:
                colorIndex = 1
            elif 390 <= center[0] <= 485:
                colorIndex = 2
            elif 505 <= center[0] <= 600:
                colorIndex = 3
        else:
            if colorIndex == 0:
                bpoints[blue_index].appendleft(center)
            elif colorIndex == 1:
                gpoints[green_index].appendleft(center)
            elif colorIndex == 2:
                rpoints[red_index].appendleft(center)
            elif colorIndex == 3:
                ypoints[yellow_index].appendleft(center)
    else:
        bpoints.append(deque(maxlen=1024)); blue_index += 1
        gpoints.append(deque(maxlen=1024)); green_index += 1
        rpoints.append(deque(maxlen=1024)); red_index += 1
        ypoints.append(deque(maxlen=1024)); yellow_index += 1

    # === Draw on Canvas and Frame ===
    points = [bpoints, gpoints, rpoints, ypoints]
    for i, color in enumerate(colors):
        for j in range(len(points[i])):
            for k in range(1, len(points[i][j])):
                if points[i][j][k - 1] is None or points[i][j][k] is None:
                    continue
                cv2.line(frame, points[i][j][k - 1], points[i][j][k], color, 2)
                cv2.line(paintWindow, points[i][j][k - 1], points[i][j][k], color, 2)

    cv2.imshow("Tracking", frame)
    cv2.imshow("Paint", paintWindow)
    cv2.imshow("Mask", mask)

    key = cv2.waitKey(1) & 0xFF
    if key == ord("s"):
        filename = f"drawing_{int(time.time())}.png"
        cv2.imwrite(filename, paintWindow)
        print(f"✅ Saved: {filename}")

    if key == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
