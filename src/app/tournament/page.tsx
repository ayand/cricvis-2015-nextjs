'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Team {
  team: string;
  image: string;
  key: string;
}

export default function TournamentPage() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Select a team above to begin analysis
      </h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Choose a team from the selection above to view detailed tournament statistics, 
        team performances, and comprehensive analytics for the 2015 Cricket World Cup.
      </p>
    </div>
  );
} 