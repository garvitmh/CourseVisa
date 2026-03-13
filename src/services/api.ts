const API_URL = import.meta.env.VITE_API_URL 
  ? (import.meta.env.VITE_API_URL.endsWith('/api/v1') ? import.meta.env.VITE_API_URL : `${import.meta.env.VITE_API_URL}/api/v1`)
  : '/api/v1';

export const api = {
  auth: {
    login: async (credentials: any) => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      }
      return res.json();
    },
    register: async (userData: any) => {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Registration failed');
      }
      return res.json();
    },
    googleLogin: async (token: string) => {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Google login failed');
      }
      return res.json();
    },
    getMe: async (token: string) => {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  },
  courses: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/courses`);
      if (!res.ok) throw new Error('Failed to fetch courses');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_URL}/courses/${id}`);
      if (!res.ok) throw new Error('Failed to fetch course');
      return res.json();
    },
  },
  mentor: {
    apply: async (formData: FormData) => {
      const res = await fetch(`${API_URL}/mentor/apply`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Application failed');
      }
      return res.json();
    },
  },
  student: {
    getEnrolledCourses: async () => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/student/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch enrolled courses');
      return res.json();
    }
  },
  payment: {
    createOrder: async (amount: number) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount })
      });
      if (!res.ok) throw new Error('Order creation failed');
      return res.json();
    },
    simulate: async (amount: number, items: any[]) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/payment/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount, items })
      });
      if (!res.ok) throw new Error('Simulated payment failed');
      return res.json();
    }
  },
  quiz: {
    getByCourseId: async (courseId: string) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/courses/${courseId}/quiz`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.json();
    },
    submitAttempt: async (courseId: string, answers: any[]) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/courses/${courseId}/quiz/attempts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ answers })
      });
      return res.json();
    },
    getAttempts: async (courseId: string) => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_URL}/courses/${courseId}/quiz/attempts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.json();
    }
  }
};
