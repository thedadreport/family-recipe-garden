// components/common/FormField.tsx
import React from 'react';

interface FormFieldOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'textarea' | 'select' | 'email' | 'password';
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  options?: FormFieldOption[];
  min?: number;
  max?: number;
  rows?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  hint,
  options,
  min,
  max,
  rows = 3,
  disabled = false,
  className = '',
  id
}) => {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  const baseInputClasses = "w-full px-4 py-3 bg-gray-50 border rounded-xl text-base text-gray-900 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const errorClasses = error 
    ? "border-red-300 focus:ring-red-500 bg-red-50" 
    : "border-gray-300 hover:border-gray-400";
    
  const inputClasses = `${baseInputClasses} ${errorClasses}`;

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            disabled={disabled}
            className={`${inputClasses} resize-none`}
            aria-describedby={
              error ? `${fieldId}-error` : 
              hint ? `${fieldId}-hint` : undefined
            }
          />
        );
        
      case 'select':
        return (
          <select
            id={fieldId}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className={inputClasses}
            aria-describedby={
              error ? `${fieldId}-error` : 
              hint ? `${fieldId}-hint` : undefined
            }
          >
            {!required && <option value="">Select an option</option>}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'number':
        return (
          <input
            id={fieldId}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            min={min}
            max={max}
            disabled={disabled}
            className={inputClasses}
            aria-describedby={
              error ? `${fieldId}-error` : 
              hint ? `${fieldId}-hint` : undefined
            }
          />
        );
        
      default:
        return (
          <input
            id={fieldId}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClasses}
            aria-describedby={
              error ? `${fieldId}-error` : 
              hint ? `${fieldId}-hint` : undefined
            }
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};