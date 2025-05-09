
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

// Define notification types (simplified version)
interface BaseNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface UserNotification extends BaseNotification {
  user: {
    name: string;
    avatar: string;
  };
}

interface BadgeNotification extends BaseNotification {
  badge: {
    name: string;
    icon: string;
  };
}

type NotificationType = UserNotification | BadgeNotification;

// Sample notification data
const sampleNotifications: NotificationType[] = [
  {
    id: '1',
    title: 'Friend Request',
    message: 'Emma Wilson wants to add you as a friend.',
    timestamp: '2025-05-07T10:30:00.000Z',
    read: false,
    user: {
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
    }
  },
  {
    id: '2',
    title: 'Challenge Invitation',
    message: 'Mike Brown invited you to "May Running Challenge"',
    timestamp: '2025-05-07T09:15:00.000Z',
    read: false,
    user: {
      name: 'Mike Brown',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    }
  },
  {
    id: '3',
    title: 'Achievement Unlocked',
    message: 'You earned the "Early Bird" badge! You completed 5 workouts before 8am.',
    timestamp: '2025-05-06T16:45:00.000Z',
    read: true,
    badge: {
      name: 'Early Bird',
      icon: '🌅'
    }
  }
];

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

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>(sampleNotifications);
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead} 
              className="text-xs h-8"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 ${notification.read ? '' : 'bg-blue-50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {'user' in notification ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : 'badge' in notification ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xl">
                        {notification.badge.icon}
                      </div>
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                        <Bell className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <Bell className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t text-center">
          <Button variant="ghost" size="sm" className="w-full h-8" asChild>
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
