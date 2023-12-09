const path = require("path");
const bot = require("./bot");
const user = require('../api/createuser');
const { text } = require("body-parser");
let CreateAccount = false
let photo = false
let setName = false
module.exports = function () {
  const fs = require("fs");
  bot.onText(/\/start/i, (msg) => {
    const chatId = msg.chat.id;

    const keyboard = {
      inline_keyboard: [
        [{ text: "Connect With Me", url: "https://tanmay-seven.vercel.app" }],
      ],
    };

    const options = {
      reply_markup: keyboard,
    };

    bot.sendMessage(
      chatId,
      `🌟 Welcome to Image Recognition Bot! 🤖 Here's how you can interact with me:\n\n- 📷/create: Upload any photo, and I'll reveal its contents using advanced image recognition.\n- ❓/help: Need assistance or want to explore more commands? Just type /help.\n\nLet's get started! 🚀✨`,
      options
    );
  });

  bot.onText(/\/create/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(msg.chat.id,'Username')
     CreateAccount = true
  });

  bot.on('message',(msg)=>{
     if(CreateAccount){
      const userData = {
        "username": msg.text,
        "name": 'Babyo7',
        "dp": "/dp/user2.gif",
        "id": msg.chat.id
      }
     if(user.usernameExists(msg.text)){
      bot.sendMessage(msg.chat.id,'try again')
     }else{
      bot.sendMessage(msg.chat.id,user.addUserData(userData))
      bot.sendMessage(msg.chat.id,`Your Link - https://ngl-clone.onrender.com/${userData.username} \n\n Use /SetName to Set Name and /SetProfilePicture to set Profile Picture`)
      CreateAccount =false
     }
    
     }

     if(setName){
      if(user.IDExists(msg.chat.id)){
        user.updateUserName(msg.chat.id,msg.text)
        bot.sendMessage(msg.chat.id,`Name Changed to ${user.IDExists(msg.chat.id).name}`)
        setName = false
      }
     }
  })


  
  bot.onText(/\/SetName/i, (msg) => {
    if(user.IDExists(msg.chat.id)){

      const chatId = msg.chat.id;
      setName = true
      bot.sendMessage(msg.chat.id,'Enter your Name')
    }
  });

  bot.onText(/\/help/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "Here are some commands you can use:\n\n- 📷/create: Upload a photo for analysis.\n- ❓/help: Get assistance or explore more commands.\n\nFeel free to give them a try!"
    );
  });

  bot.onText(/\/SetProfilePicture/i, (msg) => {
    if(user.IDExists(msg.chat.id)){
      const chatId = msg.chat.id;
      bot.sendMessage(chatId,'Upload Profile Photo');
      photo = true
    }
  });


  bot.on("photo", (msg) => {
    if(photo){
      const hdPhoto = msg.photo.reduce((prev, current) => {
        return current.width > prev.width ? current : prev;
      });
      const photoId = hdPhoto.file_id;
      bot.downloadFile(photoId,path.join(__dirname,'..','../public/dp')).then((fileInfo)=>{
        user.updateProfile(msg.chat.id,`/dp/${path.basename(fileInfo)}`)
        bot.sendMessage(msg.chat.id,'Profile Update')
        photo = false
      })
    }
  });
};
