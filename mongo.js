const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const title = process.argv[3];
const author = process.argv[4];
const link = process.argv[5];
const likes = process.argv[6];

const url = `mongodb+srv://seanhoyeonjin:${password}@cluster0.vuvmi63.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const blog = new Blog({ title, author, link, likes });

blog.save().then((result) => {
  mongoose.connection.close();
});
