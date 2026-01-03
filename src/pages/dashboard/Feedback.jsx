import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { submitFeedback } from "../../services/feedbackService";
import { getEstimationById } from "../../services/estimationService";
import { getPendingFeedbackEvents } from "../../services/dashboardService";

export default function Feedback() {
  const [searchParams] = useSearchParams();
  const estimationId = searchParams.get("estimationId");

  const [sufficient, setSufficient] = useState("");
  const [leftoverLevel, setLeftoverLevel] = useState("");
  const [estimationAccuracy, setEstimationAccuracy] = useState("");
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentEstimation, setCurrentEstimation] = useState(null);
  const [pendingFeedbacks, setPendingFeedbacks] = useState([]);
  const [selectedEstimationId, setSelectedEstimationId] = useState(estimationId || "");

  useEffect(() => {
    const fetchPendingFeedbacks = async () => {
      try {
        const pending = await getPendingFeedbackEvents();
        setPendingFeedbacks(pending);
        
        if (estimationId) {
          const estimation = await getEstimationById(estimationId);
          setCurrentEstimation(estimation);
          setSelectedEstimationId(estimationId);
        } else if (pending.length > 0) {
          // Auto-select first pending estimation
          setCurrentEstimation(pending[0]);
          setSelectedEstimationId(pending[0].id);
        }
      } catch (err) {
        console.error("Error fetching pending feedbacks:", err);
        setError("Failed to load pending events");
      }
    };

    fetchPendingFeedbacks();
  }, [estimationId]);

  const handleEstimationChange = async (newId) => {
    setSelectedEstimationId(newId);
    try {
      const estimation = await getEstimationById(newId);
      setCurrentEstimation(estimation);
    } catch (err) {
      console.error("Error fetching estimation:", err);
      setError("Failed to load estimation details");
    }
  };

  const handleSubmit = async () => {
    if (!selectedEstimationId || !sufficient || !leftoverLevel || !estimationAccuracy) {
      setError("Please select an event and answer all questions");
      return;
    }

    try {
      setLoading(true);
      await submitFeedback(selectedEstimationId, {
        sufficient,
        leftoverLevel,
        estimationAccuracy,
        comments,
      });
      setSubmitted(true);
      setError(null);
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
          Thank you for your feedback 🙏
        </h2>
        <p className="text-[#64748B] mb-6">
          This will help JUSTA improve future estimations.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setSufficient("");
            setLeftoverLevel("");
            setEstimationAccuracy("");
            setComments("");
            window.location.href = "/dashboard";
          }}
          className="bg-[#2FAE8F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25967D] transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (pendingFeedbacks.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-[#0F172A] mb-2">
          No Pending Feedback 🎉
        </h2>
        <p className="text-[#64748B] mb-6">
          All your events have feedback recorded. Create a new estimation to get started!
        </p>
        <a
          href="/dashboard/newestimation"
          className="inline-block bg-[#2FAE8F] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#25967D] transition"
        >
          New Estimation
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-20 bg-white rounded-xl shadow-md p-8">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-2">
        Post-Event Feedback
      </h1>
      <p className="text-[#64748B] mb-6">
        Your feedback helps us reduce food waste in future events.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Event Selection */}
      {pendingFeedbacks.length > 1 && (
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Select Event
          </label>
          <select
            value={selectedEstimationId}
            onChange={(e) => handleEstimationChange(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">-- Choose an event --</option>
            {pendingFeedbacks.map((est) => (
              <option key={est.id} value={est.id}>
                {est.eventType} - {est.attendees} attendees
              </option>
            ))}
          </select>
        </div>
      )}

      {currentEstimation && (
        <div className="bg-[#2FAE8F]/10 border border-[#2FAE8F]/30 rounded-lg p-4 mb-6">
          <p className="text-sm text-[#64748B] mb-2">Event Details</p>
          <p className="font-semibold text-[#0F172A] mb-3">
            {currentEstimation.eventType} - {currentEstimation.attendees} attendees
          </p>
          <p className="text-xs text-[#64748B] mb-4">
            {currentEstimation.mealType} | {currentEstimation.ageGroup}
          </p>

          {/* Show Estimated Quantities */}
          {currentEstimation.results && currentEstimation.results.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[#2FAE8F]/20">
              <p className="text-xs font-medium text-[#64748B] mb-3">
                Estimated Quantities:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {currentEstimation.results.map((item, idx) => (
                  <div key={idx} className="bg-white rounded p-2">
                    <p className="text-xs font-medium text-[#0F172A]">{item.name}</p>
                    <p className="text-sm font-semibold text-[#2FAE8F]">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Question 1 */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Was the food sufficient for all attendees?
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => setSufficient("yes")}
            className={`px-4 py-2 rounded-lg border transition ${
              sufficient === "yes"
                ? "bg-[#2FAE8F] text-white border-[#2FAE8F]"
                : "bg-white border-[#E5E7EB] hover:border-[#2FAE8F]"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => setSufficient("no")}
            className={`px-4 py-2 rounded-lg border transition ${
              sufficient === "no"
                ? "bg-[#2FAE8F] text-white border-[#2FAE8F]"
                : "bg-white border-[#E5E7EB] hover:border-[#2FAE8F]"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Question 2 */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          How accurate was our estimation?
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setEstimationAccuracy("very_accurate")}
            className={`px-4 py-2 rounded-lg border transition text-sm ${
              estimationAccuracy === "very_accurate"
                ? "bg-[#2FAE8F] text-white border-[#2FAE8F]"
                : "bg-white border-[#E5E7EB] hover:border-[#2FAE8F]"
            }`}
          >
            Very Accurate
          </button>
          <button
            onClick={() => setEstimationAccuracy("somewhat_accurate")}
            className={`px-4 py-2 rounded-lg border transition text-sm ${
              estimationAccuracy === "somewhat_accurate"
                ? "bg-[#2FAE8F] text-white border-[#2FAE8F]"
                : "bg-white border-[#E5E7EB] hover:border-[#2FAE8F]"
            }`}
          >
            Somewhat Accurate
          </button>
          <button
            onClick={() => setEstimationAccuracy("inaccurate")}
            className={`px-4 py-2 rounded-lg border transition text-sm ${
              estimationAccuracy === "inaccurate"
                ? "bg-[#2FAE8F] text-white border-[#2FAE8F]"
                : "bg-white border-[#E5E7EB] hover:border-[#2FAE8F]"
            }`}
          >
            Inaccurate
          </button>
        </div>
      </div>

      {/* Question 3 */}
      <div className="mb-6">
        <label className="block font-medium mb-2">
          Was there leftover food?
        </label>
        <select
          value={leftoverLevel}
          onChange={(e) => setLeftoverLevel(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select</option>
          <option value="none">No leftover</option>
          <option value="low">Some leftover (≈ 10–20%)</option>
          <option value="high">A lot of leftover (&gt; 25%)</option>
        </select>
      </div>

      {/* Comments */}
      <div className="mb-8">
        <label className="block font-medium mb-2">
          Additional Comments (Optional)
        </label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Share any additional observations..."
          rows="3"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!sufficient || !leftoverLevel || !estimationAccuracy || loading}
        className="w-full bg-[#2FAE8F] text-white py-3 rounded-lg font-semibold disabled:opacity-50 hover:bg-[#25967D] transition"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </div>
  );
}
