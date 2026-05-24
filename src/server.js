require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  // Tunnels are managed by tunnel.js in the project root
});
