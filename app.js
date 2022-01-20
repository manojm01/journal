//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash")
const mongoose = require('mongoose');
const e = require("express");
require('./models/db');
var Task = mongoose.model('Task');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
  Task.find((err,docs)=>{
    if(!err){
      res.render("home",{posts:docs})
    }
    else{
      console.log('Error in retrieving task list :' + err);
    }
  })

})
app.get("/about",(req,res)=>{
  res.render("about",{aboutc:aboutContent,})
})
app.get("/contact",(req,res)=>{
  res.render("contact",{contactc:contactContent})
})
app.get("/compose",(req,res)=>{
  var post={
    title:"",
    content:""
  }
  res.render("compose",{post:post})
})
app.post("/compose",(req,res)=>{
  
  insertRecord(req,res)
  res.redirect("/")
})

function insertRecord(req,res){
  var task = new Task();
  task.title=req.body.postTitle,
  task.content=req.body.postBody
  
  task.save()
  .then(data =>{
    console.log(data);
  })
  .catch(err=>{
    console.log(err);
  })
}


app.get('/posts/:id', async(req,res)=>{
  
  try {
    await Task.findById(req.params.id, (err,doc)=>{
      if(!err){
        // console.log("doc: "+doc);
        res.render("post",{post:doc})
      }
      else{
        console.log(err);
      }
    }).clone();
  } catch (e){
    console.log("Error in Port " + e);
  }
  
  })
  
app.get('/:id', async (req,res)=>{
    await Task.findById(req.params.id, (err,doc)=>{
      if(!err){
        // console.log("doc: "+doc);
        res.render("compose",{post:doc})
      }
      else{
        console.log(err);
      }
    })
})


app.get('/delete/:id', (req,res)=>{
  Task.findByIdAndRemove(req.params.id, (err,doc)=>{
    if(!err){
      res.redirect('/');
    }
    else{
      console.log("error while deleting"+err);
    }
  })
})


app.listen(4000, function() {
  console.log("Server started on port 4000");
});
