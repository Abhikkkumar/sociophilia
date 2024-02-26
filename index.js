const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");

const PORT = process.env.port || 5000;

const cors = require("cors");
app.use(cors());


const {mongoURL} = require("./key");

require("./model/schema");
require("./model/post");

app.use(express.json()); // to convert data into json format 

app.use(require("./routes/auth"));
app.use(require("./routes/createPost"));
app.use(require("./routes/user"));
mongoose.connect(mongoURL);//to connect to db.

// to give conformation message after connection to db.
mongoose.connection.on("connected",()=>{
    console.log("Connnected to database.");
});
// to give message if error occurs during connection
mongoose.connection.on("error",()=>{
    console.log("Not Connnected to database.");
});

//serving the frontend
app.use(express.static(path.join(__dirname, "/frontend/build")))

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname,"/frontend/build/index.html")),
    function(err){
        res.status(500).json(err)
    }
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})