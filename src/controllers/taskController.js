

const Task = require('../models/taskModel');
const { getAsync, setAsync } = require('../redis/redisClient');
const rsmq = require('../redis/rsmq');

const createTask = async (req, res) => {
  try {
    const { name, description, executionTime } = req.body;

    const task = new Task({
      name,
      description,
      executionTime,
      status: 'Open',
    });

    await task.save();

    const taskDetails = JSON.stringify({
      taskId: task._id,
      name: task.name,
      description: task.description,
      executionTime: task.executionTime,
    });

    // publish the task details to the RSMQ queue
    rsmq.sendMessage({ qname: 'tasksQueue', message: taskDetails }, (err, messageId) => {
      if (err) {
        console.error(`RSMQ error: ${err}`);
        return;
      }
      console.log(`Task message sent to queue with ID ${messageId}`);
    });

    // set the task status in Redis to Open
    await setAsync(`task:${task._id}:status`, 'Open');

    res.status(201).json(task);
  } catch (err) {
    console.error(`Error creating task: ${err}`);
    res.status(500).json({ error: 'Server error' });
  }
};

const processTaskMessage = async (message) => {
  try {
    const { taskId, executionTime } = JSON.parse(message);

    const taskStatus = await getAsync(`task:${taskId}:status`);
    if (taskStatus === 'Executed') {
      console.log(`Task ${taskId} already executed`);
      return;
    }

    const currentTime = Date.now();
    const delay = executionTime - currentTime;

    if (delay <= 0) {
      // execute the task
      console.log(`Executing task ${taskId}`);
      await setAsync(`task:${taskId}:status`, 'Executed');
    } else {
      // push the task message back onto the queue with a delay of 60 seconds
      console.log(`Task ${taskId} not ready to execute yet, pushing back onto queue`);
      rsmq.sendMessage({ qname: 'tasksQueue', message, delay: 60 }, (err, messageId) => {
        if (err) {
          console.error(`RSMQ error: ${err}`);
          return;
        }
        console.log(`Task message sent to queue with ID ${messageId}`);
      });
    }
  } catch (err) {
    console.error(`Error processing task message: ${err}`);
  }
};

const startTaskWorker = async () => {
  try {
    const worker = new RSMQWorker('tasksQueue', {
      autostart: true,
      interval: 1,
      invisibletime: 60,
      maxattempts: 3,
    });

    worker.on('message', async (message, next, id) => {
      console.log(`Received task message ${id}: ${message}`);

      await processTaskMessage(message);

      next();
    });

    worker.on('error', (err, message) => {
      console.error(`RSMQ worker error: ${err}, message: ${message}`);
    });
  } catch (err) {
    console.error(`Error starting task worker: ${err}`);
  }
}

module.exports={createTask,startTaskWorker,processTaskMessage}