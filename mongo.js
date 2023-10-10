const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://qiwenxin98:Zjjxwjp@cluster0.chnfjby.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

const UserSchema = {
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
};

async function connect() {
  try {
    // Connect to the MongoDB server
    await client.connect();

    const db = client.db("FurFriendz");
    const collection = db.collection("users");

    // You can create the index for uniqueness in username if needed
    // collection.createIndex({ username: 1 }, { unique: true });

    // Define your model (though it's not strictly necessary in MongoDB)
    const model = {
      create: (user) => collection.insertOne(user),
      findByUsername: (username) => collection.findOne({ username }),
      // Add other methods as needed
    };

    return model;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

module.exports = connect;
