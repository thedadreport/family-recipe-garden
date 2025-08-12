import { useState, useCallback, useMemo } from 'react';
import { validateRecipeProfile, validateWeeklyProfile, ValidationError, hasValidationErrors, getFieldError } from '../utils/validation';

// Form validation hook options
interface UseFormValidationOptions<T> {
  initialValues: T;
  validationFunction?: (values: T) => ValidationError[];
  onSubmit?: (values: T) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

// Form field state
interface FieldState {
  touched: boolean;
  dirty: boolean;
  error?: string;
}

// Hook return type
interface UseFormValidationResult<T> {
  values: T;
  errors: ValidationError[];
  fieldStates: Record<keyof T, FieldState>;
  isValid: boolean;
  isSubmitting: boolean;
  hasBeenTouched: boolean;
  setValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  setFieldError: (field: keyof T, error?: string) => void;
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleBlur: (field: keyof T) => () => void;
  validateField: (field: keyof T) => void;
  validateForm: () => boolean;
  handleSubmit: (e?: React.FormEvent) => void;
  resetForm: (newValues?: T) => void;
  getFieldError: (field: keyof T) => string | undefined;
  isFieldTouched: (field: keyof T) => boolean;
  isFieldDirty: (field: keyof T) => boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  options: UseFormValidationOptions<T>
): UseFormValidationResult<T> {
  const {
    initialValues,
    validationFunction,
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true
  } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [fieldStates, setFieldStates] = useState<Record<keyof T, FieldState>>(() => {
    const initialStates = {} as Record<keyof T, FieldState>;
    Object.keys(initialValues).forEach(key => {
      initialStates[key as keyof T] = {
        touched: false,
        dirty: false
      };
    });
    return initialStates;
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Computed values
  const isValid = useMemo(() => !hasValidationErrors(errors), [errors]);
  const hasBeenTouched = useMemo(() => 
    Object.values(fieldStates).some(state => state.touched), 
    [fieldStates]
  );

  // Validate form using provided validation function
  const validateForm = useCallback((): boolean => {
    if (!validationFunction) return true;
    
    const newErrors = validationFunction(values);
    setErrors(newErrors);
    
    // Update field states with errors
    setFieldStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        const fieldError = getFieldError(newErrors, key);
        updated[key as keyof T] = {
          ...updated[key as keyof T],
          error: fieldError
        };
      });
      return updated;
    });
    
    return !hasValidationErrors(newErrors);
  }, [values, validationFunction]);

  // Validate single field
  const validateField = useCallback((field: keyof T) => {
    if (!validationFunction) return;
    
    const newErrors = validationFunction(values);
    const fieldError = getFieldError(newErrors, field as string);
    
    setFieldStates(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        error: fieldError
      }
    }));
    
    // Update global errors
    setErrors(newErrors);
  }, [values, validationFunction]);

  // Set field value
  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Mark field as dirty
    setFieldStates(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        dirty: true
      }
    }));
    
    // Validate on change if enabled
    if (validateOnChange) {
      setTimeout(() => validateField(field), 0);
    }
  }, [validateOnChange, validateField]);

  // Set field touched state
  const setFieldTouched = useCallback((field: keyof T, touched: boolean = true) => {
    setFieldStates(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        touched
      }
    }));
  }, []);

  // Set field error manually
  const setFieldError = useCallback((field: keyof T, error?: string) => {
    setFieldStates(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        error
      }
    }));
  }, []);

  // Handle input change
  const handleChange = useCallback((field: keyof T) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked
        : e.target.type === 'number'
        ? parseFloat(e.target.value) || 0
        : e.target.value;
      
      setValue(field, value);
    }, [setValue]);

  // Handle field blur
  const handleBlur = useCallback((field: keyof T) => () => {
    setFieldTouched(field, true);
    
    if (validateOnBlur) {
      validateField(field);
    }
  }, [setFieldTouched, validateOnBlur, validateField]);

  // Handle form submission
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Mark all fields as touched
    setFieldStates(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(key => {
        updated[key as keyof T] = {
          ...updated[key as keyof T],
          touched: true
        };
      });
      return updated;
    });
    
    // Validate entire form
    const isFormValid = validateForm();
    
    if (isFormValid && onSubmit) {
      setIsSubmitting(true);
      try {
        onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit]);

  // Reset form
  const resetForm = useCallback((newValues?: T) => {
    const resetValues = newValues || initialValues;
    setValues(resetValues);
    setErrors([]);
    
    const resetStates = {} as Record<keyof T, FieldState>;
    Object.keys(resetValues).forEach(key => {
      resetStates[key as keyof T] = {
        touched: false,
        dirty: false
      };
    });
    setFieldStates(resetStates);
    setIsSubmitting(false);
  }, [initialValues]);

  // Get field error helper
  const getFieldErrorHelper = useCallback((field: keyof T): string | undefined => {
    return fieldStates[field]?.error;
  }, [fieldStates]);

  // Check if field is touched
  const isFieldTouched = useCallback((field: keyof T): boolean => {
    return fieldStates[field]?.touched || false;
  }, [fieldStates]);

  // Check if field is dirty
  const isFieldDirty = useCallback((field: keyof T): boolean => {
    return fieldStates[field]?.dirty || false;
  }, [fieldStates]);

  return {
    values,
    errors,
    fieldStates,
    isValid,
    isSubmitting,
    hasBeenTouched,
    setValue,
    setFieldTouched,
    setFieldError,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    handleSubmit,
    resetForm,
    getFieldError: getFieldErrorHelper,
    isFieldTouched,
    isFieldDirty
  };
}

// Specialized hook for recipe form validation
export function useRecipeFormValidation(initialValues: {
  adults: number;
  kids: number;
  dietaryPrefs: string[];
  timeAvailable: string;
  cookingLevel: string;
  ingredients: string;
  cookingMethod: string;
  seasonal: boolean;
  cuisine: string;
  mealType: string;
}) {
  return useFormValidation({
    initialValues,
    validationFunction: validateRecipeProfile,
    validateOnBlur: true,
    validateOnChange: false
  });
}

// Specialized hook for weekly planning form validation
export function useWeeklyPlanningFormValidation(initialValues: {
  adults: number;
  kids: number;
  kidAges: string;
  cookingLevel: string;
  dinnersNeeded: number;
  weeknightTimeLimit: number;
  prepTimeAvailable: number;
  proteins: string;
  kitchenEquipment: string[];
  shoppingFrequency: string;
  weeklyBudget: string;
  dietaryRestrictions: string[];
  cuisinePreference: string;
  prepMethods: string[];
}) {
  return useFormValidation({
    initialValues,
    validationFunction: validateWeeklyProfile,
    validateOnBlur: true,
    validateOnChange: false
  });
}

// Helper hook for managing multi-select fields (like dietary preferences)
export function useMultiSelectField<T>(
  initialValue: T[] = []
): {
  value: T[];
  toggleItem: (item: T) => void;
  addItem: (item: T) => void;
  removeItem: (item: T) => void;
  hasItem: (item: T) => boolean;
  clear: () => void;
  setValue: (items: T[]) => void;
} {
  const [value, setValue] = useState<T[]>(initialValue);

  const toggleItem = useCallback((item: T) => {
    setValue(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  }, []);

  const addItem = useCallback((item: T) => {
    setValue(prev => prev.includes(item) ? prev : [...prev, item]);
  }, []);

  const removeItem = useCallback((item: T) => {
    setValue(prev => prev.filter(i => i !== item));
  }, []);

  const hasItem = useCallback((item: T): boolean => {
    return value.includes(item);
  }, [value]);

  const clear = useCallback(() => {
    setValue([]);
  }, []);

  return {
    value,
    toggleItem,
    addItem,
    removeItem,
    hasItem,
    clear,
    setValue
  };
}