const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const cors = require("cors")
const { app, server } = require("./socket/socket.js");

const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes");
const messaageRoutes = require("./routes/messaage.routes.js");

const SMPT = process.env.SMPT || 5050;
const connectToMongoDB = require("./DB/connectToMongoDB.js");

app.use(express.json());
app.use(cookieParser());

let _dirname = path.resolve();
app.use(express.static(path.join()));

app.use("/api/auth", authRoutes);
app.use("/api/message", messaageRoutes);
app.use("/api/users", userRoutes);

server.listen(SMPT, () => {
  connectToMongoDB();
  console.log(`Server is running on port ${SMPT} `);
});
