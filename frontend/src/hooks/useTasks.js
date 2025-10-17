import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

    // TASK list (fetch)
    const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    return data;
    };

    // CREATE
    const createTaskFn = async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    return data;
    };

    // UPDATE
    const updateTaskFn = async ({ id, ...taskData }) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data;
    };

    // DELETE
    const deleteTaskFn = async (id) => {
    await api.delete(`/tasks/${id}`);
    return id;
    };

    export const useTasks = () => {
    const queryClient = useQueryClient();

    // ✅ Get all tasks
    const {
        data: tasks,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["tasks"],
        queryFn: fetchTasks,
    });

    // ✅ Create task
    const createTask = useMutation({
        mutationFn: createTaskFn,
        onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        },
    });

    // ✅ Update task
    const updateTask = useMutation({
        mutationFn: updateTaskFn,
        onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        },
    });

    // ✅ Delete task
    const deleteTask = useMutation({
        mutationFn: deleteTaskFn,
        onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        },
    });

    return {
        tasks,
        isLoading,
        isError,
        error,
        createTask,
        updateTask,
        deleteTask,
    };
    };
