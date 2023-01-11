const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Auth-Service Connected to MongoDB"))
  .catch((e) => console.log(e));

app.listen(PORT, () => {
  console.log(`Auth-Service listening on port ${PORT}`);
});
