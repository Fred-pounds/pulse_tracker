
import React, { useState } from 'react';
import Header from '../components/Header';
import WorkoutList from '../components/WorkoutList';
import LogWorkoutButton from '../components/LogWorkoutButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List, ArrowDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Workout } from '../types';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

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
    userId: '1',
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
    userId: '1',
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
    userId: '1',
    type: 'run',
    title: 'Interval Training',
    date: '2025-05-02T07:15:00.000Z',
    duration: 45,
    distance: 6.8,
    calories: 520,
    notes: 'High intensity intervals. Tough but productive session.',
    likes: 10,
    comments: 4
  }
];

const MyWorkouts: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const filterWorkouts = (workouts: Workout[]): Workout[] => {
    let filtered = [...workouts];
    
    // Filter by type
    if (selectedFilter !== "all") {
      filtered = filtered.filter(workout => workout.type === selectedFilter);
    }
    
    // Filter by selected date
    if (selectedDate) {
      filtered = filtered.filter(workout => {
        const workoutDate = parseISO(workout.date);
        return isSameDay(workoutDate, selectedDate);
      });
    }
    
    return filtered;
  };
  
  const filteredWorkouts = filterWorkouts(mockWorkouts);
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const workoutsByDate = daysInMonth.map(day => {
    const workoutsOnDay = mockWorkouts.filter(workout => {
      const workoutDate = parseISO(workout.date);
      return isSameDay(workoutDate, day);
    });
    
    return {
      date: day,
      workouts: workoutsOnDay,
      hasWorkouts: workoutsOnDay.length > 0
    };
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Workouts</h1>
          <LogWorkoutButton />
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
          <Button
            variant="outline"
            size="sm"
          >
            <ArrowDown size={16} className="mr-1" />
            Sort
          </Button>
        </div>
        
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center">
              <List size={16} className="mr-1" />
              List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center">
              <Calendar size={16} className="mr-1" />
              Calendar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            {filteredWorkouts.length > 0 ? (
              <WorkoutList workouts={filteredWorkouts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No workouts found matching your filters.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedFilter("all");
                    setSelectedDate(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {workoutsByDate.map((day, i) => (
                    <div 
                      key={i} 
                      className={`aspect-square p-1 border rounded-md flex flex-col items-center justify-center 
                      ${isSameDay(day.date, new Date()) ? 'bg-blue-50 border-blue-200' : 'border-gray-100'} 
                      ${day.hasWorkouts ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                      onClick={() => day.hasWorkouts ? setSelectedDate(selectedDate && isSameDay(selectedDate, day.date) ? null : day.date) : null}
                    >
                      <span className={`text-sm ${isSameDay(day.date, new Date()) ? 'font-medium' : ''}`}>
                        {format(day.date, 'd')}
                      </span>
                      {day.hasWorkouts && (
                        <div className={`w-6 h-1 mt-1 rounded-full ${selectedDate && isSameDay(selectedDate, day.date) ? 'bg-blue-500' : 'bg-blue-300'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {selectedDate && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                    <WorkoutList 
                      workouts={mockWorkouts.filter(workout => {
                        const workoutDate = parseISO(workout.date);
                        return isSameDay(workoutDate, selectedDate);
                      })} 
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyWorkouts;
