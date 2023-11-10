const { Router } = require("express");
const router = Router();
const Conversation = require("../Model/conversion");
const User = require("../Model/user");
const conversion = require("../Model/conversion");
const MsgNumber = require("../Model/unreadmsg");
const { route } = require("./User");
const mongoose = require('mongoose');


router.post("/addchat", async (req, res) => {
  const user1Id = req.body.participants[0];
  const user2Id = req.body.participants[1];

  const existingConversation = await Conversation.findOne({
    $or: [
      { participants: [user1Id, user2Id] },
      { participants: [user2Id, user1Id] },
    ],
  });

  let newConversation;

  if (!existingConversation) {
    newConversation = new Conversation({
      participants: [user1Id, user2Id],
    });
  } else {
    newConversation = existingConversation;
  }

  newConversation.messages.push({
    sender: user1Id,
    content: req.body.messages[0].content,
  });

  newConversation
    .save()
    .then((conversation) => {
      return res.status(200).json(conversation);
    })
    .catch((error) => {
      console.error("Error creating or updating conversation:", error);
      return res.status(500).json({ error: "Internal server error" });
    });
});

router.get("/getmessages", async (req, res) => {

  const senderId = req.query.senderid;
  const receiverId = req.query.receiverid;

  const conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (conversation) {
    res.json(conversation.messages);
  } else {
    res.status(404).json({ error: "Conversation not found" });
  }
});





router.post('/unreadmsg/:id', async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.params.id;
    const { friend , msg , read } = req.body;
    const objectId = new mongoose.Types.ObjectId(friend);
    const userValue = await User.findById(objectId); 
    const existingValue = await MsgNumber.findOne({ user: userId, friend: friend });


    if (!existingValue) {
      const newMsg = await MsgNumber.create({
        user: userId,
        friend : friend,
        friendDetails : objectId,
        msg : msg,
        read : read,
      });
      res.status(201).json(newMsg);
    } else {
      existingValue.msg = msg;
      existingValue.read = read;
      await existingValue.save();
      res.status(200).json(existingValue);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getUnreadMsgNumber/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const numberUnreadMsg = await MsgNumber.find({ user: userId, read: false });
    const len = numberUnreadMsg.length;

    if (len > 0) {
      res.status(200).json({ value: len });
    } else {
      res.status(200).json({ value: 0 }); 
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getAllFriendMsg/:id',async(req,res)=>{
  const userId  = req.params.id;
  try{
    const numberUnreadMsg = await  MsgNumber.find({user : userId})
     .populate('friendDetails')
     .sort({ lastMessageTimestamp: -1 });
    if(numberUnreadMsg){
      res.status(200).json(numberUnreadMsg);
    }else{
      res.status(200).json({});
    }
  }catch(err){
    console.log(err);
  }
})


router.put('/updateUnreadMsgTrue', async (req, res) => {
  try {
    console.log(req.query)
    const user = req.query.user;
    const friend = req.query.friend;
    const existingValue = await MsgNumber.findOne({ user: user,friend:friend });
    if (existingValue) {
      existingValue.read = true;
      await existingValue.save();
      res.status(200).json({ message: 'Data updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
