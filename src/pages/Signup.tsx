import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SignupForm from '../components/auth/SignupForm';
import { getDashboardRouteForRole } from '../utils/auth';

export default function Signup() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardRouteForRole(user.role), { replace: true });
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="min-h-[100vh] flex text-base-content bg-base-100 relative overflow-hidden">
      {/* Decorative Image Side */}
      <div className="hidden lg:flex lg:w-1/2 relative p-8">
        <div className="absolute inset-8 rounded-[40px] overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent z-10 mix-blend-multiply"></div>
          <img 
             src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2000&auto=format&fit=crop" 
             alt="Learning journey" 
             className="w-full h-full object-cover rounded-[40px] group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute bottom-16 left-16 z-20 text-white max-w-lg">
             <div className="badge badge-primary mb-4 font-bold uppercase tracking-widest shadow-lg">Join Coursiva</div>
             <h2 className="text-5xl font-black mb-4 leading-tight">Empower your future.</h2>
             <p className="text-xl opacity-90 font-medium">Join our global community of passionate learners and access thousands of premium courses today.</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 pb-20 pt-16 lg:pb-8 lg:pt-8 min-h-full">
        <SignupForm />
      </div>
    </div>
  );
}
