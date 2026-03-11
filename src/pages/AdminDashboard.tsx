import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '../components/shared';
import { Users, FileText, BookOpen, CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [applications, setApplications] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const API_BASE = '/api/v1';

      const [usersRes, coursesRes, appsRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users`, { headers }),
        fetch(`${API_BASE}/admin/courses`, { headers }),
        fetch(`${API_BASE}/admin/applications`, { headers })
      ]);

      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.data);
      }
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data.data);
      }
      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplications(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const handleUpdateUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const token = localStorage.getItem('auth_token');
      const API_BASE = '/api/v1';
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to update user status", error);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      const API_BASE = '/api/v1';
      const res = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete course", error);
    }
  };

  // Secure route
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Top Navigation Bar inside Dashboard */}
      <div className="bg-base-100 border-b border-base-300 px-8 py-4 sticky top-[64px] z-40 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-sm text-base-content/60">Manage your platform operations and users</p>
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
              { id: 'applications', label: 'Mentor Applications', icon: <FileText className="w-5 h-5"/> },
              { id: 'users', label: 'User Directory', icon: <Users className="w-5 h-5"/> },
              { id: 'courses', label: 'Course Catalog', icon: <BookOpen className="w-5 h-5"/> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
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
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6 md:p-8">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {activeTab === 'applications' && 'Pending Mentor Applications'}
              {activeTab === 'users' && 'User Directory'}
              {activeTab === 'courses' && 'Global Course Catalog'}
            </h2>
            <div className="relative w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search records..." 
                className="input input-bordered w-full pl-10 bg-base-100 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card className="shadow-lg bg-base-100 border border-base-300 overflow-hidden">
            <div className="overflow-x-auto">
              
              {activeTab === 'applications' && (
                <table className="table w-full">
                  <thead className="bg-base-200 text-base-content/80">
                    <tr>
                      <th>Applicant Name</th>
                      <th>Expertise</th>
                      <th>Experience</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan={6} className="text-center py-8">Loading applications...</td></tr>
                    ) : (
                      applications.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase())).map(app => (
                        <tr key={app.id || app._id} className="hover">
                          <td className="font-semibold">{app.name}</td>
                          <td>{app.expertise}</td>
                          <td>{app.experience} Years</td>
                          <td className="text-base-content/70">{app.date}</td>
                          <td>
                            <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
                              {app.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" className="bg-base-100 shadow-sm"><ExternalLink className="w-4 h-4 mr-1"/> Resume</Button>
                              {app.status === 'pending' && (
                                 <>
                                  <Button variant="primary" size="sm" className="shadow-sm"><CheckCircle className="w-4 h-4"/></Button>
                                  <Button variant="danger" size="sm" className="shadow-sm"><XCircle className="w-4 h-4"/></Button>
                                 </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'users' && (
                <table className="table w-full">
                  <thead className="bg-base-200 text-base-content/80">
                    <tr>
                      <th>User</th>
                      <th>Email Address</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Account Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                       <tr><td colSpan={6} className="text-center py-8">Loading users...</td></tr>
                    ) : (
                      users.filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                        <tr key={u._id || u.id} className="hover">
                          <td className="font-bold flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                               {u.username.charAt(0).toUpperCase()}
                             </div>
                             {u.username}
                          </td>
                          <td className="text-base-content/70">{u.email}</td>
                          <td>
                            <Badge variant={u.role === 'admin' ? 'danger' : u.role === 'mentor' ? 'primary' : 'secondary'}>
                              {u.role.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="text-base-content/70">{new Date(u.createdAt || u.joinDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`flex items-center gap-2 text-sm font-semibold ${u.status === 'active' ? 'text-success' : 'text-error'}`}>
                              <div className={`w-2 h-2 rounded-full ${u.status === 'active' ? 'bg-success' : 'bg-error'}`}></div>
                              {u.status === 'active' ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="text-right">
                            <Button 
                              variant={u.status === 'active' ? "outline" : "primary"} 
                              size="sm" 
                              className={u.status === 'active' ? "bg-base-100 text-error hover:bg-error hover:text-white" : "shadow-sm"}
                              onClick={() => handleUpdateUserStatus(u._id || u.id, u.status)}
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'courses' && (
                <table className="table w-full">
                  <thead className="bg-base-200 text-base-content/80">
                    <tr>
                      <th>Course Title</th>
                      <th>Instructor</th>
                      <th>Category</th>
                      <th>Metrics</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                       <tr><td colSpan={6} className="text-center py-8">Loading courses...</td></tr>
                    ) : (
                      courses.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
                        <tr key={c._id || c.id} className="hover">
                          <td className="font-bold max-w-[250px] truncate" title={c.title}>{c.title}</td>
                          <td className="text-base-content/80">{c.instructor?.username || c.instructor || 'Unknown'}</td>
                          <td><Badge variant="secondary">{c.category}</Badge></td>
                          <td>
                            <div className="flex flex-col text-sm">
                              <span className="font-semibold text-primary">${c.price}</span>
                              <span className="text-base-content/60 text-xs">{c.students?.toLocaleString() || 0} enrolled</span>
                            </div>
                          </td>
                          <td>
                             <Badge variant={c.status === 'published' ? 'success' : 'warning'}>
                              {c.status?.toUpperCase() || 'PUBLISHED'}
                            </Badge>
                          </td>
                          <td className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-base-100 text-error hover:bg-error hover:text-white border-base-300 hover:border-error"
                              onClick={() => handleDeleteCourse(c._id || c.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

            </div>
            
            {/* Pagination Mock Footer */}
            <div className="bg-base-200 p-4 border-t border-base-300 flex justify-between items-center">
               <span className="text-sm text-base-content/70">Showing 1 to {activeTab === 'users' ? users.length : activeTab === 'courses' ? courses.length : applications.length} of entries</span>
               <div className="join">
                 <button className="join-item btn btn-sm btn-disabled">«</button>
                 <button className="join-item btn btn-sm bg-base-100">Page 1</button>
                 <button className="join-item btn btn-sm btn-disabled">»</button>
               </div>
            </div>

          </Card>
        </div>
      </div>
    </div>
  );
}
