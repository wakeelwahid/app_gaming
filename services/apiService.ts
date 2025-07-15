
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

class ApiService {
  private baseUrl = 'https://your-api-url.com/api'; // Replace with your actual API URL

  // Generic API call method
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          // Add authorization token if needed
          // 'Authorization': `Bearer ${token}`,
        },
      };

      if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'API call failed',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Game related APIs
  async getGames(): Promise<ApiResponse<GameData[]>> {
    return this.makeRequest<GameData[]>('/games');
  }

  async getGameResults(gameId: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/games/${gameId}/results`);
  }

  // User related APIs
  async loginUser(phone: string, password: string): Promise<ApiResponse<UserData>> {
    return this.makeRequest<UserData>('/auth/login', 'POST', {
      phone,
      password,
    });
  }

  async registerUser(userData: {
    username: string;
    phone: string;
    email?: string;
    password: string;
    referralCode?: string;
  }): Promise<ApiResponse<UserData>> {
    return this.makeRequest<UserData>('/auth/register', 'POST', userData);
  }

  async getUserProfile(): Promise<ApiResponse<UserData>> {
    return this.makeRequest<UserData>('/user/profile');
  }

  async updateUserProfile(userData: Partial<UserData>): Promise<ApiResponse<UserData>> {
    return this.makeRequest<UserData>('/user/profile', 'PUT', userData);
  }

  // Wallet related APIs
  async getWalletBalance(): Promise<ApiResponse<{ balance: number; winnings: number }>> {
    return this.makeRequest('/wallet/balance');
  }

  async addMoney(amount: number): Promise<ApiResponse<{ newBalance: number }>> {
    return this.makeRequest('/wallet/add', 'POST', { amount });
  }

  async withdrawMoney(amount: number): Promise<ApiResponse<{ newBalance: number }>> {
    return this.makeRequest('/wallet/withdraw', 'POST', { amount });
  }

  // Betting related APIs
  async placeBet(betData: {
    gameId: number;
    number: string | number;
    amount: number;
    type: string;
  }): Promise<ApiResponse<BetData>> {
    return this.makeRequest<BetData>('/bets/place', 'POST', betData);
  }

  async getBetHistory(): Promise<ApiResponse<BetData[]>> {
    return this.makeRequest<BetData[]>('/bets/history');
  }

  async cancelBet(betId: number): Promise<ApiResponse<{ success: boolean }>> {
    return this.makeRequest(`/bets/${betId}/cancel`, 'DELETE');
  }

  // Transaction related APIs
  async getTransactionHistory(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/transactions');
  }

  // Referral related APIs
  async getReferralData(): Promise<ApiResponse<{ code: string; earnings: number; referrals: any[] }>> {
    return this.makeRequest('/referrals');
  }
}

export const apiService = new ApiService();
export type { GameData, UserData, BetData, ApiResponse };
