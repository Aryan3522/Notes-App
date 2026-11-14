require("dotenv").config({ path: "./Config/config.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectdb } = require("./Config/db");
const morgan = require("morgan");

const AuthRouter = require("./routes/auth");
const NotesRouter = require("./routes/notes");
const folderRouter = require("./routes/folder");
const profileRouter = require("./routes/profile");
const fileRouter = require("./routes/file");

const app = express();

/* middleware */
app.use(cors());
app.use(bodyParser.json({ limit: "30mb" }));
app.use(morgan("dev"));

/* connect database */
connectdb();

/* test route */
app.get("/", (req, res) => {
    res.send("Hello");
});

/* routes */
app.use("/auth", AuthRouter);
app.use("/notes", NotesRouter);
app.use("/folder", folderRouter);
app.use("/profile", profileRouter);
app.use("/file", fileRouter);

/* server */
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});