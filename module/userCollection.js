const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://qiwenxin98:Zjjxwjp@cluster0.chnfjby.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

// async function User() {
//   try {
//     // Connect to the MongoDB server
//     await client.connect();

//     const db = client.db("FurFriendz");
//     const collection = db.collection("users");

//     const UserSchema = {
//       username: { type: String, required: true, unique: true },
//       password: { type: String, required: true },
//     };

//     const model = {
//       create: async (user) => {
//         const result = await collection.insertOne(user);
//         return result.ops[0];
//       },
//       findUserByUsername: async (username) => {
//         return collection.findOne({ username });
//       },
//     };

//     return model;
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     throw err;
//   }
// }

// module.exports = User;

async function connect() {
  try {
    await client.connect();
    return client.db("FurFriendz");
  } catch (error) {
    throw new Error("Failed to connect to the database: " + error.message);
  }
}

// Create a new user document
async function createUser(user) {
  const db = await connect();
  const result = await db.collection("users").insertOne(user);
  return result.insertedId;
}

// Find a user by their username
async function findUserByUsername(username) {
  const db = await connect();
  // console.log(username);
  return db.collection("users").findOne({ username });
}

module.exports = {
  createUser,
  findUserByUsername,
};
