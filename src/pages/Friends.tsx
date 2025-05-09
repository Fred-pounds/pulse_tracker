import React, { useState } from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Activity, 
  MessageSquare,
  X 
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WorkoutList from '../components/WorkoutList';
import { Workout } from '../types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Mock friends data
const mockFriends = [
  {
    id: '1',
    name: 'Emma Wilson',
    username: 'emmaw',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    bio: 'Marathon runner & yoga enthusiast',
    stats: {
      totalWorkouts: 87,
      totalDistance: 450.2,
      totalDuration: 3240,
      weeklyStreak: 5,
      weeklyProgress: 75,
      monthlyProgress: 62
    },
    status: 'active' // active, pending, suggested
  },
  {
    id: '2',
    name: 'Mike Brown',
    username: 'mikeb',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    bio: 'Cycling addict, love mountain trails',
    stats: {
      totalWorkouts: 124,
      totalDistance: 1832.5,
      totalDuration: 5760,
      weeklyStreak: 7,
      weeklyProgress: 100,
      monthlyProgress: 85
    },
    status: 'active'
  },
  {
    id: '3',
    name: 'Sarah Chen',
    username: 'sarahc',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    bio: 'CrossFit trainer, nutrition coach',
    stats: {
      totalWorkouts: 156,
      totalDistance: 325.7,
      totalDuration: 8400,
      weeklyStreak: 4,
      weeklyProgress: 60,
      monthlyProgress: 72
    },
    status: 'active'
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    username: 'alexr',
    avatar: 'https://randomuser.me/api/portraits/men/72.jpg',
    bio: 'Trail runner, occasional swimmer',
    stats: {
      totalWorkouts: 65,
      totalDistance: 380.3,
      totalDuration: 2890,
      weeklyStreak: 2,
      weeklyProgress: 40,
      monthlyProgress: 55
    },
    status: 'pending'
  },
  {
    id: '5',
    name: 'Jessica Lee',
    username: 'jlee',
    avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
    bio: 'Swimmer, love the outdoors',
    stats: {
      totalWorkouts: 72,
      totalDistance: 120.5,
      totalDuration: 3150,
      weeklyStreak: 3,
      weeklyProgress: 45,
      monthlyProgress: 50
    },
    status: 'suggested'
  },
  {
    id: '6',
    name: 'David Kim',
    username: 'davidk',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Gym rat, fitness enthusiast',
    stats: {
      totalWorkouts: 108,
      totalDistance: 210.8,
      totalDuration: 4320,
      weeklyStreak: 6,
      weeklyProgress: 90,
      monthlyProgress: 78
    },
    status: 'suggested'
  }
];

// Mock suggested users for adding friends
const mockSuggestedUsers = [
  {
    id: '7',
    name: 'Thomas Parker',
    username: 'thomasp',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Hiking enthusiast & amateur photographer',
  },
  {
    id: '8',
    name: 'Olivia Martinez',
    username: 'oliviam',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    bio: 'Yoga instructor & wellness coach',
  },
  {
    id: '9',
    name: 'Daniel Lewis',
    username: 'danlewis',
    avatar: 'https://randomuser.me/api/portraits/men/57.jpg',
    bio: 'Tennis player & sports enthusiast',
  }
];

// Mock workouts for friends
const mockFriendWorkouts: Record<string, Workout[]> = {
  '1': [
    {
      id: 'f1-1',
      userId: '1',
      type: 'run',
      title: 'Morning Jog',
      date: '2025-05-06T07:30:00.000Z',
      duration: 30,
      distance: 4.2,
      calories: 320,
      notes: 'Easy pace, felt great!',
      likes: 5,
      comments: 1
    },
    {
      id: 'f1-2',
      userId: '1',
      type: 'gym',
      title: 'Upper Body Workout',
      date: '2025-05-04T16:00:00.000Z',
      duration: 45,
      calories: 350,
      notes: 'Focus on arms and shoulders today.',
      likes: 8,
      comments: 2
    }
  ],
  '2': [
    {
      id: 'f2-1',
      userId: '2',
      type: 'cycle',
      title: 'Mountain Trail Ride',
      date: '2025-05-05T10:15:00.000Z',
      duration: 90,
      distance: 32.5,
      calories: 850,
      notes: 'Conquered the north ridge trail today!',
      likes: 12,
      comments: 4
    }
  ],
  '3': [
    {
      id: 'f3-1',
      userId: '3',
      type: 'gym',
      title: 'CrossFit WOD',
      date: '2025-05-06T18:30:00.000Z',
      duration: 60,
      calories: 580,
      notes: 'AMRAP: 20 min of burpees, pull-ups, and box jumps',
      likes: 15,
      comments: 6
    },
    {
      id: 'f3-2',
      userId: '3',
      type: 'run',
      title: 'Interval Training',
      date: '2025-05-03T07:45:00.000Z',
      duration: 35,
      distance: 5.8,
      calories: 450,
      notes: '5 rounds of 400m sprints with 1min rest',
      likes: 9,
      comments: 3
    }
  ]
};

const Friends: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("friends");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const [addFriendSearch, setAddFriendSearch] = useState("");
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Filter friends based on search term and active tab
  const filteredFriends = mockFriends
    .filter(friend => 
      friend.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (friend.bio && friend.bio.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(friend => {
      if (activeTab === "friends") {
        return friend.status === 'active';
      } else if (activeTab === "pending") {
        return friend.status === 'pending';
      } else if (activeTab === "suggested") {
        return friend.status === 'suggested';
      }
      return true;
    });
  
  // Get friend's workouts
  const friendWorkouts = selectedFriend ? mockFriendWorkouts[selectedFriend] || [] : [];
  
  // Filter suggested users for add friend dialog
  const filteredSuggestedUsers = mockSuggestedUsers.filter(user => 
    !pendingRequests.includes(user.id) &&
    (user.name.toLowerCase().includes(addFriendSearch.toLowerCase()) ||
     user.username.toLowerCase().includes(addFriendSearch.toLowerCase()) ||
     (user.bio && user.bio.toLowerCase().includes(addFriendSearch.toLowerCase())))
  );
  
  const handleSendFriendRequest = (userId: string) => {
    setPendingRequests(prev => [...prev, userId]);
    toast({
      title: "Friend request sent!",
      description: "They will be notified of your request.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Friends</h1>
          <Dialog open={addFriendDialogOpen} onOpenChange={setAddFriendDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Friends
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Friends</DialogTitle>
                <DialogDescription>
                  Find and connect with other fitness enthusiasts.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-10"
                    value={addFriendSearch}
                    onChange={(e) => setAddFriendSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {filteredSuggestedUsers.length > 0 ? (
                    filteredSuggestedUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleSendFriendRequest(user.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No users found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddFriendDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search friends..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="friends" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TabsContent value="friends" className="m-0">
                <div className="space-y-4">
                  {filteredFriends.map((friend) => (
                    <Card 
                      key={friend.id} 
                      className={`hover:shadow-md transition-shadow cursor-pointer ${selectedFriend === friend.id ? 'border-blue-300 ring-1 ring-blue-300' : ''}`}
                      onClick={() => setSelectedFriend(friend.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <h3 className="font-medium">{friend.name}</h3>
                            <p className="text-sm text-gray-500">@{friend.username}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Activity className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredFriends.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No friends found matching your search.</p>
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
              
              <TabsContent value="pending" className="m-0">
                <div className="space-y-4">
                  {filteredFriends.map((friend) => (
                    <Card key={friend.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <h3 className="font-medium">{friend.name}</h3>
                            <p className="text-sm text-gray-500">@{friend.username}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-red-600">
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredFriends.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No pending friend requests.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="suggested" className="m-0">
                <div className="space-y-4">
                  {filteredFriends.map((friend) => (
                    <Card key={friend.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center">
                          <Avatar className="h-12 w-12 mr-4">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow">
                            <h3 className="font-medium">{friend.name}</h3>
                            <p className="text-sm text-gray-500">@{friend.username}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredFriends.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No friend suggestions available.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
            
            <div className="lg:col-span-2">
              {selectedFriend ? (
                <div>
                  {/* Selected Friend Profile */}
                  {(() => {
                    const friend = mockFriends.find(f => f.id === selectedFriend);
                    if (!friend) return null;
                    
                    return (
                      <>
                        <Card className="mb-6">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center md:items-start">
                              <Avatar className="h-24 w-24 mr-0 md:mr-6 mb-4 md:mb-0">
                                <AvatarImage src={friend.avatar} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-grow text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                  <div>
                                    <h2 className="text-xl font-semibold">{friend.name}</h2>
                                    <p className="text-gray-500 mb-2">@{friend.username}</p>
                                  </div>
                                  
                                  <div className="flex space-x-2 justify-center md:justify-start mt-2 md:mt-0">
                                    <Button variant="outline" size="sm">
                                      <MessageSquare className="h-4 w-4 mr-1" />
                                      Message
                                    </Button>
                                    <Button size="sm">
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Following
                                    </Button>
                                  </div>
                                </div>
                                
                                {friend.bio && <p className="mt-3">{friend.bio}</p>}
                                
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                  <div className="text-center">
                                    <p className="text-xl font-semibold">{friend.stats.totalWorkouts}</p>
                                    <p className="text-xs text-gray-500">Workouts</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xl font-semibold">{friend.stats.totalDistance.toFixed(1)} km</p>
                                    <p className="text-xs text-gray-500">Distance</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xl font-semibold">{Math.floor(friend.stats.totalDuration / 60)} h</p>
                                    <p className="text-xs text-gray-500">Duration</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-medium">Recent Workouts</h3>
                          <Badge variant="outline">Weekly Streak: {friend.stats.weeklyStreak} days</Badge>
                        </div>
                        
                        {friendWorkouts.length > 0 ? (
                          <WorkoutList workouts={friendWorkouts} />
                        ) : (
                          <Card>
                            <CardContent className="p-8 text-center">
                              <p className="text-gray-500">No recent workouts to display.</p>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500 mb-4">Select a friend to view their profile and recent activities.</p>
                    <Button variant="outline">Find Friends</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Friends;
