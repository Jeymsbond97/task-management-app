import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import api from "../api/axios";

import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import TaskCard from "../components/TaskCard";
import TaskFormModal from "../components/TaskFormModal";

import styles from "../styles/pages/Tasks.module.css"; // CSS Modules import

function Tasks() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", statusFilter, searchTerm],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const response = await api.get("/tasks", { params });
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newTask) => api.post("/tasks", newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setShowModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/tasks/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      setShowModal(false);
      setEditingTask(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const resetForm = () => {
    setFormData({ title: "", description: "", status: "pending" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const openCreateModal = () => {
    setEditingTask(null);
    resetForm();
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>Error loading tasks: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Header user={user} onLogout={handleLogout} />

        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onCreate={openCreateModal}
        />

        <div className={styles.grid}>
          {tasks.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyIcon}>📭</p>
              <p className={styles.emptyText}>No tasks found</p>
              <button onClick={openCreateModal} className={styles.createBtn}>
                Create Your First Task
              </button>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => handleEdit(task)}
                onDelete={() => handleDelete(task.id)}
              />
            ))
          )}
        </div>
      </div>

      <TaskFormModal
        show={showModal}
        editingTask={editingTask}
        formData={formData}
        setFormData={setFormData}
        onCancel={() => {
          setShowModal(false);
          setEditingTask(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}

export default Tasks;
