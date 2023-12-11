const puppeteer = require("puppeteer");
const { Bot, InputFile } = require("grammy");
const fetch = require("./fetch");
const dotenv = require("dotenv").config();
const fs = require("fs").promises;
const bot = new Bot(process.env.BOT);

async function SendMessage(id, text) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Set viewport size for HD image
  await page.setViewport({ width: 720, height: 300 });

  // Set HTML content with text and emojis
  await page.setContent(`
    <html>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap">
        <style>
          body {
            background: linear-gradient(to bottom right, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 0.5));
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 1.7rem;
          }
          div {
            font-size: 7vw;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            text-align: center;
            word-wrap: break-word;
            box-sizing: border-box;
            color: white;
          }
        </style>
      </head>
      <body>
        <div>${text}</div>
      </body>
    </html>
  `);

  // Capture a screenshot
  const Image = await page.screenshot({ fullPage: true });
  await browser.close();
  try {
    const temp = await fs.writeFile("temp.png", Image);
    await bot.api.sendPhoto(id, new InputFile("temp.png"), {
      caption: text,
    });
    await fs.unlink("temp.png");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

bot.command("start", (ctx) => {
  const id = ctx.chat.id;
  console.log(id);
  fetch().then((data) => {
    let userMap = new Map(data.map((items) => [items.id, items.username]));
    if (userMap.has(id.toString())) {
      ctx.reply(`Welcome ${userMap.get(id.toString())}`);
    } else {
      ctx.reply(
        `You don't have an active account contact @NGLCreateAccountbot`
      );
    }
  });
});
bot.start();
module.exports = SendMessage;
