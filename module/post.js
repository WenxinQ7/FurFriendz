const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://qiwenxin98:Zjjxwjp@cluster0.chnfjby.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

async function connect() {
  try {
    await client.connect();
    return client.db("FurFriendz");
  } catch (error) {
    throw new Error("Failed to connect to the database: " + error.message);
  }
}

async function findUserByPetName(title) {
  const db = await connect();
  return db.collection("posts").findOne(title);
}

async function insertPost(entry) {
  const db = await connect();
  const newPostEntry = {
    title: entry.title,
    content: entry.content,
  };
  return db.collection("posts").insertOne(newPostEntry);
}

async function editPostByName(title, update) {
  const db = await connect();
  return (result = await db
    .collection("posts")
    .updateOne({ title }, { $set: update }));
}

async function deletePostByName(title) {
  const db = await connect();
  return await db.collection("posts").deleteOne(title);
}

module.exports = {
  insertPost,
  findUserByPetName,
  editPostByName,
  deletePostByName,
};
