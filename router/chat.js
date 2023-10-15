const chatFunc = (app, db)=>{

    // Serve the custom /chat route
    app.get("/chat", (req, res) => {
      res.sendFile(join(__dirname, "/public/chat.html"));
    });
    
    app.get("/user/:userId", async (req, res) => {
      const { userId } = req.params;
      try {
        const user = await db.collection("furfriendz").findOne({ _id: new ObjectId(userId) });
        res.json(user);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
      }
    });
    
    app.get("/messages/:userId", async (req, res) => {
      const { userId } = req.params;
      try {
        const userMessages = await db.collection("messages").find({ to: new ObjectId(userId) }).toArray();
        res.json(userMessages);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    });
    
    app.put("/messages/:messageId/read", async (req, res) => {
      const { messageId } = req.params;
      try {
        await db.collection("messages").updateOne({ _id: new ObjectId(messageId) }, { $set: { read: true } });
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to update message status" });
      }
    });
    
    app.post("/messages/send", async (req, res) => {
      if (!db) {
        return res.status(500).json({ error: "Database connection not established" });
      }
      const {
        from, to, subject, content,
      } = req.body;
    
      const message = {
        from: new ObjectId(from),
        to: new ObjectId(to),
        subject,
        content,
        timestamp: new Date(),
        read: false,
      };
    
      try {
        await db.collection("messages").insertOne(message);
        return res.json({ success: true, message: "Message sent!" });
      } catch (error) {
        console.error("Error while sending message:", error); // This will log the detailed error
        return res.status(500).json({ error: "Failed to send message", details: error.message });
      }
    });
    
    app.post("/create-chat", async (req, res) => {
      const chat = {
        participants: req.body.participants,
        lastMessageTime: new Date(),
        messages: [],
      };
    
      try {
        const result = await db.collection("chats").insertOne(chat);
        res.json(result.ops[0]);
      } catch (error) {
        res.status(500).json({ error: "Unable to create chats" });
      }
    });
    
    app.post("/upload", async (req, res) => {
      const attachment = {
        messageID: req.body.messageID,
        filename: "mycat.jpg",
        path: "/path/to/user/device",
        fileType: "image/jpg",
        size: 1048,
      };
    
      try {
        const result = await db.collection("attachments").insertOne(attachment);
        res.json(result.ops[0]);
      } catch (error) {
        res.status(500).json({ error: "Unable to upload" });
      }
    });
    }
    
    
exports.chatFunc = chatFunc;