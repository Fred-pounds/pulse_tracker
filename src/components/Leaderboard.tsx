
import React from 'react';
import { LeaderboardEntry } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  userId?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, userId = '1' }) => {
  const getMedalColor = (rank: number): string => {
    switch (rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-amber-700';
      default:
        return 'text-gray-400';
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" /> Top Performers
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {entries.map((entry) => (
            <div 
              key={entry.user.id} 
              className={`flex items-center p-3 ${entry.user.id === userId ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center justify-center w-8">
                {entry.rank <= 3 ? (
                  <Medal className={`h-5 w-5 ${getMedalColor(entry.rank)}`} />
                ) : (
                  <span className="text-sm font-medium text-gray-500">{entry.rank}</span>
                )}
              </div>
              
              <div className="flex-1 flex items-center ml-2">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                  <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.user.name}
                    {entry.user.id === userId && <span className="text-xs ml-1 text-blue-600">(You)</span>}
                  </p>
                  <p className="text-xs text-gray-500 truncate">@{entry.user.username}</p>
                </div>
              </div>
              
              <div className="font-semibold text-right">
                {entry.score}
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
