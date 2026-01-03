import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon, XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";


// Toast Component for Popup Notifications
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const bgColors = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-green-500" />,
    error: <XCircleIcon className="w-5 h-5 text-red-500" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />,
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-300 ${bgColors[type] || bgColors.error
        }`}
    >
      {icons[type] || icons.error}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <XCircleIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [strengthScore, setStrengthScore] = useState(0);
  const navigate = useNavigate();



  // Notification State
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showToast = (message, type = "error") => {
    setNotification({ message, type });
  };

  const closeToast = () => {
    setNotification({ message: "", type: "" });
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      console.log("Starting Google Popup...");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Auth Success:", user.uid);

      // Try to save user to DB, but don't block login if it fails (e.g. permission issues)
      try {
        await setDoc(
          doc(db, "users", user.uid),
          {
            name: user.displayName || user.email.split("@")[0],
            email: user.email,
            uid: user.uid,
            createdAt: new Date(),
          },
          { merge: true }
        );
        console.log("DB Write Success");
      } catch (dbError) {
        console.error("DB Write Error (Permissions?):", dbError);
        showToast("Login success, but DB update failed (check permissions).", "warning");
      }

      showToast("Logged in successfully!", "success");
      navigate("/dashboard");

    } catch (error) {
      console.error("Google Auth Error:", error);
      showToast(error.message, "error");
    }
  };


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      showToast("Login successful!", "success");
      navigate("/dashboard");

    } catch (err) {
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        // This often happens if they signed up with Google but try to login with password
        showToast("User not found or no password set. Did you sign up with Google?", "error");
      } else if (err.code === "auth/wrong-password") {
        showToast("Incorrect password. Please try again.", "error");
      } else {
        showToast(err.message, "error");
      }
    }
  };

  const handleRegister = async () => {
    if (strengthScore < 3) {
      showToast("Password is too weak. Please use a stronger password.", "error");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = userCredential.user;

      // Try to save to DB, don't block if fails
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
        });
      } catch (dbError) {
        console.error("DB Write Error:", dbError);
        showToast("Registered, but profile save failed (check permissions).", "warning");
      }

      showToast("Registration successful!", "success");
      navigate("/dashboard");

    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        showToast("Email already associated with an account. Try 'Continue with Google'.", "warning");
        setIsLogin(true);
      } else {
        showToast(err.message, "error");
      }
    }
  };


  const checkPasswordStrength = (value) => {
    let score = 0;

    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[!@#$%^&*]/.test(value)) score++;

    setStrengthScore(score);

    if (score <= 1) setPasswordStrength("Weak");
    else if (score <= 3) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">

      {/* Toast Notification */}
      {notification.message && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={closeToast}
        />
      )}

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          <span className="text-orange-500">{isLogin ? "Welcome Back" : "Join JUSTA"}</span>
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          {isLogin ? "Login to your account" : "Create your account to get started"}
        </p>

        {/* Name (only for Register) */}
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>



        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                checkPasswordStrength(e.target.value);
              }}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            {/* Eye Icon */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeIcon className="h-5 w-5" />
              ) : (
                <EyeSlashIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>


        {!isLogin && password && passwordStrength !== "Strong" && (
          <div className="mt-2">
            <p
              className={`text-sm font-medium ${passwordStrength === "Weak"
                ? "text-red-600"
                : passwordStrength === "Medium"
                  ? "text-orange-500"
                  : "text-green-600"
                }`}
            >
              Password Strength: {passwordStrength}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1 mb-6">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${passwordStrength === "Weak"
                  ? "bg-red-500 w-1/4"
                  : passwordStrength === "Medium"
                    ? "bg-orange-500 w-2/3"
                    : "bg-green-500 w-full"
                  }`}
              ></div>
            </div>
          </div>
        )}

        {/* Note: Original had {error} display here. We removed it in favor of Toast, or we can keep it as fallback. 
            User asked for popup bar, so Toast is the primary mechanism. */}

        {/* Main Button */}
        <button
          onClick={isLogin ? handleLogin : handleRegister}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-70"
        >
          {loading ? "Processing..." : (isLogin ? "Login" : "Register")}
        </button>

        {/* Toggle Text */}
        <p className="text-sm text-center mt-4">
          {isLogin ? (
            <>
              New user?{" "}
              <button
                onClick={() => {
                  setIsLogin(false);
                  closeToast();
                }}
                className="text-orange-500 font-medium hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already registered?{" "}
              <button
                onClick={() => {
                  setIsLogin(true);
                  closeToast();
                }}
                className="text-orange-500 font-medium hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t"></div>
          <span className="mx-3 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}
