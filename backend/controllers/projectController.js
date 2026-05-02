const Project = require('../models/Project');
const sendEmail = require('../utils/sendEmail');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      totalCost,
      startDate,
      expectedCompletionDate,
    } = req.body;

    const project = await Project.create({
      userId,
      title,
      description,
      totalCost,
      startDate,
      expectedCompletionDate,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user projects
// @route   GET /api/projects/user
// @access  Private
const getUserProjects = async (req, res) => {
  try {
    // If admin, they might want to see all or specific, but route says 'user' so we fetch for logged in user
    // Alternatively, an admin can pass userId in query to fetch specific user's projects
    const userId = req.user.role === 'admin' && req.query.userId ? req.query.userId : req.user._id;
    
    const projects = await Project.find({ userId }).populate('userId', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project progress
// @route   PUT /api/projects/:id/progress
// @access  Private/Admin
const updateProjectProgress = async (req, res) => {
  try {
    const { progress, status } = req.body;

    const project = await Project.findById(req.params.id);

    if (project) {
      if (progress !== undefined) project.progress = progress;
      if (status !== undefined) project.status = status;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    User books a project
// @route   POST /api/projects/book
// @access  Private
const bookProject = async (req, res) => {
  try {
    const { title, description, personName, address, phone, agreedAmount } = req.body;
    const project = await Project.create({
      userId: req.user._id,
      title,
      description,
      personName,
      address,
      phone,
      agreedAmount: agreedAmount || 0,
      totalCost: agreedAmount || 0,
      status: 'pending',
    });

    // Send email notification
    await sendEmail({
      email: req.user.email,
      subject: 'Project Booking Received - Raj Marvel Exterior Designs',
      message: `Dear ${req.user.name},\n\nWe have received your booking request for the project: "${title}".\nOur team will review your request and get back to you shortly.\n\nThank you,\nRaj Marvel Exterior Designs Team`,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects (Admin)
// @route   GET /api/projects/all
// @access  Private/Admin
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update project details (Admin)
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProjectDetails = async (req, res) => {
  try {
    const { status, progress, totalCost, startDate, expectedCompletionDate } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      if (status !== undefined) project.status = status;
      if (progress !== undefined) project.progress = progress;
      if (totalCost !== undefined) project.totalCost = totalCost;
      if (startDate !== undefined) project.startDate = startDate;
      if (expectedCompletionDate !== undefined) project.expectedCompletionDate = expectedCompletionDate;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Admin Stats
// @route   GET /api/projects/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'in_progress' });
    const pendingProjects = await Project.countDocuments({ status: 'pending' });
    
    // Calculate total revenue from all completed payments
    const Payment = require('../models/Payment');
    const completedPayments = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
    const totalRevenue = completedPayments.length > 0 ? completedPayments[0].totalRevenue : 0;

    res.json({
      totalProjects,
      activeProjects,
      pendingProjects,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getUserProjects, updateProjectProgress, bookProject, getAllProjects, updateProjectDetails, getAdminStats };
