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

const aboutContent = "Hello! my name is Steven Wang and I am an aspiring software engineer."
  + "I've recently graduated from Florida International University with a bachelors in Computer Science with a specialized track in Software Design and Development."
  + "This means that I have taken extra courses in software engineering and testing principles than the average computer science student from my school."
  + "This web app was created by me as a practice/learning tool so that I can familiarize myself with the usage of ejs, routing, and using a mongo database.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("post", postSchema);

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

/**
 * Post route that activates when user submits the compose form
 * Title and content from the UI are gathered to be saved to DB
 * and redirect user back to the home page when post is saved.
 */
app.post("/", function(req,res){
  let postTitle = req.body.composedTitle;
  let postContent = req.body.postText;

  const post = new Post ({
    title: postTitle,
    content: postContent,
  });
  
  post.save(function(err){
    if(!err){
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});

/** 
 * Get the post request and obtain the requested title.
 * compare it with the stored title and if it is correct
 * redirect it to a post.ejs containing the contents and titles
 * passed through here to there.
 */
app.get("/post/:postID", function(req, res){
  const requestedPostID = req.params.postID;

  Post.findOne({_id: requestedPostID}, function(err, foundPost){
    if(!err){
      if(!foundPost){
        console.log("Post not found");
      } else {
        res.render("post", {
          title: foundPost.title,
          content: foundPost.content,
        })
      }
    } else {
      console.log(err);
    }
  });
});

/**
 * Listen on localhost 3000
 */
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
