const app = require('./app');
const { sequelize } = require('./models');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate(); 
    console.log('Database connected successfully.');

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: '*',
      }
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();