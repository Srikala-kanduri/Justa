import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { estimateFood } from "../../utils/estimation";
import { createEstimation } from "../../services/estimationService";
import { getFoodSuggestion, getAllFoodNames } from "../../utils/foodDatabase";
import { identifyFoodWithAI } from "../../services/geminiService";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function NewEstimation() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Event details
  const [eventType, setEventType] = useState("");
  const [attendees, setAttendees] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [mealType, setMealType] = useState("");

  // Food items
  const [foodName, setFoodName] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Results
  const [results, setResults] = useState([]);
  const [estimationCost, setEstimationCost] = useState("");

  /* ---------------- HANDLERS ---------------- */

  const handleAddFood = async () => {
    if (!foodName.trim()) return;

    setAiLoading(true);
    try {
      // Try AI first if available
      let suggestion = await identifyFoodWithAI(foodName, mealType);

      // Fallback to database
      if (!suggestion) {
        const dbSuggestion = getFoodSuggestion(foodName, mealType);
        suggestion = {
          foodName: foodName,
          quantity: dbSuggestion.qty || 100, // Ensure we have a quantity
          unit: dbSuggestion.unit || "g",
          description: dbSuggestion.description || "",
        };
      }

      // Ensure quantity is a valid number
      const quantity = parseFloat(suggestion.quantity) || parseFloat(suggestion.qty) || 100;

      const newItem = {
        name: suggestion.foodName || foodName || "Food Item",
        perPersonQty: quantity,
        unit: suggestion.unit || "g",
        description: suggestion.description || "",
      };

      console.log("Adding food item:", newItem);

      setFoodItems([...foodItems, newItem]);
      setFoodName("");
      setSuggestions([]);
    } catch (err) {
      console.error("Error adding food:", err);
      setError("Failed to add food item. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteFood = (index) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const handleFoodNameChange = (value) => {
    setFoodName(value);
    
    // Show suggestions
    if (value.length > 1) {
      const allNames = getAllFoodNames();
      const filtered = allNames.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setFoodName(suggestion);
    setSuggestions([]);
  };

  const handleCalculate = () => {
    // Clear previous errors
    setError(null);

    // Validate attendees
    if (!attendees || attendees.trim() === "") {
      setError("Please enter number of attendees");
      return;
    }

    const attendeesNum = parseInt(attendees, 10);
    if (isNaN(attendeesNum) || attendeesNum <= 0) {
      setError("Please enter a valid number of attendees (e.g., 50)");
      return;
    }

    // Validate food items
    if (!foodItems || foodItems.length === 0) {
      setError("Please add at least one food item");
      return;
    }

    // Check that all food items have valid quantities
    let hasValidItems = false;
    const problemItems = [];

    for (let i = 0; i < foodItems.length; i++) {
      const item = foodItems[i];
      const qty = parseFloat(item.perPersonQty);

      if (isNaN(qty) || qty <= 0) {
        problemItems.push(`${item.name} (current: ${item.perPersonQty})`);
      } else {
        hasValidItems = true;
      }
    }

    if (!hasValidItems) {
      setError(`Please enter valid quantities (greater than 0) for all items.\nProblems: ${problemItems.join(", ")}`);
      return;
    }

    if (problemItems.length > 0) {
      setError(`Please fix these items: ${problemItems.join(", ")}`);
      return;
    }

    try {
      console.log("=== STARTING CALCULATION ===");
      console.log("Input Data:", {
        attendees: attendeesNum,
        eventType,
        ageGroup,
        mealType,
        foodItemsCount: foodItems.length,
      });

      const cleanedFoodItems = foodItems.map((item) => {
        const qty = parseFloat(item.perPersonQty);
        return {
          name: item.name || "Unknown",
          perPersonQty: qty,
          unit: item.unit || "g",
        };
      });

      console.log("Cleaned Food Items:", cleanedFoodItems);

      const output = estimateFood({
        attendees: attendeesNum,
        eventType,
        ageGroup,
        mealType,
        foodItems: cleanedFoodItems,
      });

      console.log("Calculation Output:", output);

      if (!output || output.length === 0) {
        console.error("Estimation returned empty results", {
          output,
          cleanedFoodItems,
          attendeesNum,
        });
        setError("Calculation returned no results. Please check your inputs and the browser console for details.");
        return;
      }

      console.log("=== CALCULATION SUCCESS ===");
      setResults(output);
      setStep(3);
    } catch (err) {
      console.error("Exception during calculation:", err);
      setError(`Calculation failed: ${err.message}`);
    }
  };

  const handleSaveEstimation = async () => {
    try {
      setLoading(true);
      setError(null);

      const estimationData = {
        eventType,
        attendees: Number(attendees),
        ageGroup,
        mealType,
        foodItems,
        results,
        estimatedCost: Number(estimationCost) || 0,
      };

      console.log("Saving estimation with data:", estimationData);
      const saved = await createEstimation(estimationData);
      console.log("Estimation saved successfully with ID:", saved.id);

      // Redirect to feedback with the estimation ID
      navigate(`/dashboard/feedback?estimationId=${saved.id}`);
    } catch (err) {
      console.error("Error saving estimation:", err);
      setError("Failed to save estimation. Please try again.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setEventType("");
    setAttendees("");
    setAgeGroup("");
    setMealType("");
    setFoodItems([]);
    setResults([]);
    setEstimationCost("");
    setError(null);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-[#0F172A] mb-2">New Estimation</h1>
        <p className="text-[#64748B] text-lg">
          Define your event and menu — JUSTA estimates accurately.
        </p>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-8">
        {["Event", "Menu", "Result"].map((label, i) => {
          const stepNumber = i + 1;
          const active = step === stepNumber;
          const completed = step > stepNumber;

          return (
            <div
              key={label}
              onClick={() => step >= stepNumber && setStep(stepNumber)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition ${
                  active
                    ? "bg-[#2FAE8F] text-white"
                    : completed
                    ? "bg-[#2FAE8F]/20 text-[#2FAE8F]"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {stepNumber}
              </div>
              <span className={`text-sm ${active ? "font-semibold" : "text-gray-500"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Card title="Event Details">
          <Select label="Event Type" value={eventType} onChange={setEventType}
            options={["wedding", "college", "corporate", "birthday", "community"]} />

          <Input label="Number of Attendees" value={attendees} onChange={setAttendees} />

          <Select label="Age Group" value={ageGroup} onChange={setAgeGroup}
            options={["children", "teenagers", "adults", "mixed"]} />

          <Select label="Meal Type" value={mealType} onChange={setMealType}
            options={["breakfast", "lunch", "dinner", "snacks"]} />

          <Button onClick={() => setStep(2)}>Continue →</Button>
        </Card>
      )}

        {/* STEP 2 */}
        {step === 2 && (
          <Card title="Event Menu">
            <p className="text-sm text-[#64748B] mb-4">
              Enter food items manually. Quantities are auto-suggested using AI and database. Edit as needed.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <div className="flex gap-4 mb-6 relative">
              <div className="flex-1 relative">
                <input
                  className="border rounded-lg p-3 w-full"
                  placeholder="Food item (e.g., Rice, Paneer Curry, Pizza)"
                  value={foodName}
                  onChange={(e) => handleFoodNameChange(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleAddFood();
                  }}
                />
                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-10">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="w-full text-left px-4 py-2 hover:bg-[#2FAE8F]/10 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={handleAddFood}
                disabled={aiLoading}
                className="bg-[#2FAE8F] text-white px-6 rounded-lg font-semibold hover:bg-[#25967D] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {aiLoading ? "..." : "Add"}
              </button>
            </div>

            {foodItems.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No food items added yet. Start by adding items above.
              </div>
            )}

            {foodItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border rounded-lg p-4 mb-3 bg-white hover:bg-gray-50 transition"
              >
                <div className="flex-1">
                  <div className="font-medium text-[#0F172A]">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.description}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={item.perPersonQty}
                      onChange={(e) => {
                        const updated = [...foodItems];
                        updated[index].perPersonQty = parseFloat(e.target.value) || 0;
                        setFoodItems(updated);
                      }}
                      className="w-20 border rounded-md p-2 text-sm"
                    />
                    <span className="text-sm text-gray-500 w-12">{item.unit}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteFood(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Delete item"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <GhostButton onClick={() => setStep(1)}>Back</GhostButton>
              <Button onClick={handleCalculate} disabled={foodItems.length === 0}>
                Calculate →
              </Button>
            </div>
          </Card>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <Card title="Final Estimated Quantities">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-8">
                {results.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex items-start justify-between border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-[#0F172A] text-base">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0F172A] text-lg">
                          {typeof item.quantity === "number" && item.quantity % 1 !== 0
                            ? item.quantity.toFixed(2)
                            : item.quantity}{" "}
                          <span className="text-sm text-gray-600">{item.unit}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4">
                <Button
                  onClick={() => {
                    setStep(1);
                    setEventType("");
                    setAttendees("");
                    setAgeGroup("");
                    setMealType("");
                    setFoodItems([]);
                    setResults([]);
                    setError(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  New Estimation
                </Button>
                <Button
                  onClick={handleSaveEstimation}
                  disabled={loading}
                  className="bg-[#2FAE8F] hover:bg-[#258d76] text-white px-8 py-2 rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
  );
}

/* ---------------- REUSABLE UI ---------------- */

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-[#2FAE8F]/10 px-8 py-4">
        <h2 className="text-xl font-bold text-[#0F172A]">{title}</h2>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-3"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg p-3"
      >
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function Button({ children, className, ...props }) {
  const baseClass = "bg-[#2FAE8F] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#25967D] transition disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <button
      {...props}
      className={className ? `${baseClass} ${className}` : baseClass}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, className, ...props }) {
  const baseClass = "text-[#64748B] font-medium";
  return (
    <button 
      {...props} 
      className={className ? `${baseClass} ${className}` : baseClass}
    >
      {children}
    </button>
  );
}
