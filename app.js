var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// app.use(methodOverride(function(req, res){
//   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//     // look in urlencoded POST bodies and delete it
//     var method = req.body._method
//     delete req.body._method
//     return method
//   }
// }))

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body:  String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Audace",
//   image: "https://unsplash.com/search/photos/macbook?photo=8u5JvXfp4uw",
//   body: "Let's get started"
// })

// ROUTES
app.get("/", function(req, res){
  res.redirect("/blogs");
})

// REST INDEX for blogs
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs){
    if (err) {
      console.log(err);
    } else {
        res.render("index", {blogs: blogs});      
    }
  });
});

// REST NEW ROUTE
app.get("/blogs/new", function(req, res){
  res.render("new");
});

// REST CREATE ROUTE
app.post("/blogs", function(req, res){
  // Create a new blog and then redirect to INDEX
  Blog.create(req.body.blog, function(err, newBlog){
    if(err) {
      res.render("new");
    } else {
      res.redirect("/blogs");
    }
  });
});

// REST SHOW ROUTE
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  });
});

// REST EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      console.log("EDIT PAGE WAS NOT SHOWN");
    } else {
        res.render("edit", {blog: foundBlog}); 
    }
  });  
});

// REST UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, {new: true}, function(err, updatedBlog){
    if (err) {
      console.log("UNABLE TO UPDATE THE BLOG");
      console.log(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// Listener for our blog site
app.listen(3000, process.env.IP, function(){
  console.log("Your blog site server has started :)");
});