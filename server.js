const express = require('express');
const router = require('./src/api/api');
const bodyParser = require('body-parser');
const bot = require('./src/modules/telegram')
const Port = process.env.PORT || 3000

const app = express();
const port = 3000;
router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.static('public'))
router.use(bodyParser.json())

app.set('view engine','ejs')

bot()

app.use('/',router)
app.use('/:username',router)
app.use('/message', router);

app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
