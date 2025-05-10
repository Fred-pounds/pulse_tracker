
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyWorkouts from "./pages/MyWorkouts";
import AllWorkouts from "./pages/AllWorkouts";
import Challenges from "./pages/Challenges";
import CreateChallenge from "./pages/CreateChallenge";
import Friends from "./pages/Friends";
import LogWorkout from "./pages/LogWorkout";
import Notifications from "./pages/Notifications";
import { ProtectedRoute, PublicRoute } from "./services/protected-routes";
import { AuthProvider } from "./services/auth-provider"; 
import VerifyEmail from "./pages/verify-email";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
        <Routes>
  <Route element={<PublicRoute />}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Route>

  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Index />} />
    <Route path="/workouts" element={<MyWorkouts />} />
    <Route path="/all-workouts" element={<AllWorkouts />} />
    <Route path="/verify-email" element={< VerifyEmail />} />
    <Route path="/challenges" element={<Challenges />} />
    <Route path="/create-challenge" element={<CreateChallenge />} />
    <Route path="/friends" element={<Friends />} />
    <Route path="/log-workout" element={<LogWorkout />} />
    <Route path="/notifications" element={<Notifications />} />
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);


export default App;
