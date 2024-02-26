const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST");

//to get all posts in the 'POST' collection
router.get("/allPosts", requireLogin, (req, res) => {
  POST.find()
    .populate("postedBy", "_id name photo photoBlocked") // use ".populate("postedBy","") instead, to populate all fields in 'postedBy'
    .populate("comments.postedBy", "_id name")
    .sort("-createdAt") //it sort our post in decreasing order according to out time stamp
    .then((posts) => {
      return res.status(200).json(posts);
    })
    .catch((err) => console.log(err));
});

//to create new post in 'POST' collection
router.post("/createPost", requireLogin, (req, res) => {
  const { photo, caption, canSee } = req.body;

  if (!photo || !caption) {
    return res.status(422).json({
      error: "Please add all the fields!",
    });
  }

  const post = new POST({
    photo,
    body: caption,
    canSee,
    postedBy: req.user,
  });
  console.log(post);

  post
    .save()
    .then((result) => {
      return res.status(200).json({ message: "Post successfully saved" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({
        error: "Error occured during posting!",
      });
    });
});

// to get all posts created by a particular 'account'
router.get("/myposts", requireLogin, (req, res) => {
  POST.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .sort("-createdAt")
    .then((myposts) => res.json(myposts));
});

// to like a post- we are adding 'id' of a user in 'likes' array of the liked post
router.put("/like", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => res.status(422).json(err));
});

// to unlike a post
router.put("/unlike", requireLogin, (req, res) => {
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .then((result) => {
      return res.json(result);
    })
    .catch((err) => res.status(422).json(err));
});

//to show posts by accounts followed by "signed in" user
router.get("/myfollowingpost", requireLogin, (req, res) => {
  POST.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name photo photoBlocked")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

//to handle comments
router.put("/comment", requireLogin, (req, res) => {
  const comment = {
    comment: req.body.text,
    postedBy: req.user._id,
  };
  POST.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name photo photoBlocked")
    .populate("comments.postedBy", "name photo")
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(422).json(err));
});

module.exports = router;
