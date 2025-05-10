
import React from 'react';
import { Calendar, Trophy, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Challenge } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChallengeCardProps {
  challenge: Challenge;

}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  // Calculate user progress
  const userProgress = challenge.participants.find(p => p.userId === challenge.created_by)?.progress || 0;
  
  // Format dates
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d');
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 pt-5">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{challenge.title}</CardTitle>
          <div className="bg-blue-100 p-1.5 rounded-full">
            <Trophy size={16} className="text-blue-600" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-5">
        <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>
              {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
            </span>
          </div>
          
          <div className="flex items-center">
            <Users size={14} className="mr-1" />
            <span>{challenge.participants.length} participants</span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="font-medium">Your progress</span>
            <span className="text-blue-600 font-medium">{userProgress}%</span>
          </div>
          <Progress value={userProgress} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {challenge.participants.slice(0, 3).map((participant, index) => (
              <Avatar key={participant.userId} className="h-6 w-6 border-2 border-white">
                <AvatarImage src={`https://i.pravatar.cc/300?img=${index + 2}`} />
                <AvatarFallback>U{index + 1}</AvatarFallback>
              </Avatar>
            ))}
            {challenge.participants.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                +{challenge.participants.length - 3}
              </div>
            )}
          </div>
          
          <a href="#" className="text-xs font-medium text-blue-600 hover:underline">
            View Challenge
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
