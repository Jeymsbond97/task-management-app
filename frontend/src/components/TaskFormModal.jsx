import React from "react";
import { X, Save, Plus } from "lucide-react";
import styles from "../styles/components/TaskFormModal.module.css";

const TaskFormModal = ({ show, editingTask, formData, setFormData, onCancel, onSubmit, isPending }) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onCancel} className={styles.closeBtn}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className={styles.input}
              placeholder="Enter task title"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={styles.textarea}
              placeholder="Enter task description"
              rows="4"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={styles.input}
            >
              <option value="pending">⏳ Pending</option>
              <option value="in_progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>

          <div className={styles.modalActions}>
            <button type="button" onClick={onCancel} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={isPending} className={styles.submitBtn}>
              {isPending ? (
                <>
                  <div className={styles.spinner}></div>
                  <span>Saving...</span>
                </>
              ) : editingTask ? (
                <>
                  <Save size={18} />
                  <span>Update Task</span>
                </>
              ) : (
                <>
                  <Plus size={18} />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
