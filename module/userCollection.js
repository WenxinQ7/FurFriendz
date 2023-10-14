const db = require("./db").client;

// Create a new user document
async function createUser(user) {
  const result = await db.db("FurFriendz").collection("users").insertOne(user);
  return result.insertedId;
}

// Find a user by their username
async function findUserByUsername(username) {
  // console.log(username);
  return db.db("FurFriendz").collection("users").findOne(username);
}

module.exports = {
  createUser,
  findUserByUsername,
};
