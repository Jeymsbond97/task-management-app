import React, { useState } from "react";
import { LayoutDashboard, LogOut, Sparkles } from "lucide-react";
import styles from "../styles/components/Header.module.css";

const Header = ({ user, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleLogoutClick = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onLogout();
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.iconWrapper}>
          <LayoutDashboard size={28} className={styles.dashboardIcon} />
        </div>
        <div>
          <h1 className={styles.title}>Task Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back, <strong>{user?.name}</strong>! 
            <Sparkles size={16} className={styles.sparkle} />
          </p>
        </div>
      </div>
      <button 
        onClick={handleLogoutClick} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${styles.logoutBtn} ${isHovered ? styles.logoutBtnHover : ""}`}
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Header;
