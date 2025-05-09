
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface LogWorkoutButtonProps {
  className?: string;
  fixed?: boolean;
}

const LogWorkoutButton: React.FC<LogWorkoutButtonProps> = ({ 
  className = '',
  fixed = false 
}) => {
  return (
    <>
      {/* Desktop version */}
      <Button 
        className={`hidden md:flex items-center ${className}`} 
        size="sm"
        asChild
      >
        <Link to="/log-workout">
          <Plus className="mr-1 h-4 w-4" />
          Log Workout
        </Link>
      </Button>
      
      {/* Mobile version - fixed position */}
      {fixed && (
        <Button 
          className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
          asChild
        >
          <Link to="/log-workout">
            <Plus size={24} />
            <span className="sr-only">Log Workout</span>
          </Link>
        </Button>
      )}
    </>
  );
};

export default LogWorkoutButton;
