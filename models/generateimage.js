const puppeteer = require("puppeteer");
const { Bot, InputFile } = require("grammy");
const fetch = require("./fetch");
const dotenv = require("dotenv").config();
const fs = require("fs");
const bot = new Bot(process.env.BOT);

let h = null;
const gradients = [
  "linear-gradient(to bottom right, rgba(255, 255, 0, 0.5), rgba(255, 165, 0, 0.5), rgba(255, 0, 0, 0.5));",
  "linear-gradient(to bottom right, rgba(75, 0, 130, 0.5), rgba(0, 0, 255, 0.5), rgba(128, 0, 128, 0.5));",
  "linear-gradient(312deg, rgba(166,38,168,1) 0%, rgba(208,95,17,0.9820260868019083) 99%, rgba(255,0,0,1) 100%);",
];

async function SendMessage(id, text) {
  console.log(text.length);
  if (text.length > 70) {
    h = 350;
  } else {
    h = 333;
  }
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  const randomGradient =
    gradients[Math.floor(Math.random() * gradients.length)];
  await page.setViewport({ width: 720, height: h }); // Adjust width and height as needed

  // Set HTML content with text and emojis
  await page.addStyleTag({
    content: `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
    `,
  });
  await page.setContent(`
  <html lang="en">
  <head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap">
    <style>
      body {
        font-family: 'Noto Color Emoji', sans-serif;
        display: flex;
        flex-direction: column; 
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
      }
      header {
        background: ${randomGradient};
        background-color: white;
        height: 30vw;
        color: white;
        width: 100%;
        text-align:center;
        display: flex;
        font-weight: 600;
        align-items: center;
        justify-content: center;
      }
      div {
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 7vw;
        font-family: 'Noto Color Emoji', sans-serif;
        font-weight: 600;
        text-align: center;
        word-wrap: break-word;
        height: 50vh; /* 100% of the viewport height */
      }
    </style>
  </head>
  <body>
    <header>
      <span style="font-size: 7vw;">Send me anonymous <br> message!</span>
    </header>
    <div>${text}</div>
  </body>
  </html>  
  `);

  // Capture a screenshot

  await bot.api.sendPhoto(
    id,
    new InputFile(await page.screenshot({ fullPage: true })),
    {
      caption: text,
    }
  );

  await browser.close();

  return true;
}

bot.command("start", async (ctx) => {
  await bot.api.setMyCommands([
    { command: "start", description: "Start bot " },
    { command: "help", description: "help" },
  ]);
  const id = ctx.chat.id;
  console.log(id);
  fetch().then((data) => {
    let userMap = new Map(data.map((items) => [items.id, items.username]));
    if (userMap.has(id.toString())) {
      ctx.reply(
        `<b><i>Hi!</i> <a href="https://ngl-clone-production.up.railway.app/${userMap.get(
          id.toString()
        )}">${userMap.get(id.toString())}</a> <i>how you doing!</i></b> .`,
        { parse_mode: "HTML", disable_web_page_preview: true }
      );
    } else {
      ctx.reply(
        `You don't have an active account contact @NGLCreateAccountbot`
      );
    }
  });
});

bot.command("help", async (ctx) => {
  await bot.api.sendMessage(
    ctx.chat.id,
    "<b>Contact</b> <i>@NGLCreateAccountbot</i> For help.",
    { parse_mode: "HTML" }
  );
});

bot.start();

module.exports = SendMessage;
