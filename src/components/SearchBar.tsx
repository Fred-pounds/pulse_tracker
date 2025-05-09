
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Command, 
  CommandDialog,
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { useNavigate } from 'react-router-dom';
import { Workout, WorkoutType } from '../types';

interface SearchBarProps {
  className?: string;
}

// Mock data for search
const searchData = {
  workouts: [
    { id: '1', title: 'Morning Run', type: 'run' as WorkoutType },
    { id: '2', title: 'Evening Gym Session', type: 'gym' as WorkoutType },
    { id: '3', title: 'Weekend Cycling', type: 'cycle' as WorkoutType },
  ],
  users: [
    { id: '1', name: 'John Doe', username: 'johndoe' },
    { id: '2', name: 'Jane Smith', username: 'janesmith' },
    { id: '3', name: 'Mike Johnson', username: 'mikej' },
  ],
  challenges: [
    { id: '1', title: '30-Day Run Challenge' },
    { id: '2', title: 'Weekly Fitness Goal' },
    { id: '3', title: 'Monthly Distance Challenge' },
  ],
};

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  const handleWorkoutSelect = (id: string) => {
    setOpen(false);
    navigate(`/workouts?id=${id}`);
  };
  
  const handleUserSelect = (username: string) => {
    setOpen(false);
    navigate(`/friends?username=${username}`);
  };
  
  const handleChallengeSelect = (id: string) => {
    setOpen(false);
    navigate(`/challenges?id=${id}`);
  };
  
  return (
    <div className={className}>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <span className="text-muted-foreground">Search...</span>
        <kbd className="ml-auto hidden rounded border bg-muted px-1.5 font-mono text-xs md:inline-flex">
          ⌘K
        </kbd>
      </button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search workouts, users, challenges..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Workouts">
            {searchData.workouts.map((workout) => (
              <CommandItem 
                key={workout.id}
                onSelect={() => handleWorkoutSelect(workout.id)}
              >
                <div className="flex items-center">
                  <span className="mr-2">
                    {workout.type === 'run' && '🏃‍♂️'}
                    {workout.type === 'cycle' && '🚴‍♂️'}
                    {workout.type === 'swim' && '🏊‍♂️'}
                    {workout.type === 'gym' && '💪'}
                    {workout.type === 'other' && '🏋️‍♂️'}
                  </span>
                  {workout.title}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Users">
            {searchData.users.map((user) => (
              <CommandItem 
                key={user.id}
                onSelect={() => handleUserSelect(user.username)}
              >
                <div className="flex items-center">
                  <span className="mr-2">👤</span>
                  {user.name} (@{user.username})
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Challenges">
            {searchData.challenges.map((challenge) => (
              <CommandItem 
                key={challenge.id}
                onSelect={() => handleChallengeSelect(challenge.id)}
              >
                <div className="flex items-center">
                  <span className="mr-2">🏆</span>
                  {challenge.title}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export default SearchBar;
