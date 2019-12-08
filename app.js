//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
//var entriesArray = [];
var _ = require("lodash");
const mongoose = require('mongoose');
var blogNum = 0;


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect('mongodb+srv://duncan:test123@cluster0-kuucd.mongodb.net/xyz?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb+srv://duncan:test123@cluster0-kuucd.mongodb.net/test?retryWrites=true&w=majority',{dbName: "blog", useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect('mongodb+srv://duncan:test123@cluster0-kuucd.mongodb.net/blog',{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb+srv://duncanmcewan:test123@cluster0-w7pho.mongodb.net/blog?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});
const blogSchema = new mongoose.Schema({
//  _id: Number,
  title: String,
  post: String
});

const BlogEntry = mongoose.model('BlogEntry', blogSchema);

app.get("/", function(req, res) {
  var h1 = "Home";

  BlogEntry.find({}, function(err, entries){
    console.log("NUM "+blogNum);
    res.render("home", {
      header1:h1,
      homePar: homeStartingContent,
      toDoList: entries
      });
  });
});

app.get("/about", function(req, res) {
  var h1 = "About";
  res.render("about",{header1:h1, aboutPar:aboutContent});
});

app.get("/contact", function(req, res) {
  var h1 = "Contact";
  res.render("contact",{header1:h1, contactPar:contactContent});
});

app.get("/compose", function(req, res) {
  var h1 = "Compose";
  res.render("compose",{header1:h1});
});

/*
app.post("/compose", function(req, res) {
  pHead = req.body.postTitle;
  pBody = req.body.postBody;
  post = {"entryHead":pHead,"entryBody":pBody};
  posts.push(post);
  console.log(posts);
  res.redirect("/");
});
*/
app.post("/compose", function(req, res) {
  blogNum++;
  pHead = req.body.postTitle;
  pBody = req.body.postBody;
  //post = {"entryHead":pHead,"entryBody":pBody};
  //posts.push(post);

  const blogEntry = new BlogEntry({
  //  _id: blogNum,
    title: pHead,
    post: pBody
  });
  blogEntry.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });

});




app.get("/posts/:entryTitle", function (req, res) {
  var targetTitle = _.lowerCase(req.params.entryTitle);

  BlogEntry.findOne({title:targetTitle}, function(err, entries){
    res.render("post", {
            entryHead:entry.title,
            entryBody: entry.post
      });
  });
});

/*
app.get("/posts/:entryTitle", function (req, res) {
  var targetTitle = _.lowerCase(req.params.entryTitle);
  console.log("TARGET TITLE : "+targetTitle);

  posts.forEach (function(entry) {
    console.log("POST TITLE : "+entry.entryHead);

    if (_.lowerCase(entry.entryHead) === targetTitle) {
      console.log("MATCH FOUND : "+entry.entryHead);
      res.render("post",{entryHead:entry.entryHead,entryBody:entry.entryBody});
    }
  });
});
*/


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port "+port);
});
