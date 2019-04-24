const express = require('express');
const router = express.Router();

//Test route visit http://localhost:5000/ to verify
router.get('/', (req, res) => {
  res.json({test: 'Route works!'});
});

module.exports = router;
