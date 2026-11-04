const express = require('express')
const {
  getDashboard,
  seedDemoDashboard,
} = require('../controllers/dashboardController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/', getDashboard)
router.post('/seed-demo', seedDemoDashboard)

module.exports = router
