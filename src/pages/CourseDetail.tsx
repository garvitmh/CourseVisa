import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../hooks';

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('curriculum');
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const res = await api.courses.getById(id);
        if (res.success) {
          setCourse(res.data);
          if (res.data.videos?.length > 0) {
            setSelectedVideo(res.data.videos[0]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <span className="loading loading-ring loading-lg text-primary"></span>
    </div>
  );

  if (error || !course) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="text-8xl">😕</div>
      <h2 className="text-3xl font-extrabold">{error || 'Course Not Found'}</h2>
      <Link to="/courses" className="btn btn-outline btn-primary mt-4">← Back to Courses</Link>
    </div>
  );

  const videos = course.videos || [];
  const inCart = isInCart(course._id);

  return (
    <div className="min-h-screen bg-base-100 pb-20">
      
      {/* 1. HERO BREADCRUMB STRIP */}
      <div className="bg-neutral text-neutral-content">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 text-sm breadcrumbs">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li className="font-semibold">{course.title}</li>
          </ul>
        </div>
      </div>

      {/* 2. DYNAMIC HERO SECTION */}
      <div className="bg-base-200 py-12 border-b border-base-300 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid lg:grid-cols-[1fr_400px] gap-12 items-start relative z-10">
          
          {/* Main Info */}
          <div className="flex flex-col gap-6">
            <div className="flex gap-2">
              <div className="badge badge-primary badge-lg uppercase font-bold tracking-widest">{course.category}</div>
              {course.rating && (
                <div className="badge badge-warning badge-lg font-bold gap-1 shadow-sm">
                  <span className="text-xs">⭐</span> {parseFloat(course.rating).toFixed(1)}
                </div>
              )}
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-base-content">
              {course.title}
            </h1>
            
            <p className="text-lg md:text-xl text-base-content/70 leading-relaxed max-w-3xl">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-10">
                    <span className="font-bold">🧑‍🏫</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-base-content/50 uppercase font-semibold">Created by</div>
                  <div className="font-bold text-base-content">{course.instructor?.username || 'Coursiva Expert'}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-sm font-medium"><span className="text-lg">📺</span> {videos.length} Lectures</span>
                <span className="flex items-center gap-2 text-sm font-medium"><span className="text-lg">🌐</span> English</span>
              </div>
            </div>
          </div>

          {/* Sticky Enrollment Card / Video Preview */}
          <div className="lg:-mt-24 lg:sticky lg:top-24 z-20">
            <div className="card bg-base-100 shadow-2xl border border-base-300 overflow-hidden group">
              {/* Preview image or video player if one is selected */}
              <figure className="relative max-h-[260px] bg-base-300">
                {selectedVideo ? (
                  <div className="w-full aspect-video bg-black flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${course.image})` }}></div>
                    <div className="z-10 text-center p-6 text-white max-w-full">
                      <div className="text-4xl mb-3">▶️</div>
                      <h4 className="font-bold truncate" title={selectedVideo.title}>{selectedVideo.title}</h4>
                      <p className="text-white/60 text-sm mt-1">{selectedVideo.duration || '10:00'} min</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img 
                      src={course.image || `https://placehold.co/600x400/6419e6/fff?text=${encodeURIComponent(course.title)}`}
                      alt={course.title} 
                      className="w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button className="btn btn-circle btn-lg border-none bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-black">
                        ▶️
                      </button>
                    </div>
                  </>
                )}
              </figure>

              <div className="card-body p-6">
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-4xl font-extrabold text-base-content">${course.price}</span>
                  <span className="text-xl text-base-content/40 line-through font-medium block pb-1">
                    ${Math.floor(course.price * 1.4)}
                  </span>
                  <div className="badge badge-success text-[10px] font-bold py-3 uppercase tracking-widest text-success-content ml-auto">
                    30% Off
                  </div>
                </div>

                <div className="w-full bg-error-content/20 text-error rounded-md py-2 px-3 text-xs font-bold flex items-center gap-2 mb-4">
                  <span>⏱️</span> 12 hours left at this price!
                </div>

                {inCart ? (
                  <Link to="/cart" className="btn btn-success btn-block shadow-lg text-lg h-14">
                    View in Cart 🛒
                  </Link>
                ) : (
                  <button 
                    onClick={() => addToCart({
                      id: course._id, subjectId: 'course', category: course.category,
                      title: course.title, rating: course.rating, price: course.price,
                      image: course.image, description: course.description
                    } as any)}
                    className="btn btn-primary btn-block shadow-lg text-lg h-14"
                  >
                    Add to Cart
                  </button>
                )}
                
                <p className="text-center text-xs text-base-content/50 mt-4 leading-relaxed font-medium">
                  30-Day Money-Back Guarantee
                </p>

                <div className="divider my-4"></div>

                <h4 className="font-bold text-sm mb-3">This course includes:</h4>
                <ul className="space-y-3 text-sm text-base-content/80 font-medium">
                  <li className="flex gap-3"><span className="text-lg">📺</span> {videos.length || '15+'} on-demand videos</li>
                  <li className="flex gap-3"><span className="text-lg">📱</span> Access on mobile and TV</li>
                  <li className="flex gap-3"><span className="text-lg">♾️</span> Full lifetime access</li>
                  <li className="flex gap-3"><span className="text-lg">🏆</span> Certificate of completion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABS AND CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 grid lg:grid-cols-[1fr_400px] gap-12">
        
        {/* Left Column - Main Details */}
        <div className="min-w-0">
          <div role="tablist" className="tabs tabs-bordered w-full mb-8 font-semibold">
            {['curriculum', 'overview', 'instructor'].map(tab => (
              <a 
                role="tab" 
                key={tab} 
                className={`tab tab-lg px-8 transition-colors ${activeTab === tab ? 'tab-active text-primary border-primary' : 'text-base-content/50 hover:text-base-content'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' ? '📋 Overview' : tab === 'curriculum' ? '📚 Curriculum' : '🧑‍🏫 Instructor'}
              </a>
            ))}
          </div>

          <div className="animate-fade-in">
            {activeTab === 'overview' && (
              <div className="space-y-10">
                <div className="card bg-base-200 border border-base-300">
                  <div className="card-body p-6 sm:p-8">
                    <h2 className="text-2xl font-extrabold mb-6">What you'll learn</h2>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                      {[
                        "Master the foundational concepts thoroughly and confidently",
                        "Build incredibly complex, real-world level applications",
                        "Learn best practices directly from industry experts",
                        "Optimize applications for maximum speed and scale"
                      ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-base-content/80 font-medium">
                          <span className="text-success text-xl">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-extrabold mb-4">Description</h2>
                  <div className="prose prose-base pr-4 text-base-content/70 max-w-none">
                    <p className="leading-relaxed">
                      {course.description}
                    </p>
                    <p className="leading-relaxed mt-4">
                      This comprehensive curriculum is designed to take you from an absolute beginner to an advanced professional. Every section is packed full of actionable advice, deep dives into core theory, and extensive hands-on exercises so you are fully prepared for the real world.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div>
                <div className="flex justify-between items-end mb-6">
                  <h2 className="text-2xl font-extrabold">Course Content</h2>
                  <div className="text-sm font-medium text-base-content/60">
                    {videos.length} sections • {(videos.length * 15) || 0}m total length
                  </div>
                </div>

                {videos.length === 0 ? (
                  <div className="alert alert-warning shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Curriculum videos are still being processed by the instructor. Enroll today to guarantee your spot!</span>
                  </div>
                ) : (
                  <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden divide-y divide-base-200">
                    {videos.map((vid: any, i: number) => (
                      <button 
                        key={vid._id || i}
                        onClick={() => setSelectedVideo(vid)}
                        className={`w-full text-left p-5 flex items-center justify-between gap-4 transition-all ${
                          selectedVideo?._id === vid._id 
                            ? 'bg-primary/5 border-l-4 border-l-primary' 
                            : 'hover:bg-base-200 border-l-4 border-l-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                            selectedVideo?._id === vid._id ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/60'
                          } font-bold text-sm shrink-0`}>
                            {i + 1}
                          </div>
                          <div>
                            <div className={`font-semibold truncate ${selectedVideo?._id === vid._id ? 'text-primary' : ''}`}>
                              {vid.title}
                            </div>
                            <div className="text-xs text-base-content/50 mt-1 flex items-center gap-1 font-medium">
                              <span>▶️</span> Video
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-mono text-base-content/60 shrink-0 bg-base-200 px-2 py-1 rounded">
                          {vid.duration || '12:00'}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="card bg-base-200 border border-base-300">
                <div className="card-body p-8">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="avatar">
                      <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center bg-base-300 text-4xl">
                        🧑‍🏫
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold mb-1">
                        {course.instructor?.username || 'Coursiva Expert Partner'}
                      </h2>
                      <p className="text-primary font-bold mb-4">{course.category} Specialist Educator</p>
                      
                      <div className="flex flex-wrap gap-4 mb-4 text-sm font-medium">
                        <span className="flex items-center gap-2"><span className="text-lg">⭐</span> 4.8 Instructor Rating</span>
                        <span className="flex items-center gap-2"><span className="text-lg">🎓</span> 124k+ Students</span>
                        <span className="flex items-center gap-2"><span className="text-lg">🎬</span> 14 Courses</span>
                      </div>
                      
                      <p className="text-base-content/80 text-sm leading-relaxed max-w-2xl">
                        Our instructors bring deep industry experience to their teaching. We heavily vet all teachers to guarantee you only receive accurate, up-to-date, and meticulously designed educational content.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column placeholder for alignment in large screens */}
        <div className="hidden lg:block relative -z-10"></div>
      </div>
    </div>
  );
}
