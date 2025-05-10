
export interface Profile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio?: string;
  stats: UserStats;
  email?: string; // Added for Supabase auth
  created_at?: string; // Supabase timestamp
}

export interface UserStats {
  totalWorkouts: number;
  totalDistance: number;
  totalDuration: number;
  weeklyStreak: number;
  weeklyProgress: number; // percentage
  monthlyProgress: number; // percentage
}

export type WorkoutType = 'run' | 'cycle' | 'swim' | 'gym' | 'other';

export interface Workout {
  id: string;
  userId: string;
  type: WorkoutType;
  title: string;
  date: string;
  duration: number; // in minutes
  distance?: number; // in kilometers
  calories?: number;
  notes?: string;
  likes: number;
  comments: number;
  created_at?: string; // Supabase timestamp
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  goal_type: 'distance' | 'duration' | 'workouts';
  goal_value: number;
  start_date: string;       // ISO date string
  end_date: string;         // ISO date string
  privacy: 'public' | 'friends' | 'private';
  participants: { userId: string; progress: number }[];
  created_by: string;
  created_at: string;
}

export interface Perf  { user_id: string; count: number };


export interface LeaderboardEntry {
  user: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  score: number;
  rank: number;
}

// New types for notifications
export interface BaseNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable: boolean;
  user_id: string; // The user who receives the notification
  created_at?: string; // Supabase timestamp
}

export interface UserRelatedNotification extends BaseNotification {
  related_user_id: string; // The user who triggered the notification
}

export interface ChallengeNotification extends BaseNotification {
  challenge_id: string;
}

export interface WorkoutNotification extends BaseNotification {
  workout_id: string;
  related_user_id?: string;
}

export interface SystemNotification extends BaseNotification {
  // No additional fields
}

export interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}
