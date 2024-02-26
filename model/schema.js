const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  searchText:{
    type:String
  },
  photo: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [{ type: ObjectId, ref: "USER" }],
  following: [{ type: ObjectId, ref: "USER" }],
  followersBlocked: [{ type: ObjectId, ref: "USER" }], //user blocked from seeing 'follower' list
  followingBlocked: [{ type: ObjectId, ref: "USER" }],
  photoBlocked: [{ type: ObjectId, ref: "USER" }],
});

mongoose.model("USER", userSchema);
