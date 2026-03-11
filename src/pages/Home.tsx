import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Course } from '../types';
import { Carousel } from '../components/animations/Carousel';
import { GlareCard } from '../components/animations/GlareCard';
import { GlitchText } from '../components/animations/GlitchText';
import { Marquee } from '../components/animations/Marquee';

export default function Home() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.courses.getAll();
        if (res.success) {
          setFeaturedCourses(res.data.slice(0, 6)); // Top 6 for home
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery && !category) return;
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (category) params.append('cat', category);
    navigate(`/courses?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-transparent relative">
      
      {/* Hero Section */}
      <div className="hero min-h-[85vh] bg-base-200/50 relative z-10 backdrop-blur-sm">
        <div className="hero-content flex-col lg:flex-row-reverse gap-10 lg:gap-20 w-full max-w-7xl px-4 py-12">
          
          {/* Hero Image / Badge */}
          <div className="relative w-full lg:w-1/2 flex justify-center">
            {/* Soft decorative blob */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000"></div>
            
            <div className="relative z-10 p-4">
              <img 
                src="/photo/student.png" 
                alt="Student learning" 
                className="max-w-xs md:max-w-md w-full drop-shadow-2xl"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              
              {/* Floating stats card */}
              <div className="absolute bottom-10 -left-6 lg:-left-12 bg-base-100 shadow-xl rounded-2xl p-4 flex items-center gap-4 animate-bounce hover:scale-105 transition-transform duration-300">
                <div className="bg-success text-success-content p-3 rounded-xl shadow-inner">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <div className="font-extrabold text-xl">100+</div>
                  <div className="text-xs text-base-content/60 uppercase font-bold tracking-wider">Expert Instructors</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <div className="badge badge-primary badge-outline badge-lg mb-6 font-semibold p-4 shadow-sm">
              ✨ Never Stop Learning
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
              <span className="block mb-2">Grow your skills with</span>
              <GlitchText text="Coursiva" className="text-primary text-6xl lg:text-8xl font-black uppercase tracking-wide block drop-shadow-lg" />
            </h1>
            
            <p className="text-lg text-base-content/70 mb-10 max-w-xl leading-relaxed">
              Global training provider offering high-quality video, audio, and interactive classes for every learner — from kindergarten to college.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="join w-full shadow-lg rounded-full">
                <select 
                  className="select select-bordered join-item w-1/3 focus:outline-none"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Levels</option>
                  <option value="kindergarten">🧸 Kindergarten</option>
                  <option value="highschool">📐 High School</option>
                  <option value="college">🎓 College</option>
                </select>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Search any topic..." 
                    className="input input-bordered join-item w-full focus:outline-none focus:ring-0" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary join-item px-6">Search</button>
              </div>
            </form>

            <div className="mt-8 flex gap-6 text-sm text-base-content/60 font-medium">
              <span className="flex items-center gap-1">✅ Lifetime access</span>
              <span className="flex items-center gap-1">✅ Expert guidance</span>
            </div>
          </div>

        </div>
      </div>

      {/* Featured Courses Section */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Featured Courses</h2>
          <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
            Start your learning journey today with our most highly-rated and popular courses handpicked by experts.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner text-primary loading-lg"></span>
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-md mx-auto">
            <span>{error}</span>
          </div>
        ) : (
          <Carousel>
            {featuredCourses.map((course) => (
              <GlareCard key={(course as any)._id || course.id} className="w-full mx-2 h-full max-h-[420px]">
                <div className="card bg-base-100/90 backdrop-blur-md shadow-xl border border-base-200 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group h-full">
                  <figure className="h-56 relative overflow-hidden bg-base-300">
                  <img 
                    src={course.image || `https://placehold.co/600x400/6419e6/fff?text=${encodeURIComponent(course.title)}`} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="badge badge-primary font-bold shadow-md uppercase text-xs tracking-wider">
                      {course.category}
                    </span>
                  </div>
                </figure>
                <div className="card-body p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="card-title text-xl font-bold leading-tight line-clamp-2">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-base-content/60 text-sm line-clamp-2 flex-grow">
                    {course.description}
                  </p>
                  
                  <div className="mt-auto pt-4">
                    <div className="divider my-0 mb-2"></div>
                    <div className="flex justify-between items-center w-full mb-3">
                      <div className="flex items-center gap-1 text-warning font-bold">
                        <span>★</span>
                        <span>{parseFloat(course.rating?.toString() || '0').toFixed(1)}</span>
                      </div>
                      <div className="text-2xl font-extrabold text-primary">
                        ${course.price}
                      </div>
                    </div>
                    <Link to={`/courses/${(course as any)._id || course.id}`} className="btn btn-primary btn-sm w-full shadow-md text-base">
                      View Details
                    </Link>
                  </div>
                </div>
                </div>
              </GlareCard>
            ))}
          </Carousel>
        )}

        <div className="text-center mt-12">
          <Link to="/courses" className="btn btn-primary btn-lg shadow-lg hover:shadow-primary/50">
            Explore All Courses 🚀
          </Link>
        </div>
      </div>

      {/* Demo Mentors Section */}
      <div className="py-24 bg-base-200/30 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Learn from the Best</h2>
            <p className="text-base-content/60 text-lg max-w-2xl mx-auto">
              Our professional mentors are industry experts dedicated to your success.
            </p>
          </div>

          <Marquee speed={30}>
            {[
              { name: "Dr. Sarah Chen", role: "AI Research Scientist", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" },
              { name: "Marcus Johnson", role: "Senior Full-Stack Developer", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" },
              { name: "Elena Rodriguez", role: "UX Design Lead", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop" },
              { name: "David Kim", role: "Cloud Systems Architect", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop" },
              { name: "Anita Sharma", role: "Data Science Lead", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600&auto=format&fit=crop" },
              { name: "James Carter", role: "Cybersecurity Expert", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=600&auto=format&fit=crop" },
              { name: "Sophia Lee", role: "Product Manager", image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=600&auto=format&fit=crop" },
              { name: "Hassan Ali", role: "Mobile App Developer", image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=600&auto=format&fit=crop" },
              { name: "Mia Wong", role: "Machine Learning Engineer", image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=600&auto=format&fit=crop" },
              { name: "Thomas Wright", role: "Blockchain Developer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop" }
            ].map((mentor, i) => (
              <div key={i} className="relative group p-1 rounded-2xl bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-xy background-size-200 text-center w-72 flex-shrink-0 mx-4 cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="bg-base-100/90 backdrop-blur rounded-xl p-8 h-full flex flex-col items-center shadow-lg">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-base-100 shadow-xl mb-6 relative">
                    <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content mb-2 whitespace-normal">{mentor.name}</h3>
                  <p className="text-primary font-semibold text-sm m-0 whitespace-normal">{mentor.role}</p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
