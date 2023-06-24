require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db");
const registerRoute = require("./routes/registerAndLogin");
const playlistsRoute = require("./routes/playlists");
const logoutRoute = require("./routes/logout");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3500;

//DB connection
connectDB();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// App routes
app.use("/", registerRoute);
app.use("/", playlistsRoute);
app.use("/", logoutRoute);

//error handling middleware
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {});
