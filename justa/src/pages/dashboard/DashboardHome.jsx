import { useState, useEffect } from "react";
import { getDashboardStats, getRecentEstimations, getPendingFeedbackEvents } from "../../services/dashboardService";
import { getUserProfile } from "../../services/userService";

export default function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [recentEstimations, setRecentEstimations] = useState([]);
    const [pendingFeedback, setPendingFeedback] = useState([]);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);
            const [dashboardStats, recent, pending, userProfile] = await Promise.all([
                getDashboardStats(),
                getRecentEstimations(),
                getPendingFeedbackEvents(),
                getUserProfile(),
            ]);
            
            console.log("Dashboard data fetched:", {
                recent: recent?.length,
                pending: pending?.length,
            });
            
            setStats(dashboardStats);
            setRecentEstimations(recent);
            setPendingFeedback(pending);
            setUserName(userProfile?.name || "");
            setError(null);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            setError("Failed to load dashboard data");
            // Set default values for better UX
            setStats({
                totalEvents: 0,
                completedEvents: 0,
                totalFoodSaved: 0,
                totalMoneySaved: 0,
                averageFoodSavedPerEvent: 0,
            });
            setRecentEstimations([]);
            setPendingFeedback([]);
            setUserName("");
        } finally {
            setRefreshing(false);
            if (loading) setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-10">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-48 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-72"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">
                    Welcome Back {userName && `${userName}`} 👋
                </h1>
                <p className="text-[#64748B] text-lg mt-1">
                    Plan events smarter. Reduce food waste. Save money.
                </p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Events Planned"
                    value={stats?.totalEvents || 0}
                    subtitle="Events estimated using JUSTA"
                    color="emerald"
                />
                <StatCard
                    title="Food Saved"
                    value={`${stats?.totalFoodSaved || 0} kg`}
                    subtitle="Compared to manual estimation"
                    color="blue"
                />
                <StatCard
                    title="Money Saved"
                    value={`₹${(stats?.totalMoneySaved || 0).toLocaleString()}`}
                    subtitle="Approximate cost reduction"
                    color="emerald"
                />
            </div>

            {/* Primary CTA */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-8 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition">
                <div>
                    <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
                        Create a New Estimation
                    </h2>
                    <p className="text-[#64748B]">
                        Use AI-powered planning to get accurate food quantities.
                    </p>
                </div>
                <a
                    href="/dashboard/newestimation"
                    className="mt-6 md:mt-0 bg-[#2FAE8F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#25967D] transition shadow-sm"
                >
                    New Estimation →
                </a>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6">
                <h3 className="text-xl font-bold text-[#0F172A] mb-4">
                    Recent Estimations
                </h3>

                {recentEstimations.length === 0 ? (
                    <p className="text-[#64748B] text-center py-6">
                        No estimations yet. Start by creating a new one!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {recentEstimations.map((estimation) => {
                            // Handle different timestamp formats
                            let dateStr = "N/A";
                            if (estimation.createdAt) {
                                if (estimation.createdAt.toDate) {
                                    // Firestore Timestamp
                                    dateStr = estimation.createdAt.toDate().toLocaleDateString();
                                } else if (estimation.createdAt.seconds) {
                                    // Timestamp with seconds property
                                    dateStr = new Date(estimation.createdAt.seconds * 1000).toLocaleDateString();
                                } else if (typeof estimation.createdAt === 'string') {
                                    dateStr = new Date(estimation.createdAt).toLocaleDateString();
                                }
                            }
                            
                            console.log("Rendering estimation:", {
                                id: estimation.id,
                                eventType: estimation.eventType,
                                attendees: estimation.attendees,
                                foodSavedKg: estimation.foodSavedKg,
                                createdAt: estimation.createdAt,
                                dateStr: dateStr,
                            });
                            
                            return (
                                <RecentItem
                                    key={estimation.id}
                                    event={estimation.eventType}
                                    attendees={estimation.attendees}
                                    date={dateStr}
                                    foodSaved={estimation.foodSavedKg || 0}
                                    status={estimation.status === "completed" ? "Completed" : "Pending"}
                                />
                            );
                        })}
                    </div>
                )}

                <a
                    href="/dashboard/history"
                    className="inline-block mt-4 text-sm font-medium text-[#2FAE8F] hover:underline"
                >
                    View full history →
                </a>
            </div>

            {/* Feedback Reminder */}
            {pendingFeedback.length > 0 && (
                <div className="bg-[#2FAE8F]/10 border border-[#2FAE8F]/30 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <h4 className="text-lg font-bold text-[#0F172A] mb-1">
                            Feedback Pending 📝
                        </h4>
                        <p className="text-[#475569]">
                            {pendingFeedback.length} event{pendingFeedback.length > 1 ? "s" : ""} waiting for your feedback.
                        </p>
                    </div>
                    <a
                        href="/dashboard/feedback"
                        className="mt-4 md:mt-0 bg-[#2FAE8F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25967D] transition"
                    >
                        Give Feedback
                    </a>
                </div>
            )}
        </div>
    );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, subtitle, color }) {
    const colorClasses = {
        emerald: "text-[#2FAE8F] bg-[#2FAE8F]/10",
        blue: "text-[#334155] bg-[#A3B4C4]/20",
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 hover:-translate-y-1 transition-transform">
            <p className="text-xs uppercase tracking-wide text-[#64748B] font-medium mb-1">
                {title}
            </p>
            <div className={`inline-block text-4xl font-bold px-3 py-1 rounded-md ${colorClasses[color]}`}>
                {value}
            </div>
            <p className="text-sm text-[#64748B] mt-2">
                {subtitle}
            </p>
        </div>
    );
}

function RecentItem({ event, attendees, date, foodSaved, status }) {
    const statusColor =
        status === "Completed"
            ? "text-emerald-600 bg-emerald-50"
            : "text-amber-600 bg-amber-50";

    return (
        <div className="flex items-center justify-between border border-[#E5E7EB] rounded-lg px-4 py-3 hover:bg-gray-50 transition">
            <div className="flex-1">
                <p className="font-semibold text-[#0F172A] capitalize">{event}</p>
                <p className="text-sm text-[#64748B]">{attendees} attendees • {date}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-[#2FAE8F]">{foodSaved} kg saved</p>
                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${statusColor} mt-1`}>
                    {status}
                </span>
            </div>
        </div>
    );
}
