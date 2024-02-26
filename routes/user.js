const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const axios = require("axios");
const PDFDocument = require("pdfkit"); //importing pdfkit

//to get profile of a user
router.get("/user/:id", (req, res) => {
  USER.findOne({ _id: req.params.id })
    .select("-password") // removes password form the result
    .then((user) => {
      POST.find({ postedBy: req.params.id })
        .populate("postedBy", "_id") //makes sure that only '_id' remains in 'postedBy'
        .then((posts) => {
          return res.status(200).json({ user, posts });
        })
        .catch((err) => res.status(422).json({ error: err }));
    })
    .catch((err) => res.status(422).json({ error: "User Not foune!" }));
});

//to follow
router.put("/follow", requireLogin, (req, res) => {
  USER.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      USER.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .then((response) => res.json(response))
        .catch((err) => res.status(422).json({ error: err }));
    })
    .catch((err) => res.status(422).json({ error: err }));
});

//to unfollow
router.put("/unfollow", requireLogin, (req, res) => {
  USER.findByIdAndUpdate(
    req.body.followId,
    {
      $pull: { followers: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      USER.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.followId },
        },
        {
          new: true,
        }
      )
        .then((response) => res.json(response))
        .catch((err) => res.status(422).json({ error: err }));
    })
    .catch((err) => res.status(422).json({ error: err }));
});

//to upload profile pic
router.put("/uploadProfilePic", requireLogin, (req, res) => {
  USER.findByIdAndUpdate(
    req.user._id,
    {
      $set: { photo: req.body.pic },
    },
    {
      new: true,
    }
  )
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(422).json(err));
});

//to get all user in the 'USER' collection
router.get("/allUser", requireLogin, (req, res) => {
  USER.find()
    .then((users) => {
      return res.status(200).json(users);
    })
    .catch((err) => console.log(err));
});

//to lock a user in privacy settings
router.put("/lockUser", requireLogin, (req, res) => {
  const location = req.body.location; // we are getting location array which has to be updated.

  const userId = new mongoose.Types.ObjectId(req.body.userId); // we are extracting mongoDb document Id from string of 'id' as query can only be performend on 'ObjectId' of mongoDb document.

  //since, our location contains name of array in string form, so we have to dynamically update our query
  const updateQuery = {
    $push: {},
  };
  updateQuery.$push[location] = userId;
  USER.findByIdAndUpdate(req.user._id, updateQuery, { new: true })
    .select("-password")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

//to unlock a user in privacy settings
router.put("/unlockUser", requireLogin, (req, res) => {
  const location = req.body.location; // we are getting location array which has to be updated.

  const userId = new mongoose.Types.ObjectId(req.body.userId); // we are extracting mongoDb document Id from string of 'id' as query can only be performend on 'ObjectId' of mongoDb document.

  //since, our location contains name of array in string form, so we have to dynamically update our query
  const updateQuery = {
    $pull: {},
  };
  updateQuery.$pull[location] = userId;
  USER.findByIdAndUpdate(req.user._id, updateQuery, { new: true })
    .select("-password")
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(422).json(err);
    });
});

function callApi(userId) {
  return axios
    .get(`http://localhost:5000/user/${userId}`)
    .then((result) => result.data)
    .catch((err) => console.log(err));
}

router.get("/generate-data", requireLogin, async (req, res) => {
  try {
    const userId = req.user._id;
    const jsonData = await callApi(userId); // Wait for the Promise to resolve.
    const user = jsonData.user;
    const posts = jsonData.posts;

    const doc = new PDFDocument({ size: "A4" }); // Create a new PDFDocument.
    // Add content to the PDF, customize it, and save it to a response.

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="profile-data.pdf"'
    );

    // Pipe the PDF content to the response stream.
    doc.pipe(res);

    doc.text("User Profile-Data: {\n\n");
    doc.text(
      `_id: ${user._id},\n name: ${user.name},\n username: ${user.username},\n email: ${user.email},\n photo: "${user.photo}"`
    );
    doc.text(` followers: ${JSON.stringify(user.followers)}`);
    doc.text(` following: ${JSON.stringify(user.following)}`);
    doc.text(` followersBlocked: ${JSON.stringify(user.followersBlocked)}`);
    doc.text(` followingBlocked: ${JSON.stringify(user.followingBlocked)}`);
    doc.text(` photoBlocked: ${JSON.stringify(user.photoBlocked)} \n\n}\n`);

    // Add content to the PDF document.
    doc.text(`\nPosts done by the ${user.name} :[\n`);
    posts.map((post, index) => {
      doc.text(`\n{`);
      doc.text(
        `_id: ${post._id},\n body: ${post.body},\n photo: "${post.photo}",`
      );
      doc.text(`likes: ${JSON.stringify(post.likes)} \n },\n`);
    });
    doc.text(`]`);
    // End the PDF document.
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

router.get("/findByName/:name", (req, res) => {
  USER.find({ searchText: req.params.name })
    .select("-password")
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(422).json(err));
});

module.exports = router;
