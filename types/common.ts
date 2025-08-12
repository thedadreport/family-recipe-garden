// types/common.ts
export interface FormValidationError {
  field: string;
  message: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  progress?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// User types are now in types/user.ts

// API related types
export interface ClaudeApiRequest {
  model: string;
  max_tokens: number;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ClaudeApiResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

// Storage related types
export interface StorageManager<T> {
  get: (key: string, defaultValue?: T) => T | null;
  set: (key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
}