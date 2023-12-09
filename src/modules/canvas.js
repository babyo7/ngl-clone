const { createCanvas, registerFont } = require("canvas");
const fs = require("fs");
const path = require("path");
const bot = require("./bot"); // Assuming you have a separate bot module
let no = 0;

module.exports = function canvas(Text,to) {
  const fontSize = 70; // Adjust as needed
  const targetWidth = 1080; // 4K width
  const paddingX = 20; // Padding on X axis
  const paddingY = 33; // Padding on Y axis
  const maxWidth = (targetWidth - 2 * paddingX) * 1; // 80% of the available width after padding
  const lineSpacing = 0.3 * fontSize; // Line spacing in pixels

  // Create a temporary canvas with minimal height
  const tempCanvas = createCanvas(targetWidth, 1);
  const tempCtx = tempCanvas.getContext("2d");

  const text = Text;

  // Function to break text into lines based on a maximum width
  function breakTextIntoLines(text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      let testLine = currentLine + " " + words[i];
      let testWidth = tempCtx.measureText(testLine).width;

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }

    lines.push(currentLine);
    return lines;
  }

  // Calculate font size dynamically based on target width
  tempCtx.font = `bold ${fontSize}px poppins`;

  // Break text into lines
  const lines = breakTextIntoLines(text, maxWidth);

  // Calculate the total text height
  const totalTextHeight = lines.length * (fontSize + lineSpacing);

  // Create the final canvas with adjusted height and padding
  const canvasHeight = totalTextHeight + 2 * paddingY;
  const canvas = createCanvas(targetWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  // Set linear gradient background
  function createRandomGradient(ctx, targetWidth, canvasHeight) {
    const randomColor = () => Math.floor(Math.random() * 256);
    const randomRGBA = () => `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 1)`;

    const gradient = ctx.createLinearGradient(0, 0, targetWidth, canvasHeight);
    gradient.addColorStop(0, randomRGBA());
    gradient.addColorStop(1, randomRGBA());

    return gradient;
}

const gradient = createRandomGradient(ctx, targetWidth, canvasHeight);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, targetWidth, canvasHeight);

  // Set text properties
  ctx.fillStyle = "black";
  ctx.font = `bold ${fontSize}px poppins`;

  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  // Add your text lines with padding
  lines.forEach((line, index) => {
    const lineY = paddingY + index * (fontSize + lineSpacing);
    ctx.fillText(line, targetWidth / 2, lineY);
  });

  // Save the image to a file
  const outputImagePath = path.join(__dirname, `../../uploads`, `${++no}.png`);

  const out = fs.createWriteStream(outputImagePath);
  const stream = canvas.createPNGStream();
  stream.pipe(out);

  out.on("finish", () => {
    // The PNG stream has been closed, and the file has been completely written

    // Send the photo
    bot
      .sendPhoto(to || '5356614395', fs.createReadStream(outputImagePath))
      .then(() => {
        // Photo sent successfully, now delete the file
        fs.unlink(outputImagePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err.message);
          } else {
            console.log("File deleted successfully");
          }
        });
      })
      .catch((err) => {
        console.error("Error sending photo:", err.message);
      });
  });
};
