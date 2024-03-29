const express = require("express");
const app = express();
const PORT = process.env.PORT || 3003;
const mongoose = require("mongoose");
const productRouter = require("./routes/product");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/products", productRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Product-Service Connected to MongoDB"))
  .catch((e) => console.log(e));

app.listen(PORT, () => {
  console.log(`Product-Service listening on port ${PORT}`);
});
