import { useState, useEffect, useCallback } from 'react';

// Local storage hook options
interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  onError?: (error: Error) => void;
}

// Hook return type
interface UseLocalStorageResult<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
  removeValue: () => void;
  loading: boolean;
  error: Error | null;
}

// Default serialization functions
const defaultSerialize = <T>(value: T): string => JSON.stringify(value);
const defaultDeserialize = <T>(value: string): T => JSON.parse(value);

export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): UseLocalStorageResult<T> {
  const {
    defaultValue,
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    onError
  } = options;

  const [value, setStoredValue] = useState<T>(defaultValue as T);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize value from localStorage on mount
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window === 'undefined') {
        // SSR safe - use default value
        setStoredValue(defaultValue as T);
        setLoading(false);
        return;
      }

      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        // No stored value, use default
        if (defaultValue !== undefined) {
          setStoredValue(defaultValue);
        }
      } else {
        // Parse stored value
        const parsedValue = deserialize(item);
        setStoredValue(parsedValue);
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to read from localStorage');
      setError(error);
      
      if (onError) {
        onError(error);
      }

      // Fallback to default value
      if (defaultValue !== undefined) {
        setStoredValue(defaultValue);
      }
      
    } finally {
      setLoading(false);
    }
  }, [key, defaultValue, deserialize, onError]);

  // Set value in both state and localStorage
  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    try {
      setError(null);

      // Handle function updates
      const valueToStore = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(value)
        : newValue;

      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        if (valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, serialize(valueToStore));
        }
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to write to localStorage');
      setError(error);
      
      if (onError) {
        onError(error);
      }
    }
  }, [key, value, serialize, onError]);

  // Remove value from both state and localStorage
  const removeValue = useCallback(() => {
    try {
      setError(null);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      setStoredValue(defaultValue as T);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove from localStorage');
      setError(error);
      
      if (onError) {
        onError(error);
      }
    }
  }, [key, defaultValue, onError]);

  return {
    value,
    setValue,
    removeValue,
    loading,
    error
  };
}

// Specialized hooks for common data types

// Hook for storing arrays with helper methods
export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = []
): UseLocalStorageResult<T[]> & {
  addItem: (item: T) => void;
  removeItem: (predicate: (item: T) => boolean) => void;
  updateItem: (predicate: (item: T) => boolean, updater: (item: T) => T) => void;
  clearArray: () => void;
} {
  const { value, setValue, removeValue, loading, error } = useLocalStorage<T[]>(key, { defaultValue });

  const addItem = useCallback((item: T) => {
    setValue(prev => [...prev, item]);
  }, [setValue]);

  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setValue(prev => prev.filter(item => !predicate(item)));
  }, [setValue]);

  const updateItem = useCallback((predicate: (item: T) => boolean, updater: (item: T) => T) => {
    setValue(prev => prev.map(item => predicate(item) ? updater(item) : item));
  }, [setValue]);

  const clearArray = useCallback(() => {
    setValue([]);
  }, [setValue]);

  return {
    value,
    setValue,
    removeValue,
    loading,
    error,
    addItem,
    removeItem,
    updateItem,
    clearArray
  };
}

// Hook for storing objects with deep merge capability
export function useLocalStorageObject<T extends Record<string, any>>(
  key: string,
  defaultValue: T
): UseLocalStorageResult<T> & {
  updateProperty: (property: keyof T, value: T[keyof T]) => void;
  mergeObject: (partial: Partial<T>) => void;
  resetToDefault: () => void;
} {
  const { value, setValue, removeValue, loading, error } = useLocalStorage<T>(key, { defaultValue });

  const updateProperty = useCallback((property: keyof T, newValue: T[keyof T]) => {
    setValue(prev => ({ ...prev, [property]: newValue }));
  }, [setValue]);

  const mergeObject = useCallback((partial: Partial<T>) => {
    setValue(prev => ({ ...prev, ...partial }));
  }, [setValue]);

  const resetToDefault = useCallback(() => {
    setValue(defaultValue);
  }, [setValue, defaultValue]);

  return {
    value,
    setValue,
    removeValue,
    loading,
    error,
    updateProperty,
    mergeObject,
    resetToDefault
  };
}

// Hook for user preferences with validation
export function useUserPreferences<T extends Record<string, any>>(
  defaultPreferences: T
): UseLocalStorageResult<T> & {
  updatePreference: (key: keyof T, value: T[keyof T]) => void;
  resetPreferences: () => void;
} {
  const { value, setValue, removeValue, loading, error } = useLocalStorage<T>(
    'user-preferences',
    { defaultValue: defaultPreferences }
  );

  const updatePreference = useCallback((key: keyof T, newValue: T[keyof T]) => {
    setValue(prev => ({ ...prev, [key]: newValue }));
  }, [setValue]);

  const resetPreferences = useCallback(() => {
    setValue(defaultPreferences);
  }, [setValue, defaultPreferences]);

  return {
    value,
    setValue,
    removeValue,
    loading,
    error,
    updatePreference,
    resetPreferences
  };
}

// Utility function to check localStorage availability
export const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const test = '__localStorage_test__';
    window.localStorage.setItem(test, 'test');
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Utility function to get localStorage usage info
export const getLocalStorageInfo = (): {
  used: number;
  total: number;
  available: number;
  usedPercentage: number;
} => {
  if (!isLocalStorageAvailable()) {
    return { used: 0, total: 0, available: 0, usedPercentage: 0 };
  }

  let used = 0;
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      used += window.localStorage[key].length + key.length;
    }
  }

  // Most browsers limit localStorage to 5-10MB, we'll use 5MB as conservative estimate
  const total = 5 * 1024 * 1024; // 5MB in bytes
  const available = total - used;
  const usedPercentage = (used / total) * 100;

  return { used, total, available, usedPercentage };
};