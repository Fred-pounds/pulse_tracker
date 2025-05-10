
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Calendar, Clock, MapPin, BarChart2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from 'date-fns';
import { WorkoutType } from '../types';
import { toast } from "@/hooks/use-toast";
import {supabase} from "../services/supabaseClient"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }).max(50),
  type: z.enum(["run", "cycle", "swim", "gym", "other"] as const),
  date: z.string().min(1, { message: "Please select a date" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute" }),
  distance: z.number().optional(),
  calories: z.number().optional(),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LogWorkout: React.FC = () => {
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "run",
      date: format(new Date(), "yyyy-MM-dd"),
      duration: 30,
      distance: undefined,
      calories: undefined,
      notes: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    // 1. Get the logged-in user
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      toast({
        title: "Not logged in",
        description: "Please log in and try again.",
        variant: "destructive",
      })
      return
    }

    // 2. Insert into your "workouts" table
    const { error: insertErr } = await supabase
      .from('workouts')
      .insert({
        user_id:    user.id,
        title:      data.title,
        type:       data.type,
        date:       data.date,
        duration:   data.duration,
        distance:   data.distance ?? null,
        calories:   data.calories ?? null,
        notes:      data.notes,
      })

    // 3. Handle success / error
    if (insertErr) {
      toast({
        title: "Failed to save workout",
        description: insertErr.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Workout logged",
        description: "Your workout has been saved.",
      })
      navigate('/workouts')
    }
  }

  
  const workoutTypeIcons: Record<WorkoutType, string> = {
    run: "🏃‍♂️",
    cycle: "🚴‍♂️",
    swim: "🏊‍♂️",
    gym: "💪",
    other: "🏋️‍♂️",
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Log Workout</h1>
        </div>
        
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>New Workout Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Morning Run" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {(['run', 'cycle', 'swim', 'gym', 'other'] as const).map((type) => (
                          <Button
                            key={type}
                            type="button"
                            variant={field.value === type ? 'default' : 'outline'}
                            className={`justify-center flex-col h-20 ${field.value === type ? '' : 'border-dashed'}`}
                            onClick={() => field.onChange(type)}
                          >
                            <span className="text-xl mb-1">{workoutTypeIcons[type]}</span>
                            <span className="capitalize">{type}</span>
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="date" 
                              className="pl-10" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type="number"
                              className="pl-10"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distance (km)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="number"
                              step="0.1"
                              className="pl-10"
                              placeholder="Optional"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Optional for gym workouts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="calories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Calories Burned</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <BarChart2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                              type="number"
                              className="pl-10"
                              placeholder="Optional"
                              {...field}
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Optional
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How did your workout feel? Any achievements or challenges?"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional - Add details about your workout experience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Workout
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default LogWorkout;
