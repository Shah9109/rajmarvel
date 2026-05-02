const express = require('express');
const router = express.Router();
const { generateBill, getProjectBills, downloadBillPdf } = require('../controllers/billController');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/bills  — create bill (admin)
router.route('/').post(protect, admin, generateBill);
// POST /api/bills/generate — alias
router.route('/generate').post(protect, admin, generateBill);

// GET /api/bills/:billId/pdf  — download PDF (MUST be before /:projectId)
router.get('/:billId/pdf', protect, downloadBillPdf);

// GET /api/bills/:projectId — get all bills for a project
router.get('/:projectId', protect, getProjectBills);

module.exports = router;
