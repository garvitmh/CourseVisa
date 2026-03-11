import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardHeader, CardBody } from '../components/shared';
import { User, Shield, Bell, CreditCard } from 'lucide-react';
import { CloudinaryUploadWidget } from '../components/shared';

export default function ProfileSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <h2 className="text-2xl font-bold">Please log in to view profile settings.</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
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
                  <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl border-2 border-primary overflow-hidden shadow-inner">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                         <CloudinaryUploadWidget 
                             cloudName="dgkzstbui"
                             uploadPreset="e-learning"
                             onUploadSuccess={(url) => console.log('Avatar uploaded:', url)}
                           />
                         <p className="text-xs text-base-content/50 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Full Name" defaultValue={user.username} />
                      <Input label="Email Address" type="email" defaultValue={user.email || 'user@example.com'} disabled />
                    </div>
                    
                    <Input label="Bio" placeholder="Tell us a little about yourself..." className="h-24" />
                    
                    <div className="flex justify-end mt-4">
                      <Button variant="primary" className="shadow-md">Save Changes</Button>
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
                  <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
                    <Input label="Current Password" type="password" placeholder="••••••••" />
                    <Input label="New Password" type="password" placeholder="••••••••" />
                    <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                    
                    <div className="flex flex-col gap-4 mt-6 border-t border-base-200 pt-6">
                       <h3 className="font-bold">Two-Factor Authentication</h3>
                       <div className="flex items-center justify-between p-4 border border-base-300 rounded-xl bg-base-200">
                         <div>
                           <div className="font-semibold mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Authenticator App</div>
                           <div className="text-sm text-base-content/60">Use an app like Google Authenticator to get 2FA codes when you login.</div>
                         </div>
                         <Button variant="outline" size="sm">Enable</Button>
                       </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button variant="primary" className="shadow-md">Update Security</Button>
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
                    <Button variant="primary" className="shadow-md">Save Preferences</Button>
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
                         <div className="font-medium text-base-content/80">{user.username.toUpperCase()}</div>
                       </div>
                       <div>
                         <div className="text-xs text-base-content/50 uppercase tracking-widest font-bold">Expires</div>
                         <div className="font-medium text-base-content/80">09/28</div>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <Button variant="outline" size="sm" className="bg-base-100">Edit</Button>
                       <Button variant="danger" size="sm">Remove</Button>
                     </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-dashed py-8 font-semibold hover:border-primary hover:text-primary transition-colors">
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
