//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("post", postSchema);

const post1 = new Post ({
  title: 'Day 1', 
  content: '1Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const post2 = new Post ({
  title: 'Day 2', 
  content: '2Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

const post3 = new Post ({
  title: 'Day 3', 
  content: '3Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
});

// Array of posts objects
let arrPosts = [post1,post2,post3];

app.get("/", function(req,res){
  Post.find({}, function(err, foundPosts){
    if(err){
      console.log(err);
    } else {
      res.render("home", {
        posts: foundPosts,
      });
    }
  });
});

app.get("/about", function(req,res){
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function(req,res){
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function(req,res){
  res.render("compose");
});

app.post("/", function(req,res){
  let postTitle = req.body.composedTitle;
  let postContent = req.body.postText;

  const post = new Post ({
    title: postTitle,
    content: postContent,
  });
  
  post.save();
  res.redirect("/");
});


/** 
 * Get the post request and obtain the requested title.
 * compare it with the stored title and if it is correct
 * redirect it to a post.ejs containing the contents and titles
 * passed through here to there.
 */
app.get("/post/:postID", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postID);
  
  arrPosts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if(requestedTitle === storedTitle){
      res.render("post", {
        title: post.title,
        content: post.content,
      })
    } else {
      console.log("not found");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
