const express = require("express")
const router = express.Router()
const User = require("../models/userSchema")
const Poll = require("../models/pollSchema")
const Vote = require("../models/voteSchema")
const Comment = require("../models/commentSchema")
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");



router.get('/', authMiddleware, async (req, res) => {
    try {
      let polls;
      const page = parseInt(req.query.page) ;
      const limit = parseInt(req.query.limit);
  
      if (page && limit) {
        polls = await Poll.find()
          .skip((page - 1) * limit)
          .limit(limit);
      } else {
        polls = await Poll.find();
      }
  
      res.send(polls);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  


router.get("/:id", authMiddleware, async function(req,res){
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) {
        return res.status(404).send();
        }
        res.send(poll);
        } catch (error) {
        res.status(500).send(error);
        }
})



router.post("/:id/vote", authMiddleware, async (req, res) => {
    const { option, userId } = req.body;
    const pollId = req.params.id;
  
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const existingVote = await Vote.findOne({ poll: pollId, voter: userId });
      if (existingVote) {
        return res.status(400).json({ error: 'User has already voted in this poll' });
      }
      const vote = new Vote({ poll: pollId, option, voter: userId });
      await vote.save();
  
      user.votedPolls.push(pollId);
      await user.save();
  
      const results = await Vote.aggregate([
        { $match: { poll: new mongoose.Types.ObjectId(pollId) } },
        { $group: { _id: '$option', votes: { $sum: 1 } } },
      ]);
  
      req.io.emit('vote', results);
      console.log(results)
      res.status(200).json(vote);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  


  router.get('/:id/result', authMiddleware, async (req, res) => {
    const pollId = req.params.id;
    try {
        const results = await Vote.aggregate([
            { $match: { poll: new mongoose.Types.ObjectId(pollId) } }, 
            { $group: { _id: '$option', votes: { $sum: 1 } } },
        ]);

        console.log(results);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

router.post("/:id/comment", authMiddleware, async (req, res) => {
    try {
      const { id: pollId } = req.params;
      const { text, userId, parentId } = req.body;
  
      let parentComment = null;
      var parentUsername = null;
      console.log(parentId)
  
      if (parentId) {
        parentComment = await Comment.findById(parentId);
        if (!parentComment) {
          return res.status(404).send({ error: "Parent comment not found" });
        }
        const parentCommentUser = await User.findById(parentComment.user);
        parentUsername = parentCommentUser.username;
      }
      const currentUser = await User.findById(userId);
      const username = currentUser.username;
  
      const comment = new Comment({
        poll: pollId,
        text,
        user: userId,
        parentComment: parentComment ? parentComment._id : null,
      });
        console.log(username, parentUsername)
      await comment.save();
  
      if (parentComment) {
        parentComment.replies.push(comment._id);
        await parentComment.save();
      }
  
      req.io.emit("comment", {
        _id: comment._id,
        poll: comment.poll,
        text: comment.text,
        user: {
          _id: comment.user,
          username: username,
        },
        parentComment: {
          _id: parentComment ? parentComment._id : null,
          user: {
            _id: parentComment ? parentComment.user : null,
            username: parentUsername,
          },
        },
      });
  
      res.status(201).send(comment);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  }); 


router.get("/:id/comments", authMiddleware, async (req, res) => {
    try {
      const comments = await Comment.find({ poll: req.params.id })
        .populate({
          path: "user",
          select: "username", 
        })
        .populate({
          path: "parentComment",
          populate: {
            path: "user",
            select: "username", 
          },
        })
        .sort({ createdAt: -1 }); 
  
      res.send(comments);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  });
  

module.exports = router

