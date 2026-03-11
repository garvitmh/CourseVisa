import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Badge } from '../components/shared';
import { GraduationCap, LayoutDashboard, Award, Settings, BookOpen, Clock, PlayCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('learning');
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  // Realistic Enterprise Mock Data
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setEnrolledCourses([
          { 
            id: '1', 
            title: 'Full-Stack React & Node.js', 
            progress: 65, 
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', 
            instructor: 'Marcus Johnson',
            nextLesson: 'Building the Authentication API',
            totalLessons: 42,
            completedLessons: 27
          },
          { 
            id: '2', 
            title: 'Data Structures & Algorithms', 
            progress: 12, 
            image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80', 
            instructor: 'Dr. Sarah Chen',
            nextLesson: 'Big O Notation In Depth',
            totalLessons: 85,
            completedLessons: 10
          },
          { 
            id: '3', 
            title: 'Advanced Web Design', 
            progress: 100, 
            image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80', 
            instructor: 'Elena Rodriguez',
            nextLesson: null,
            totalLessons: 30,
            completedLessons: 30
          }
        ]);
      }, 600);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const inProgressCourses = enrolledCourses.filter(c => c.progress < 100);
  const completedCourses = enrolledCourses.filter(c => c.progress === 100);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 border-b border-base-300 px-8 py-4 sticky top-[64px] z-40 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Student Portal</h1>
          <p className="text-sm text-base-content/60">Track your progress and access your courses</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="primary" className="py-3 px-4 shadow-sm font-semibold">Welcome, {user.username}</Badge>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar */}
        <div className="w-full md:w-64 p-6 shrink-0 border-r border-base-300 bg-base-100/50 min-h-[calc(100vh-140px)]">
          <div className="text-xs uppercase font-bold text-base-content/50 tracking-widest mb-4 px-4">Menu</div>
          <div className="flex flex-col gap-2">
            {[
              { id: 'learning', label: 'My Learning', icon: <BookOpen className="w-5 h-5"/> },
              { id: 'achievements', label: 'Certificates', icon: <Award className="w-5 h-5"/> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-content shadow-md'
                    : 'text-base-content/70 hover:bg-base-300 hover:text-base-content'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            <div className="divider my-2"></div>
            <Link to="/profile" className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold text-base-content/70 hover:bg-base-300 hover:text-base-content transition-all duration-200">
              <Settings className="w-5 h-5" /> Account Settings
            </Link>
            {user.role === 'student' && (
              <Link to="/mentor" className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold text-base-content/70 hover:bg-base-300 hover:text-base-content transition-all duration-200 mt-2 bg-gradient-to-r hover:from-primary/10 hover:to-transparent">
                <GraduationCap className="w-5 h-5 text-primary" /> Become a Mentor
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8">
          
          {activeTab === 'learning' && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 text-primary group-hover:scale-110 transition-transform"><BookOpen className="w-16 h-16" /></div>
                   <CardBody className="p-6">
                     <div className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-1">In Progress</div>
                     <div className="text-4xl font-black">{inProgressCourses.length}</div>
                   </CardBody>
                </Card>
                <Card className="bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 text-success group-hover:scale-110 transition-transform"><Award className="w-16 h-16" /></div>
                   <CardBody className="p-6">
                     <div className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-1">Completed</div>
                     <div className="text-4xl font-black">{completedCourses.length}</div>
                   </CardBody>
                </Card>
                <Card className="bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 text-accent group-hover:scale-110 transition-transform"><Clock className="w-16 h-16" /></div>
                   <CardBody className="p-6">
                     <div className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-1">Learning Hours</div>
                     <div className="text-4xl font-black">12.5h</div>
                     <div className="text-success text-sm font-semibold mt-2">+2.5h this week</div>
                   </CardBody>
                </Card>
              </div>

              {inProgressCourses.length > 0 && (
                <>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><PlayCircle className="w-5 h-5 text-primary"/> Continue Learning</h2>
                  <div className="grid grid-cols-1 gap-4 mb-10">
                    {inProgressCourses.map(course => (
                      <Card key={course.id} className="bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="w-full md:w-64 h-40 shrink-0 relative">
                             <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                               <PlayCircle className="w-16 h-16 text-white" />
                             </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                             <div>
                               <div className="flex justify-between items-start mb-1">
                                 <h3 className="font-bold text-xl">{course.title}</h3>
                                 <span className="font-semibold text-primary">{course.progress}%</span>
                               </div>
                               <p className="text-base-content/60 text-sm mb-4">Instructor: {course.instructor}</p>
                               
                               <div className="w-full bg-base-300 rounded-full h-2 mb-4 overflow-hidden">
                                 <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }}></div>
                               </div>
                             </div>
                             
                             <div className="flex justify-between items-center bg-base-200 p-3 rounded-lg border border-base-300">
                               <div className="flex items-center gap-2 text-sm">
                                  <span className="font-bold text-base-content/50 uppercase tracking-wider text-xs">Up Next:</span>
                                  <span className="font-semibold truncate max-w-[200px] md:max-w-none">{course.nextLesson}</span>
                               </div>
                               <Button variant="primary" size="sm" className="shadow-sm pl-3 pr-4">
                                  <PlayCircle className="w-4 h-4 mr-2"/> Resume
                               </Button>
                             </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {completedCourses.length > 0 && (
                <>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-success"/> Completed Courses</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedCourses.map(course => (
                      <Card key={course.id} className="bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
                        <div className="h-40 w-full relative group">
                          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 right-2 bg-success text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-md">Completed</div>
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                            <Button variant="primary" className="shadow-lg">View Certificate</Button>
                          </div>
                        </div>
                        <CardBody className="p-4">
                          <h3 className="font-bold text-lg mb-1 truncate" title={course.title}>{course.title}</h3>
                          <p className="text-base-content/60 text-sm">Instructor: {course.instructor}</p>
                          <div className="mt-4 pt-4 border-t border-base-200 flex justify-between items-center">
                            <span className="text-xs text-base-content/50 font-bold uppercase tracking-wider">Course Passed</span>
                            <Button variant="outline" size="sm">Review Course</Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              
              {enrolledCourses.length === 0 && (
                 <div className="bg-base-100 p-12 rounded-xl border border-base-300 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                    <h3 className="text-xl font-bold mb-2">You aren't enrolled in any courses yet</h3>
                    <p className="text-base-content/60 mb-6 max-w-sm mx-auto">Explore our catalog and find the perfect course to kickstart your learning journey.</p>
                    <Link to="/courses">
                      <Button variant="primary">Explore Catalog</Button>
                    </Link>
                 </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="w-6 h-6 text-warning"/> Certificates & Achievements</h2>
              {completedCourses.length > 0 ? (
                <div className="bg-base-100 border border-base-300 p-8 rounded-xl shadow-sm text-center">
                   <h3 className="text-xl font-bold mb-2">You have {completedCourses.length} certificate(s) available</h3>
                   <p className="text-base-content/60 mb-6">Download your certificates and share them on LinkedIn.</p>
                   <div className="flex flex-col gap-4 max-w-lg mx-auto">
                     {completedCourses.map(course => (
                       <div key={course.id} className="flex justify-between items-center p-4 bg-base-200 rounded-lg border border-base-300">
                         <div className="font-bold truncate max-w-[200px]">{course.title}</div>
                         <Button variant="primary" size="sm">Download PDF</Button>
                       </div>
                     ))}
                   </div>
                </div>
              ) : (
                <div className="bg-base-100 p-12 rounded-xl border border-base-300 text-center">
                  <Award className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Certificates Yet</h3>
                  <p className="text-base-content/60">Complete a course to earn your first certificate.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
