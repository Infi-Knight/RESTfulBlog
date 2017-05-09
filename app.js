var bodyParser = require("bodyParser"),
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

// ROUTES

// Listener for our blog site
app.listen(3000, process.env.IP, function(){
  console.log("Your blog site server has started  :)");
});