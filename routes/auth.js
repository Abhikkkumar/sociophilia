const express = require("express");
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Jwt_secret } = require("../key.js");
const requireLogin = require("../middleware/requireLogin.js");

const router = express.Router(); //used to handle request on large website in effective manner

router.post("/signup", (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    res.status(422).json({
      error: "Please add all the fields",
    });
    return;
  }
  //it check if any user is already registered in DB, with provided 'email' or 'username'
  USER.findOne({ $or: [{ email: email }, { username: username }] }).then(
    (savedUser) => {
      // if user exist in DB, then return error
      if (savedUser) {
        return res.status(422).json({
          error: "email or username already registered!",
        });
      }
      //else create new user and save it in DB

      //'bcrypt' is used to hide our password by hashing it
      bcrypt.hash(password, 12).then((hashedPass) => {
        const searchText = name.toLowerCase().trim().replaceAll(/\s+/g, "-");
        const user = new USER({
          name,
          searchText,
          username,
          email,
          password: hashedPass,
        });
        user
          .save()
          .then((user) =>
            res.status(200).json({ message: "Registered Successfully!" })
          )
          .catch((error) => console.log(error));
      });
    }
  );
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body; //destructuring incoming data

  //if email or password is empty, then give error
  if (!email || !password) {
    return res.status(422).json({
      error: "Please add email and password.",
    });
  }

  USER.findOne({ email: email }).then((savedUser) => {
    //if email is not present in DB, then give error
    if (!savedUser) {
      return res.status(422).json({
        error: "Invalid Email!",
      });
    }
    bcrypt
      .compare(password, savedUser.password) // use bcrypt to compare provided password with those in DB
      .then((matchResult) => {
        if (!matchResult) {
          return res.status(422).json({
            error: "Invalid Password!",
          });
        }

        const token = jwt.sign({ _id: savedUser.id }, Jwt_secret);
        const { _id, name, username, email } = savedUser;
        // console.log({token,savedUser});
        res.status(200).json({ token, savedUser });
      })
      .catch((err) => {
        return res.status(422).json("Error occured during signin!");
      });
  });
});

module.exports = router;
