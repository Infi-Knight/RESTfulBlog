// NOTE: methodOverride and expressSanitizer should come after bodyParser
var bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body:  String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

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
  // Sanitize the incoming description to get rid of any malicious scripts
  req.body.blog.body = req.sanitize(req.body.blog.body);
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
  // NOTE the use of req.params.id  If you tried req.body.id you would be
  // really really extremely fucked as you will find that it returns undefined
  // which neither updates the database nor gives you a hint of that
  
  // Sanitize the incoming description to get rid of any malicious scripts
  req.body.blog.body = req.sanitize(req.body.blog.body);
  
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, {new: true}, function(err, updatedBlog){
    if (err) {
      console.log("UNABLE TO UPDATE THE BLOG");
      console.log(err);
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

// REST DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
//   res.send("Expelliarmus..");
  // destroy the blog
  Blog.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

// Listener for our blog site
app.listen(3000, process.env.IP, function(){
  console.log("Your blog site server has started :)");
});