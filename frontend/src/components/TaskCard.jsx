import React from "react";
import { Edit2, Trash2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import styles from "../styles/components/TaskCard.module.css";

const TaskCard = ({ task, onEdit, onDelete }) => {
    const getStatusConfig = (status) => {
        switch (status) {
        case "completed":
            return { color: "#10b981", bg: "#d1fae5", icon: <CheckCircle size={16} />, label: "Completed" };
        case "in_progress":
            return { color: "#f59e0b", bg: "#fef3c7", icon: <AlertCircle size={16} />, label: "In Progress" };
        default:
            return { color: "#6b7280", bg: "#f3f4f6", icon: <Clock size={16} />, label: "Pending" };
        }
    };

    const statusConfig = getStatusConfig(task.status);

    return (
        <div className={styles.card}>
        <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{task.title}</h3>
            <span
            className={styles.statusBadge}
            style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
            >
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
            </span>
        </div>

        <p className={styles.cardDesc}>{task.description || "No description provided"}</p>

        <div className={styles.cardFooter}>
            <p className={styles.cardDate}>
            <Clock size={14} className={styles.clockIcon} />
            {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>

            <div className={styles.cardActions}>
            <button onClick={onEdit} className={styles.editBtn}>
                <Edit2 size={16} />
            </button>
            <button onClick={onDelete} className={styles.deleteBtn}>
                <Trash2 size={16} />
            </button>
            </div>
        </div>
        </div>
    );
};

export default TaskCard;
