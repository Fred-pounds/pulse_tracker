
import Header from '../components/Header';
import WorkoutList from '../components/WorkoutList';
import LogWorkoutButton from '../components/LogWorkoutButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List, ArrowDown, Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Workout } from '../types'



const MyWorkouts: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
const [loading, setLoading]   = useState(true);

useEffect(() => {
  const loadWorkouts = async () => {
    setLoading(true);
    // 1) Get session → user
    const { data: { session }, error: sessErr } = await supabase.auth.getSession();
    if (sessErr || !session) {
      console.error('No session:', sessErr);
      setWorkouts([]);
      setLoading(false);
      return;
    }

    // 2) Fetch workouts belonging to this user
    const { data: wData, error: wErr } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('date', { ascending: false }); // newest first

    if (wErr) {
      console.error('Error fetching workouts:', wErr);
      setWorkouts([]);
    } else {
      setWorkouts(wData || []);
    }
    setLoading(false);
  };

  loadWorkouts();
}, []);
  


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
  
  const filteredWorkouts = filterWorkouts(workouts);
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const workoutsByDate = daysInMonth.map(day => {
    const workoutsOnDay = workouts.filter(workout => {
      const workoutDate = parseISO(workout.date);
      return isSameDay(workoutDate, day);
    });
    
    return {
      date: day,
      workouts: workoutsOnDay,
      hasWorkouts: workoutsOnDay.length > 0
    };
  });

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading your workouts…
      </div>
    );
  }
  
  
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
                      workouts={workouts.filter(workout => {
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
