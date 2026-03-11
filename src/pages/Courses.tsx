import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useDebounce } from '../hooks';
import { SplitText } from '../components/animations/SplitText';
import { AnimatedList } from '../components/animations/AnimatedList';

const CATEGORY_EMOJIS: Record<string, string> = {
  all: '🗂️',
  kindergarten: '🧸',
  highschool: '📐',
  college: '🎓',
  computer: '💻',
  science: '🔬',
  engineering: '⚙️',
};

const CATEGORY_COLORS: Record<string, string> = {
  kindergarten: 'badge-warning',
  highschool: 'badge-success',
  college: 'badge-info',
  computer: 'badge-primary',
  science: 'badge-accent',
  engineering: 'badge-secondary',
};

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('cat') || 'all';
  });
  
  const [searchTerm, setSearchTerm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.courses.getAll();
        if (res.success) {
          setCourses(res.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    let filtered = selectedCategory === 'all'
      ? courses
      : courses.filter(course => course.category === selectedCategory);

    if (debouncedSearchTerm) {
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(lowerSearch) ||
        course.category.toLowerCase().includes(lowerSearch) ||
        (course.description || '').toLowerCase().includes(lowerSearch)
      );
    }
    return filtered;
  }, [selectedCategory, debouncedSearchTerm, courses]);

  const categories = [
    { key: 'all', label: 'All Courses' },
    { key: 'kindergarten', label: 'Kindergarten' },
    { key: 'highschool', label: 'High School' },
    { key: 'college', label: 'College' },
    { key: 'computer', label: 'Computer' },
    { key: 'science', label: 'Science' },
    { key: 'engineering', label: 'Engineering' },
  ];

  const renderStars = (rating: number) => {
    const stars = Math.round(rating || 5);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Dynamic Hero Banner */}
      <div className="bg-base-200 py-16 px-4 border-b border-base-300 relative overflow-hidden">
        {/* Soft decorative blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          
          <h1 className="text-5xl lg:text-6xl font-extrabold text-base-content mb-4 tracking-tight">
            <SplitText text="Explore Our Courses" delay={50} className="inline-block" />
          </h1>
          
          <p className="text-xl text-base-content/70 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            From kindergarten to college — find the perfect course for every stage of your learning journey.
          </p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto shadow-2xl rounded-full bg-base-100 p-2 flex border border-base-300">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl opacity-50">🔍</span>
            <input
              type="search"
              placeholder="Search any course, topic or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none pl-14 pr-4 py-3 text-lg focus:outline-none text-base-content"
            />
            <button className="btn btn-primary rounded-full px-8">Search</button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`btn btn-sm rounded-full gap-2 transition-all duration-300 ${
                selectedCategory === cat.key
                  ? 'btn-primary shadow-lg scale-105 px-6'
                  : 'btn-ghost bg-base-200 border border-base-300 hover:border-primary hover:bg-base-300'
              }`}
            >
              <span className="text-lg">{CATEGORY_EMOJIS[cat.key]}</span>
              <span className="font-semibold">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-base-300">
          <h2 className="text-2xl font-extrabold text-base-content">
            Showing <span className="text-primary">{filteredCourses.length}</span> courses
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.key === selectedCategory)?.label}`}
          </h2>
          {debouncedSearchTerm && (
            <span className="badge badge-lg">Search: "{debouncedSearchTerm}"</span>
          )}
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="loading loading-spinner text-primary loading-lg"></span>
            <p className="text-base-content/60 font-medium">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error max-w-md mx-auto shadow-lg">
            <span>{error}</span>
            <button className="btn btn-sm" onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-32 bg-base-200 rounded-3xl border border-base-300 border-dashed">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-2xl font-bold mb-2 text-base-content">No courses found</h3>
            <p className="text-base-content/60 mb-6 max-w-md mx-auto">We couldn't find anything matching your search criteria. Try adjusting your filters.</p>
            <button className="btn btn-primary" onClick={() => { setSelectedCategory('all'); setSearchTerm(''); }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <AnimatedList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course: any) => (
              <div
                key={course._id}
                className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300 group flex flex-col h-full"
              >
                {/* Card Image */}
                <figure className="relative overflow-hidden h-48 bg-base-300">
                  <img
                    src={course.image || `https://placehold.co/600x400/6419e6/fff?text=${encodeURIComponent(course.title)}`}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${CATEGORY_COLORS[course.category] || 'badge-neutral'} badge-md shadow-md font-bold uppercase tracking-wider text-[10px]`}>
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300 translate-y-4 group-hover:translate-y-0 text-sm">Preview Course ▶</span>
                  </div>
                </figure>
                
                <div className="card-body p-6 flex-grow flex flex-col">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-warning text-sm tracking-widest">{renderStars(course.rating)}</span>
                    <span className="text-xs text-base-content/60 font-semibold">({course.rating?.toFixed(1) || '5.0'})</span>
                  </div>

                  <h2 className="card-title text-xl font-extrabold line-clamp-2 leading-tight mb-2 text-base-content group-hover:text-primary transition-colors">
                    {course.title}
                  </h2>
                  
                  <p className="text-sm text-base-content/70 line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-base-200">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-success font-bold uppercase tracking-wider">Top Rated</span>
                        <span className="text-2xl font-extrabold text-base-content">${course.price}</span>
                      </div>
                      <Link to={`/courses/${course._id}`} className="btn btn-primary">
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedList>
        )}
      </div>
    </div>
  );
}
