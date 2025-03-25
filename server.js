// ------------------------ IMPORTING MODULES and SETTING UP ENV ------------------------- // 

// Load Express
const express = require('express');
const app = express();

// Load .environment package, and confure env according to .env file. 
const dotenv = require("dotenv");
dotenv.config(); 

// ???
const methodOverride = require("method-override"); 

// ???
const morgan = require("morgan"); 

// ??
const path = require("path");

//  Load Mongoose DB driver package
const mongoose = require("mongoose"); 

// Connect to DB 
mongoose.connect(process.env.MONGODB_URI);

// Log successful connection
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });
 
// Import DB sin model
const Sin = require("./models/sin.js");

// 
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 

app.use(express.static(path.join(__dirname, "public")));

// ------------------------ SERVER LOGIC ------------------------- // 

// GET Methods
app.get("/", async (req, res) => {
    res.render("index.ejs");
  });

// Add New sin
app.get("/sins/new", (req, res) => {
    res.render("sins/new.ejs");
});

// Show sin. 
app.get("/sins/:sinId", async (req, res) => {
  const foundSin = await Sin.findById(req.params.sinId);
  res.render("sins/show.ejs", { sin: foundSin });
});

// Show ALL sins
app.get("/sins", async (req, res) => {
  const allSins = await Sin.find();
  res.render("sins/index.ejs", { sins: allSins });
});

// Show and EDIT sin
app.get("/sins/:sinId/edit", async (req, res) => {
  const foundSin = await Sin.findById(req.params.sinId);
  console.log(foundSin);
  res.render(`sins/edit.ejs`, {sin: foundSin});
});

// DELETE Method - delete sin
app.delete("/sins/:sinId", async (req, res) => {
  await Sin.findByIdAndDelete(req.params.sinId);
  res.redirect("/sins");
});

// POST Method - add sin 
app.post("/sins", async (req, res) => {
  if (req.body.isDeadly === "on") {
    req.body.isDeadly = true;
  } else {
    req.body.isDeadly = false;
  }
  if (req.body.isFun === "on") {
    req.body.isFun = true;
  } else {
    req.body.isFun = false;
  }
  console.log(req.body.name);
  console.log(req.body.isFun);
  console.log(req.body.bestActivity);
  console.log(req.body.worstActivity);
  await Sin.create(req.body);
  res.redirect("/sins");
});

// PUT Method - update sin
app.put("/sins/:sinId", async (req, res) => {
  // Handle the checkbox data
  if (req.body.isDeadly === "on") {
    req.body.isDeadly = true;
  } else {
    req.body.isDeadly = false;
  }
  if (req.body.isFun === "on") {
    req.body.isFun = true;
  } else {
    req.body.isFun = false;
  }
  
  // Update the sin in the database
  await Sin.findByIdAndUpdate(req.params.sinId, req.body);

  // Redirect to the sin's show page to see the updates
  res.redirect(`/sins/${req.params.sinId}`);
});

// Listener
app.listen(3000, () => {
  console.log('Listening on port 3000');
});
