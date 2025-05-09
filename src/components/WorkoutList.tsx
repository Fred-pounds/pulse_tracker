
import React from 'react';
import { Calendar, Clock, MapPin, BarChart2, MessageSquare, Heart } from 'lucide-react';
import { Workout } from '../types';
import { format, parseISO } from 'date-fns';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WorkoutListProps {
  workouts: Workout[];
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  };
  
  const formatTime = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };
  
  const getWorkoutTypeIcon = (type: string) => {
    switch (type) {
      case 'run':
        return "🏃‍♂️";
      case 'cycle':
        return "🚴‍♂️";
      case 'swim':
        return "🏊‍♂️";
      case 'gym':
        return "💪";
      default:
        return "🏋️‍♂️";
    }
  };
  
  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <Card 
          key={workout.id} 
          className={`workout-card ${workout.type} p-0 overflow-hidden`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getWorkoutTypeIcon(workout.type)}</span>
                <h3 className="font-medium">{workout.title}</h3>
              </div>
              <Badge variant={workout.type === 'run' ? 'default' : 'outline'} className="capitalize">
                {workout.type}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 text-sm">
              <div className="flex items-center text-gray-600">
                <Calendar size={16} className="mr-1.5" />
                <span>{formatDate(workout.date)}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1.5" />
                <span>{workout.duration} mins</span>
              </div>
              
              {workout.distance && (
                <div className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-1.5" />
                  <span>{workout.distance} km</span>
                </div>
              )}
              
              {workout.calories && (
                <div className="flex items-center text-gray-600">
                  <BarChart2 size={16} className="mr-1.5" />
                  <span>{workout.calories} cal</span>
                </div>
              )}
            </div>
            
            {workout.notes && (
              <p className="text-gray-600 text-sm mb-3">{workout.notes}</p>
            )}
            
            <div className="flex items-center justify-end space-x-4 text-sm text-gray-500 pt-2 border-t">
              <span className="flex items-center">
                <Heart size={16} className="mr-1 text-gray-400" />
                {workout.likes}
              </span>
              <span className="flex items-center">
                <MessageSquare size={16} className="mr-1 text-gray-400" />
                {workout.comments}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutList;
