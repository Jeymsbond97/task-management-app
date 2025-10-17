import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import api from "../api/axios";
import { User, Lock, LogIn, Eye, EyeOff, Sparkles } from "lucide-react";
import styles from "../styles/pages/Login.module.css"; // CSS Modules import

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
        <div className={styles.container}>
        <div className={styles.backgroundPattern}></div>
        <div className={styles.card}>
            <div className={styles.header}>
            <div className={styles.iconWrapper}>
                <Sparkles size={32} className={styles.headerIcon} />
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
                <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
                </div>
            )}

            <div className={styles.inputGroup}>
                <label className={styles.label}>Username</label>
                <div className={styles.inputWrapper}>
                <User size={20} className={styles.inputIcon} />
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Enter your username"
                />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                <Lock size={20} className={styles.inputIcon} />
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                    placeholder="Enter your password"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
                {loading ? (
                <>
                    <div className={styles.spinner}></div>
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

            <div className={styles.divider}>
            <span className={styles.dividerText}>New to our platform?</span>
            </div>

            <Link to="/register" className={styles.secondaryButton}>
            Create an account
            </Link>
        </div>
        </div>
    );
}

export default Login;
