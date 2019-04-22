const express = require('express');
const router = express.Router();

//Test route 
app.get('/', (req, res) => {
  res.json({test: 'Route works!'});
});

module.exports = router;
