import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Card, CardHeader, CardBody } from '../components/shared';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { api } from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);

  // Reset Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isReset, setIsReset] = useState(false);

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.auth.forgotPassword(email);
      setIsSubmitted(true);
      // In this simulation, we get the token back directly for demonstration
      if (res.resetToken) {
        setSimulatedToken(res.resetToken);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!simulatedToken) throw new Error('No reset token found');
      await api.auth.resetPassword(simulatedToken, newPassword);
      setIsReset(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isReset) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full shadow-2xl border border-base-200">
          <CardBody className="text-center p-8">
            <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black mb-2">Password Reset Successful</h2>
            <p className="text-base-content/60 mb-8">Your password has been successfully updated. You can now log in with your new password.</p>
            <Link to="/login" className="w-full">
              <Button variant="primary" className="w-full py-4 shadow-lg">Back to Login</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-base-100">
      <Card className="max-w-md w-full shadow-2xl border border-base-200 overflow-hidden">
        <div className="h-2 bg-primary"></div>
        <CardHeader className="pt-8 px-8 text-center">
          <h1 className="text-3xl font-black mb-2 lowercase tracking-tighter">
            reset <span className="text-primary">password</span>
          </h1>
          <p className="text-base-content/60">
            {!isSubmitted 
              ? "Enter your email and we'll send you instructions to reset your password."
              : "Use the simulated token below to set a new password."}
          </p>
        </CardHeader>

        <CardBody className="p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmitEmail} className="flex flex-col gap-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail className="w-5 h-5 opacity-50" />}
                className="bg-base-200 border-none focus:ring-2 ring-primary/20"
              />

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-error/10 text-error text-sm border border-error/20">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-4 shadow-xl font-bold uppercase tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-base-content/60 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
              {simulatedToken && (
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-2">
                   <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1 flex items-center gap-2">
                     <Key className="w-3 h-3" /> Simulated Reset Token
                   </div>
                   <code className="text-[10px] break-all opacity-70">{simulatedToken}</code>
                </div>
              )}

              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-base-200 border-none focus:ring-2 ring-primary/20"
              />

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-base-200 border-none focus:ring-2 ring-primary/20"
              />

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-error/10 text-error text-sm border border-error/20">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button 
                type="submit" 
                variant="primary" 
                className="w-full py-4 shadow-xl font-bold uppercase tracking-wider"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
