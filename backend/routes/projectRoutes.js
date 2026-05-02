const express = require('express');
const router = express.Router();
const {
  createProject,
  getUserProjects,
  updateProjectProgress,
  bookProject,
  getAllProjects,
  updateProjectDetails,
  getAdminStats
} = require('../controllers/projectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createProject);
router.route('/all').get(protect, admin, getAllProjects);
router.route('/stats').get(protect, admin, getAdminStats);
router.route('/book').post(protect, bookProject);
router.route('/user').get(protect, getUserProjects);
router.route('/:id/progress').put(protect, admin, updateProjectProgress);
router.route('/:id').put(protect, admin, updateProjectDetails);

module.exports = router;
