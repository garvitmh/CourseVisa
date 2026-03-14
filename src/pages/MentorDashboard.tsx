import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardBody, Button, Badge, CloudinaryUploadWidget } from '../components/shared';
import { LayoutDashboard, BookOpen, PlusCircle, BarChart3, Settings, Users, Star, DollarSign, Image as ImageIcon, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currencies';

const CATEGORIES = [
  { value: 'kindergarten', label: 'Kindergarten' },
  { value: 'highschool', label: 'High School' },
  { value: 'college', label: 'College' },
  { value: 'computer', label: 'Computer Science' },
  { value: 'science', label: 'Science' },
  { value: 'engineering', label: 'Engineering' },
];

const EMPTY_COURSE = { title: '', description: '', price: '', category: '', image: '' };

type ToastType = { type: 'success' | 'error'; message: string } | null;

export default function MentorDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newCourse, setNewCourse] = useState(EMPTY_COURSE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);
  const [stats, setStats] = useState({ totalStudents: 0, totalEarnings: 0, rating: 4.8 });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (user?.role !== 'mentor' && user?.role !== 'admin') navigate('/');
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (user && (user.role === 'mentor' || user.role === 'admin')) {
      fetchMyCourses();
      fetchStats();
    }
  }, [user]);

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/v1/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const uid = (user as any)?._id || user?.id;
        const myCourses = data.data.filter((course: any) =>
          course.instructor === uid ||
          (course.instructor && (course.instructor._id === uid || course.instructor === uid))
        );
        setCourses(myCourses);
      }
    } catch (err) {
      console.error('Failed to fetch courses', err);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/v1/mentor/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setStats(data.data);
      }
    } catch (err) {
      // Stats endpoint may not exist yet — silently ignore
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!newCourse.title.trim() || newCourse.title.trim().length < 5)
      errors.title = 'Title must be at least 5 characters.';
    if (!newCourse.description.trim() || newCourse.description.trim().length < 20)
      errors.description = 'Description must be at least 20 characters.';
    if (!newCourse.category)
      errors.category = 'Please select a category.';
    const price = parseFloat(newCourse.price);
    if (isNaN(price) || price <= 0)
      errors.price = 'Price must be a positive number.';
    return errors;
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token'); // ← correct key
      const res = await fetch('/api/v1/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newCourse.title.trim(),
          description: newCourse.description.trim(),
          price: parseFloat(newCourse.price),
          category: newCourse.category,
          image: newCourse.image || undefined,
          subjectId: newCourse.title.trim().toLowerCase().replace(/\s+/g, '-'),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCourse(EMPTY_COURSE);
        fetchMyCourses();
        setActiveTab('courses');
        showToast('success', `"${data.data.title}" published successfully! It is now live in the course catalog.`);
      } else {
        showToast('error', data.error || 'Failed to publish course. Please try again.');
      }
    } catch (err) {
      console.error('Failed to create course', err);
      showToast('error', 'Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMentorCourse = async (courseId: string, courseTitle: string) => {
    if (!window.confirm(`Unpublish "${courseTitle}"? It will be removed from the catalog immediately.`)) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/v1/courses/${courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchMyCourses();
        showToast('success', `"${courseTitle}" has been unpublished.`);
      } else {
        showToast('error', 'Failed to unpublish. You may not have permission.');
      }
    } catch (err) {
      console.error('Failed to delete course', err);
      showToast('error', 'Network error. Please try again.');
    }
  };

  // Stable upload callback so CloudinaryWidget does not re-initialize on every keystroke
  const handleImageUpload = useCallback((url: string) => {
    setNewCourse(prev => ({ ...prev, image: url }));
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.value;
    setNewCourse(prev => ({ ...prev, [field]: val }));
    if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
  };

  if (!user || (user.role !== 'mentor' && user.role !== 'admin')) return null;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-[999] flex items-start gap-3 p-4 rounded-xl shadow-2xl max-w-sm border backdrop-blur-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="bg-base-100 border-b border-base-300 px-8 py-4 sticky top-[64px] z-40 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mentor Portal</h1>
          <p className="text-sm text-base-content/60">Manage your courses, students, and earnings</p>
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
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5"/> },
              { id: 'courses', label: 'My Courses', icon: <BookOpen className="w-5 h-5"/> },
              { id: 'create', label: 'Create Course', icon: <PlusCircle className="w-5 h-5"/> },
              { id: 'earnings', label: 'Financials', icon: <BarChart3 className="w-5 h-5"/> },
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
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8">

          {activeTab === 'overview' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-50 text-primary group-hover:scale-110 transition-transform"><Users className="w-12 h-12" /></div>
                   <CardBody className="p-6">
                     <div className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-1">Total Students</div>
                     <div className="text-4xl font-black">{stats.totalStudents.toLocaleString()}</div>
                   </CardBody>
                </Card>
                <Card className="bg-base-100 border border-base-300 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-50 text-warning group-hover:scale-110 transition-transform"><Star className="w-12 h-12" /></div>
                   <CardBody className="p-6">
                     <div className="text-sm font-bold text-base-content/60 uppercase tracking-wider mb-1">Avg. Rating</div>
                     <div className="text-4xl font-black">{stats.rating.toFixed(1)}</div>
                     <div className="text-base-content/60 text-sm font-semibold mt-2">Across {courses.length} courses</div>
                   </CardBody>
                </Card>
                <Card className="bg-success text-success-content shadow-sm relative overflow-hidden group col-span-1 lg:col-span-2">
                   <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><DollarSign className="w-24 h-24" /></div>
                   <CardBody className="p-6">
                     <div className="text-sm font-bold text-success-content/80 uppercase tracking-wider mb-1">Total Earnings</div>
                     <div className="text-5xl font-black">{formatCurrency(stats.totalEarnings)}</div>
                     <div className="text-success-content font-semibold mt-2">Lifetime revenue generated</div>
                     <Button className="mt-4 bg-white text-success border-none hover:bg-base-200 self-start" onClick={() => setActiveTab('earnings')}>View Financials</Button>
                   </CardBody>
                </Card>
              </div>

              <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
              {courses.length === 0 ? (
                 <div className="bg-base-100 p-8 rounded-xl border border-base-300 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
                    <h3 className="text-lg font-bold mb-2">No courses yet</h3>
                    <p className="text-base-content/60 mb-4">You haven't published any courses yet. Start sharing your knowledge!</p>
                    <Button variant="primary" onClick={() => setActiveTab('create')}>Create First Course</Button>
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {courses.slice(0, 3).map(course => (
                    <Card key={course._id} className="bg-base-100 border border-base-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="h-32 bg-base-200 relative">
                        {course.image ? <img src={course.image} alt={course.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-base-content/30"><ImageIcon className="w-10 h-10" /></div>}
                      </div>
                      <CardBody className="p-5">
                        <h3 className="font-bold text-lg mb-1 truncate" title={course.title}>{course.title}</h3>
                        <p className="text-primary font-bold mb-3">{formatCurrency(course.price)}</p>
                        <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab('courses')}>Manage Course</Button>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="animate-fadeIn max-w-3xl">
              <Card className="bg-base-100 border border-base-300 shadow-sm">
                <CardHeader className="border-b border-base-200 pb-4">
                  <h2 className="text-2xl font-bold">Create New Course</h2>
                  <p className="text-base-content/60 text-sm">Fill in the details below to publish a new course to the catalog.</p>
                </CardHeader>
                <CardBody className="pt-6">
                   <form onSubmit={handleCreateCourse} className="flex flex-col gap-6" noValidate>

                     {/* Title */}
                     <div className="flex flex-col gap-1">
                       <label className="font-semibold text-base-content">Course Title <span className="text-error">*</span></label>
                       <input
                         type="text"
                         className={`input input-bordered w-full bg-base-100 ${formErrors.title ? 'input-error' : ''}`}
                         value={newCourse.title}
                         onChange={handleChange('title')}
                         placeholder="e.g. Advanced React Patterns"
                       />
                       {formErrors.title && <span className="text-error text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.title}</span>}
                     </div>

                     {/* Description */}
                     <div className="flex flex-col gap-1">
                       <label className="font-semibold text-base-content">Description <span className="text-error">*</span></label>
                       <textarea
                         rows={5}
                         className={`textarea textarea-bordered w-full text-base focus:outline-none bg-base-100 ${formErrors.description ? 'textarea-error' : ''}`}
                         value={newCourse.description}
                         onChange={handleChange('description')}
                         placeholder="Describe what students will learn in at least 20 characters..."
                       />
                       {formErrors.description && <span className="text-error text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.description}</span>}
                     </div>

                     {/* Price + Category */}
                     <div className="grid grid-cols-2 gap-6">
                       <div className="flex flex-col gap-1">
                         <label className="font-semibold text-base-content">Price (INR) <span className="text-error">*</span></label>
                         <input
                           type="number"
                           min="1"
                           step="1"
                           className={`input input-bordered w-full bg-base-100 ${formErrors.price ? 'input-error' : ''}`}
                           value={newCourse.price}
                           onChange={handleChange('price')}
                           placeholder="e.g. 1499"
                         />
                         {formErrors.price && <span className="text-error text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.price}</span>}
                       </div>
                       <div className="flex flex-col gap-1">
                         <label className="font-semibold text-base-content">Category <span className="text-error">*</span></label>
                         <select
                           className={`select select-bordered w-full bg-base-100 ${formErrors.category ? 'select-error' : ''}`}
                           value={newCourse.category}
                           onChange={handleChange('category')}
                         >
                           <option value="">Select a category...</option>
                           {CATEGORIES.map(c => (
                             <option key={c.value} value={c.value}>{c.label}</option>
                           ))}
                         </select>
                         {formErrors.category && <span className="text-error text-sm flex items-center gap-1"><AlertCircle className="w-3 h-3" />{formErrors.category}</span>}
                       </div>
                     </div>

                     {/* Thumbnail */}
                     <div className="flex flex-col gap-2 p-6 border border-base-300 rounded-xl bg-base-200/50 mt-2">
                       <label className="font-bold border-b border-base-300 pb-2 mb-2 flex items-center gap-2">
                         <ImageIcon className="w-5 h-5"/> Course Thumbnail <span className="text-base-content/40 text-xs font-normal">(optional)</span>
                       </label>
                       <div className="flex items-center gap-6">
                         {newCourse.image ? (
                           <div className="h-32 w-48 rounded-lg overflow-hidden border border-base-300 shadow-inner">
                             <img src={newCourse.image} alt="Preview" className="w-full h-full object-cover" />
                           </div>
                         ) : (
                           <div className="h-32 w-48 rounded-lg border-2 border-dashed border-base-300 flex items-center justify-center text-base-content/40 bg-base-100 text-sm">
                             No image yet
                           </div>
                         )}
                         <div className="flex-1">
                           <p className="text-sm text-base-content/60 mb-4">Upload a high-quality 16:9 thumbnail to attract more students.</p>
                           <CloudinaryUploadWidget
                             cloudName="dgkzstbui"
                             uploadPreset="e-learning"
                             onUploadSuccess={handleImageUpload}
                           />
                           {newCourse.image && (
                             <button type="button" className="text-error text-sm mt-2 hover:underline" onClick={() => setNewCourse(prev => ({ ...prev, image: '' }))}>Remove image</button>
                           )}
                         </div>
                       </div>
                     </div>

                     {/* Actions */}
                     <div className="flex justify-end gap-4 mt-6">
                        <Button variant="outline" type="button" onClick={() => { setActiveTab('overview'); setFormErrors({}); }}>Cancel</Button>
                        <Button variant="primary" type="submit" disabled={isSubmitting} className="shadow-md px-8">
                          {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : <><PlusCircle className="w-4 h-4 mr-2"/>Publish Course</>}
                        </Button>
                     </div>
                   </form>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">My Published Courses</h2>
                <Button variant="primary" onClick={() => setActiveTab('create')}><PlusCircle className="w-4 h-4 mr-2"/> New Course</Button>
              </div>

              {courses.length === 0 ? (
                 <div className="bg-base-100 p-12 rounded-xl border border-base-300 text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-base-content/20 mb-4" />
                    <h3 className="text-xl font-bold mb-2">Your Catalog is Empty</h3>
                    <p className="text-base-content/60 mb-6">Create courses to start sharing knowledge and earning revenue.</p>
                    <Button variant="primary" onClick={() => setActiveTab('create')}>Get Started</Button>
                 </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {courses.map(course => (
                    <div key={course._id} className="bg-base-100 border border-base-300 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex gap-4 items-center w-full sm:w-auto">
                        <div className="w-24 h-16 rounded-md overflow-hidden bg-base-200 shrink-0">
                           {course.image ? <img src={course.image} className="w-full h-full object-cover" alt={course.title}/> : <div className="w-full h-full flex items-center justify-center text-base-content/30"><ImageIcon className="w-6 h-6"/></div>}
                        </div>
                        <div>
                          <h3 className="m-0 mb-1 font-bold text-lg truncate max-w-[300px]" title={course.title}>{course.title}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant="secondary">{course.category}</Badge>
                            <span className="font-semibold text-primary">{formatCurrency(course.price)}</span>
                            <Link to={`/courses/${course._id}`} className="text-base-content/50 hover:text-primary text-xs underline">View Live →</Link>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                        <Link to={`/courses/${course._id}`} className="flex-1 sm:flex-none">
                          <Button variant="outline" size="sm" className="w-full">Preview</Button>
                        </Link>
                        <Button variant="danger" size="sm" className="flex-1 sm:flex-none" onClick={() => handleDeleteMentorCourse(course._id, course.title)}>Unpublish</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">Financial Reports</h2>
              <div className="bg-base-100 p-8 rounded-xl border border-base-300 text-center mb-8">
                <BarChart3 className="w-16 h-16 mx-auto text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Analytics Coming Soon</h3>
                <p className="text-base-content/60 max-w-lg mx-auto">We are building a robust charting experience to show your revenue growth, student demographics, and course performance.</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
