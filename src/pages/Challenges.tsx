import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, Plus, Calendar, Users, Trophy } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Challenge } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from 'react-router-dom';

// Mock challenges data
const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'May Running Challenge',
    description: 'Run at least 50km during this month',
    goal: {
      type: 'distance',
      value: 50
    },
    startDate: '2025-05-01T00:00:00.000Z',
    endDate: '2025-05-31T23:59:59.000Z',
    participants: [
      { userId: '1', progress: 68 },
      { userId: '2', progress: 42 },
      { userId: '3', progress: 85 },
      { userId: '4', progress: 15 }
    ],
    createdBy: '3'
  },
  {
    id: '2',
    title: 'Weekly Workout Streak',
    description: 'Complete at least 5 workouts this week',
    goal: {
      type: 'workouts',
      value: 5
    },
    startDate: '2025-05-05T00:00:00.000Z',
    endDate: '2025-05-11T23:59:59.000Z',
    participants: [
      { userId: '1', progress: 60 },
      { userId: '2', progress: 80 },
      { userId: '4', progress: 40 }
    ],
    createdBy: '2'
  },
  {
    id: '3',
    title: 'Summer Cycling Challenge',
    description: 'Cycle 100km in two weeks',
    goal: {
      type: 'distance',
      value: 100
    },
    startDate: '2025-05-15T00:00:00.000Z',
    endDate: '2025-05-29T23:59:59.000Z',
    participants: [
      { userId: '1', progress: 25 },
      { userId: '3', progress: 42 }
    ],
    createdBy: '1'
  },
  {
    id: '4',
    title: 'Month of Fitness',
    description: 'Exercise for at least 20 hours this month',
    goal: {
      type: 'duration',
      value: 20
    },
    startDate: '2025-05-01T00:00:00.000Z',
    endDate: '2025-05-31T23:59:59.000Z',
    participants: [
      { userId: '1', progress: 45 },
      { userId: '2', progress: 30 },
      { userId: '3', progress: 55 },
      { userId: '4', progress: 70 }
    ],
    createdBy: '4'
  }
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
  }
];

const Challenges: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();
  
  // Filter challenges based on search term and active tab
  const filteredChallenges = mockChallenges
    .filter(challenge => 
      challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(challenge => {
      const now = new Date();
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      
      if (activeTab === "active") {
        return now >= startDate && now <= endDate;
      } else if (activeTab === "upcoming") {
        return now < startDate;
      } else if (activeTab === "past") {
        return now > endDate;
      } else if (activeTab === "my") {
        return challenge.participants.some(p => p.userId === '1'); // Assuming logged in user id is '1'
      }
      return true;
    });
  
  // Get creator information for each challenge
  const getChallengeCreator = (createdById: string) => {
    return mockUsers.find(user => user.id === createdById);
  };
  
  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  };
  
  // Get goal text
  const getGoalText = (challenge: Challenge) => {
    const { goal } = challenge;
    
    switch (goal.type) {
      case 'distance':
        return `${goal.value} km`;
      case 'duration':
        return `${goal.value} hours`;
      case 'workouts':
        return `${goal.value} workouts`;
      default:
        return `${goal.value}`;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Challenges</h1>
          <Button onClick={() => navigate('/create-challenge')}>
            <Plus className="mr-1 h-4 w-4" />
            Create Challenge
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search challenges..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="active" className="space-y-4" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="my">My Challenges</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm">
              <Filter className="mr-1 h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <TabsContent value="active" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => {
                const creator = getChallengeCreator(challenge.createdBy);
                return (
                  <Card key={challenge.id} className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 pb-2">
                      <div className="mb-2 flex justify-between items-start">
                        <Badge variant="outline" className="bg-white/70 backdrop-blur-sm">
                          {challenge.goal.type === 'distance' && 'Distance'}
                          {challenge.goal.type === 'duration' && 'Time'}
                          {challenge.goal.type === 'workouts' && 'Frequency'}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> 
                        {formatDateRange(challenge.startDate, challenge.endDate)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-600 mb-4">{challenge.description}</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Goal</span>
                          <span>{getGoalText(challenge)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Participants</span>
                          <div className="flex -space-x-2">
                            {challenge.participants.slice(0, 3).map((participant, index) => {
                              const user = mockUsers.find(u => u.id === participant.userId);
                              return (
                                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                  <AvatarImage src={user?.avatar} alt={user?.name} />
                                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              );
                            })}
                            {challenge.participants.length > 3 && (
                              <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                                +{challenge.participants.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">Your Progress</span>
                          <span>{challenge.participants.find(p => p.userId === '1')?.progress ?? 0}%</span>
                        </div>
                        <Progress value={challenge.participants.find(p => p.userId === '1')?.progress ?? 0} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-gray-50 flex justify-between items-center pt-3 pb-3">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={creator?.avatar} alt={creator?.name} />
                          <AvatarFallback>{creator?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">Created by {creator?.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 p-0">
                        <Trophy className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
              
              {filteredChallenges.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No challenges found matching your search.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* My Challenges Tab - Similar to Active tab */}
          <TabsContent value="my" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Same card component as above with filteredChallenges */}
              {filteredChallenges.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">You haven't joined any challenges yet.</p>
                  <Button onClick={() => navigate('/create-challenge')} className="mt-4">
                    <Plus className="mr-1 h-4 w-4" />
                    Create a Challenge
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Upcoming Tab - Similar to Active tab */}
          <TabsContent value="upcoming" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Same card component as above with filteredChallenges */}
              {filteredChallenges.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No upcoming challenges found.</p>
                  <Button onClick={() => navigate('/create-challenge')} className="mt-4">
                    <Plus className="mr-1 h-4 w-4" />
                    Create a Challenge
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Past Tab - Similar to Active tab */}
          <TabsContent value="past" className="space-y-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Same card component as above with filteredChallenges */}
              {filteredChallenges.length === 0 && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No past challenges found.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Challenges;
