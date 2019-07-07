const express = require("express");
require("./db/mongoose");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

//App Setup
app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));

require("./routes/user")(app);
//Server Setup

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App listening on port " + PORT);
});
