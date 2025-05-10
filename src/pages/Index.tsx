
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import WorkoutList from '../components/WorkoutList';
import ChallengeCard from '../components/ChallengeCard';
import Leaderboard from '../components/Leaderboard';
import LogWorkoutButton from '../components/LogWorkoutButton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  currentUser, 
  leaderboard 
} from '../data/mockData';
import React, { useState, useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'
import { Workout, Challenge, Profile} from '@/types' 




type Perf = { userId: string; count: number };

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const Index: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [allWorkouts, setAllWorkouts] = useState([]);
  const [topPerformers, setTopPerformers] = useState<Perf[]>([]);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);;
  const [users, setUsers] = useState([])
  const [weeklyStreak, setWeeklyStreak]     = useState(0);
  const [totalDurationSeconds, setTotalDurationSeconds] = useState(0);



  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
     
  // Option A: cached session (client-side)
  const { data: { session }, error: sessionErr } = await supabase.auth.getSession();

  if (sessionErr || !session) {
   
    console.error('No session found:', sessionErr);
    return;
  }
  
  const user = session.user;
  
  const { data: logUser, error: userFetchErr } = await supabase
    .from('users')
    .select('*')
    .eq('uuid', user.id) 
    .single(); 
  
  if (userFetchErr) {
    console.error('Error fetching user:', userFetchErr);
    return;
  }
  
  setCurrentUser(logUser);
  


        // Fetch workouts for this user
        const { data: wData, error: wErr } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
      if (wErr) console.error(wErr)
      else setWorkouts(wData || [])

      const { data: allWorkouts } = await supabase
      .from('workouts')
      .select('user_id');
      setAllWorkouts(allWorkouts || []);


      // Fetch active challenges
      const { data: cData, error: cErr } = await supabase
        .from('challenges')
        .select('*')
        .eq('created_by', user.id)
      if (cErr) console.error(cErr)
      else setChallenges(cData || [])
    console.log(cData)

      setLoading(false)

  type Perf = { userId: string; count: number };
  const counts: Record<string, number> = {};
  allWorkouts?.forEach(w => {
    counts[w.user_id] = (counts[w.user_id] || 0) + 1;
  });
  const computedTop: Perf[] = Object.entries(counts)
  .map(([userId, count]) => ({ userId, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 5);
  console.log(computedTop);

setTopPerformers(computedTop);

    const { data: pData } = await supabase
    .from('users')
    .select('*')
    .in('uuid', topPerformers.map(p => p.userId));
  setUsers(pData);
  console.log(pData);
  
    }
    loadData()
  }, [])

  useEffect(() => {
    if (!loading) {
      // Total duration in seconds
      const totalSec = workouts.reduce((sum, w) => sum + (w.duration || 0), 0);
      setTotalDurationSeconds(totalSec);
      console.log(totalDurationSeconds);
  
      // Weekly streak: count back from today
      const daysWithWorkout = new Set(
        workouts.map(w => new Date(w.date).toDateString())
      );
  
      let streak = 0;
      for (let i = 0; ; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        if (daysWithWorkout.has(d.toDateString())) streak++;
        else break;
      }
      setWeeklyStreak(streak);
    }
  }, [loading, workouts]);
  

  


  
    if (loading) {
      return <div className="p-8 text-center">Loading…</div>
    }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="dashboard-container pb-20">
        {/* Welcome section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Welcome back, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-gray-600 mt-1">
              Let's check your progress for this week
            </p>
          </div>
          
          <LogWorkoutButton />
        </div>
       
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
  <StatCard
    title="Weekly Streak"
    value={`${weeklyStreak} days`}
    icon="streak"
    trend={{ value: weeklyStreak, isPositive: weeklyStreak > 0 }}
  />
  <StatCard
    title="Total Workouts"
    value={workouts.length}
    icon="workouts"
    progress={workouts.length ? undefined : 0}
  />
  <StatCard
    title="Total Duration"
    value={`${(totalDurationSeconds / 3600)} hrs`}
    icon="duration"
    trend={{ value: totalDurationSeconds, isPositive: totalDurationSeconds > 0 }}
  />
  <StatCard
    title="Total Distance"
    value={`${workouts.reduce((sum, w) => sum + (w.distance || 0), 0).toFixed(1)} km`}
    icon="distance"
    progress={workouts.length ? undefined : 0}
  />
</div>

        
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Workouts and Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent workouts */}
        <section className="mb-8">
          <div className="section-header">
            <h2 className="text-xl font-semibold">Recent Workouts</h2>
            <a href="/workouts" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          {workouts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              All your workouts will show here.
            </div>
          ) : (
            <WorkoutList workouts={workouts.slice(0, 5)} />
          )}
        </section>
          
           {/* Active Challenges */}
        <section className="mb-8">
          <div className="section-header">
            <h2 className="text-xl font-semibold">My Challenges</h2>
            <a href="/challenges" className="text-sm text-blue-600 hover:underline">View all</a>
          </div>
          {challenges.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">
              All your challenges will show here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {challenges.map(c => (
                <ChallengeCard key={c.id} challenge={c} />
              ))}
            </div>
          )}
        </section>
          </div>
          {/* Column 2: Leaderboard and quick actions */}
          <div className="space-y-8">
            {/* Global leaderboard */}
<Card>
  <CardHeader>
    <CardTitle>Top Performers</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {topPerformers.map((perf, idx) => {
      const user = users.find(p => p.uuid === perf.userId);
      return (
        <div key={perf.userId} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-medium">{idx + 1}.</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{user?.name || 'Unknown'}</span>
          </div>
          <span className="font-semibold">{perf.count} workouts</span>
        </div>
      );
    })}
  </CardContent>
</Card>
    
            
            {/* Quick links card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
              </CardHeader>
              
              <CardContent className="grid grid-cols-2 gap-3">
                <a href="/friends" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Find Friends
                </a>
                <a href="/create-challenge" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Create Challenge
                </a>
                <a href="/workouts" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Workout History
                </a>
                {/* <a href="/settings" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Settings
                </a> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {/* Mobile floating action button */}
      <LogWorkoutButton fixed={true} />
    </div>
  );
};

export default Index;
