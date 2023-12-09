const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const BotCommands = require("../modules/telegram");
const canvas = require("../modules/canvas")
const user = require('../api/createuser')

router.use(express.static('public'))
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get('/',(req,res)=>{
  res.render('index',{username:null,name:null,dp:null,id:null,socialLink:null})
})

router.get('/:username', (req, res) => {
  const {username} = req.params
    try {
      if(!user.usernameExists(username)){
        res.render('index',{username:null,name:null,dp:null,id:null,socialLink:null})
      }else{
        let RenderUser = user.usernameExists(username)
          res.render('index',{username:RenderUser.username,name:RenderUser.name,dp:RenderUser.dp,id:RenderUser.id,socialLink:RenderUser.socialLink})
        }
    } catch (error) {
      console.log('Error Rendering Page'); 
    }
});

router.post('/message', (req, res) => {
  if(req.body.message && req.body.message.trim() !==''){
    try {
      const text = req.body.message; 
      const id = req.body.id
      BotCommands();
      canvas(text,id);
      res.json({ message: 'Form submitted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }else{
    res.json({message:'Message is empty'})
  }
    
});

module.exports = router;
