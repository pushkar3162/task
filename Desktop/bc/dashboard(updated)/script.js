const setup = () => {
  const getTheme = () => {
    if (window.localStorage.getItem("dark")) {
      return JSON.parse(window.localStorage.getItem("dark"));
    }
    return (
      !!window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  };

  const setTheme = (value) => {
    window.localStorage.setItem("dark", value);
  };

  return {
    loading: true,
    isDark: getTheme(),
    toggleTheme() {
      this.isDark = !this.isDark;
      setTheme(this.isDark);
    },
  };
};
// handled file displaying logic
const fileInput = document.getElementById("fileInput");
const output = document.getElementById("output");

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const fileType = file.type;
  const reader = new FileReader();

  reader.onload = (event) => {
    const result = event.target.result;

    // Clear the output container
    output.innerHTML = "";

    // Handle display based on file type
    if (fileType.startsWith("image/")) {
      // Display image
      const img = document.createElement("img");
      img.src = result;
      img.style.maxWidth = "100%";
      output.appendChild(img);
    } else if (fileType === "application/pdf") {
      // Display PDF using iframe
      const iframe = document.createElement("iframe");
      iframe.src = result;
      iframe.style.width = "100%";
      iframe.style.height = "500px";
      output.appendChild(iframe);
    } else if (fileType === "text/plain") {
      // Display plain text
      const pre = document.createElement("pre");
      pre.textContent = result;
      output.appendChild(pre);
    } else {
      // Unsupported file type
      output.innerHTML = `<p>Unsupported file type: ${fileType}</p>`;
    }
  };

  // Read file as data URL (works for most file types)
  if (fileType.startsWith("image/") || fileType === "application/pdf") {
    reader.readAsDataURL(file);
  } else if (fileType === "text/plain") {
    reader.readAsText(file);
  } else {
    output.innerHTML =
      "<p>Unsupported file type. Please upload a PDF, image, or text file.</p>";
  }
});
