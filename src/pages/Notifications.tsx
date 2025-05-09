
import React from 'react';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Bell, Users, Trophy, Calendar, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

// Define types for our notifications
interface BaseNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  actionable: boolean;
}

interface UserNotification extends BaseNotification {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface ChallengeNotification extends BaseNotification {
  challenge: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface WorkoutNotification extends BaseNotification {
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  workout: {
    id: string;
    title: string;
  };
}

interface AchievementNotification extends BaseNotification {
  badge: {
    id: string;
    name: string;
    icon: string;
  };
}

interface SystemNotification extends BaseNotification {
  // No additional props needed for system notifications
}

type NotificationType = 
  | UserNotification 
  | ChallengeNotification 
  | WorkoutNotification 
  | AchievementNotification 
  | SystemNotification;

interface NotificationState {
  unread: NotificationType[];
  read: NotificationType[];
}

// Mock notification data
const notificationData: NotificationState = {
  unread: [
    {
      id: '1',
      type: 'friend_request',
      title: 'Friend Request',
      message: 'Emma Wilson wants to add you as a friend.',
      timestamp: '2025-05-07T10:30:00.000Z',
      user: {
        id: '2',
        name: 'Emma Wilson',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
      },
      actionable: true
    } as UserNotification,
    {
      id: '2',
      type: 'challenge_invite',
      title: 'Challenge Invitation',
      message: 'Mike Brown invited you to "May Running Challenge"',
      timestamp: '2025-05-07T09:15:00.000Z',
      user: {
        id: '3',
        name: 'Mike Brown',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      challenge: {
        id: '1',
        title: 'May Running Challenge'
      },
      actionable: true
    } as ChallengeNotification,
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'You earned the "Early Bird" badge! You completed 5 workouts before 8am.',
      timestamp: '2025-05-06T16:45:00.000Z',
      badge: {
        id: '1',
        name: 'Early Bird',
        icon: '🌅'
      },
      actionable: false
    } as AchievementNotification
  ],
  read: [
    {
      id: '4',
      type: 'workout_comment',
      title: 'New Comment',
      message: 'Sarah Chen commented on your Morning Run workout.',
      timestamp: '2025-05-05T14:22:00.000Z',
      user: {
        id: '4',
        name: 'Sarah Chen',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      workout: {
        id: '5',
        title: 'Morning Run'
      },
      actionable: false
    } as WorkoutNotification,
    {
      id: '5',
      type: 'challenge_complete',
      title: 'Challenge Completed',
      message: 'You completed the "Weekly Workout Streak" challenge!',
      timestamp: '2025-05-04T18:10:00.000Z',
      challenge: {
        id: '2',
        title: 'Weekly Workout Streak'
      },
      actionable: false
    } as ChallengeNotification,
    {
      id: '6',
      type: 'system',
      title: 'System Update',
      message: 'New features have been added to the app. Check out the what\'s new section.',
      timestamp: '2025-05-03T12:00:00.000Z',
      actionable: false
    } as SystemNotification
  ]
};

// Format date relative to now (simple implementation)
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
};

// Get icon based on notification type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'friend_request':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'challenge_invite':
    case 'challenge_complete':
      return <Trophy className="h-4 w-4 text-yellow-500" />;
    case 'workout_comment':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case 'achievement':
      return <Trophy className="h-4 w-4 text-purple-500" />;
    case 'system':
      return <Bell className="h-4 w-4 text-gray-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const NotificationItem = ({ 
  notification, 
  onAction 
}: { 
  notification: NotificationType, 
  onAction: (id: string, action: 'accept' | 'reject') => void 
}) => {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {('user' in notification && notification.user) ? (
              <Avatar>
                <AvatarImage src={notification.user.avatar} />
                <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : ('badge' in notification && notification.badge) ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-2xl">
                {notification.badge.icon}
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                {getNotificationIcon(notification.type)}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <span className="text-xs text-gray-500">
                {formatRelativeTime(notification.timestamp)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            
            {notification.actionable && (
              <div className="flex gap-2 mt-2">
                <Button 
                  onClick={() => onAction(notification.id, 'accept')} 
                  size="sm" 
                  className="h-8"
                >
                  <Check className="mr-1 h-3 w-3" />
                  Accept
                </Button>
                <Button 
                  onClick={() => onAction(notification.id, 'reject')} 
                  variant="outline" 
                  size="sm" 
                  className="h-8"
                >
                  <X className="mr-1 h-3 w-3" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Notifications: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = React.useState<NotificationState>(notificationData);
  
  // Handle notification actions (accept/reject)
  const handleNotificationAction = (id: string, action: 'accept' | 'reject') => {
    // Here we would typically update the backend via Supabase
    
    // Update local state for immediate UI feedback
    const updatedUnread = notifications.unread.filter(n => n.id !== id);
    setNotifications(prev => ({
      ...prev,
      unread: updatedUnread
    }));
    
    // Show toast message
    toast({
      title: action === 'accept' ? "Accepted" : "Declined",
      description: `You ${action === 'accept' ? 'accepted' : 'declined'} the request.`,
    });
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    // Here we would update the status in Supabase
    
    setNotifications(prev => ({
      unread: [],
      read: [...prev.read, ...prev.unread]
    }));
    
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read.",
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
          
          {notifications.unread.length > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="unread" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="unread">
              Unread
              {notifications.unread.length > 0 && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {notifications.unread.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <div className="mt-4">
            <TabsContent value="unread">
              {notifications.unread.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                  {notifications.unread.map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onAction={handleNotificationAction}
                    />
                  ))}
                </ScrollArea>
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No unread notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You're all caught up! Check the "All" tab to see previous notifications.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all">
              <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                {[...notifications.unread, ...notifications.read].length > 0 ? (
                  [...notifications.unread, ...notifications.read].map(notification => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onAction={handleNotificationAction}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You don't have any notifications yet.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Notifications;
