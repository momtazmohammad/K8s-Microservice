const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;
const mongoose = require("mongoose");
const amqp = require("amqplib");
const Order = require("./models/Order");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var channel, connection;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Order-Service Connected to MongoDB"))
  .catch((e) => console.log(e));

// RabbitMQ connection
async function connectToRabbitMQ() {
  connection = await amqp.connect("amqp://rabbitmq-svc:5672"); //amqp://guest:guest@rabbitmq-svc.default:5672
  channel = await connection.createChannel();
  await channel.assertQueue("order-service-queue");
}

createOrder = (products, userEmail) => {
  let total = 0;
  products.forEach((product) => {
    total += product.price;
  });

  const order = new Order({
    user: userEmail,
    products,
    total,
  });
  order.save();
  return order;
};

connectToRabbitMQ().then(() => {
  channel.consume("order-service-queue", (data) => {
    // order service queue listens to this queue
    const { products, userEmail } = JSON.parse(data.content);
    const newOrder = createOrder(products, userEmail);
    channel.ack(data);
    channel.sendToQueue(
      "product-service-queue",
      Buffer.from(JSON.stringify(newOrder))
    );
  });
});

app.listen(PORT, () => {
  console.log(`Order-Service listening on port ${PORT}`);
});
