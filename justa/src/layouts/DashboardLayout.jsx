import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function DashboardLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${isActive
            ? "bg-white/10 text-white font-medium"
            : "text-[#A3B4C4] hover:bg-white/5 hover:text-white"
        }`;

    return (
        <div className="min-h-screen flex bg-[#F8FAFC]">

            {/* Sidebar */}
            <aside className="w-[240px] bg-gradient-to-b from-[#1F2F33] to-[#1a252a] text-white flex flex-col fixed h-full shadow-lg z-10 transition-all duration-300">
                <div className="p-6 pb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                        JUSTA
                    </h1>
                    <p className="text-xs text-[#A3B4C4] font-medium opacity-80">
                        Smart Quantity Planner
                    </p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <NavLink to="/dashboard" end className={linkClass}>
                        <span className="text-xl">📊</span>
                        <span className="font-medium">Dashboard</span>
                    </NavLink>
                    <NavLink to="/dashboard/newestimation" className={linkClass}>
                        <span className="text-xl">➕</span>
                        <span className="font-medium">New Estimation</span>
                    </NavLink>
                    <NavLink to="/dashboard/history" className={linkClass}>
                        <span className="text-xl">🕒</span>
                        <span className="font-medium">History</span>
                    </NavLink>
                    <NavLink to="/dashboard/feedback" className={linkClass}>
                        <span className="text-xl">📝</span>
                        <span className="font-medium">Feedback</span>
                    </NavLink>
                </nav>

                <div className="p-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-30 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg transition-colors font-medium ml-9"
                    >
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-[240px] p-8 md:p-12 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}
