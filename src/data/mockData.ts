
import { Profile, Workout, Challenge, LeaderboardEntry } from '../types';

export const currentUser: Profile = {
  id: '1',
  name: 'Alex Johnson',
  username: 'alexj',
  avatar: 'https://i.pravatar.cc/300?img=1',
  bio: 'Fitness enthusiast and marathon runner',
  stats: {
    totalWorkouts: 87,
    totalDistance: 783.4,
    totalDuration: 7251,
    weeklyStreak: 5,
    weeklyProgress: 71,
    monthlyProgress: 65
  }
};

// export const recentWorkouts: Workout[] = [
//   {
//     id: '1',
//     userId: '1',
//     type: 'run',
//     title: 'Morning Run',
//     date: '2023-05-06T08:30:00',
//     duration: 45,
//     distance: 5.2,
//     calories: 420,
//     notes: 'Felt great today!',
//     likes: 12,
//     comments: 3
//   },
//   {
//     id: '2',
//     userId: '1',
//     type: 'cycle',
//     title: 'Weekend Ride',
//     date: '2023-05-05T10:15:00',
//     duration: 75,
//     distance: 20.7,
//     calories: 650,
//     notes: 'Nice weather, took the scenic route',
//     likes: 8,
//     comments: 1
//   },
//   {
//     id: '3',
//     userId: '1',
//     type: 'gym',
//     title: 'Upper Body Workout',
//     date: '2023-05-04T17:00:00',
//     duration: 60,
//     calories: 380,
//     notes: 'Focused on chest and shoulders',
//     likes: 5,
//     comments: 0
//   },
//   {
//     id: '4',
//     userId: '1',
//     type: 'swim',
//     title: 'Pool Session',
//     date: '2023-05-03T19:30:00',
//     duration: 40,
//     distance: 1.5,
//     calories: 350,
//     notes: 'Worked on freestyle technique',
//     likes: 9,
//     comments: 2
//   }
// ];

// export const activeChallenges: Challenge[] = [
//   {
//     id: '1',
//     title: 'May Running Challenge',
//     description: 'Run 50km in May',
//     goal: {
//       type: 'distance',
//       value: 50
//     },
//     startDate: '2023-05-01T00:00:00',
//     endDate: '2023-05-31T23:59:59',
//     participants: [
//       { userId: '1', progress: 42 },
//       { userId: '2', progress: 67 },
//       { userId: '3', progress: 28 }
//     ],
//     createdBy: '2'
//   },
//   {
//     id: '2',
//     title: 'Weekly Workout Streak',
//     description: 'Complete a workout every day for 7 days',
//     goal: {
//       type: 'workouts',
//       value: 7
//     },
//     startDate: '2023-05-01T00:00:00',
//     endDate: '2023-05-07T23:59:59',
//     participants: [
//       { userId: '1', progress: 71 },
//       { userId: '4', progress: 85 },
//       { userId: '5', progress: 100 }
//     ],
//     createdBy: '4'
//   }
// ];

export const leaderboard: LeaderboardEntry[] = [
  {
    user: {
      id: '5',
      name: 'Emma Smith',
      username: 'emmas',
      avatar: 'https://i.pravatar.cc/300?img=5'
    },
    score: 248,
    rank: 1
  },
  {
    user: {
      id: '2',
      name: 'Michael Chen',
      username: 'mchen',
      avatar: 'https://i.pravatar.cc/300?img=8'
    },
    score: 235,
    rank: 2
  },
  {
    user: {
      id: '3',
      name: 'Sophia Garcia',
      username: 'sgarcia',
      avatar: 'https://i.pravatar.cc/300?img=9'
    },
    score: 221,
    rank: 3
  },
  {
    user: {
      id: '1',
      name: 'Alex Johnson',
      username: 'alexj',
      avatar: 'https://i.pravatar.cc/300?img=1'
    },
    score: 198,
    rank: 4
  },
  {
    user: {
      id: '4',
      name: 'James Wilson',
      username: 'jwilson',
      avatar: 'https://i.pravatar.cc/300?img=3'
    },
    score: 187,
    rank: 5
  }
];
