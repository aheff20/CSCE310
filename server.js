const express = require("express");
const passport = require("passport");
const path = require("path");
const users = require("./routes/users");
const programs = require("./routes/programs");
const events = require("./routes/events");
// const orders = require("./routes/orders");
// const translator = require("./routes/translator");
// const reports = require("./routes/reports");
// const menu = require("./routes/menu");
const { Pool, Client } = require("pg");
const dotenv = require("dotenv");

const app = express();

var cors = require('cors');
app.use(cors());

// Set Port
const port = 5000;
let environment = "production";
console.log(`Application is running in the ${environment} environment.`);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Establish Routes
app.use("/users", users);
app.use("/programs", programs);
app.use("/events", events);

// Serve static assets from the build directory if in production
app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});


app.listen(port, () => console.log(`Server up and running on port ${port}!`));
