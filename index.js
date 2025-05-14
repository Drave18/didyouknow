import express from "express";
import router from "./router/pagesController.js";

const app = express();

const port = process.env.PORT || 3000;

// Enable view engine pug
app.set("view engine", "pug");

// Body parser to read data from request
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});