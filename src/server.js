require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  server.setTimeout(120000);
  server.keepAliveTimeout = 120000;

  // Tunnels are managed by tunnel.js in the project root
});
