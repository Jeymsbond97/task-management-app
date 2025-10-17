import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../utils/AuthContext";
import api from "../api/axios";
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Sparkles } from "lucide-react";
import styles from "../styles/pages/Register.module.css"; // CSS Modules import

    function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
        const response = await api.post("/register", formData);
        login(response.data.user, response.data.token);
        navigate("/tasks");
        } catch (err) {
        const errors = err.response?.data?.errors;
        if (errors) {
            const errorMessages = Object.values(errors).flat().join(", ");
            setError(errorMessages);
        } else {
            setError(err.response?.data?.message || "Registration failed");
        }
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
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Start your journey with us today</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
                <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                {error}
                </div>
            )}

            <div className={styles.inputGroup}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputWrapper}>
                <User size={20} className={styles.inputIcon} />
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="John Doe"
                />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                <Mail size={20} className={styles.inputIcon} />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.input}
                    placeholder="you@example.com"
                />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                <Lock size={20} className={styles.inputIcon} />
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="8"
                    className={styles.input}
                    placeholder="Minimum 8 characters"
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

            <div className={styles.inputGroup}>
                <label className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrapper}>
                <Lock size={20} className={styles.inputIcon} />
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    minLength="8"
                    className={styles.input}
                    placeholder="Re-enter your password"
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={styles.eyeButton}
                >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                </div>
            </div>

            <button type="submit" disabled={loading} className={styles.button}>
                {loading ? (
                <>
                    <div className={styles.spinner}></div>
                    <span>Creating Account...</span>
                </>
                ) : (
                <>
                    <UserPlus size={20} />
                    <span>Create Account</span>
                </>
                )}
            </button>
            </form>

            <div className={styles.divider}>
            <span className={styles.dividerText}>Already have an account?</span>
            </div>

            <Link to="/login" className={styles.secondaryButton}>
            Sign In
            </Link>
        </div>
        </div>
    );
}

export default Register;
