const router = require("express").Router();

router.get("/:user?", (req, res) => {
    const {user} = req.params
  if(!user){
    res.render("index", {
        id: null,
        name: null,
        username: null,
        dp: null,
        socialLink: null,
      });
  }else{
   res.json({"Dynamic":'Live'})
  }
});

router.post('/message',(req,res)=>{
    const FormData = req.body
    console.log(FormData);
    if(!FormData || FormData.message.trim()==''){
        res.sendStatus(400)
    }else{
        console.log(ok);
    }
})

module.exports = router;
