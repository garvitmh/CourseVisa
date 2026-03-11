/* Course Types */
export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Course {
  id: number;
  subjectId: string;
  category: CategoryType;
  title: string;
  rating: 1 | 2 | 3 | 4 | 5;
  price: number;
  image: string;
  description?: string;
  instructor?: string;
  studentCount?: number;
  duration?: string;
}

export interface Video {
  id: string;
  title: string;
  videoUrl: string;
  duration: string; // format: "10:10"
}

export interface CourseDetail extends Course {
  videos: Video[];
  fullDescription?: string;
  learningPoints?: string[];
  requirements?: string[];
}

/* User & Auth Types */
export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  phone: string;
  role: 'student' | 'mentor' | 'admin';
  createdAt: Date;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface SignupFormData {
  [key: string]: string | boolean;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface LoginFormData {
  [key: string]: string | boolean;
  email: string;
  password: string;
}

/* Cart Types */
export interface CartItem {
  courseId: number;
  course: Course;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: number) => void;
  updateQuantity: (courseId: number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (courseId: number) => boolean;
}

/* Form Validation Types */
export interface FieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

export interface FormValidationConfig {
  [field: string]: {
    rules: {
      minLength?: number;
      maxLength?: number;
      pattern?: RegExp;
      required?: boolean;
      custom?: (value: string) => boolean;
    };
    message: string;
  };
}

/* Filter & Search Types */
export type CategoryType = 'all' | 'kindergarten' | 'highschool' | 'college' | 'computer' | 'science' | 'engineering';

export interface FilterState {
  activeCategory: CategoryType;
  searchTerm: string;
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface SearchSuggestion {
  courseId: number;
  courseTitle: string;
  matchField: 'title' | 'description';
}

/* Mentor Application Types */
export interface MentorApplicationData {
  name: string;
  email: string;
  qualifications: string;
  bio: string;
  experience: string;
  certificates?: File[];
}

/* API Response Types */
export interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
