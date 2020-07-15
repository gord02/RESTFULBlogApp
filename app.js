var express = require("express"), app= express(), bodyParser = require("body-parser"), mongoose = require("mongoose"), methodOverride = require("method-override"), expressSanitizer= require("express-sanitizer");

//conncects to database
mongoose.connect("mongodb://localhost/restufl_blog_app", { useNewUrlParser: true, useUnifiedTopology: true });

//APP CONFIG
app.set("view engine", "ejs");
// this allows us to use whatever is is in public directory
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
// this look for anything that is insde the brackets of overide and take anything that uses _method as an argument, takes whatever _method is equal to and treats that request as a put or delte rquest
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//MONGOOSE/ MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    // this allows for time to be displayed with other infomration
    created: {type: Date, default: Date.now}
});

// var Blog = mongoos.model("Blog");
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: String,
//     image: 
// })


// RESTful ROUTES
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", function(req, res){
   //retrives all blogs form the database
    Blog.find({}, function (err, blogs){
        if(err){
            console.log("ERROR")
        }else{
            res.render("index", {blogs: blogs});
        }
    })
});
// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});
// CREATE ROUTE
app.post("/blogs", function(req, res){
    //this is used to sanitize, done so by updating itslef after being santized
    req.body.blog.body = req.sanitize(req.body.blog.body);
//create blog
// using requedst.body.blog allows use to include all three of the body[] we had in the new.ejs file
Blog.create(req.body.blog, function(err, newBlog){
if(err) {
    res.render("new");
    } else {
        // redirect to index
        res.redirect("/blogs")
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id",function(req, res) {
    // var ids= req.body._id;
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else{
            res.render("show",{blog:foundBlog});
        }
    });
});
// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
//   this lets us find specific blog that needs to be edited and passes it over into the edit page
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else{
            res.render("edit",{blog:foundBlog});
        }
   });
});
// UPDATE ROUTE
//put is for update
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // res.render("");
//takes id in url and finds existing data and updates it with new data
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});
// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
//  destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });

});

app.listen(8000, function(){
    var date = new Date();    
    // console.log("Servers has started. " + "Time: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    console.log("Servers has started. Time: " + date.toLocaleTimeString());
    console.log("localhost:8000/");
});