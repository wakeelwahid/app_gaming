import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Modal, TextInput, Alert, FlatList, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
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

// Import API services
import { userService } from './services/userService';
import { walletService } from './services/walletService';
import { gameService } from './services/gameService';

// Import constants
import { GAME_CARDS, FEATURES } from './constants/gameData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [wallet, setWallet] = useState('₹1000.00');
  const [winnings, setWinnings] = useState('₹0.00');
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  // Dummy bet history data
  const [betList, setBetList] = useState([
    // Jaipur King bets (Recent)
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

    // Faridabad bets (Mixed results)
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

    // Ghaziabad bets (Yesterday)
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

    // Gali bets (Current session)
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

    // Disawer bets (Mixed results)
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

    // Diamond King bets (Multiple sessions)
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

    // More Jaipur King bets (Previous sessions)
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

    // More Faridabad bets (Different amounts)
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

    // Additional mixed results for variety
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

  // Function to fetch bet history from API
  const fetchBetHistory = async () => {
    try {
      // If you have real API, uncomment below:
      // const response = await apiService.getBetHistory();
      // if (response.success) {
      //   setBetList(response.data);
      // }
    } catch (error) {
      console.error('Error fetching bet history:', error);
    }
  };

  // Call fetchBetHistory on component mount
  useEffect(() => {
    fetchBetHistory();
  }, []);
  const [currentBetType, setCurrentBetType] = useState('numbers');
  const [activeTab, setActiveTab] = useState('home');

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showAddCashModal, setShowAddCashModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john@example.com',
    referralCode: 'REF12345',
    kycStatus: 'VERIFIED' as 'VERIFIED' | 'PENDING' | 'REJECTED'
  });

  const [lastBetDetails, setLastBetDetails] = React.useState<any>(null);
  const [showBetSuccess, setShowBetSuccess] = React.useState(false);
  const [placedBets, setPlacedBets] = React.useState<any[]>([]);

  const gameCards = GAME_CARDS;
  const features = FEATURES;

  const handleMenuItemPress = (key: string) => {
    setActiveTab(key);
  };

  const handlePlayNow = (game: any) => {
    setSelectedGame(game);
    setShowBettingModal(true);
  };

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    setShowBettingModal(true);
  };

  const handleNumberSelect = (number: any, type: string, amount: number) => {
    // Add number to selected list with amount
    const existingBetIndex = betList.findIndex(b => b.number === number && b.type === type);

    if (existingBetIndex >= 0) {
      // Update existing bet amount
      const updatedBetList = [...betList];
      updatedBetList[existingBetIndex].amount = amount;
      setBetList(updatedBetList);
    } else {
      // Add new bet to list
      const newBet = {
        id: Date.now(),
        number,
        amount,
        type,
        game: selectedGame?.title || '',
        timestamp: new Date(),
      };
      setBetList([...betList, newBet]);
    }
  };

  const handlePlaceBets = () => {
    if (betList.length === 0) {
      Alert.alert('No Bets', 'कोई bet select नहीं किया गया है।');
      return;
    }

    const totalAmount = betList.reduce((total, bet) => total + bet.amount, 0);
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));

    if (currentWallet >= totalAmount) {
      // Update wallet
      setWallet(`₹${(currentWallet - totalAmount).toFixed(2)}`);

      // Create bet records with proper status and timestamp
      const newBets = betList.map(bet => ({
        ...bet,
        id: Date.now() + Math.random(), // Ensure unique ID
        game: selectedGame?.title || 'Unknown Game',
        status: 'pending' as const,
        timestamp: Date.now(),
        sessionTime: selectedGame?.timing || '09:00 PM - 04:50 PM',
        date: new Date().toISOString().split('T')[0]
      }));

      // Set success details for display
      setLastBetDetails({
        number: betList.length > 1 ? `${betList.length} Numbers` : betList[0].number,
        amount: totalAmount,
        type: betList.length > 1 ? 'Multiple' : betList[0].type,
        gameName: selectedGame?.title || '',
      });

      // Add to placed bets (these will show in MyBet component)
      setPlacedBets(prevBets => [...prevBets, ...newBets]);

      // Clear current bet selection
      setBetList([]);

      // Show success modal first
      setShowBetSuccess(true);

      // Close betting modal immediately
      setShowBettingModal(false);

      // Auto close success modal and navigate to MyBet after 3 seconds
      setTimeout(() => {
        setShowBetSuccess(false);
        setActiveTab('mybets'); // Navigate to MyBet tab
      }, 3000);

    } else {
      Alert.alert('Insufficient Balance', 'आपके wallet में पर्याप्त balance नहीं है।');
    }
  };

  const handleBetPlace = (amount: number) => {
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));

    if (currentWallet >= amount) {
      setWallet(`₹${(currentWallet - amount).toFixed(2)}`);

      const newBet = {
        id: Date.now(),
        number: selectedNumber,
        amount: amount,
        type: currentBetType,
        game: selectedGame?.title || 'Unknown Game',
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

      setBetList([...betList, newBet]);
      setShowAmountModal(false);
      Alert.alert('Bet Placed!', `आपका ₹${amount} का bet ${selectedNumber} पर लगा दिया गया है।`);
    } else {
      Alert.alert('Insufficient Balance', 'आपके wallet में पर्याप्त balance नहीं है।');
    }
  };

  const removeBet = (betId: number) => {
    const bet = betList.find(b => b.id === betId);
    if (bet) {
      const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
      setWallet(`₹${(currentWallet + bet.amount).toFixed(2)}`);
      setBetList(betList.filter(b => b.id !== betId));
    }
  };

  const handleAuthPress = (mode: string) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogin = async () => {
    // Here you can make API call for login
    // const result = await apiService.loginUser(phone, password);
    Alert.alert('Login', 'Login functionality to be implemented');
    setShowAuthModal(false);
  };

  const handleRegister = async () => {
    // Here you can make API call for registration
    // const result = await apiService.registerUser(userData);
    Alert.alert('Register', 'Registration functionality to be implemented');
    setShowAuthModal(false);
  };

  const handleAddCash = async (amount: number) => {
    // Here you can make API call to add money
    // const result = await apiService.addMoney(amount);
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
    setWallet(`₹${(currentWallet + amount).toFixed(2)}`);
    setShowAddCashModal(false);
    setDepositAmount('');
    Alert.alert('Deposit Successful', `₹${amount} has been added to your wallet. Admin approval pending.`);
  };

  const handleWithdraw = async (amount: number) => {
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
    if (currentWallet >= amount) {
      // Here you can make API call to withdraw money
      // const result = await apiService.withdrawMoney(amount);
      setWallet(`₹${(currentWallet - amount).toFixed(2)}`);
      setShowWithdrawModal(false);
      setShowWithdrawSuccessModal(true);
    } else {
      Alert.alert('Insufficient Balance', 'आपके wallet में पर्याप्त balance नहीं है।');
    }
  };

  const handleWithdrawSuccessClose = () => {
    setShowWithdrawSuccessModal(false);
    setWithdrawAmount('');
    setActiveTab('home');
  };

  const calculateDepositDetails = (amount: number) => {
    const gst = Math.round(amount * 0.28);
    const cashback = amount >= 2000 ? Math.round(amount * 0.05) : 0;
    const total = amount + gst;
    return { gst, cashback, total };
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
    setShowAddCashModal(false);
    setShowPaymentModal(true);
  };

  const handleUTRConfirmation = () => {
    if (utrNumber.length !== 12) {
      Alert.alert('Invalid UTR', 'Please enter a valid 12-digit UTR number');
      return;
    }

    // Close payment modal and show success modal
    setShowPaymentModal(false);
    setShowPaymentSuccessModal(true);
  };

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccessModal(false);
    setActiveTab('home');
    setUtrNumber('');
    setDepositAmount('');
    setSelectedPaymentMethod('');
    setShowAddCashModal(false);
  };

  const handleUpdateProfile = async (profileData: any) => {
    try {
      // const result = await userService.updateProfile(profileData);
      // if (result.success) {
      setUserData(profileData);
      Alert.alert('Success', 'Profile updated successfully!');
      // } else {
      //   Alert.alert('Error', result.error || 'Failed to update profile');
      // }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCompleteKYC = () => {
    Alert.alert('KYC Verification', 'KYC verification process will be implemented soon');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            gameCards={gameCards}
            features={features}
            onPlayNow={handlePlayNow}
          />
        );
      case 'wallet':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>💰 Wallet</Text>

            {/* Action Buttons - Moved to Top */}
            <View style={styles.walletActionsTop}>
              <TouchableOpacity 
                style={styles.addCashButton}
                onPress={() => setShowAddCashModal(true)}
              >
                <Text style={styles.addCashButtonText}>ADD CASH</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.withdrawButton}
                onPress={() => setShowWithdrawModal(true)}
              >
                <Text style={styles.withdrawButtonText}>WITHDRAW</Text>
              </TouchableOpacity>
            </View>

            {/* Enhanced Total Balance Card */}
            <View style={styles.totalBalanceCard}>
              <View style={styles.balanceCardHeader}>
                <Ionicons name="wallet" size={24} color="#4A90E2" />
                <Text style={styles.totalBalanceTitle}>TOTAL BALANCE</Text>
              </View>
              <Text style={styles.totalBalanceAmount}>{wallet}</Text>
              <View style={styles.balanceCardFooter}>
                <Ionicons name="checkmark-circle" size={16} color="#00FF88" />
                <Text style={styles.totalBalanceSubtitle}>Available for withdrawal & games</Text>
              </View>
            </View>

            {/* Enhanced Balance Breakdown */}
            <View style={styles.balanceBreakdown}>
              <View style={styles.balanceItem}>
                <View style={styles.balanceItemHeader}>
                  <Ionicons name="trophy" size={20} color="#00FF88" />
                  <Text style={styles.balanceItemTitle}>WINNINGS AMOUNT</Text>
                </View>
                <Text style={styles.winningsAmount}>₹1,250.00</Text>
                <View style={styles.balanceItemFooter}>
                  <Ionicons name="cash" size={14} color="#00FF88" />
                  <Text style={styles.balanceItemSubtitle}>Withdrawable • No TDS deducted</Text>
                </View>
              </View>

              <View style={styles.balanceItem}>
                <View style={styles.balanceItemHeader}>
                  <Ionicons name="gift" size={20} color="#FFD700" />
                  <Text style={styles.balanceItemTitle}>BONUS AMOUNT</Text>
                </View>
                <Text style={styles.bonusAmount}>₹500.00</Text>
                <View style={styles.balanceItemFooter}>
                  <Ionicons name="game-controller" size={14} color="#FFD700" />
                  <Text style={styles.balanceItemSubtitle}>Can be used to join contests only</Text>
                </View>
              </View>
            </View>
          </View>
        );
      case 'mybets':
      case 'history':
      case 'bets':

        return <MyBet placedBets={placedBets} />;
      case 'transactions':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>💸 Transactions</Text>
            <Text style={styles.comingSoonText}>Transaction history जल्द ही आएगा</Text>
          </View>
        );
      case 'refer':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>🎁 Refer & Earn</Text>
            <View style={styles.referContainer}>
              <Text style={styles.referTitle}>अपने दोस्तों को invite करें</Text>
              <Text style={styles.referCode}>Referral Code: {userData.referralCode}</Text>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareButtonText}>Share Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'terms':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>📋 Terms & Conditions</Text>
            <Text style={styles.comingSoonText}>Terms & Conditions जल्द ही उपलब्ध होंगे</Text>
          </View>
        );
      case 'privacy':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>🛡️ Privacy Policy</Text>
            <Text style={styles.comingSoonText}>Privacy Policy जल्द ही उपलब्ध होगी</Text>
          </View>
        );
      case 'games':
        return (
          <Games 
            gameCards={gameCards}
            onGameSelect={handleGameSelect}
          />
        );
      case 'profile':
        return (
          <Profile 
            userData={userData}
            onUpdateProfile={handleUpdateProfile}
            onCompleteKYC={handleCompleteKYC}
          />
        );
      default:
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>🚧 Coming Soon</Text>
            <Text style={styles.comingSoonText}>यह फीचर जल्द ही आएगा</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Component */}
      <Header wallet={wallet} onMenuItemPress={handleMenuItemPress} />

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Menu Component */}
      <BottomMenu
        activeTab={activeTab}
        onMenuItemPress={handleMenuItemPress}
      />

      {/* Betting Modal Component */}
      <BettingModal
        visible={showBettingModal}
        selectedGame={selectedGame}
        currentBetType={currentBetType}
        betList={betList}
        onClose={() => setShowBettingModal(false)}
        onBetTypeChange={setCurrentBetType}
        onNumberSelect={handleNumberSelect}
        onRemoveBet={removeBet}
        onPlaceBets={handlePlaceBets}
      />

      {/* Amount Selection Modal */}
      <Modal
        visible={showAmountModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAmountModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.amountModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Bet Amount - {selectedNumber}
              </Text>
              <TouchableOpacity onPress={() => setShowAmountModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.amountContent}>
              <View style={styles.betPreview}>
                <Text style={styles.betPreviewText}>
                  🎯 {selectedNumber} ({currentBetType})
                </Text>
                <Text style={styles.betPreviewGame}>
                  Game: {selectedGame?.title}
                </Text>
              </View>

              <Text style={styles.amountLabel}>Quick Select:</Text>
              <View style={styles.amountButtonsGrid}>
                {[10, 50, 200, 300, 500, 1000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.amountButton}
                    onPress={() => handleBetPlace(amount)}
                  >
                    <Text style={styles.amountButtonText}>₹{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.amountLabel}>Custom Amount (Min ₹10):</Text>
              <TextInput
                style={styles.customAmountInput}
                placeholder="Enter amount"
                placeholderTextColor="#999"
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.customAmountButton}
                onPress={() => {
                  const amount = parseFloat(customAmount);
                  if (amount >= 10) {
                    handleBetPlace(amount);
                    setCustomAmount('');
                  } else {
                    Alert.alert('Invalid Amount', 'Minimum bet amount is ₹10');
                  }
                }}
              >
                <Text style={styles.customAmountButtonText}>Place Custom Bet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Authentication Modal */}
      <Modal
        visible={showAuthModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAuthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.authModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {authMode === 'login' ? '🔐 Login' : '📝 Register'}
              </Text>
              <TouchableOpacity onPress={() => setShowAuthModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.authModalContent}>
              {authMode === 'login' ? (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Login to Your Account</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Mobile Number</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="+91 98765 43210"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#999"
                      secureTextEntry={true}
                    />
                  </View>

                  <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
                    <Text style={styles.submitButtonText}>Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setAuthMode('register')}>
                    <Text style={styles.switchModeText}>
                      Don't have an account? Register here
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Create New Account</Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Username *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter username"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Mobile Number *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="+91 98765 43210"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email (Optional)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter email address"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Create password"
                      placeholderTextColor="#999"
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Confirm password"
                      placeholderTextColor="#999"
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Referral Code (Optional)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter referral code"
                      placeholderTextColor="#999"
                    />
                  </View>

                  <TouchableOpacity style={styles.submitButton} onPress={handleRegister}>
                    <Text style={styles.submitButtonText}>Register</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setAuthMode('login')}>
                    <Text style={styles.switchModeText}>
                      Already have an account? Login here
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Wallet Operations Component */}
      <WalletOperations
        showAddCashModal={showAddCashModal}
        showWithdrawModal={showWithdrawModal}
        showPaymentModal={showPaymentModal}
        depositAmount={depositAmount}
        withdrawAmount={withdrawAmount}
        selectedPaymentMethod={selectedPaymentMethod}
        utrNumber={utrNumber}
        onCloseAddCash={() => setShowAddCashModal(false)}
        onCloseWithdraw={() => setShowWithdrawModal(false)}
        onClosePayment={() => setShowPaymentModal(false)}
        onDepositAmountChange={setDepositAmount}
        onWithdrawAmountChange={setWithdrawAmount}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        onUtrChange={setUtrNumber}
        onConfirmPayment={handleUTRConfirmation}
        onWithdrawRequest={handleWithdraw}
      />

      {/* Payment Success Component */}
      <PaymentSuccess
        visible={showPaymentSuccessModal}
        amount={depositAmount && calculateDepositDetails(parseFloat(depositAmount)).total.toString()}
        utrNumber={utrNumber}
        paymentMethod={selectedPaymentMethod}
        onClose={handlePaymentSuccessClose}
      />

      {/* Withdraw Success Component */}
      <WithdrawSuccess
        visible={showWithdrawSuccessModal}
        amount={withdrawAmount}
        onClose={handleWithdrawSuccessClose}
      />
      {activeTab === 'bets' && (
        <BetHistory 
          visible={true} 
          betHistory={betList || []}
          onClose={() => setActiveTab('home')}
        />
      )}

      <BetSuccessModal
        visible={showBetSuccess}
        betDetails={lastBetDetails}
        onClose={() => setShowBetSuccess(false)}
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
    padding: 20,
    alignItems: 'center',
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 20,
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
  },
  amountModal: {
    backgroundColor: '#0a0a0a',
    width: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    flex: 1,
  },
  amountContent: {
    padding: 20,
  },
  betPreview: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  betPreviewText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  betPreviewGame: {
    color: '#999',
    fontSize: 12,
  },
  amountLabel: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  amountButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  amountButton: {
    width: '30%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  amountButtonText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customAmountInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
  },
  customAmountButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  customAmountButtonText: {
    color: '#000',
    fontSize: 14,
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
  referContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  referTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    textAlign: 'center',
  },
  referCode: {
    fontSize: 16,
    color: '#00FF88',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  shareButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Add Cash Modal Styles
  addCashModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  addCashContent: {
    flex: 1,
    padding: 20,
  },
  depositLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  depositInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickAmountButton: {
    width: '30%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  quickAmountText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  depositSummary: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#999',
    fontSize: 14,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryValueGreen: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryLabelTotal: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryValueTotal: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 8,
  },
  paymentMethodLabel: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  paymentMethod: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  paymentMethodText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  depositInfo: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  depositInfoTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  depositInfoText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  depositButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 55,
  },
  depositButtonDisabled: {
    backgroundColor: '#333',
  },
  depositButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
    flexWrap: 'wrap',
  },
  // Payment QR Modal Styles
  paymentQRModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  paymentQRContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  qrCodeContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  qrSquare: {
    width: '48%',
    height: '48%',
    backgroundColor: '#ccc',
    margin: '1%',
    borderRadius: 5,
  },
  scanInstructions: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  highlightText: {
    color: '#00FF88',
    fontWeight: 'bold',
  },
  utrLabel: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  utrInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  paymentButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 55,
  },
  paymentButtonDisabled: {
    backgroundColor: '#333',
  },
  paymentButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
    flexWrap: 'wrap',
  },
  withdrawModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  withdrawContent: {
    flex: 1,
    padding: 20,
  },
  withdrawLabel: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  withdrawInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  withdrawButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 55,
  },
  withdrawButtonDisabled: {
    backgroundColor: '#333',
  },
  withdrawButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
    letterSpacing: 0.5,
    flexWrap: 'wrap',
  },
  successModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FF88',
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    color: '#00FF88',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  successAmount: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  successDetails: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
  closeButton: {
    backgroundColor: '#00FF88',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  gameTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});