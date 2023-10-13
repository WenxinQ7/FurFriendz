const { MongoClient } = require("mongodb");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

// Define your MongoDB connection URI
const url =
  "mongodb+srv://qiwenxin98:Zjjxwjp@cluster0.chnfjby.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

// Define your collection name
const collectionName = "posts";

// Function to connect to the MongoDB database
async function connect() {
  try {
    await client.connect();
    console.log("Connected to the MongoDB database");
  } catch (error) {
    console.error("Error connecting to the MongoDB database:", error);
  }
}

// Function to insert a post into the database
async function insertPost(post) {
  try {
    const database = client.db();
    const collection = database.collection(collectionName);

    // Create a slug and sanitized HTML
    post.slug = slugify(post.title, { lower: true, strict: true });
    post.sanitizedHtml = dompurify.sanitize(marked(post.markdown));

    // Insert the post into the collection
    const result = await collection.insertOne(post);
    return result.ops[0];
  } catch (error) {
    console.error("Error inserting article:", error);
    return null;
  }
}

async function findById(id) {
  try {
    const database = client.db();
    const collection = database.collection(collectionName);

    const post = await collection.findOne({ _id: ObjectId(id) });

    return post;
  } catch (error) {
    console.error("Error finding article by ID:", error);
    return null;
  }
}

async function findPostBySlug(slug) {
  try {
    const database = client.db();
    const collection = database.collection(collectionName);

    // Use the findOne method to find the article by its slug
    const post = await collection.findOne({ slug });
    return post;
  } catch (error) {
    console.error("Error finding article by slug:", error);
    return null;
  }
}

async function deletePostById(id) {
  try {
    const database = client.db();
    const collection = database.collection(collectionName);

    const objectId = new ObjectID(id);

    // Use findByIdAndDelete to remove the article by its ID
    const result = await collection.findOneAndDelete({ _id: objectId });

    if (result.value) {
      console.log("Deleted post:", result.value);
      return result.value;
    } else {
      console.log("post not found");
      return null;
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return null;
  }
}
// Export functions to connect and insert posts
module.exports = {
  connect,
  insertPost,
  findById,
  findPostBySlug,
  deletePostById,
};
