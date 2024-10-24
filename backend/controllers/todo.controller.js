import Todo from "../models/todo.model.js";
import mongoose from "mongoose";

export const fetchTodos = async (req, res) => {
  try {
    const data = await Todo.find();
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ success: false, message: "server error" });
  }
};

export const createTodo = async (req, res) => {
  const todoData = req.body;
  try {
    const data = await new Todo(todoData);
    data.save();
    return res.status(201).json({ success: true, data: data });
  } catch (error) {
    console.error("Error", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTodo = async (req, res) => {
  const todoId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return res.status(404).json({ success: false, message: "invalid todo id" });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(todoId, req.body, {
      new: true,
    });

    if (updatedTodo) {
      return res.status(200).json({ success: true, data: updatedTodo });
    } else {
      throw new Error("Todo Not found");
    }
  } catch (error) {
    console.error("Error", error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
};

export const deleteTodo = async (req, res) => {
  const todoId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(todoId)) {
    return res.status(404).json({ success: false, message: "invalid todo id" });
  }

  try {
    const deletedTodo = await Todo.findByIdAndDelete(todoId);

    if (deletedTodo) {
      return res.status(200).json({ success: true, message: "todo deleted" });
    } else {
      throw new Error("Todo not found");
    }
  } catch (error) {
    console.error("Error", error.message);
    return res.status(404).json({ success: false, message: error.message });
  }
};
