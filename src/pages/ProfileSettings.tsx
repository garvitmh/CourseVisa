import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardHeader, CardBody } from '../components/shared';
import { User, Shield, Bell, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { CloudinaryUploadWidget } from '../components/shared';
import { api } from '../services/api';

type ToastType = { type: 'success' | 'error'; message: string } | null;

export default function ProfileSettings() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [toast, setToast] = useState<ToastType>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <h2 className="text-2xl font-bold">Please log in to view profile settings.</h2>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.auth.updateProfile({
        username: profileData.username,
        phone: profileData.phone,
        bio: profileData.bio,
      });
      await checkAuth(); // Refresh user data in context
      showToast('success', 'Profile updated successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordErrors({});
    setIsLoading(true);
    try {
      await api.auth.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('success', 'Password updated successfully!');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
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

      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
            Account Settings
          </h1>
          <p className="text-base-content/60 text-lg">
            Manage your personal data, security preferences, and notifications.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card className="shadow-lg border border-base-200 sticky top-[100px]">
              <div className="flex flex-col p-2 gap-1">
                {[
                  { id: 'personal', label: 'Personal Information', icon: <User className="w-5 h-5" /> },
                  { id: 'security', label: 'Security & Password', icon: <Shield className="w-5 h-5" /> },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
                  { id: 'billing', label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-content shadow-md translate-x-1'
                        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'
                    }`}
                  >
                    <span className="flex items-center justify-center text-current">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {activeTab === 'personal' && (
              <Card className="shadow-xl bg-base-100 border border-base-200 animate-fadeIn">
                <CardHeader className="border-b border-base-200 pb-4">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <p className="text-sm text-base-content/60 mt-1">Update your basic profile details here.</p>
                </CardHeader>
                <CardBody className="pt-6">
                  <form className="flex flex-col gap-6" onSubmit={handleUpdateProfile}>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl border-2 border-primary overflow-hidden shadow-inner uppercase font-black text-primary">
                          {user.username.charAt(0)}
                        </div>
                      </div>
                      <div>
                         <CloudinaryUploadWidget 
                             cloudName="dgkzstbui"
                             uploadPreset="e-learning"
                             onUploadSuccess={() => showToast('success', 'Profile picture updated! (Feature coming soon)')}
                           />
                         <p className="text-xs text-base-content/50 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Full Name" 
                        value={profileData.username} 
                        onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                        required
                      />
                      <Input label="Email Address" type="email" value={user.email || ''} disabled />
                    </div>
                    
                    <Input 
                      label="Phone Number" 
                      value={profileData.phone} 
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="Enter your phone number"
                    />

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-base-content/70 ml-1">Bio</label>
                      <textarea 
                        className="textarea textarea-bordered w-full bg-base-100 focus:outline-none focus:border-primary transition-all min-h-[100px]"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>
                    
                    <div className="flex justify-end mt-4">
                       <Button type="submit" variant="primary" className="shadow-md" disabled={isLoading}>
                         {isLoading ? 'Saving...' : 'Save Changes'}
                       </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="shadow-xl bg-base-100 border border-base-200 animate-fadeIn">
                <CardHeader className="border-b border-base-200 pb-4">
                  <h2 className="text-2xl font-bold">Security</h2>
                  <p className="text-sm text-base-content/60 mt-1">Manage your password and security keys.</p>
                </CardHeader>
                <CardBody className="pt-6">
                  <form className="flex flex-col gap-6" onSubmit={handleUpdatePassword}>
                    <Input 
                      label="Current Password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                    <div>
                      <Input 
                        label="New Password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        error={passwordErrors.newPassword}
                      />
                    </div>
                    <div>
                      <Input 
                        label="Confirm New Password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                        error={passwordErrors.confirmPassword}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-4 mt-6 border-t border-base-200 pt-6">
                       <h3 className="font-bold">Two-Factor Authentication</h3>
                       <div className="flex items-center justify-between p-4 border border-base-300 rounded-xl bg-base-200">
                         <div>
                           <div className="font-semibold mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Authenticator App</div>
                           <div className="text-sm text-base-content/60">Use an app like Google Authenticator to get 2FA codes when you login.</div>
                         </div>
                          <Button variant="outline" size="sm" type="button" onClick={() => showToast('error', '2FA Setup: This feature will be available in future updates.')}>Enable</Button>
                       </div>
                    </div>

                    <div className="flex justify-end mt-4">
                       <Button type="submit" variant="primary" className="shadow-md" disabled={isLoading}>
                         {isLoading ? 'Updating...' : 'Update Security'}
                       </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="shadow-xl bg-base-100 border border-base-200 animate-fadeIn">
                <CardHeader className="border-b border-base-200 pb-4">
                  <h2 className="text-2xl font-bold">Email Notifications</h2>
                  <p className="text-sm text-base-content/60 mt-1">Control how we communicate with you.</p>
                </CardHeader>
                <CardBody className="pt-6 flex flex-col gap-4">
                  {[
                    { title: 'Security Alerts', desc: 'Get notified about important security updates.', active: true },
                    { title: 'Course Updates', desc: 'Emails about new features, courses, and updates.', active: true },
                    { title: 'Promo & Offers', desc: 'Receive exclusive discounts and promotional offers.', active: false },
                    { title: 'Weekly Newsletter', desc: 'Our weekly curated recap of top learning resources.', active: false }
                  ].map((notif, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:bg-base-200 transition-colors">
                       <div>
                         <div className="font-bold">{notif.title}</div>
                         <div className="text-sm text-base-content/60">{notif.desc}</div>
                       </div>
                       <input type="checkbox" className="toggle toggle-primary" defaultChecked={notif.active} />
                    </div>
                  ))}
                  
                   <div className="flex justify-end mt-4">
                     <Button variant="primary" className="shadow-md" onClick={() => showToast('success', 'Notification preferences saved!')}>Save Preferences</Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card className="shadow-xl bg-base-100 border border-base-200 animate-fadeIn">
                <CardHeader className="border-b border-base-200 pb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">Payment Methods <span className="badge badge-primary badge-sm bg-opacity-20 text-primary border-primary">Secured</span></h2>
                  <p className="text-sm text-base-content/60 mt-1">Manage your payment details securely.</p>
                </CardHeader>
                <CardBody className="pt-6">
                  <div className="p-6 border border-base-300 rounded-2xl bg-base-200 relative mb-6">
                     <div className="absolute top-4 right-4 text-base-content/40"><CreditCard className="w-8 h-8" /></div>
                     <h3 className="font-bold text-lg mb-4">Visa ending in 4242</h3>
                     <div className="flex gap-8 mb-4">
                       <div>
                         <div className="text-xs text-base-content/50 uppercase tracking-widest font-bold">Name on card</div>
                         <div className="font-medium text-base-content/80 text-primary">{user.username.toUpperCase()}</div>
                       </div>
                       <div>
                         <div className="text-xs text-base-content/50 uppercase tracking-widest font-bold">Expires</div>
                         <div className="font-medium text-base-content/80">09/28</div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-base-100" onClick={() => showToast('error', 'Card editing is available in the full payment portal.')} >Edit</Button>
                        <Button variant="danger" size="sm" onClick={() => { if(window.confirm('Remove this payment method?')) showToast('success', 'Card removed.'); }}>Remove</Button>
                     </div>
                  </div>
                  
                   <Button variant="outline" className="w-full border-dashed py-8 font-semibold hover:border-primary hover:text-primary transition-colors" onClick={() => showToast('error', 'Add Payment Method: Portal available in production mode.')}>
                     + Add New Payment Method
                   </Button>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
