import { useState, useEffect } from "react";
import { getUserEstimations } from "../../services/estimationService";

export default function PastEvents() {
    const [estimations, setEstimations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEstimations = async () => {
            try {
                setLoading(true);
                const data = await getUserEstimations();
                setEstimations(data || []);
                setError(null);
            } catch (err) {
                console.error("Error fetching estimations:", err);
                setError("Failed to load estimations");
                setEstimations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEstimations();
    }, []);

    if (loading) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-[#0F172A] mb-6">History</h1>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-[#0F172A] mb-6">History</h1>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}
            {estimations.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-8 min-h-[300px] flex items-center justify-center">
                    <p className="text-[#64748B]">No estimations found yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {estimations.map((estimation) => {
                        const createdDate = estimation.createdAt 
                            ? new Date(estimation.createdAt.seconds * 1000).toLocaleDateString()
                            : "Unknown date";
                        
                        return (
                            <div key={estimation.id} className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-6 hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-[#0F172A] capitalize">
                                                {estimation.eventType} Event
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                estimation.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                estimation.status === "completed" ? "bg-green-100 text-green-700" :
                                                "bg-gray-100 text-gray-700"
                                            }`}>
                                                {estimation.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#64748B] mb-3">
                                            {createdDate} • {estimation.attendees} attendees • {estimation.mealType}
                                        </p>
                                        <div className="flex flex-wrap gap-4">
                                            <div>
                                                <p className="text-xs text-[#64748B]">Food Saved</p>
                                                <p className="font-semibold text-[#0F172A]">{(estimation.foodSavedKg || 0).toFixed(1)} kg</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#64748B]">Estimated Items</p>
                                                <p className="font-semibold text-[#0F172A]">{estimation.results?.length || estimation.foodItems?.length || 0} items</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#64748B]">Age Group</p>
                                                <p className="font-semibold text-[#0F172A]">{estimation.ageGroup}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}