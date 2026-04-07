import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card, CardHeader, CardBody } from '../components/shared';
import { User, Shield, Bell, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { CloudinaryUploadWidget } from '../components/shared';
import { api } from '../services/api';

type ToastType = { type: 'success' | 'error'; message: string } | null;

type NotificationPrefs = {
  securityAlerts: boolean;
  courseUpdates: boolean;
  promoOffers: boolean;
  weeklyNewsletter: boolean;
};

type PaymentMethod = {
  _id?: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  holderName?: string;
  isDefault?: boolean;
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  securityAlerts: true,
  courseUpdates: true,
  promoOffers: false,
  weeklyNewsletter: false,
};

export default function ProfileSettings() {
  const { user, checkAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [toast, setToast] = useState<ToastType>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    username: '',
    phone: '',
    bio: '',
    avatar: '',
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>(DEFAULT_NOTIFICATION_PREFS);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    holderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    brand: 'Visa',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;

    setProfileData({
      username: user.username || '',
      phone: user.phone || '',
      bio: user.bio || '',
      avatar: user.avatar || '',
    });

    setNotificationPrefs(user.notificationPreferences || DEFAULT_NOTIFICATION_PREFS);
    setTwoFactorEnabled(!!user.twoFactorEnabled);
    setPaymentMethods(user.paymentMethods || []);
  }, [user]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const persistProfile = async (payload: Record<string, any>, successMessage: string) => {
    setIsLoading(true);
    try {
      await api.auth.updateProfile(payload);
      await checkAuth();
      showToast('success', successMessage);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
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
    await persistProfile(
      {
        username: profileData.username,
        phone: profileData.phone,
        bio: profileData.bio,
        avatar: profileData.avatar,
      },
      'Profile updated successfully!'
    );
  };

  const handleAvatarUpload = async (avatarUrl: string) => {
    setProfileData((prev) => ({ ...prev, avatar: avatarUrl }));
    await persistProfile({ avatar: avatarUrl }, 'Profile picture updated successfully!');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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

  const handleToggleTwoFactor = async () => {
    const nextState = !twoFactorEnabled;
    setTwoFactorEnabled(nextState);
    await persistProfile(
      { twoFactorEnabled: nextState },
      nextState ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.'
    );
  };

  const handleSaveNotifications = async () => {
    await persistProfile(
      { notificationPreferences: notificationPrefs },
      'Notification preferences saved!'
    );
  };

  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = newPaymentMethod.cardNumber.replace(/\D/g, '');

    if (digits.length < 12) {
      showToast('error', 'Enter a valid card number');
      return;
    }

    const expiryMonth = Number(newPaymentMethod.expiryMonth);
    const expiryYear = Number(newPaymentMethod.expiryYear);

    if (!Number.isInteger(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) {
      showToast('error', 'Enter a valid expiry month (1-12)');
      return;
    }

    if (!Number.isInteger(expiryYear) || expiryYear < new Date().getFullYear()) {
      showToast('error', 'Enter a valid expiry year');
      return;
    }

    const nextMethods: PaymentMethod[] = [
      ...paymentMethods,
      {
        brand: newPaymentMethod.brand,
        holderName: newPaymentMethod.holderName.trim(),
        last4: digits.slice(-4),
        expiryMonth,
        expiryYear,
        isDefault: paymentMethods.length === 0,
      },
    ];

    setPaymentMethods(nextMethods);
    await persistProfile({ paymentMethods: nextMethods }, 'Payment method added successfully!');
    setNewPaymentMethod({ holderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', brand: 'Visa' });
    setShowAddPaymentForm(false);
  };

  const handleRemovePaymentMethod = async (methodId?: string) => {
    if (!methodId) return;
    const nextMethods = paymentMethods.filter((method) => method._id !== methodId);

    if (nextMethods.length > 0 && !nextMethods.some((method) => method.isDefault)) {
      nextMethods[0].isDefault = true;
    }

    setPaymentMethods(nextMethods);
    await persistProfile({ paymentMethods: nextMethods }, 'Payment method removed.');
  };

  const handleSetDefaultPaymentMethod = async (methodId?: string) => {
    if (!methodId) return;

    const nextMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method._id === methodId,
    }));

    setPaymentMethods(nextMethods);
    await persistProfile({ paymentMethods: nextMethods }, 'Default payment method updated.');
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4">
      {toast && (
        <div className={`fixed top-20 right-6 z-[999] flex items-start gap-3 p-4 rounded-xl shadow-2xl max-w-sm border backdrop-blur-sm animate-fade-in ${
          toast.type === 'success' ? 'bg-success/10 border-success/30 text-success' : 'bg-error/10 border-error/30 text-error'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 shrink-0 mt-0.5" />}
          <span className="text-sm font-semibold">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-auto opacity-60 hover:opacity-100">x</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">Account Settings</h1>
          <p className="text-base-content/60 text-lg">Manage your personal data, security preferences, and payment methods.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <Card className="shadow-lg border border-base-200 sticky top-[100px]">
              <div className="flex flex-col p-2 gap-1">
                {[
                  { id: 'personal', label: 'Personal Information', icon: <User className="w-5 h-5" /> },
                  { id: 'security', label: 'Security & Password', icon: <Shield className="w-5 h-5" /> },
                  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
                  { id: 'billing', label: 'Payment Methods', icon: <CreditCard className="w-5 h-5" /> },
                ].map((tab) => (
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

          <div className="flex-1">
            {activeTab === 'personal' && (
              <Card className="shadow-xl bg-base-100 border border-base-200 animate-fadeIn">
                <CardHeader className="border-b border-base-200 pb-4">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  <p className="text-sm text-base-content/60 mt-1">Update your profile details.</p>
                </CardHeader>
                <CardBody className="pt-6">
                  <form className="flex flex-col gap-6" onSubmit={handleUpdateProfile}>
                    <div className="flex items-center gap-6 mb-4">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl border-2 border-primary overflow-hidden shadow-inner uppercase font-black text-primary">
                          {profileData.avatar ? (
                            <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            user.username.charAt(0)
                          )}
                        </div>
                      </div>
                      <div>
                        <CloudinaryUploadWidget
                          cloudName="dgkzstbui"
                          uploadPreset="e-learning"
                          buttonText="Upload Profile Picture"
                          onUploadSuccess={handleAvatarUpload}
                        />
                        <p className="text-xs text-base-content/50 mt-2">JPG/PNG/WebP. Uploaded image is saved to your account.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        required
                      />
                      <Input label="Email Address" type="email" value={user.email || ''} disabled />
                    </div>

                    <Input
                      label="Phone Number"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-base-content/70 ml-1">Bio</label>
                      <textarea
                        className="textarea textarea-bordered w-full bg-base-100 focus:outline-none focus:border-primary transition-all min-h-[100px]"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
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
                  <p className="text-sm text-base-content/60 mt-1">Manage password and account sign-in protection.</p>
                </CardHeader>
                <CardBody className="pt-6">
                  <form className="flex flex-col gap-6" onSubmit={handleUpdatePassword}>
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="********"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="********"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      error={passwordErrors.newPassword}
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="********"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      error={passwordErrors.confirmPassword}
                    />

                    <div className="flex flex-col gap-4 mt-2 border-t border-base-200 pt-6">
                      <h3 className="font-bold">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 border border-base-300 rounded-xl bg-base-200">
                        <div>
                          <div className="font-semibold mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Account 2FA</div>
                          <div className="text-sm text-base-content/60">Enable an additional authentication step at login.</div>
                        </div>
                        <Button variant={twoFactorEnabled ? 'danger' : 'outline'} size="sm" type="button" onClick={handleToggleTwoFactor}>
                          {twoFactorEnabled ? 'Disable' : 'Enable'}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button type="submit" variant="primary" className="shadow-md" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Password'}
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
                  <p className="text-sm text-base-content/60 mt-1">Choose which updates you want to receive.</p>
                </CardHeader>
                <CardBody className="pt-6 flex flex-col gap-4">
                  {[
                    { key: 'securityAlerts', title: 'Security Alerts', desc: 'Important account and security updates.' },
                    { key: 'courseUpdates', title: 'Course Updates', desc: 'Course and learning update emails.' },
                    { key: 'promoOffers', title: 'Promo & Offers', desc: 'Discounts and promotional campaigns.' },
                    { key: 'weeklyNewsletter', title: 'Weekly Newsletter', desc: 'Curated weekly highlights.' },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:bg-base-200 transition-colors">
                      <div>
                        <div className="font-bold">{notif.title}</div>
                        <div className="text-sm text-base-content/60">{notif.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        checked={notificationPrefs[notif.key as keyof NotificationPrefs]}
                        onChange={(e) =>
                          setNotificationPrefs((prev) => ({
                            ...prev,
                            [notif.key]: e.target.checked,
                          }))
                        }
                      />
                    </div>
                  ))}

                  <div className="flex justify-end mt-4">
                    <Button variant="primary" className="shadow-md" onClick={handleSaveNotifications} disabled={isLoading}>
                      Save Preferences
                    </Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {activeTab === 'billing' && (
              <Card className="shadow-xl bg-base-100 border border-base-200 animate-fadeIn">
                <CardHeader className="border-b border-base-200 pb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Payment Methods
                    <span className="badge badge-primary badge-sm bg-opacity-20 text-primary border-primary">Saved</span>
                  </h2>
                  <p className="text-sm text-base-content/60 mt-1">Manage your payment methods for checkout.</p>
                </CardHeader>
                <CardBody className="pt-6">
                  {paymentMethods.length === 0 ? (
                    <div className="text-base-content/60 mb-6">No payment methods saved yet.</div>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {paymentMethods.map((method) => (
                        <div key={method._id || `${method.brand}-${method.last4}`} className="p-4 border border-base-300 rounded-xl bg-base-200 flex items-center justify-between gap-4">
                          <div>
                            <div className="font-bold text-lg">{method.brand} ending in {method.last4}</div>
                            <div className="text-sm text-base-content/60">
                              {method.holderName || user.username} - {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                            </div>
                            {method.isDefault && <span className="badge badge-success badge-sm mt-2">Default</span>}
                          </div>
                          <div className="flex gap-2">
                            {!method.isDefault && (
                              <Button variant="outline" size="sm" onClick={() => handleSetDefaultPaymentMethod(method._id)}>
                                Make Default
                              </Button>
                            )}
                            <Button variant="danger" size="sm" onClick={() => handleRemovePaymentMethod(method._id)}>
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!showAddPaymentForm ? (
                    <Button
                      variant="outline"
                      className="w-full border-dashed py-8 font-semibold hover:border-primary hover:text-primary transition-colors"
                      onClick={() => setShowAddPaymentForm(true)}
                    >
                      + Add New Payment Method
                    </Button>
                  ) : (
                    <form className="border border-base-300 rounded-xl p-4 bg-base-200 space-y-4" onSubmit={handleAddPaymentMethod}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Cardholder Name"
                          value={newPaymentMethod.holderName}
                          onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, holderName: e.target.value }))}
                          required
                        />
                        <Input
                          label="Card Number"
                          value={newPaymentMethod.cardNumber}
                          onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="4111 1111 1111 1111"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="Expiry Month"
                          value={newPaymentMethod.expiryMonth}
                          onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, expiryMonth: e.target.value }))}
                          placeholder="MM"
                          required
                        />
                        <Input
                          label="Expiry Year"
                          value={newPaymentMethod.expiryYear}
                          onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, expiryYear: e.target.value }))}
                          placeholder="YYYY"
                          required
                        />
                        <div className="flex flex-col gap-1">
                          <label className="text-sm font-semibold text-base-content/70 ml-1">Brand</label>
                          <select
                            className="select select-bordered w-full bg-base-100"
                            value={newPaymentMethod.brand}
                            onChange={(e) => setNewPaymentMethod((prev) => ({ ...prev, brand: e.target.value }))}
                          >
                            <option>Visa</option>
                            <option>Mastercard</option>
                            <option>Amex</option>
                            <option>RuPay</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowAddPaymentForm(false)}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>Save Card</Button>
                      </div>
                    </form>
                  )}
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
