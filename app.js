console.log("Loading Modules ...");

var colors = require("colors");
var express = require("express");
var io = require("socket.io");
var mongoose = require("mongoose");
var mustacheExpress = require("mustache-express");
var session = require("express-session")
var bodyParser = require("body-parser");
var config = require("./core/config");
var flash = require("connect-flash");
var app = express(),
    server = require("http").createServer(app),
    io = io.listen(server),
    hash = "jfldgh795tz9458ghfv9h78z5498t65ghtv9stzh9e45o958thg89f54z";

console.log("Done".green);

console.log("Starting ...");
app.engine("mustache", mustacheExpress());
app.set("views", __dirname + "/core/views");
app.set("view engine", "mustache");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(flash());
app.disable("view cache"); // Only for Development

app.use(session({
  secret: hash,
  saveUninitialized: true,
  resave: false
}));

mongoose.connect(config.mongoose, function(err) {
  if(err) throw err;

  console.log("Connection opened".green);
});

require("./core/routes.js")(app);
require("./core/sockets.js")(io);

server.listen(config.port, function() {
  console.log("Server started!".green);
});
