import axios from "axios";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Todo = () => {
  const myRef = useRef();
  const queryClient = useQueryClient();

  const [todoData, setTodoData] = useState({ title: "" });
  const [updateTodo, setUpdateTodo] = useState({ id: "", title: "" });

  const fetchTodos = async () => {
    const response = await axios.get("/api/todos/");
    return response.data.data;
  };

  const {
    data: todos,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: async (newTodo) => {
      const { title } = newTodo;
      if (title !== "") {
        const response = await axios.post("/api/todos/", newTodo);
        return response.data.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
      setTodoData({ title: "" });
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: async (updatedTodo) => {
      const { id, title } = updatedTodo;
      const response = await axios.put(`/api/todos/${id}`, { title });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      setUpdateTodo({ id: "", title: "" });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (todoId) => {
      const response = await axios.delete(`/api/todos/${todoId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  const toggleCompletedMutation = useMutation({
    mutationFn: async (todo) => {
      const response = await axios.put(`/api/todos/${todo._id}`, {
        completed: !todo.completed,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  if (isLoading) return <h1>Loading....</h1>;
  if (error) return <h1>{error.message}</h1>;

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (updateTodo.id !== "") {
      setUpdateTodo((prev) => ({ ...prev, title: value }));
    } else {
      setTodoData({ title: value });
    }
  };

  const handleSave = () => {
    if (updateTodo.id) {
      updateTodoMutation.mutate(updateTodo);
    } else {
      addTodoMutation.mutate(todoData);
    }
  };

  return (
    <div className="w-full max-w-[800px] h-[100%] bg-slate-200 m-auto p-4">
      <h1 className="text-3xl text-center font-bold mb-4">Todos</h1>
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <input
          type="text"
          className="w-full md:w-[700px] outline-none h-[40px] rounded bg-zinc-800 text-white pl-2"
          placeholder="Write something here"
          value={updateTodo.id ? updateTodo.title : todoData.title}
          onChange={handleInputChange}
          ref={myRef}
        />
        <button
          className="px-8 py-2 border-none rounded bg-blue-500"
          onClick={handleSave}
        >
          {updateTodo.id ? "Update" : "Save"}
        </button>
      </div>
      <table className="w-full border-2 mt-4 text-center">
        <thead className="bg-zinc-500 text-white">
          <tr>
            <th className="border-2">Title</th>
            <th className="border-2 px-2">Completed</th>
            <th className="border-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo._id}>
              <td className="border-2 text-white bg-zinc-700 p-2 text-justify">
                {todo.title}
              </td>
              <td className="border-2 text-white bg-zinc-700">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={todo.completed}
                  onChange={() => toggleCompletedMutation.mutate(todo)}
                />
              </td>
              <td className="border-2 bg-zinc-700 p-2 whitespace-nowrap">
                <button
                  className="p-1 bg-blue-500 text-white border-none rounded"
                  onClick={() =>
                    setUpdateTodo({ id: todo._id, title: todo.title })
                  }
                >
                  Update
                </button>
                <button
                  className="p-1 bg-red-500 text-white border-none rounded ml-2"
                  onClick={() => deleteTodoMutation.mutate(todo._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Todo;
