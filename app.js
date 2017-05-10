var bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    express    = require("express"),
    app        = express();

// APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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

// Listener for our blog site
app.listen(3000, process.env.IP, function(){
  console.log("Your blog site server has started :)");
});