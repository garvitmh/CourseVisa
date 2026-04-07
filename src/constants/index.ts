/* Type Definitions */
export type CategoryType = 'kindergarten' | 'highschool' | 'college' | 'computer' | 'science' | 'engineering' | 'all';

/* Color Constants */
export const COLORS = {
  primary: '#6A6CFF',
  primaryRed: '#FF464A',
  deepBlue: '#2B2162',
  textDark: '#292B2E',
  textLight: '#6C6C6C',
  bgLight: '#FBFBFB',
  borderColor: '#F1F1F1',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
} as const;

/* Category Constants */
export const CATEGORIES: CategoryType[] = [
  'kindergarten',
  'highschool',
  'college',
  'computer',
  'science',
  'engineering',
];

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  all: 'All Courses',
  kindergarten: 'Kindergarten',
  highschool: 'High School',
  college: 'College',
  computer: 'Computer',
  science: 'Science',
  engineering: 'Engineering',
};

/* Form Validation Rules */
export const FORM_VALIDATION_RULES = {
  signup: {
    username: {
      rules: { minLength: 3, required: true },
      message: 'Name must be at least 3 characters',
    },
    email: {
      rules: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true,
      },
      message: 'Please enter a valid email address',
    },
    password: {
      rules: { minLength: 6, required: true },
      message: 'Password must be at least 6 characters',
    },
    confirmPassword: {
      rules: { minLength: 6, required: true },
      message: 'Passwords must match',
    },
    phone: {
      rules: {
        pattern: /^[0-9]{10}$/,
        required: true,
      },
      message: 'Phone number must be exactly 10 digits',
    },
  },
  login: {
    email: {
      rules: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true,
      },
      message: 'Please enter a valid email address',
    },
    password: {
      rules: { minLength: 6, required: true },
      message: 'Password is required',
    },
  },
  mentor: {
    name: {
      rules: { minLength: 3, required: true },
      message: 'Name must be at least 3 characters',
    },
    email: {
      rules: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        required: true,
      },
      message: 'Please enter a valid email address',
    },
    qualifications: {
      rules: { minLength: 10, required: true },
      message: 'Qualifications must be at least 10 characters',
    },
  },
} as const;

/* API Endpoints */
export const API_ENDPOINTS = {
  base: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  // Auth
  login: '/auth/login',
  signup: '/auth/signup',
  logout: '/auth/logout',
  // Courses
  courses: '/courses',
  courseDetail: (id: number) => `/courses/${id}`,
  // Cart
  cart: '/cart',
  // Mentor
  mentorApply: '/mentor/apply',
};

/* Payment Methods */
export const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'wallet', label: 'Wallet', icon: '👛' },
];

export const PAYMENT_MODES = {
  simulate: 'simulate',
  razorpay: 'razorpay',
} as const;

export type PaymentMode = keyof typeof PAYMENT_MODES;

export const PAYMENT_MODE: PaymentMode =
  import.meta.env.VITE_PAYMENT_MODE === PAYMENT_MODES.razorpay
    ? PAYMENT_MODES.razorpay
    : PAYMENT_MODES.simulate;

/* Sort Options */
export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

/* Storage Keys */
export const STORAGE_KEYS = {
  authUser: 'auth_user',
  authToken: 'auth_token',
  cartItems: 'cart_items',
  theme: 'theme',
  preferences: 'user_preferences',
};

/* App Configuration */
export const APP_CONFIG = {
  useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'true' || true,
  appName: import.meta.env.VITE_APP_NAME || 'Coursiva',
  debug: {
    logApiCalls: true,
  },
} as const;
