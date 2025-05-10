
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import WorkoutList from '../components/WorkoutList';
import ChallengeCard from '../components/ChallengeCard';
import Leaderboard from '../components/Leaderboard';
import LogWorkoutButton from '../components/LogWorkoutButton';
import { 
  currentUser, 
  recentWorkouts, 
  activeChallenges, 
  leaderboard 
} from '../data/mockData';
import React, { useState, useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'
import { Workout, Challenge } from '@/types' 


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const Index: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
     
  // Option A: cached session (client-side)
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession()
    if (sessionErr || !session) { /* handle missing session */ }
    const user = session.user


        // Fetch workouts for this user
        const { data: wData, error: wErr } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
      if (wErr) console.error(wErr)
      else setWorkouts(wData || [])

      // Fetch active challenges
      const { data: cData, error: cErr } = await supabase
        .from('challenges')
        .select('*')
        .eq('user_id', user.id)
      if (cErr) console.error(cErr)
      else setChallenges(cData || [])

      setLoading(false)
    }
    loadData()
  }, [])

    // default zeros
    let totalWorkouts = 0
    let totalDuration = 0 // in seconds
    let totalDistance = 0 // in km
    let weeklyStreak = 0
  
    if (workouts.length > 0) {
      totalWorkouts = workouts.length
      totalDuration = workouts.reduce((sum, w) => sum + (w.duration || 0), 0)
      totalDistance = workouts.reduce((sum, w) => sum + (w.distance || 0), 0)
  
      // Simple streak: count how many days in a row up to today have at least one workout.
      const dates = new Set(workouts.map(w => new Date(w.date).toDateString()))
      for (let i = 0; ; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        if (dates.has(d.toDateString())) weeklyStreak++
        else break
      }
    }
  
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
        <section>
              <div className="section-header">
                <h2 className="text-xl font-semibold">Recent Workouts</h2>
                <a href="/workouts" className="text-sm text-blue-600 hover:underline">
                  View all
                </a>
              </div>
              
              <WorkoutList workouts={recentWorkouts} />
            </section>
           {/* Stats grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Weekly Streak" value={`${weeklyStreak} days`} icon="streak" trend={{ value: weeklyStreak, isPositive: weeklyStreak>0 }} />
          <StatCard title="Total Workouts" value={totalWorkouts} icon="workouts" progress={workouts.length? undefined : 0} />
          <StatCard title="Total Duration" value={`${Math.round(totalDuration/3600)} hrs`} icon="duration" trend={{ value: totalDuration, isPositive: totalDuration>0 }} />
          <StatCard title="Total Distance" value={`${totalDistance.toFixed(1)} km`} icon="distance" progress={workouts.length? undefined : 0} />
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
            <h2 className="text-xl font-semibold">Active Challenges</h2>
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
            <Leaderboard entries={leaderboard} />
            
            {/* Quick links card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Quick Links</CardTitle>
              </CardHeader>
              
              <CardContent className="grid grid-cols-2 gap-3">
                <a href="/friends" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Find Friends
                </a>
                <a href="/challenges/new" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Create Challenge
                </a>
                <a href="/workouts" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Workout History
                </a>
                <a href="/settings" className="py-2 px-3 bg-gray-100 rounded-md hover:bg-gray-200 text-center text-sm font-medium">
                  Settings
                </a>
              </CardContent>
            </Card>
            
            {/* Activity Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">Weekly Streak</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-7 gap-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
                    const isCompleted = index < currentUser.stats.weeklyStreak;
                    const isToday = index === currentUser.stats.weeklyStreak;
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className="text-xs text-gray-500 mb-1">{day}</div>
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                            ${isCompleted ? 'bg-blue-500 text-white' : 
                              isToday ? 'border-2 border-blue-500 bg-white animate-pulse-gentle' : 
                              'bg-gray-100 text-gray-400'}`}
                        >
                          {isCompleted ? '✓' : index + 1}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="text-center mt-3 text-sm text-gray-600">
                  {currentUser.stats.weeklyStreak} day streak! Keep it going!
                </div>
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
