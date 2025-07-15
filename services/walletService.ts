import { ApiResponse } from './apiService';

export interface WalletBalance {
  totalBalance: number;
  winnings: number;
  bonus: number;
  deposit: number;
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BET' | 'WIN' | 'BONUS';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  description: string;
  timestamp: string;
  utrNumber?: string;
  paymentMethod?: string;
}

export interface DepositRequest {
  amount: number;
  paymentMethod: string;
  utrNumber: string;
}

export interface WithdrawalRequest {
  amount: number;
  bankAccount: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
}

class WalletService {
  private baseUrl = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/wallet` : 'https://api.example.com/api/wallet';

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
          'Authorization': `Bearer ${this.getToken()}`,
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

  private getToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  // Wallet Balance APIs
  async getBalance(): Promise<ApiResponse<WalletBalance>> {
    return this.makeRequest<WalletBalance>('/balance');
  }

  // Deposit APIs
  async initiateDeposit(amount: number, paymentMethod: string): Promise<ApiResponse<{
    transactionId: string;
    qrCode: string;
    upiId: string;
    amount: number;
    gst: number;
    total: number;
  }>> {
    return this.makeRequest('/deposit/initiate', 'POST', { amount, paymentMethod });
  }

  async confirmDeposit(depositData: DepositRequest): Promise<ApiResponse<{
    transactionId: string;
    status: string;
    message: string;
  }>> {
    return this.makeRequest('/deposit/confirm', 'POST', depositData);
  }

  async getDepositHistory(): Promise<ApiResponse<Transaction[]>> {
    return this.makeRequest<Transaction[]>('/deposit/history');
  }

  // Withdrawal APIs
  async initiateWithdrawal(withdrawalData: WithdrawalRequest): Promise<ApiResponse<{
    transactionId: string;
    status: string;
    estimatedTime: string;
  }>> {
    return this.makeRequest('/withdrawal/initiate', 'POST', withdrawalData);
  }

  async getWithdrawalHistory(): Promise<ApiResponse<Transaction[]>> {
    return this.makeRequest<Transaction[]>('/withdrawal/history');
  }

  async cancelWithdrawal(transactionId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.makeRequest<{ success: boolean }>(`/withdrawal/${transactionId}/cancel`, 'POST');
  }

  // Transaction APIs
  async getTransactionHistory(
    page: number = 1,
    limit: number = 20,
    type?: string
  ): Promise<ApiResponse<{
    transactions: Transaction[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
  }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(type && { type }),
    });

    return this.makeRequest(`/transactions?${params}`);
  }

  async getTransactionDetails(transactionId: string): Promise<ApiResponse<Transaction>> {
    return this.makeRequest<Transaction>(`/transactions/${transactionId}`);
  }

  // Bank Account APIs
  async getBankAccounts(): Promise<ApiResponse<Array<{
    id: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
    isDefault: boolean;
  }>>> {
    return this.makeRequest('/bank-accounts');
  }

  async addBankAccount(bankData: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  }): Promise<ApiResponse<{ id: string; success: boolean }>> {
    return this.makeRequest('/bank-accounts', 'POST', bankData);
  }

  async deleteBankAccount(accountId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.makeRequest(`/bank-accounts/${accountId}`, 'DELETE');
  }

  // Payment Methods APIs
  async getPaymentMethods(): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    icon: string;
    isActive: boolean;
    processingTime: string;
    charges: number;
  }>>> {
    return this.makeRequest('/payment-methods');
  }
}

export const walletService = new WalletService();