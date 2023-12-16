const router = require("express").Router();
const { defaultPage, dynamicPage, notFound } = require("../models/pages");
const fetch = require("../models/fetch");
const SendMessage = require("../models/generateimage");


let username = new Map();

router.get("/:user?", (req, res) => {
  const { user } = req.params;
  if (user) {
    fetch()
      .then((data) => {
        username = new Map(data.map((item) => [item.username, item]));
        if (!username.has(user)) {
          notFound(res);
        } else {
          dynamicPage(res, username.get(user));
        }
      })
      .catch((err) => {
        console.log(err.message);
        res.render("index", defaultPage);
      });
  } else {
    res.render("index", defaultPage);
  }
});

router.post("/message", async(req, res) => {
  console.log('req');
  const FormData = req.body;
  console.log(FormData);
  if (!FormData || FormData.message.trim() === "") {
      res.sendStatus(400);
  } else {
    if(FormData.message.length>80){
      res.status(404).json({ error: "Reached Word Limit" });
    }else{
    await SendMessage(FormData.id, FormData.message)
      .then((response) => {
        if (!response) {
          res.status(404).json({ error: response.error });
        } else {
          res.status(200).json({ message: "success" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  }
}
});


router.get("/api/v1/:userId?", (req, res) => {
  const { userId } = req.params;
  fetch()
    .then((data) => {
      let userMap = new Map(data.map((item) => [item.username, item]));
      if (!userId) {
        res.json({ user: Object.fromEntries(userMap) });
      } else {
        res.json({ user: userMap.get(userId) });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
