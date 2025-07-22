import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Modal, TextInput, Alert, FlatList, Animated, Dimensions, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import Games from './components/Games';
import BottomMenu from './components/BottomMenu';
import BettingModal from './components/BettingModal';
import BetSuccessModal from './components/BetSuccessModal';
import MyBet from './components/MyBet';
import WalletOperations from './components/WalletOperations';
import PaymentSuccess from './components/PaymentSuccess';
import WithdrawSuccess from './components/WithdrawSuccess';
import Profile from './components/Profile';
import BetHistory from './components/BetHistory';
import AgeVerificationModal from './components/AgeVerificationModal';
import Transaction from './components/Transaction';
import KYCPage from './components/KYCPage';
import ReferPage from './components/ReferPage';
import RefundPolicy from './components/RefundPolicy';
import {
  GameHistory,
} from './components';

// Import API services
import { userService } from './services/userService';
import { walletService } from './services/walletService';
import { gameService } from './services/gameService';

// Import constants
import { GAME_CARDS, FEATURES } from './constants/gameData';

// Import hooks
import { useAuth } from './hooks/useAuth';
import { useWallet } from './hooks/useWallet';

const { width: SCREEN_WIDTH, height: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeDevice = SCREEN_WIDTH >= 768;

export default function App() {
  // Auth state
  const { user, isAuthenticated, login, register, logout, updateProfile } = useAuth();

  // Wallet state
  const { wallet, winnings, bonus, addMoney, withdrawMoney } = useWallet();

  const [winningsState, setWinningsState] = useState('₹0.00');
  const [showBettingModalState, setShowBettingModalState] = useState(false);
  const [selectedGameState, setSelectedGameState] = useState(null);
  const [showAmountModalState, setShowAmountModalState] = useState(false);
  const [selectedNumberState, setSelectedNumberState] = useState(null);
  const [customAmountState, setCustomAmountState] = useState('');
  const [betListState, setBetListState] = useState([]);
  const [betHistoryState, setBetHistoryState] = useState([
    {
      id: '1',
      game: 'Jaipur King',
      number: '14',
      amount: 100,
      type: 'single',
      status: 'pending',
      timestamp: Date.now() - 3600000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '2',
      game: 'Jaipur King',
      number: '2',
      amount: 100,
      type: 'andar',
      status: 'pending',
      timestamp: Date.now() - 3600000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '3',
      game: 'Jaipur King',
      number: '61',
      amount: 100,
      type: 'single',
      status: 'pending',
      timestamp: Date.now() - 3600000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '4',
      game: 'Jaipur King',
      number: '5',
      amount: 50,
      type: 'bahar',
      status: 'pending',
      timestamp: Date.now() - 3600000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '5',
      game: 'Jaipur King',
      number: '77',
      amount: 200,
      type: 'jodi',
      status: 'pending',
      timestamp: Date.now() - 3600000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '6',
      game: 'Jaipur King',
      number: '9',
      amount: 150,
      type: 'single',
      status: 'pending',
      timestamp: Date.now() - 3600000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '7',
      game: 'Faridabad',
      number: '6',
      amount: 100,
      type: 'single',
      status: 'win',
      winAmount: 900,
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '8',
      game: 'Faridabad',
      number: '8',
      amount: 100,
      type: 'single',
      status: 'win',
      winAmount: 900,
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '9',
      game: 'Faridabad',
      number: '1',
      amount: 100,
      type: 'andar',
      status: 'win',
      winAmount: 180,
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '10',
      game: 'Faridabad',
      number: '27',
      amount: 100,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '11',
      game: 'Faridabad',
      number: '33',
      amount: 100,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '12',
      game: 'Faridabad',
      number: '4',
      amount: 100,
      type: 'bahar',
      status: 'loss',
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '13',
      game: 'Faridabad',
      number: '19',
      amount: 500,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '14',
      game: 'Faridabad',
      number: '99',
      amount: 300,
      type: 'jodi',
      status: 'loss',
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '15',
      game: 'Faridabad',
      number: '0',
      amount: 100,
      type: 'andar',
      status: 'win',
      winAmount: 180,
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '16',
      game: 'Faridabad',
      number: '7',
      amount: 250,
      type: 'single',
      status: 'win',
      winAmount: 2250,
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '17',
      game: 'Ghaziabad',
      number: '89',
      amount: 200,
      type: 'jodi',
      status: 'loss',
      timestamp: Date.now() - 86400000,
      sessionTime: '11:00 PM - 07:50 PM'
    },
    {
      id: '18',
      game: 'Ghaziabad',
      number: '45',
      amount: 150,
      type: 'single',
      status: 'win',
      winAmount: 1350,
      timestamp: Date.now() - 86400000,
      sessionTime: '11:00 PM - 07:50 PM'
    },
    {
      id: '19',
      game: 'Ghaziabad',
      number: '3',
      amount: 100,
      type: 'single',
      status: 'win',
      winAmount: 900,
      timestamp: Date.now() - 86400000,
      sessionTime: '11:00 PM - 07:50 PM'
    },
    {
      id: '20',
      game: 'Ghaziabad',
      number: '7',
      amount: 50,
      type: 'bahar',
      status: 'loss',
      timestamp: Date.now() - 86400000,
      sessionTime: '11:00 PM - 07:50 PM'
    },
    {
      id: '21',
      game: 'Ghaziabad',
      number: '56',
      amount: 300,
      type: 'jodi',
      status: 'loss',
      timestamp: Date.now() - 86400000,
      sessionTime: '11:00 PM - 07:50 PM'
    },
    {
      id: '22',
      game: 'Ghaziabad',
      number: '2',
      amount: 100,
      type: 'andar',
      status: 'win',
      winAmount: 180,
      timestamp: Date.now() - 86400000,
      sessionTime: '11:00 PM - 07:50 PM'
    },
    {
      id: '23',
      game: 'Gali',
      number: '12',
      amount: 300,
      type: 'single',
      status: 'pending',
      timestamp: Date.now() - 1800000,
      sessionTime: '04:00 AM - 10:30 PM'
    },
    {
      id: '24',
      game: 'Gali',
      number: '3',
      amount: 200,
      type: 'bahar',
      status: 'pending',
      timestamp: Date.now() - 1800000,
      sessionTime: '04:00 AM - 10:30 PM'
    },
    {
      id: '25',
      game: 'Gali',
      number: '88',
      amount: 150,
      type: 'jodi',
      status: 'pending',
      timestamp: Date.now() - 1800000,
      sessionTime: '04:00 AM - 10:30 PM'
    },
    {
      id: '26',
      game: 'Gali',
      number: '5',
      amount: 100,
      type: 'single',
      status: 'pending',
      timestamp: Date.now() - 1800000,
      sessionTime: '04:00 AM - 10:30 PM'
    },
    {
      id: '27',
      game: 'Gali',
      number: '9',
      amount: 100,
      type: 'andar',
      status: 'pending',
      timestamp: Date.now() - 1800000,
      sessionTime: '04:00 AM - 10:30 PM'
    },
    {
      id: '28',
      game: 'Disawer',
      number: '23',
      amount: 100,
      type: 'single',
      status: 'win',
      winAmount: 900,
      timestamp: Date.now() - 10800000,
      sessionTime: '07:00 AM - 02:30 AM'
    },
    {
      id: '29',
      game: 'Disawer',
      number: '67',
      amount: 200,
      type: 'jodi',
      status: 'loss',
      timestamp: Date.now() - 10800000,
      sessionTime: '07:00 AM - 02:30 AM'
    },
    {
      id: '30',
      game: 'Disawer',
      number: '4',
      amount: 50,
      type: 'bahar',
      status: 'win',
      winAmount: 90,
      timestamp: Date.now() - 10800000,
      sessionTime: '07:00 AM - 02:30 AM'
    },
    {
      id: '31',
      game: 'Disawer',
      number: '1',
      amount: 150,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 10800000,
      sessionTime: '07:00 AM - 02:30 AM'
    },
    {
      id: '32',
      game: 'Disawer',
      number: '8',
      amount: 100,
      type: 'andar',
      status: 'win',
      winAmount: 180,
      timestamp: Date.now() - 10800000,
      sessionTime: '07:00 AM - 02:30 AM'
    },
    {
      id: '33',
      game: 'Diamond King',
      number: '55',
      amount: 500,
      type: 'jodi',
      status: 'win',
      winAmount: 4500,
      timestamp: Date.now() - 14400000,
      sessionTime: '06:00 AM - 10:10 PM'
    },
    {
      id: '34',
      game: 'Diamond King',
      number: '6',
      amount: 200,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 14400000,
      sessionTime: '06:00 AM - 10:10 PM'
    },
    {
      id: '35',
      game: 'Diamond King',
      number: '11',
      amount: 100,
      type: 'jodi',
      status: 'loss',
      timestamp: Date.now() - 14400000,
      sessionTime: '06:00 AM - 10:10 PM'
    },
    {
      id: '36',
      game: 'Diamond King',
      number: '3',
      amount: 50,
      type: 'bahar',
      status: 'win',
      winAmount: 90,
      timestamp: Date.now() - 14400000,
      sessionTime: '06:00 AM - 10:10 PM'
    },
    {
      id: '37',
      game: 'Diamond King',
      number: '9',
      amount: 100,
      type: 'single',
      status: 'win',
      winAmount: 900,
      timestamp: Date.now() - 14400000,
      sessionTime: '06:00 AM - 10:10 PM'
    },
    {
      id: '38',
      game: 'Diamond King',
      number: '0',
      amount: 75,
      type: 'andar',
      status: 'loss',
      timestamp: Date.now() - 14400000,
      sessionTime: '06:00 AM - 10:10 PM'
    },
    {
      id: '39',
      game: 'Jaipur King',
      number: '44',
      amount: 400,
      type: 'jodi',
      status: 'win',
      winAmount: 3600,
      timestamp: Date.now() - 172800000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '40',
      game: 'Jaipur King',
      number: '7',
      amount: 250,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 172800000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '41',
      game: 'Jaipur King',
      number: '6',
      amount: 100,
      type: 'bahar',
      status: 'win',
      winAmount: 180,
      timestamp: Date.now() - 172800000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '42',
      game: 'Jaipur King',
      number: '22',
      amount: 300,
      type: 'jodi',
      status: 'loss',
      timestamp: Date.now() - 172800000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '43',
      game: 'Faridabad',
      number: '13',
      amount: 1000,
      type: 'single',
      status: 'win',
      winAmount: 9000,
      timestamp: Date.now() - 259200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '44',
      game: 'Faridabad',
      number: '78',
      amount: 600,
      type: 'jodi',
      status: 'loss',
      timestamp: Date.now() - 259200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '45',
      game: 'Faridabad',
      number: '5',
      amount: 200,
      type: 'andar',
      status: 'win',
      winAmount: 360,
      timestamp: Date.now() - 259200000,
      sessionTime: '10:00 PM - 06:40 PM'
    },
    {
      id: '46',
      game: 'Gali',
      number: '90',
      amount: 800,
      type: 'jodi',
      status: 'win',
      winAmount: 7200,
      timestamp: Date.now() - 345600000,
      sessionTime: '04:00 AM - 10:30 PM'
    },
    {
      id: '47',
      game: 'Disawer',
      number: '2',
      amount: 150,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 432000000,
      sessionTime: '07:00 AM - 02:30 AM'
    },
    {
      id: '48',
      game: 'Diamond King',
      number: '77',
      amount: 500,
      type: 'jodi',
      status: 'win',
      winAmount: 4500,
      timestamp: Date.now() - 518400000,
      sessionTime: '06:00 AM - 10:10 PM'
    },
    {
      id: '49',
      game: 'Ghaziabad',
      number: '4',
      amount: 100,
      type: 'single',
      status: 'loss',
      timestamp: Date.now() - 604800000,
      sessionTime: '11:00 PM - 07:50 PM'
    },
    {
      id: '50',
      game: 'Jaipur King',
      number: '9',
      amount: 200,
      type: 'bahar',
      status: 'win',
      winAmount: 360,
      timestamp: Date.now() - 691200000,
      sessionTime: '09:00 PM - 04:50 PM'
    }
  ]);
  const [currentBetTypeState, setCurrentBetTypeState] = useState('numbers');
  const [showAuthModalState, setShowAuthModalState] = useState(false);
  const [authModeState, setAuthModeState] = useState('login');
  const [showAddCashModalState, setShowAddCashModalState] = useState(false);
  const [showWithdrawModalState, setShowWithdrawModalState] = useState(false);
  const [depositAmountState, setDepositAmountState] = useState('');
  const [withdrawAmountState, setWithdrawAmountState] = useState('');
  const [showPaymentModalState, setShowPaymentModalState] = useState(false);
  const [selectedPaymentMethodState, setSelectedPaymentMethodState] = useState('');
  const [utrNumberState, setUtrNumberState] = useState('');
  const [showPaymentSuccessModalState, setShowPaymentSuccessModalState] = useState(false);
  const [showWithdrawSuccessModalState, setShowWithdrawSuccessModalState] = useState(false);
  const [countdownSecondsState, setCountdownSecondsState] = useState(5);
  const [userDataState, setUserDataState] = useState({
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john@example.com',
    referralCode: 'REF12345',
    kycStatus: 'VERIFIED' as 'VERIFIED' | 'PENDING' | 'REJECTED'
  });

  const [lastBetDetailsState, setLastBetDetailsState] = React.useState<any>(null);
  const [showBetSuccessState, setShowBetSuccessState] = React.useState(false);
  const [placedBetsState, setPlacedBetsState] = React.useState<any[]>([]);

  const [showAgeVerificationState, setShowAgeVerificationState] = React.useState(false);
  const [isAgeVerifiedState, setIsAgeVerifiedState] = React.useState(false);
  const [showKYCPageState, setShowKYCPageState] = React.useState(false);
  const [showRefundPolicyState, setShowRefundPolicyState] = React.useState(false);

  const gameCards = GAME_CARDS;
  const features = FEATURES;

  // UI state - consolidated to avoid conflicts
  const [activeTabLocal, setActiveTabLocal] = useState('home');
  const [showBettingModalLocal, setShowBettingModalLocal] = useState(false);
  const [showKYCPageLocal, setShowKYCPageLocal] = useState(false);
  const [showAgeVerificationLocal, setShowAgeVerificationLocal] = useState(false);
  const [isAgeVerifiedLocal, setIsAgeVerifiedLocal] = useState(false);

  // Game state
  const [selectedGameLocal, setSelectedGameLocal] = useState(null);

  // Modal states
  const [showAddCashModalLocal, setShowAddCashModalLocal] = useState(false);
  const [showWithdrawModalLocal, setShowWithdrawModalLocal] = useState(false);
  const [showPaymentModalLocal, setShowPaymentModalLocal] = useState(false);
  const [showPaymentSuccessModalLocal, setShowPaymentSuccessModalLocal] = useState(false);
  const [showWithdrawSuccessModalLocal, setShowWithdrawSuccessModalLocal] = useState(false);

  // Form states
  const [depositAmountLocal, setDepositAmountLocal] = useState('');
  const [withdrawAmountLocal, setWithdrawAmountLocal] = useState('');
  const [selectedPaymentMethodLocal, setSelectedPaymentMethodLocal] = useState('');
  const [utrNumberLocal, setUtrNumberLocal] = useState('');
  const [activeTabState, setActiveTabState] = useState('home');
    const [currentViewState, setCurrentViewState] = useState('home');

  useEffect(() => {
    // Check age verification on app start
    setShowAgeVerificationState(true);
  }, []);

  const handlePlayNow = (game: any) => {
    setSelectedGameState(game);
    setShowBettingModalState(true);
  };

  const handleBetSuccessState = (betDetails: any) => {
    setLastBetDetailsState(betDetails);
    setShowBetSuccessState(true);
    setShowBettingModalState(false);

    setTimeout(() => {
      setShowBetSuccessState(false);
      setActiveTabLocal('mybets');
    }, 3000);
  };

  const handleKYCPress = () => {
    setShowKYCPageState(true);
  };

  const handleAgeVerificationAccept = () => {
    setIsAgeVerifiedState(true);
    setShowAgeVerificationState(false);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethodState(method);
    setShowAddCashModalState(false);
    setShowPaymentModalState(true);
  };

  const handleUTRConfirmation = async () => {
    if (utrNumberState.length !== 12) {
      return;
    }

    //const amount = parseFloat(depositAmount);
    //const result = await addMoney(amount, selectedPaymentMethod, utrNumber);
    setShowPaymentModalState(false);
    setShowPaymentSuccessModalState(true);
  };

  const handleWithdrawRequest = async (amount: number) => {
    // Close withdraw modal first
    setShowWithdrawModalState(false);

    // Show withdrawal success page
    setShowWithdrawSuccessModalState(true);

    // Here you can make API call to withdraw money
    // const result = await withdrawMoney(amount);

    console.log('Withdrawal request submitted for amount:', amount);
  };
  const handleMenuItemPress = (key: string) => {
    setActiveTabLocal(key);
  };

  const handleGameSelect = (game: any) => {
    setSelectedGameLocal(game);
    setBetListState([]); // Clear any previous selections
    setShowBettingModalLocal(true);
  };

  const handleNumberSelect = (number: any, type: string, amount: number) => {
    // Add number to selected list with amount
    const existingBetIndex = betListState.findIndex(b => b.number === number && b.type === type);

    if (existingBetIndex >= 0) {
      // Update existing bet amount
      const updatedBetList = [...betListState];
      updatedBetList[existingBetIndex].amount = amount;
      setBetListState(updatedBetList);
    } else {
      // Add new bet to list
      const newBet = {
        id: Date.now(),
        number,
        amount,
        type,
        game: selectedGameState?.title || '',
        timestamp: new Date(),
      };
      setBetListState([...betListState, newBet]);
    }
  };

  const handlePlaceBets = () => {
    console.log('handlePlaceBets called with betList:', betListState);

    if (betListState.length === 0) {
      Alert.alert('No Bets', 'कोई bet select नहीं किया गया है।');
      return;
    }

    const totalAmount = betListState.reduce((total, bet) => total + bet.amount, 0);
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));

    console.log('Total amount:', totalAmount, 'Current wallet:', currentWallet);

    // For demo purposes, allow bet placement even with insufficient balance
    // In production, you would validate wallet balance properly

    // Deduct money from wallet (only if sufficient balance)
    if (currentWallet >= totalAmount) {
      withdrawMoney(totalAmount);
    }

    // Create bet records with proper status and timestamp
    const newBets = betListState.map(bet => ({
      ...bet,
      id: Date.now() + Math.random(),
      game: selectedGameLocal?.title || selectedGameState?.title || 'Unknown Game',
      status: 'pending' as const,
      timestamp: Date.now(),
      sessionTime: selectedGameLocal?.timing || selectedGameState?.timing || '09:00 PM - 04:50 PM',
      date: new Date().toISOString().split('T')[0]
    }));

    // Set success details for display
    const betDetails = {
      number: betListState.length > 1 ? `${betListState.length} Numbers` : String(betListState[0].number),
      amount: totalAmount,
      type: betListState.length > 1 ? 'Multiple' : betListState[0].type,
      gameName: selectedGameLocal?.title || selectedGameState?.title || '',
      betCount: betListState.length
    };

    // Add to placed bets and bet history
    setPlacedBetsState(prevBets => [...prevBets, ...newBets]);
    setBetHistoryState(prevHistory => [...prevHistory, ...newBets]);
    setLastBetDetailsState(betDetails);

    // Clear current bet selection
    setBetListState([]);

    // Close betting modal and show success
    setShowBettingModalLocal(false);
    setShowBettingModalState(false);
    setShowBetSuccessState(true);

    console.log('Bet placed successfully! Success modal should be visible');

    // Auto navigate to Home after 7 seconds
    setTimeout(() => {
      console.log('Auto navigating to home');
      setShowBetSuccessState(false);
      setActiveTabLocal('home');
      setActiveTabState('home');
    }, 7000);
  };

  const handleBetPlace = (amount: number) => {
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));

    if (currentWallet >= amount) {
      //setWallet(`₹${(currentWallet - amount).toFixed(2)}`);

      const newBet = {
        id: Date.now(),
        number: selectedNumberState,
        amount: amount,
        type: currentBetTypeState,
        game: selectedGameState?.title || 'Unknown Game',
        timestamp: new Date(),
        status: 'pending' as const
      };

      // Here you can make API call to place bet
      // const result = await apiService.placeBet({
      //   gameId: selectedGame.id,
      //   number: selectedNumber,
      //   amount,
      //   type: currentBetType
      // });

      setBetListState([...betListState, newBet]);
      setShowAmountModalState(false);
      Alert.alert('Bet Placed!', `आपका ₹${amount} का bet ${selectedNumberState} पर लगा दिया गया है।`);
    } else {
      Alert.alert('Insufficient Coins', 'आपके wallet में पर्याप्त coins नहीं हैं।');
    }
  };

  const removeBet = (betId: number) => {
    const bet = betListState.find(b => b.id === betId);
    if (bet) {
      const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
      //setWallet(`₹${(currentWallet + bet.amount).toFixed(2)}`);
      setBetListState(betListState.filter(b => b.id !== betId));
    }
  };

  const handleAuthPress = (mode: string) => {
    setAuthModeState(mode);
    setShowAuthModalState(true);
  };

  const handleLogin = async () => {
    // Here you can make API call for login
    // const result = await apiService.loginUser(phone, password);
    Alert.alert('Login', 'Login functionality to be implemented');
    setShowAuthModalState(false);
  };

  Verification Modal */}
      <AgeVerificationModal
        visible={showAgeVerificationState}
        onAccept={handleAgeVerificationAcceptState}
        onReject={handleAgeVerificationReject}
      />
        <BetSuccessModal
        visible={showBetSuccessState}
        betDetails={lastBetDetailsState}
        onClose={() => setShowBetSuccessState(false)}
        onNavigateToMyBets={() => {
          setShowBetSuccessState(false);
          setActiveTabLocal('mybets');
          setActiveTabState('mybets');
        }}
        onNavigateToHome={() => {
          setShowBetSuccessState(false);
          setActiveTabLocal('home');
          setActiveTabState('home');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: isSmallDevice ? 10 : isMediumDevice ? 15 : 20,
    alignItems: 'center',
  },
  tabTitle: {
    fontSize: isSmallDevice ? 20 : isMediumDevice ? 22 : 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: isSmallDevice ? 15 : 20,
  },
  walletContainer: {
    flex: 1,
    padding: isSmallDevice ? 10 : isMediumDevice ? 15 : 20,
  },
  mainBalanceCard: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 15 : isMediumDevice ? 20 : 25,
    borderRadius: isSmallDevice ? 10 : 15,
    alignItems: 'center',
    marginBottom: isSmallDevice ? 15 : 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  walletTitle: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mainBalanceAmount: {
    color: '#00FF88',    fontSize: isSmallDevice ? 24 : isMediumDevice ? 28 : 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balanceSubtitle: {
    color: '#999',
    fontSize: isSmallDevice ? 12 : 14,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: isSmallDevice ? 10 : 15,
    marginBottom: isSmallDevice ? 15 : 20,
  },
  actionButtonAdd: {
    flex: 1,
    backgroundColor: '#00FF88',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 8 : 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isSmallDevice ? 6 : 8,
    minHeight: isSmallDevice ? 45 : 50,
  },
  actionButtonWithdraw: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 8 : 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isSmallDevice ? 6 : 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    minHeight: isSmallDevice ? 45 : 50,
  },
  actionButtonIcon: {
    fontSize: 18,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  balanceBreakdownSimple: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breakdownIcon: {
    fontSize: 20,
  },
  breakdownTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  breakdownSubtitle: {
    color: '#999',
    fontSize: 12,
  },
  breakdownAmount: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  breakdownAmountBonus: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickStatsCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  quickStatsTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#00FF88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  totalBalanceCard: {
    backgroundColor: '#1a1a1a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
    width: '100%',
  },
  balanceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  balanceCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  totalBalanceTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A90E2',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  totalBalanceAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00FF88',
    marginBottom: 4,
  },
  totalBalanceSubtitle: {
    color: '#999',
    fontSize: 10,
  },
  balanceBreakdown: {
    width: '100%',
    marginBottom: 30,
  },
  balanceItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  balanceItemTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4A90E2',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  balanceItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  balanceItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  winningsAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF88',
    marginBottom: 4,
  },
  bonusAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  balanceItemSubtitle: {
    color: '#999',
    fontSize: 9,
    lineHeight: 14,
  },
  walletActionsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  addCashButton: {
    flex: 1,
    backgroundColor: '#00FF88',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCashButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  withdrawButtonText: {
    color: '#4A90E2',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  historyItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  historyNumber: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyGame: {
    color: '#999',
    fontSize: 12,
  },
  historyAmount: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noHistory: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  profileCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  profilePhone: {
    color: '#999',
    fontSize: 16,
    marginBottom: 20,
  },
  profileButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  comingSoonText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 10 : 20,
  },
  amountModal: {
    backgroundColor: '#0a0a0a',
    width: isSmallDevice ? '95%' : '90%',
    maxWidth: 500,
    borderRadius: isSmallDevice ? 10 : 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isSmallDevice ? 15 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    flex: 1,
  },
  amountContent: {
    padding: isSmallDevice ? 15 : 20,
  },
  betPreview: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 8 : 10,
    marginBottom: isSmallDevice ? 15 : 20,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  betPreviewText: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  betPreviewGame: {
    color: '#999',
    fontSize: isSmallDevice ? 10 : 12,
  },
  amountLabel: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: isSmallDevice ? 15 : 20,
  },
  amountButton: {
    width: isSmallDevice ? '31%' : '30%',
    backgroundColor: '#1a1a1a',
    paddingVertical: isSmallDevice ? 10 : 12,
    borderRadius: isSmallDevice ? 6 : 8,
    alignItems: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
    borderWidth: 1,
    borderColor: '#00FF88',
    minHeight: isSmallDevice ? 35 : 40,
  },
  amountButtonText: {
    color: '#00FF88',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  customAmountInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: isSmallDevice ? 6 : 8,
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 10 : 12,
    color: '#fff',
    fontSize: isSmallDevice ? 14 : 16,
    marginBottom: isSmallDevice ? 12 : 15,
    minHeight: isSmallDevice ? 40 : 45,
  },
  customAmountButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 6 : 8,
    alignItems: 'center',
    minHeight: isSmallDevice ? 40 : 45,
  },
  customAmountButtonText: {
    color: '#000',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  authModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  authModalContent: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  switchModeText: {
    color: '#00FF88',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  referBenefitsContainer: {
    marginBottom: 20,
  },
  benefitItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  benefitTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  benefitDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 18,
  },
  referralStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    width: '48%',
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  statMainNumber: {
    color: '#00FF88',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statMainLabel: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  referralCodeSection: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  referralCodeTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  referralCodeSubtitle: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  codeDisplayContainer: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  referralCodeDisplay: {
    color: '#00FF88',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  referralActions: {
    gap: 10,
  },
  copyCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  copyCodeText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  shareWhatsAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  shareWhatsAppText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  shareTelegramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0088CC',
    paddingVertical: 12,
    borderRadius: 8,
  },
  shareTelegramText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  howItWorksSection: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  howItWorksTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  stepsContainer: {
    gap: 15,
  },
  workStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  workStepNumber: {
    backgroundColor: '#4A90E2',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    width: 30,
    height: 30,
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: 30,
  },
  workStepContent: {
    flex: 1,
  },
  workStepTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workStepDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 18,
  },
  commissionStructure: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  commissionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  commissionItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  commissionItem: {
    alignItems: 'center',
  },
  commissionAmount: {
    color: '#00FF88',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commissionLabel: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },

  // Policy & Terms Styles
  policyContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  policySection: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  policyText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
    paddingLeft: 10,
  },

  // Help & Support Styles
  helpContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
  helpWelcome: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactSection: {
    marginBottom: 25,
  },
  contactTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  contactInfo: {
    marginLeft: 15,
    flex: 1,
  },
  contactMethod: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contactDetails: {
    color: '#4A90E2',
    fontSize: 14,
    marginBottom: 2,
  },
  contactTiming: {
    color: '#00FF88',
    fontSize: 12,
  },
  faqSection: {
    marginBottom: 25,
  },
  faqTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  faqItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  faqQuestion: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  faqAnswer: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
  quickActions: {
    marginBottom: 20,
  },
  quickActionsTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 10,
  },
  verificationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  // Refund Policy Styles
  refundContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: isSmallDevice ? 15 : 20,
  },
  pageSubtitle: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
  },
  noticeContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a1a00',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  noticeIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noticeText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  contactContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  contactTitle: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  contactText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactButtons: {
    gap: 10,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    padding: 12,
    borderRadius: 8,
  },
  telegramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0088CC',
    padding: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  lastUpdated: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  lastUpdatedText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  lastUpdatedSubtext: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});