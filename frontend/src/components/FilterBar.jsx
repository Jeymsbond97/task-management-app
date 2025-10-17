import React from "react";
import { Search, Filter, PlusCircle, List, Clock, AlertCircle, CheckCircle } from "lucide-react";
import styles from "../styles/components/FilterBar.module.css"; // CSS Modules import

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onCreate,
}) => {
  const getFilterIcon = () => {
    switch (statusFilter) {
      case "pending":
        return <Clock size={18} />;
      case "in_progress":
        return <AlertCircle size={18} />;
      case "completed":
        return <CheckCircle size={18} />;
      default:
        return <List size={18} />;
    }
  };

  return (
    <div className={styles.filters}>
      <div className={styles.searchWrapper}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.selectWrapper}>
        <div className={styles.selectIconWrapper}>
          {getFilterIcon()}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.select}
        >
          <option value="" className={styles.option}>All Status</option>
          <option value="pending" className={styles.option}>Pending</option>
          <option value="in_progress" className={styles.option}>In Progress</option>
          <option value="completed" className={styles.option}>Completed</option>
        </select>
      </div>

      <button onClick={onCreate} className={styles.createBtn}>
        <PlusCircle size={20} />
        <span>New Task</span>
      </button>
    </div>
  );
};

export default FilterBar;
