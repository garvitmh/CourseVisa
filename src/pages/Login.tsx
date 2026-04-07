import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm';
import { getDashboardRouteForRole } from '../utils/auth';

export default function Login() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardRouteForRole(user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-screen flex text-base-content bg-base-100 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 -left-64 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none animate-blob"></div>
      <div className="absolute -bottom-64 -right-64 w-[800px] h-[800px] bg-secondary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none animate-blob animation-delay-2000"></div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <LoginForm />
      </div>

      {/* Decorative Image Side */}
      <div className="hidden lg:flex lg:w-1/2 relative p-8">
        <div className="absolute inset-8 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent z-10 mix-blend-multiply"></div>
          <img 
             src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2000&auto=format&fit=crop" 
             alt="Students learning together" 
             className="w-full h-full object-cover rounded-[40px] hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg">
             <div className="badge badge-accent mb-4 font-bold uppercase tracking-widest shadow-lg">Welcome Back</div>
             <h2 className="text-5xl font-black mb-4 leading-tight">Master your craft.</h2>
             <p className="text-xl opacity-90 font-medium">Log in back to your account and continue your seamless learning journey with thousands of world-class experts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
