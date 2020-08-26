require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Users = require('./routes/Users')
app.use('/users', Users)

app.listen(PORT, () => {
  console.log("Server started on port 3000");
});
