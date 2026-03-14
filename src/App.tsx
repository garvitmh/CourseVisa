import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home.tsx'));
const Courses = React.lazy(() => import('./pages/Courses.tsx'));
const CourseDetail = React.lazy(() => import('./pages/CourseDetail.tsx'));
const Signup = React.lazy(() => import('./pages/Signup.tsx'));
const Login = React.lazy(() => import('./pages/Login.tsx'));
const Cart = React.lazy(() => import('./pages/Cart.tsx'));
const Checkout = React.lazy(() => import('./pages/Checkout.tsx'));
const Mentor = React.lazy(() => import('./pages/Mentor.tsx'));
const ComponentsDemo = React.lazy(() => import('./pages/ComponentsDemo.tsx').then(m => ({ default: m.ComponentsDemo })));
const OrderConfirmation = React.lazy(() => import('./pages/OrderConfirmation.tsx'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard.tsx'));
const MentorDashboard = React.lazy(() => import('./pages/MentorDashboard.tsx'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard.tsx'));
const Books = React.lazy(() => import('./pages/Books.tsx'));
const BookDetail = React.lazy(() => import('./pages/BookDetail.tsx'));
const ProfileSettings = React.lazy(() => import('./pages/ProfileSettings.tsx'));
const QuizView = React.lazy(() => import('./pages/QuizView.tsx'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword.tsx'));

// Import components
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import Loader from './components/shared/Loader';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/shared/ScrollToTop';
import { ClickSpark } from './components/animations/ClickSpark';
import { ParticlesBackground } from './components/animations/ParticlesBackground';

import './styles/global.css';
import './styles/variables.css';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <ClickSpark sparkColor="#a855f7" sparkSize={10} sparkRadius={15}>
                <div className="app relative min-h-screen flex flex-col">
                  <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
                    <ParticlesBackground />
                  </div>
                  <div className="relative z-10 flex flex-col flex-1">
                    <Navbar />
                    <main className="main-content flex-1">
                      <Suspense fallback={<Loader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/courses" element={<Courses />} />
                          <Route path="/courses/:id" element={<CourseDetail />} />
                          <Route 
                            path="/courses/:id/quiz" 
                            element={
                              <ProtectedRoute>
                                <QuizView />
                              </ProtectedRoute>
                            } 
                          />
                          <Route path="/books" element={<Books />} />
                          <Route path="/books/:id" element={<BookDetail />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/forgot-password" element={<ForgotPassword />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route
                            path="/checkout"
                            element={
                              <ProtectedRoute>
                                <Checkout />
                              </ProtectedRoute>
                            }
                          />
                          <Route path="/mentor" element={<Mentor />} />
                          <Route path="/components" element={<ComponentsDemo />} />
                          <Route path="/order-confirmation" element={<OrderConfirmation />} />
                          <Route
                            path="/admin"
                            element={
                              <ProtectedRoute>
                                <AdminDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/mentor-dashboard"
                            element={
                              <ProtectedRoute>
                                <MentorDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/dashboard"
                            element={
                              <ProtectedRoute>
                                <StudentDashboard />
                              </ProtectedRoute>
                            }
                          />
                          <Route
                            path="/profile"
                            element={
                              <ProtectedRoute>
                                <ProfileSettings />
                              </ProtectedRoute>
                            }
                          />
                        </Routes>
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                </div>
              </ClickSpark>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
