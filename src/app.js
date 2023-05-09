const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route");
//const tasksRouter = require('./routes/tasks');
///const RSMQWorker = require("rsmq-worker");

require("dotenv").config();
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", route);
const mongoose = require("mongoose");
//const taskModel = require("./models/taskModel");
mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: "true",
    useUnifiedTopology: "true",
  })

  .then(() => console.log("mongodb is connected"))
  .catch((err) => console.log(err));
// // Set up RSMQ worker
// const worker = new RSMQWorker("tasks");
// // Start RSMQ worker
// worker.on("message", async (message, next, id) => {
//   try {
//     const task = JSON.parse(message);
//     if (task.executionTime <= Date.now()) {
//       await taskModel.findByIdAndUpdate(task._id, { status: "Executed" });
//     } else {
//       worker.send(message, { delay: 60000 }, (err, messageId) => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log(`Message ${messageId} sent to queue with 60s delay`);
//         }
//       });
//     }
//     next();
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// });

// worker.start();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
