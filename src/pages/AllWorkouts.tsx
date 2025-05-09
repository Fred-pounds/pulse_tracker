
import React, { useState } from 'react';
import Header from '../components/Header';
import WorkoutList from '../components/WorkoutList';
import { Search, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Workout } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const mockWorkouts: Workout[] = [
  {
    id: '1',
    userId: '1',
    type: 'run',
    title: 'Morning Run',
    date: '2025-05-06T08:30:00.000Z',
    duration: 35,
    distance: 5.2,
    calories: 420,
    notes: 'Felt great today. Good pace throughout.',
    likes: 12,
    comments: 3
  },
  {
    id: '2',
    userId: '2',
    type: 'gym',
    title: 'Upper Body Workout',
    date: '2025-05-05T17:45:00.000Z',
    duration: 50,
    calories: 380,
    notes: 'Focus on chest and back. Increased weights on bench press.',
    likes: 8,
    comments: 1
  },
  {
    id: '3',
    userId: '3',
    type: 'cycle',
    title: 'Weekend Ride',
    date: '2025-05-04T10:15:00.000Z',
    duration: 75,
    distance: 22.5,
    calories: 680,
    notes: 'Long route through the park and hills. Great weather.',
    likes: 15,
    comments: 5
  },
  {
    id: '4',
    userId: '1',
    type: 'swim',
    title: 'Pool Session',
    date: '2025-05-03T14:00:00.000Z',
    duration: 40,
    distance: 1.5,
    calories: 350,
    notes: 'Worked on freestyle technique. Felt smooth in the water.',
    likes: 6,
    comments: 2
  },
  {
    id: '5',
    userId: '2',
    type: 'run',
    title: 'Interval Training',
    date: '2025-05-02T07:15:00.000Z',
    duration: 45,
    distance: 6.8,
    calories: 520,
    notes: 'High intensity intervals. Tough but productive session.',
    likes: 10,
    comments: 4
  },
  {
    id: '6',
    userId: '3',
    type: 'cycle',
    title: 'Mountain Trail',
    date: '2025-05-01T15:30:00.000Z',
    duration: 90,
    distance: 28.3,
    calories: 750,
    notes: 'Challenging mountain trail with steep climbs. Amazing views!',
    likes: 22,
    comments: 7
  },
  {
    id: '7',
    userId: '4',
    type: 'gym',
    title: 'Leg Day',
    date: '2025-04-30T18:15:00.000Z',
    duration: 60,
    calories: 450,
    notes: 'Heavy squats and deadlifts. Increased weight on all exercises.',
    likes: 9,
    comments: 2
  },
];

// Mock users
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  },
  {
    id: '3',
    name: 'Mike Brown',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
  },
  {
    id: '4',
    name: 'Sarah Chen',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
  },
];

const AllWorkouts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  // Filter workouts based on search term and filter
  const filteredWorkouts = mockWorkouts
    .filter(workout => 
      workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workout.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(workout => selectedFilter === "all" || workout.type === selectedFilter);
  
  // Get user information for each workout
  const workoutsWithUserInfo = filteredWorkouts.map(workout => {
    const user = mockUsers.find(user => user.id === workout.userId);
    return { ...workout, user };
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Community Workouts</h1>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search workouts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Button
            variant={selectedFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            All
          </Button>
          <Button
            variant={selectedFilter === "run" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("run")}
          >
            Run
          </Button>
          <Button
            variant={selectedFilter === "cycle" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("cycle")}
          >
            Cycle
          </Button>
          <Button
            variant={selectedFilter === "swim" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("swim")}
          >
            Swim
          </Button>
          <Button
            variant={selectedFilter === "gym" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter("gym")}
          >
            Gym
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto"
          >
            <Filter size={16} className="mr-1" />
            More Filters
          </Button>
        </div>
        
        {/* Workouts with user avatars */}
        <div className="space-y-4">
          {workoutsWithUserInfo.length > 0 ? (
            workoutsWithUserInfo.map((workout, index) => (
              <div key={workout.id} className="relative">
                <div className="absolute left-0 top-4 transform -translate-x-1/2 z-10">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={workout.user?.avatar} alt={workout.user?.name} />
                    <AvatarFallback>{workout.user?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="pl-6">
                  <WorkoutList workouts={[workout]} />
                </div>
                {index < workoutsWithUserInfo.length - 1 && (
                  <div className="h-6 ml-5 border-l-2 border-dashed border-gray-200"></div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No workouts found matching your search.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllWorkouts;
