const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {router} = require("./routers/router");
const {resetSession} = require("./service/vtiger-service");
const cron = require("node-cron");

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/api", router);

require("dotenv").config();
const port = process.env.PORT;

cron.schedule("*/4 * * * *", () => {
  console.log('running a task every 4 minute');
  resetSession();
});

app.listen(port, () => {
    console.log("running on port " + port);
    resetSession();
});