import http from 'http';
import fs from 'fs';
import path from 'path';

let tasks = [
  {
    id: 1,
    taskName: "Develop Login Page",
    assignedTo: "Rahul Sharma",
    status: "Pending"
  },
  {
    id: 2,
    taskName: "Create API Endpoints",
    assignedTo: "Priya Patel",
    status: "In Progress"
  },
  {
    id: 3,
    taskName: "Setup Database Schema",
    assignedTo: "Amit Kumar",
    status: "Completed"
  }
];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (method === 'GET' && url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Welcome to Employee Task Management System</h1>');
  } else if (method === 'GET' && url === '/tasks') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tasks));
  } else if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Us</h1><p>Employee Task Management application manages tasks and workflow efficiently.</p>');
  } else if (method === 'GET' && url === '/home') {
    const filePath = path.join(process.cwd(), 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if (method === 'POST' && url === '/add-task') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newTask = JSON.parse(body);
        const { id, taskName, assignedTo, status } = newTask;
        if (!id || !taskName || !assignedTo || !status) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ message: "All fields (id, taskName, assignedTo, status) are required" }));
        }
        tasks.push(newTask);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Task added successfully", task: newTask }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: "Invalid JSON format" }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
