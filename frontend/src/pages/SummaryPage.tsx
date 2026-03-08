import { useNavigate } from "react-router-dom";
import { Trophy, ArrowLeft } from "lucide-react";

export function SummaryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-amber-900 mb-3">
          Parichay Complete
        </h1>
        <p className="text-amber-700 mb-2">
          You completed all 5 levels and 80 conversations.
        </p>
        <p className="text-amber-600 text-sm mb-8">
          The best decisions are built on honest conversations. We hope this
          brought you closer to clarity.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center justify-center gap-2 mx-auto bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
