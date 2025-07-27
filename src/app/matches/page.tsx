export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-8xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Match Analysis</h1>
          <div className="text-center py-16">
            <div className="text-6xl mb-10">📊</div>
            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
              This page provides detailed match analysis with ball-by-ball statistics, 
              player performances, run charts, wicket analysis, and comprehensive match visualizations.
            </p>
            <h2 className="text-3xl font-bold text-gray-800 text-center">Select a match to get started!</h2>
          </div>
        </div>
      </div>
    </div>
  );
} 