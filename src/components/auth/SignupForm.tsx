import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../hooks';
import { useFormValidation } from '../../hooks';
import { SignupFormData } from '../../types';
import { FORM_VALIDATION_RULES } from '../../constants';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import PasswordStrength from './PasswordStrength';
import { getDashboardRouteForRole } from '../../utils/auth';

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup, googleLogin, isLoading: authLoading, error: authError } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSignupLogic() {
    setFormError(null);
    if (values.password !== values.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    try {
      const signedUpUser = await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phone: values.phone,
      });
      navigate(getDashboardRouteForRole(signedUpUser.role), { replace: true });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
    }
  }

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormValidation<SignupFormData>(
      { username: '', email: '', password: '', confirmPassword: '', phone: '' },
      FORM_VALIDATION_RULES.signup as Record<string, any>,
      handleSignupLogic
    );

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setFormError(null);
        const loggedInUser = await googleLogin(tokenResponse.access_token);
        navigate(getDashboardRouteForRole(loggedInUser.role), { replace: true });
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Google login failed');
      }
    },
    onError: () => setFormError('Google Login Failed'),
  });

  return (
    <div className="w-full max-w-md mx-auto relative z-10 px-4 py-8 sm:p-10 bg-base-100/80 backdrop-blur-md rounded-3xl shadow-2xl border border-base-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Create Account</h2>
        <p className="text-base-content/60">Join Coursiva and start your journey</p>
      </div>

      {(formError || authError) && (
        <div className="alert alert-error font-medium mb-6 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{formError || authError}</span>
        </div>
      )}

      {/* Social Logins */}
      <div className="flex flex-col gap-3 mb-6">
        <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-base-300 hover:border-primary" onClick={() => loginWithGoogle()}>
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
          <span className="font-semibold text-base-content/80">Sign up with Google</span>
        </Button>
      </div>

      <div className="divider text-base-content/40 text-sm font-medium mb-6">OR EMAIL</div>

      <form onSubmit={handleSignupSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-bold text-base-content/80 ml-1">Full Name</label>
          <Input
            id="username" name="username" type="text" placeholder="John Doe"
            value={values.username} onChange={handleChange} onBlur={handleBlur}
            error={touched.username ? errors.username : undefined} disabled={authLoading}
          />
          {touched.username && errors.username && <span className="text-error text-xs ml-1 font-semibold">{errors.username}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-bold text-base-content/80 ml-1">Email Address</label>
          <Input
            id="email" name="email" type="email" placeholder="you@example.com"
            value={values.email} onChange={handleChange} onBlur={handleBlur}
            error={touched.email ? errors.email : undefined} disabled={authLoading}
          />
          {touched.email && errors.email && <span className="text-error text-xs ml-1 font-semibold">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-bold text-base-content/80 ml-1">Password</label>
          <Input
            id="password" name="password" type="password" placeholder="••••••••"
            value={values.password} onChange={handleChange} onBlur={handleBlur}
            error={touched.password ? errors.password : undefined} disabled={authLoading}
          />
          {touched.password && errors.password && <span className="text-error text-xs ml-1 font-semibold">{errors.password}</span>}
          {values.password && <div className="mt-2"><PasswordStrength password={values.password} /></div>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword" className="text-sm font-bold text-base-content/80 ml-1">Confirm Password</label>
          <Input
            id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••"
            value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : undefined} disabled={authLoading}
          />
          {touched.confirmPassword && errors.confirmPassword && <span className="text-error text-xs ml-1 font-semibold">{errors.confirmPassword}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-bold text-base-content/80 ml-1">Phone Number</label>
          <Input
            id="phone" name="phone" type="tel" placeholder="1234567890"
            value={values.phone} onChange={handleChange} onBlur={handleBlur}
            error={touched.phone ? errors.phone : undefined} disabled={authLoading}
          />
          {touched.phone && errors.phone && <span className="text-error text-xs ml-1 font-semibold">{errors.phone}</span>}
        </div>

        <Button type="submit" variant="primary" className="w-full mt-2 shadow-lg hover:shadow-primary/40 transition-shadow" disabled={authLoading}>
          {authLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Create Account'}
        </Button>
      </form>

      <div className="text-center mt-6 pt-6 border-t border-base-200">
        <p className="text-sm text-base-content/70 mb-3 font-medium">Already have an account?</p>
        <Link to="/login">
          <Button variant="outline" className="w-full font-bold">Sign in instead</Button>
        </Link>
      </div>
    </div>
  );
}
