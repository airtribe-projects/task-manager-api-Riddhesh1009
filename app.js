const express = require('express');
const tasksRouter = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/tasks', tasksRouter);

// 404 for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found', message: `Cannot ${req.method} ${req.originalUrl}` });
});

// Centralized error handler
app.use(errorHandler);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;