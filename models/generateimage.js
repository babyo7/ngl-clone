const puppeteer = require("puppeteer");
const { Bot, InputFile } = require("grammy");
const fetch = require("./fetch");
const dotenv = require("dotenv").config();
const fs = require("fs").promises;
const bot = new Bot(process.env.BOT);

let h = null
const gradients = [
  "linear-gradient(to bottom right, rgba(255, 255, 0, 0.5), rgba(255, 165, 0, 0.5), rgba(255, 0, 0, 0.5));",
  "linear-gradient(to bottom right, rgba(75, 0, 130, 0.5), rgba(0, 0, 255, 0.5), rgba(128, 0, 128, 0.5));",
  "linear-gradient(to bottom right, rgba(255, 0, 0, 0.5), rgba(255, 182, 193, 0.5), rgba(255, 0, 0, 0.5));",
  "linear-gradient(to bottom right, rgba(255, 191, 0, 0.5), rgba(255, 255, 0, 0.5), rgba(255, 69, 0, 0.5));",
  "linear-gradient(to bottom right, rgba(0, 0, 255, 0.5), rgba(173, 216, 230, 0.5), rgba(0, 255, 255, 0.5));",
  "linear-gradient(to bottom right, rgba(0, 255, 0, 0.5), rgba(0, 128, 0, 0.5), rgba(0, 128, 128, 0.5));",
];

async function SendMessage(id, text) {
  console.log(text.length);
  if(text.length>70){
   h=0
  }else{
    h=300
  }
  const browser = await puppeteer.launch({ headless: "new" ,args: ['--no-sandbox']});
  const page = await browser.newPage();

  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
  await page.setViewport({ width: 720, height: h }); // Adjust width and height as needed

  // Set HTML content with text and emojis
  await page.setContent(`
    <html>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap">
        <style>
          body {
            background: ${randomGradient};
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding:0;
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
  const Image = await page.screenshot( {fullPage: true });
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

bot.command("start",async (ctx) => {
  await bot.api.setMyCommands([
    { command: "start", description: "Start bot " },
    { command: "help", description: "help" },
  ])
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

bot.command('help',async (ctx)=>{
  await bot.api.sendMessage(
    ctx.chat.id,
    '<b>Contact</b> <i>@NGLCreateAccountbot</i> For help.',
    { parse_mode: "HTML" }
  );
  
})
bot.start();


module.exports = SendMessage;
