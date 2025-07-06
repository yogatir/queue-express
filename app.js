const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const staffRoutes = require('./routes/staffRoutes');
const queueRoutes = require('./routes/queueRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/staff', staffRoutes);
app.use('/queue', queueRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('API is running.');
});

module.exports = app;