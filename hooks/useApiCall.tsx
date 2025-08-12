import { useState, useCallback } from 'react';

// API Error interface
interface ApiError {
  message: string;
  code?: string;
  type?: 'network' | 'parsing' | 'api' | 'timeout' | 'unknown';
  details?: any;
}

// Hook options
interface UseApiCallOptions {
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

// Hook return type
interface UseApiCallResult<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (prompt: string, options?: { maxTokens?: number }) => Promise<T | null>;
  retry: () => Promise<T | null>;
  reset: () => void;
}

// Mock Claude API service function (replace with actual service later)
const claudeApiCall = async (prompt: string, options: { maxTokens?: number } = {}): Promise<any> => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: options.maxTokens || 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data;
};

export function useApiCall<T = any>(options: UseApiCallOptions = {}): UseApiCallResult<T> {
  const {
    retryCount = 2,
    retryDelay = 1000,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');
  const [lastOptions, setLastOptions] = useState<{ maxTokens?: number }>({});

  const execute = useCallback(async (
    prompt: string, 
    executeOptions: { maxTokens?: number } = {}
  ): Promise<T | null> => {
    setLastPrompt(prompt);
    setLastOptions(executeOptions);
    setLoading(true);
    setError(null);

    let currentAttempt = 0;
    
    while (currentAttempt <= retryCount) {
      try {
        const response = await claudeApiCall(prompt, executeOptions);
        
        setData(response);
        setLoading(false);
        
        if (onSuccess) {
          onSuccess(response);
        }
        
        return response;
        
      } catch (err: any) {
        currentAttempt++;
        
        // If this was the last attempt, handle the error
        if (currentAttempt > retryCount) {
          const apiError: ApiError = {
            message: err.message || 'API call failed',
            type: err.name === 'TypeError' ? 'network' : 'api',
            code: err.code,
            details: err
          };
          
          setError(apiError);
          setLoading(false);
          
          if (onError) {
            onError(apiError);
          }
          
          return null;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, currentAttempt - 1))
        );
      }
    }
    
    return null;
  }, [retryCount, retryDelay, onSuccess, onError]);

  const retry = useCallback(async (): Promise<T | null> => {
    if (!lastPrompt) {
      const retryError: ApiError = {
        message: 'No previous request to retry',
        type: 'unknown'
      };
      setError(retryError);
      return null;
    }
    
    return execute(lastPrompt, lastOptions);
  }, [execute, lastPrompt, lastOptions]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setLastPrompt('');
    setLastOptions({});
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset
  };
}

// Utility hook for recipe-specific API calls
export function useRecipeApiCall(options: UseApiCallOptions = {}) {
  return useApiCall<any>({
    ...options,
    retryCount: options.retryCount ?? 3, // More retries for recipe generation
  });
}

// Utility hook for meal plan API calls
export function useMealPlanApiCall(options: UseApiCallOptions = {}) {
  return useApiCall<any>({
    ...options,
    retryCount: options.retryCount ?? 2, // Fewer retries for meal plans (they're longer)
  });
}