const path = require("path");
const bot = require("./bot");
const user = require('../api/createuser');
let CreateAccount = false
let photo = false
let setName = false
let SocialLink = false
module.exports = function () {

const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/;

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
      `🌟 Welcome to Your NGL Bot! 🤖 Here's how you can interact with me:\n\n- 📷 /create: Create NGL Account.\n- 🆔 /SetName: Set your display name.\n- 🔗 /AddSocialLink: Set your Social media link to you profile nav bar.\n- 🖼️ /SetProfilePicture: Upload a profile picture.\n- ❓ /help: Need assistance or want to explore more commands? Just type /help.\n\nLet's get started! 🚀✨`,
      options
    );
  });

  bot.onText(/\/create/i, (msg) => {
    if (user.IDExists(msg.chat.id)) {
        bot.sendMessage(msg.chat.id, `You Already have an Account. Use /help for more commands.`);
    } else {
        const chatId = msg.chat.id;
        bot.sendMessage(msg.chat.id, 'Enter Your Username');
        CreateAccount = true;
    }
});

  bot.on('message',(msg)=>{
     if(CreateAccount){
      const userData = {
        "username": msg.text,
        "name": 'Babyo7',
        "dp": "/dp/user2.gif",
        "id": msg.chat.id,
        "socialLink": "#"
      }
     if(user.usernameExists(msg.text)){
      bot.sendMessage(msg.chat.id,'Username already taken')
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
      }else{
        bot.sendMessage(msg.chat.id,`Create Account To Continue /Create`)
      }
     }

     if(SocialLink){
      if(urlRegex.test(msg.text)){
        if(user.IDExists(msg.chat.id)){
          user.updateSocialLink(msg.chat.id,msg.text)
          bot.sendMessage(msg.chat.id,`${user.IDExists(msg.chat.id).socialLink} Added To your profile`)
          SocialLink = false
        }
      }else{
        bot.sendMessage(msg.chat.id,"Please send a valid url to link")
      }
     }

     if(msg.chat.id==5356614395 && msg.text == 'Backup'){
       bot.sendDocument('5356614395',path.join(__dirname,'..','../public/users/users.json'))
     }

  })

  
  bot.onText(/\/SetName/i, (msg) => {
    if(user.IDExists(msg.chat.id)){

      const chatId = msg.chat.id;
      setName = true
      bot.sendMessage(msg.chat.id,'Enter your Name')
    }else{
      bot.sendMessage(msg.chat.id,`Create Account To Continue /Create`)
    }
  });

  bot.onText(/\/AddSocialLink/i, (msg) => {
    if(user.IDExists(msg.chat.id)){
      const chatId = msg.chat.id;
      SocialLink = true
      bot.sendMessage(msg.chat.id,'Enter any Social Media Link')
    }else{
      bot.sendMessage(msg.chat.id,`Create Account To Continue /Create`)
    }
  });


  bot.onText(/\/help/i, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "Here are some commands you can use:\n\n- 📷/create: Create Account.\n- 🆔 /SetName: Set your display name.\n- 🔗 /AddSocialLink: Set your Social media link to you profile nav bar.\n- 🖼️ /SetProfilePicture: Upload a profile picture.\n- ❓/help: Get assistance or explore more commands.\n\nFeel free to give them a try!"
    );
  });
  
  bot.onText(/\/SetProfilePicture/i, (msg) => {
    if (user.IDExists(msg.chat.id)) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Upload Profile Photo');
        photo = true;
    } else {
        bot.sendMessage(msg.chat.id, `Create an Account To Continue /create`);
    }
});

  bot.on("photo",async  (msg) => {
    if(photo){
      const hdPhoto = msg.photo.reduce((prev, current) => {
        return current.width > prev.width ? current : prev;
      });
      const photoId = hdPhoto.file_id;
      await bot.downloadFile(photoId,path.join(__dirname,'..','../public/dp')).then((fileInfo)=>{
        user.updateProfile(msg.chat.id,`/dp/${path.basename(fileInfo)}`)
        bot.sendMessage(msg.chat.id,'Profile Image Updated')
        photo = false
      })
    }
  });
};
