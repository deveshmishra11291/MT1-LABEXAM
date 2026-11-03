import express from 'express';

const app = express();
app.use(express.json());

let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending",
    priority: "High"
  },
  {
    id: 2,
    taskName: "Design Database Schema",
    assignedTo: "Priya Patel",
    status: "In Progress",
    priority: "Medium"
  },
  {
    id: 3,
    taskName: "Setup CI/CD Pipeline",
    assignedTo: "Amit Kumar",
    status: "Completed",
    priority: "Low"
  }
];

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

app.post('/tasks', (req, res) => {
  const { id, taskName, assignedTo, status, priority } = req.body;

  if (!taskName || !assignedTo || !status || !priority) {
    return res.status(400).json({ message: "All task fields are required" });
  }

  const newTask = {
    id: id || (tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1),
    taskName,
    assignedTo,
    status,
    priority
  };

  tasks.push(newTask);
  res.status(201).json({
    message: "Task added successfully",
    task: newTask
  });
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...req.body,
    id: id
  };

  res.status(200).json({
    message: "Task updated successfully",
    task: tasks[taskIndex]
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
