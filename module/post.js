const db = require("./db").client;

async function connect() {
  try {
    return client.db("FurFriendz");
  } catch (error) {
    throw new Error("Failed to connect to the database: " + error.message);
  }
}

async function findUserByPetName(title) {
  return db.db("FurFriendz").collection("posts").findOne(title);
}

async function insertPost(entry) {
  const newPostEntry = {
    title: entry.title,
    content: entry.content,
  };
  return db.db("FurFriendz").collection("posts").insertOne(newPostEntry);
}

async function editPostByName(title, update) {
  return (result = await db
    .db("FurFriendz")
    .collection("posts")
    .updateOne({ title }, { $set: update }));
}

async function deletePostByName(title) {
  return await db.db("FurFriendz").collection("posts").deleteOne(title);
}

module.exports = {
  insertPost,
  findUserByPetName,
  editPostByName,
  deletePostByName,
};
