import React, { createContext, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { FetchContextType, FetchProviderType } from "./fetchContext.types";
import { useTodoContext } from "../../hooks/useTodoContext";
import {
  createOneTodo,
  deleteOneTodo,
  getAllTodos,
  updateOneTodo,
} from "../../utils/api";
import { ErrorMessages, SuccessMessages } from "../../types/Messages";
import { useToastContext } from "../../hooks";
import { ToastOptions } from "..";

export const FetchContext = createContext<FetchContextType>({
  handleTodoDelete: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
  handleAddNewTodo: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
  handleUpdateTodo: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  },
});

export const FetchProvider: React.FC<FetchProviderType> = ({ children }) => {
  const { setTodos, setProcessingTodoIds, setNewTodoTitle, setTempTodo } =
    useTodoContext();
  const { notify } = useToastContext();

  useEffect(() => {
    handleGetAll();
  }, []);

  const handleGetAll = async () => {
    try {
      const data = await getAllTodos();

      if (!data) {
        throw new Error("Failed to fetch");
      }

      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTodoDelete = async (todoId: number) => {
    try {
      setProcessingTodoIds((prevTodos) => [...prevTodos, todoId]);

      await deleteOneTodo(todoId);

      await handleGetAll();

      notify(ToastOptions.Success, SuccessMessages.Delete);
    } catch (err) {
      notify(ToastOptions.Error, ErrorMessages.Delete);
    } finally {
      setProcessingTodoIds((prevTodos) => {
        const filteredTodos = prevTodos.filter((id) => todoId !== id);

        return filteredTodos;
      });
    }
  };

  const handleAddNewTodo = async (title: string) => {
    try {
      await createOneTodo(title);
      setNewTodoTitle("");

      await handleGetAll();

      notify(ToastOptions.Success, SuccessMessages.Add);
    } catch (err) {
      notify(ToastOptions.Error, ErrorMessages.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleUpdateTodo = async (todoId: number, option: string | boolean) => {
    try {
      setProcessingTodoIds((prevTodos) => [...prevTodos, todoId]);

      await updateOneTodo(todoId, option);

      await handleGetAll();

      notify(ToastOptions.Success, SuccessMessages.Update);
    } catch (err) {
      notify(ToastOptions.Error, ErrorMessages.Update);
    } finally {
      setProcessingTodoIds((prevTodos) => {
        const filteredTodos = prevTodos.filter((id) => todoId !== id);

        return filteredTodos;
      });
    }
  };

  const fetchState = { handleTodoDelete, handleAddNewTodo, handleUpdateTodo };

  return (
    <FetchContext.Provider value={fetchState}>{children}</FetchContext.Provider>
  );
};
