const express = require("express");
const userCollection = require("./module/userCollection");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());

app.get("/index", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

app.post("/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be at least 6 characters",
    });
  }

  const checking = await userCollection.findUserByUsername({
    username: req.body.username,
  });

  if (checking) {
    if (checking.username === req.body.username) {
      return res.json({ status: "error", error: "Username already in use" });
    }
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await userCollection.createUser({
      username,
      password,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await userCollection.findUserByUsername(username);

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    // the username, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
