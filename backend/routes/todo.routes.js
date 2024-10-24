import express from "express";
import {
  fetchTodos,
  updateTodo,
  createTodo,
  deleteTodo,
} from "../controllers/todo.controller.js";

const routes = express.Router();

routes.get("/", fetchTodos);

routes.post("/", createTodo);

routes.put("/:id", updateTodo);

routes.delete("/:id", deleteTodo);

export default routes;
