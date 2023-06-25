require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const registerRoute = require("./routes/registerAndLogin");
const playlistsRoute = require("./routes/playlists");
const logoutRoute = require("./routes/logout");
const groupsRoutes = require("./routes/groups");
const boardMessagesRoute = require("./routes/boardMessages");
const spotifyRoute = require("./routes/spotify");
const errorHandler = require("./middleware/errorHandler");
const rateLimit = require("./config/rateLimit");

const app = express();
const PORT = process.env.PORT || 3500;

//DB connection
connectDB();

// Middlewares

app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-credentials", true);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, UPDATE"
  );
  next();
});

app.use(helmet());
app.use(bodyParser.json({ limit: "1mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());
app.use(rateLimit);

// App routes
app.use("/", registerRoute);
app.use("/", playlistsRoute);
app.use("/", logoutRoute);
app.use("/", groupsRoutes);
app.use("/", boardMessagesRoute);
app.use("/", spotifyRoute);

//error handling middleware
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB Error");
});
