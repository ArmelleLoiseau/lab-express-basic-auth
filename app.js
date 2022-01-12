// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

// Handles session
const session = require("express-session");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require("./config")(app);

// default value for title local
const projectName = "lab-express-basic-auth";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

app.use(
  session({
    secret: "ASecretStringThatSouldBeHARDTOGUESS/CRACK",
    saveUninitialized: true,
    resave: true,
  })
);

app.use(require("./middlewares/logStatus"));

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const private = require("./routes/private");
app.use("/private", private);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
