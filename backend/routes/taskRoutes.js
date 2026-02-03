const express = require("express");
const router = express.Router();

const Task = require("../models/Task"); 
const controller = require('../controllers/taskController');

router.post('/', controller.createTask);
router.get('/', controller.getTasks);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
