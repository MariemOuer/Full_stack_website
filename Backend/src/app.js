const express = require('express');
const cors = require('cors');
const usersRoutes = require('./routes/users_routes');
const eventsRoutes = require('./routes/events_routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api', [usersRoutes, eventsRoutes]);
app.listen(5000);
module.exports = app;
