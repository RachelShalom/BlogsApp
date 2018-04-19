//APP CONFIG
var express = require("express");
var app = express();
var methodOverride = require('method-override');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//SCHEMA/MODEL CONFIG
//define a schema:titel ,image,body, created(date)

var blogSchema = mongoose.Schema({
     title: String,
     image: String,
     body: String,
     created: { type: Date, default: Date.now },
});

//RESTFUL ROUTES
var Blog = mongoose.model("Blog", blogSchema);
//Blog.create({ title: "Product blog", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDLRI6Gh7oKvDnqLJiA8AsvxUYOnBD4hsAkK_6uSfsmqB_Kg4I", body: "this is a product blog I will write a lot later" });
//INDEX-GET SHOW ALL BLOGS
app.get("/", function(req, res) {
     res.redirect("/blogs");
});
app.get("/blogs", function(req, res) {
     Blog.find({}, function(err, blogs) {
          if (err) {
               console.log(err);
          }
          else {
               res.render("index", { blogs: blogs });
          }
     })

});

//NEW- GET- SHOW A FORM For ADDING A NEW BLOG
app.get("/blogs/new", function(req, res) {
     res.render("new");
});

//CREATE-POST - CREATE A NEW BLOG A REDIRECT THE PAGE TO BLOGS
app.post("/blogs", function(req, res) {


     Blog.create(req.body.blog, function(err, newBlog) {
          if (err) {
               res.redirect("/blogs/new")
          }
          else {

               res.redirect("/blogs");
          }
     });
});

//SHOW- GET WILL SHOW ADDITIONAL INFO ABOUT SPECIFIC BLOG
app.get("/blogs/:id", function(req, res) {
     var id = req.params.id;
     Blog.findById(id, function(err, currentBlog) {
          if (err) {
               console.log(err);
          }
          else {
               res.render("show", { blog: currentBlog });
          }
     })

});

//EDIT-GET-SHOW EDIT FORM FOR SPECIFIC BLOG
app.get("/blogs/:id/edit", function(req, res) {
     Blog.findById(req.params.id, function(err, foundBlog) {
          if (err) {
               res.redirect("/blogs");
          }
          else {
               res.render("edit", { blog: foundBlog });
          }
     })
});

//UPDATE -PUT -Update a particulat blog then redirect somewhere
app.put("/blogs/:id", function(req, res) {
     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
          if (err) {
               res.redirect("/blogs/" + req.params.id + "/edit");
          }
          else {
               res.redirect("/blogs/" + req.params.id);
          }
     })
})

//DESTROY: Method: DELETE. delete a particular blog and send redirect somewhere

app.delete("/blogs/:id", function(req, res) {
     //delete the blog
     Blog.findByIdAndRemove(req.params.id, function(err) {
          if (err) {
               console.log(err);

          }
          else {
               //redirect
               res.redirect("/blogs");
          }

     })
})

app.listen(process.env.PORT, process.env.IP, function() {
     console.log("The blog server has started");
});
