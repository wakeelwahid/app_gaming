// API service for handling all API calls
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface GameData {
  id: number;
  title: string;
  openTime: string;
  closeTime: string;
  status: string;
  color: string;
  bgColor: string;
}

interface UserData {
  id: string;
  username: string;
  phone: string;
  wallet: number;
  winnings: number;
}

interface BetData {
  id: number;
  number: string | number;
  amount: number;
  type: string;
  game: string;
  timestamp: Date;
}

// API Service for all HTTP requests
export const apiService = {
  baseURL: 'https://api.yourapp.com',

  async request(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      // Return a default error response instead of throwing
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null 
      };
    }
  },

  async get(endpoint: string) {
    try {
      return await this.request(endpoint);
    } catch (error) {
      console.error('API GET Error:', error);
      return { success: false, error: 'Failed to fetch data', data: null };
    }
  },

  async post(endpoint: string, data: any) {
    try {
      return await this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('API POST Error:', error);
      return { success: false, error: 'Failed to post data', data: null };
    }
  },

  async put(endpoint: string, data: any) {
    try {
      return await this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('API PUT Error:', error);
      return { success: false, error: 'Failed to update data', data: null };
    }
  },

  async delete(endpoint: string) {
    try {
      return await this.request(endpoint, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('API DELETE Error:', error);
      return { success: false, error: 'Failed to delete data', data: null };
    }
  },
};

// Helper function to get auth token
const getAuthToken = async (): Promise<string> => {
  // Implementation depends on your auth system
  // For now, return empty string
  return '';
};

export type { GameData, UserData, BetData, ApiResponse };