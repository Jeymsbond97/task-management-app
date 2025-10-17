import { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import api from "../api/axios";

import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import TaskCard from "../components/TaskCard";
import TaskFormModal from "../components/TaskFormModal";

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

    // Fetch tasks
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

    // Create task mutation
    const createMutation = useMutation({
        mutationFn: (newTask) => api.post("/tasks", newTask),
        onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        setShowModal(false);
        resetForm();
        },
    });

    // Update task mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => api.put(`/tasks/${id}`, data),
        onSuccess: () => {
        queryClient.invalidateQueries(["tasks"]);
        setShowModal(false);
        setEditingTask(null);
        resetForm();
        },
    });

    // Delete task mutation
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

    const getStatusColor = (status) => {
        switch (status) {
        case "completed":
            return "#10b981";
        case "in_progress":
            return "#f59e0b";
        default:
            return "#6b7280";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
        case "completed":
            return "✅ Completed";
        case "in_progress":
            return "🔄 In Progress";
        default:
            return "⏳ Pending";
        }
    };

    if (isLoading) {
        return (
        <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Loading tasks...</p>
        </div>
        );
    }

    if (error) {
        return (
        <div style={styles.error}>
            <p>❌ Error loading tasks: {error.message}</p>
        </div>
        );
    }

    return (
        <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
            <div>
            <h1 style={styles.title}>📋 Task Dashboard</h1>
            <p style={styles.subtitle}>
                Welcome back, <strong>{user?.name}</strong>!
            </p>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
            </button>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
            <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            />
            <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
            >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            </select>
            <button onClick={openCreateModal} style={styles.createBtn}>
            ➕ New Task
            </button>
        </div>

        {/* Tasks Grid */}
        <div style={styles.grid}>
            {tasks.length === 0 ? (
            <div style={styles.emptyState}>
                <p style={styles.emptyIcon}>📭</p>
                <p style={styles.emptyText}>No tasks found</p>
                <button onClick={openCreateModal} style={styles.createBtn}>
                Create Your First Task
                </button>
            </div>
            ) : (
            tasks.map((task) => (
                <div key={task.id} style={styles.card}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{task.title}</h3>
                    <span
                    style={{
                        ...styles.statusBadge,
                        backgroundColor: getStatusColor(task.status) + "20",
                        color: getStatusColor(task.status),
                    }}
                    >
                    {getStatusLabel(task.status)}
                    </span>
                </div>
                <p style={styles.cardDesc}>
                    {task.description || "No description"}
                </p>
                <p style={styles.cardDate}>Created: {task.created_at}</p>
                <div style={styles.cardActions}>
                    <button onClick={() => handleEdit(task)} style={styles.editBtn}>
                    ✏️ Edit
                    </button>
                    <button
                    onClick={() => handleDelete(task.id)}
                    style={styles.deleteBtn}
                    >
                    🗑️ Delete
                    </button>
                </div>
                </div>
            ))
            )}
        </div>

        {/* Modal */}
        {showModal && (
            <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.modalTitle}>
                {editingTask ? "✏️ Edit Task" : "➕ Create New Task"}
                </h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Title *</label>
                    <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    style={styles.input}
                    placeholder="Enter task title"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Description</label>
                    <textarea
                    value={formData.description}
                    onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                    }
                    style={styles.textarea}
                    placeholder="Enter task description"
                    rows="4"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label style={styles.label}>Status</label>
                    <select
                    value={formData.status}
                    onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                    }
                    style={styles.input}
                    >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    </select>
                </div>

                <div style={styles.modalActions}>
                    <button
                    type="button"
                    onClick={() => {
                        setShowModal(false);
                        setEditingTask(null);
                        resetForm();
                    }}
                    style={styles.cancelBtn}
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={
                        createMutation.isPending || updateMutation.isPending
                    }
                    style={styles.submitBtn}
                    >
                    {createMutation.isPending || updateMutation.isPending
                        ? "⏳ Saving..."
                        : editingTask
                        ? "💾 Update"
                        : "✅ Create"}
                    </button>
                </div>
                </form>
            </div>
            </div>
        )}
        </div>
    );
    }

const styles = {
    container: {
        minHeight: "100vh",
        background: "#3c5079ff",
        padding: "20px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        background: "white",
        padding: "20px 30px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    title: {
        fontSize: "28px",
        color: "#333",
        margin: "0",
    },
    subtitle: {
        color: "#666",
        marginTop: "5px",
    },
    logoutBtn: {
        padding: "10px 20px",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    filters: {
        display: "flex",
        gap: "15px",
        marginBottom: "30px",
        flexWrap: "wrap",
    },
    searchInput: {
        flex: "1",
        minWidth: "250px",
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "16px",
    },
    select: {
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "16px",
        background: "white",
        cursor: "pointer",
    },
    createBtn: {
        padding: "12px 24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px",
    },
    card: {
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        transition: "transform 0.2s",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "15px",
    },
    cardTitle: {
        fontSize: "20px",
        color: "#333",
        margin: "0",
        flex: "1",
    },
    statusBadge: {
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        fontWeight: "600",
    },
    cardDesc: {
        color: "#666",
        marginBottom: "15px",
        lineHeight: "1.5",
    },
    cardDate: {
        color: "#999",
        fontSize: "13px",
        marginBottom: "15px",
    },
    cardActions: {
        display: "flex",
        gap: "10px",
    },
    editBtn: {
        flex: "1",
        padding: "10px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
    },
    deleteBtn: {
        flex: "1",
        padding: "10px",
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
    },
    emptyState: {
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "60px 20px",
        background: "white",
        borderRadius: "12px",
    },
    emptyIcon: {
        fontSize: "64px",
        margin: "0",
    },
    emptyText: {
        fontSize: "18px",
        color: "#666",
        marginBottom: "20px",
    },
    modalOverlay: {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: "1000",
    },
    modal: {
        background: "white",
        padding: "30px",
        borderRadius: "15px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflow: "auto",
    },
    modalTitle: {
        marginTop: "0",
        marginBottom: "25px",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    label: {
        fontWeight: "600",
        color: "#555",
        fontSize: "14px",
    },
    input: {
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "16px",
    },
    textarea: {
        padding: "12px",
        border: "2px solid #e0e0e0",
        borderRadius: "8px",
        fontSize: "16px",
        fontFamily: "inherit",
        resize: "vertical",
    },
    modalActions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px",
    },
    cancelBtn: {
        flex: "1",
        padding: "12px",
        background: "#e0e0e0",
        color: "#333",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    submitBtn: {
        flex: "1",
        padding: "12px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "18px",
        color: "#666",
    },
    spinner: {
        width: "50px",
        height: "50px",
        border: "5px solid #f3f3f3",
        borderTop: "5px solid #667eea",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
    error: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "18px",
        color: "#ef4444",
    },
};

export default Tasks;







import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import api from "../api/axios";
import { User, Lock, LogIn, Eye, EyeOff, Sparkles } from "lucide-react";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
        const response = await api.post("/login", { name, password });
        login(response.data.user, response.data.token);
        navigate("/tasks");
        } catch (err) {
        setError(err.response?.data?.message || "Login failed");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
        <div style={styles.backgroundPattern}></div>
        <div style={styles.card}>
            <div style={styles.header}>
            <div style={styles.iconWrapper}>
                <Sparkles size={32} style={styles.headerIcon} />
            </div>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
            {error && (
                <div style={styles.error}>
                <span style={styles.errorIcon}>⚠️</span>
                {error}
                </div>
            )}

            <div style={styles.inputGroup}>
                <label style={styles.label}>Username</label>
                <div style={styles.inputWrapper}>
                <User size={20} style={styles.inputIcon} />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Enter your username"
                />
                </div>
            </div>

            <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputWrapper}>
                <Lock size={20} style={styles.inputIcon} />
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Enter your password"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
                {loading ? (
                <>
                    <div style={styles.spinner}></div>
                    <span>Signing in...</span>
                </>
                ) : (
                <>
                    <LogIn size={20} />
                    <span>Sign In</span>
                </>
                )}
            </button>
            </form>

            <div style={styles.divider}>
            <span style={styles.dividerText}>New to our platform?</span>
            </div>

            <Link to="/register" style={styles.secondaryButton}>
            Create an account
            </Link>
        </div>
        </div>
    );
    }

    const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
    },
    backgroundPattern: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `,
        animation: "fadeIn 1s ease-in-out",
    },
    card: {
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(20px)",
        padding: "50px 40px",
        borderRadius: "24px",
        boxShadow: "0 30px 90px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "460px",
        position: "relative",
        zIndex: 1,
        animation: "slideIn 0.6s ease-out",
    },
    header: {
        textAlign: "center",
        marginBottom: "40px",
    },
    iconWrapper: {
        width: "64px",
        height: "64px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        boxShadow: "0 8px 24px rgba(102, 126, 234, 0.4)",
    },
    headerIcon: {
        color: "white",
    },
    title: {
        fontSize: "32px",
        fontWeight: "800",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "8px",
        letterSpacing: "-0.5px",
    },
    subtitle: {
        color: "#64748b",
        fontSize: "15px",
        fontWeight: "500",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "24px",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    label: {
        fontWeight: "600",
        color: "#334155",
        fontSize: "14px",
        letterSpacing: "0.3px",
    },
    inputWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    inputIcon: {
        position: "absolute",
        left: "16px",
        color: "#94a3b8",
        pointerEvents: "none",
        zIndex: 1,
    },
    input: {
        width: "100%",
        padding: "14px 16px 14px 48px",
        border: "2px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "15px",
        transition: "all 0.3s ease",
        outline: "none",
        background: "white",
        fontWeight: "500",
        color: "#1e293b",
    },
    eyeButton: {
        position: "absolute",
        right: "12px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px",
        color: "#94a3b8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "color 0.2s",
        borderRadius: "8px",
    },
    button: {
        padding: "16px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        borderRadius: "12px",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "700",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        letterSpacing: "0.5px",
    },
    spinner: {
        width: "20px",
        height: "20px",
        border: "3px solid rgba(255,255,255,0.3)",
        borderTop: "3px solid white",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
    },
    error: {
        background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
        color: "#991b1b",
        padding: "14px 16px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: "600",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        border: "1px solid #fca5a5",
    },
    errorIcon: {
        fontSize: "18px",
    },
    divider: {
        position: "relative",
        textAlign: "center",
        margin: "32px 0 24px",
    },
    dividerText: {
        background: "rgba(255, 255, 255, 0.95)",
        padding: "0 16px",
        color: "#64748b",
        fontSize: "14px",
        fontWeight: "600",
        position: "relative",
        zIndex: 1,
    },
    secondaryButton: {
        display: "block",
        textAlign: "center",
        padding: "14px",
        background: "transparent",
        color: "#667eea",
        border: "2px solid #667eea",
        borderRadius: "12px",
        fontSize: "15px",
        fontWeight: "700",
        textDecoration: "none",
        transition: "all 0.3s ease",
        letterSpacing: "0.3px",
    },
    };

    ex;