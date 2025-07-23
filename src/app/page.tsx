import Image from "next/image";
import ExampleUsage from "@/components/ExampleUsage";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-8xl mx-auto text-center">
        {/* Cricket Logo */}
        <div className="mb-8">
          <div className="w-64 h-64 mx-auto bg-white rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-6xl font-bold text-gray-800">🏏</div>
          </div>
        </div>
        
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            The One-Stop Visual Portal for Exploring the 2015 Cricket World Cup!
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Dive deep into the world of cricket analytics with our comprehensive visualization tools. 
            Explore tournament statistics, analyze individual matches, and discover fascinating player matchups 
            from the 2015 Cricket World Cup.
          </p>
        </div>
        
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Tournament View</h3>
            <p className="text-gray-600">
              Explore the complete tournament structure, team performances, and overall statistics.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Match Analysis</h3>
            <p className="text-gray-600">
              Dive deep into individual match data with detailed ball-by-ball analysis and visualizations.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Player Matchup</h3>
            <p className="text-gray-600">
              Compare player performances and discover fascinating head-to-head statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
