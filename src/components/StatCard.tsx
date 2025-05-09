
import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Clock, 
  Activity, 
  MapPin 
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: 'streak' | 'workouts' | 'duration' | 'distance';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  progress 
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'streak':
        return <Award className="text-yellow-500" size={24} />;
      case 'workouts':
        return <Activity className="text-blue-500" size={24} />;
      case 'duration':
        return <Clock className="text-purple-500" size={24} />;
      case 'distance':
        return <MapPin className="text-green-500" size={24} />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="bg-gray-100 p-2 rounded-full">
            {renderIcon()}
          </div>
        </div>
        
        <div className="flex items-end mb-1">
          <h2 className="text-2xl font-bold mr-2">{value}</h2>
          {trend && (
            <span 
              className={trend.isPositive ? 'stat-trend-up' : 'stat-trend-down'}
            >
              {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {trend.value}%
            </span>
          )}
        </div>
        
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-1" />
            <p className="text-xs text-gray-500 mt-1">{progress}% of weekly goal</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
