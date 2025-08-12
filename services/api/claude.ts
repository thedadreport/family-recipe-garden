// services/api/claude.ts
import { ClaudeApiRequest, ClaudeApiResponse, ApiError } from '../../types/common';

class ClaudeApiService {
  private readonly baseUrl = 'https://api.anthropic.com/v1/messages';
  private readonly model = 'claude-sonnet-4-20250514';
  
  async makeRequest(
    content: string,
    maxTokens: number = 1500,
    timeout: number = 30000
  ): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const request: ClaudeApiRequest = {
        model: this.model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content }]
      };
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw this.createApiError(
          `API request failed with status ${response.status}`,
          response.status,
          errorData.error?.code
        );
      }
      
      const data: ClaudeApiResponse = await response.json();
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw this.createApiError('Invalid response format from API');
      }
      
      return data.content[0].text;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw this.createApiError('Request timed out. Please try again.');
        }
        
        // Re-throw ApiError instances
        if ('status' in error) {
          throw error;
        }
        
        throw this.createApiError(error.message);
      }
      
      throw this.createApiError('An unexpected error occurred');
    }
  }
  
  cleanJsonResponse(responseText: string): string {
    return responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
  }
  
  async makeRequestWithRetry(
    content: string,
    maxTokens: number = 1500,
    timeout: number = 30000,
    maxRetries: number = 2
  ): Promise<string> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.makeRequest(content, maxTokens, timeout);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error && 'status' in error) {
          const apiError = error as ApiError;
          // Don't retry on client errors (4xx)
          if (apiError.status && apiError.status >= 400 && apiError.status < 500) {
            throw error;
          }
        }
        
        // If this isn't the last attempt, wait before retrying
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    throw lastError!;
  }
  
  private createApiError(message: string, status?: number, code?: string): ApiError {
    const error = new Error(message) as ApiError;
    error.status = status;
    error.code = code;
    return error;
  }
  
  // Utility method to validate JSON response
  parseJsonResponse<T>(responseText: string): T {
    try {
      const cleanedResponse = this.cleanJsonResponse(responseText);
      return JSON.parse(cleanedResponse);
    } catch (error) {
      throw this.createApiError(
        'Failed to parse API response as JSON. The AI may have returned invalid JSON format.'
      );
    }
  }
  
  // Method to estimate token count (rough approximation)
  estimateTokens(text: string): number {
    // Rough approximation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }
  
  // Method to truncate content if it's too long
  truncateContent(content: string, maxTokens: number = 1500): string {
    const estimatedTokens = this.estimateTokens(content);
    
    if (estimatedTokens <= maxTokens) {
      return content;
    }
    
    // Leave some buffer for the response
    const maxInputTokens = Math.floor(maxTokens * 0.7);
    const maxChars = maxInputTokens * 4;
    
    if (content.length <= maxChars) {
      return content;
    }
    
    return content.substring(0, maxChars - 100) + '\n\n[Content truncated to fit token limit]';
  }
}

// Export singleton instance
export const claudeApi = new ClaudeApiService();