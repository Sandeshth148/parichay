import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

export function SummaryPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4" fill="currentColor" />
        <h1 className="text-3xl font-bold text-amber-900 mb-4">
          Congratulations!
        </h1>
        <p className="text-amber-700 mb-2">
          You completed all 16 conversations in this level.
        </p>
        <p className="text-amber-600 text-sm mb-8">
          Great conversations build great relationships.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center gap-2 mx-auto bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
