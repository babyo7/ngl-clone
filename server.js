const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = require("./routes/router");
const { notFound } = require("./models/pages");

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());

app.use(router);

app.use((req, res, next) => {
  notFound(res);
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
