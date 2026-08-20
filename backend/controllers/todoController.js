const Todo = require('../models/Todo');

// @desc    Get all todos with filtering, search & sorting for logged in user
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const { search, status, category, priority, sortBy, order } = req.query;

    let query = { user: req.user._id };

    // Search filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$and = [
        { user: req.user._id },
        {
          $or: [{ title: searchRegex }, { description: searchRegex }]
        }
      ];
    }

    // Status filter
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'active') {
      query.completed = false;
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Sorting
    let sortOptions = {};
    const sortField = sortBy || 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    sortOptions[sortField] = sortOrder;

    const todos = await Todo.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stats for dashboard for logged in user
// @route   GET /api/todos/stats
// @access  Private
const getStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const total = await Todo.countDocuments({ user: userId });
    const completed = await Todo.countDocuments({ user: userId, completed: true });
    const pending = total - completed;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const highPriority = await Todo.countDocuments({ user: userId, priority: 'high', completed: false });
    const mediumPriority = await Todo.countDocuments({ user: userId, priority: 'medium', completed: false });
    const lowPriority = await Todo.countDocuments({ user: userId, priority: 'low', completed: false });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        completionPercentage,
        priorityBreakdown: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new todo for logged in user
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (!title || title.trim() === '') {
      res.status(400);
      throw new Error('Title is required');
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      category: category || 'General',
      dueDate: dueDate || null,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this task');
    }

    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this task');
    }

    await todo.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all completed todos for logged in user
// @route   DELETE /api/todos/completed/clear
// @access  Private
const clearCompleted = async (req, res, next) => {
  try {
    const result = await Todo.deleteMany({ user: req.user._id, completed: true });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed todos cleared`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getStats,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompleted
};
