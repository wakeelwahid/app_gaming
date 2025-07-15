import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Modal, TextInput, Alert, FlatList, Animated, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import components
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import BottomMenu from './components/BottomMenu';
import BettingModal from './components/BettingModal';

// Import API service
import { apiService } from './services/apiService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [wallet, setWallet] = useState('₹1000.00');
  const [winnings, setWinnings] = useState('₹0.00');
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [betList, setBetList] = useState([]);
  const [currentBetType, setCurrentBetType] = useState('numbers');
  const [activeTab, setActiveTab] = useState('home');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_WIDTH));
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
  const [countdownSeconds, setCountdownSeconds] = useState(5);

  const gameCards = [
    {
      id: 1,
      title: 'Jaipur King',
      openTime: '05:00 PM',
      closeTime: '04:50 PM',
      status: 'Open for Play',
      color: '#4A90E2',
      bgColor: '#1A3A5A'
    },
    {
      id: 2,
      title: 'Faridabad',
      openTime: '10:00 PM',
      closeTime: '06:40 PM',
      status: 'Open for Play',
      color: '#00FF88',
      bgColor: '#1A4A3A'
    },
    {
      id: 3,
      title: 'Ghaziabad',
      openTime: '11:00 PM',
      closeTime: '07:50 PM',
      status: 'Open for Play',
      color: '#4A90E2',
      bgColor: '#1A3A5A'
    },
    {
      id: 4,
      title: 'Gali',
      openTime: '04:00 AM',
      closeTime: '10:30 PM',
      status: 'Open for Play',
      color: '#9B59B6',
      bgColor: '#3A2A4A'
    },
    {
      id: 5,
      title: 'Disawer',
      openTime: '07:00 AM',
      closeTime: '02:30 AM',
      status: 'Open for Play',
      color: '#E74C3C',
      bgColor: '#4A2A2A'
    },
    {
      id: 6,
      title: 'Diamond King',
      openTime: '06:00 AM',
      closeTime: '10:10 PM',
      status: 'Multiple Sessions',
      color: '#FF1493',
      bgColor: '#4A2A3A'
    }
  ];

  const features = [
    {
      icon: '₹',
      title: '24x7 निकासी',
      subtitle: 'कभी भी पैसा निकाल निकालें'
    },
    {
      icon: '⏱',
      title: '5 मिनट में भुगतान',
      subtitle: 'तुरंत पेमेंट मिलती'
    },
    {
      icon: '🎧',
      title: '24x7 सपोर्ट',
      subtitle: 'हमेशा आपकी सेवा में'
    },
    {
      icon: '🛡',
      title: '100% सुरक्षित',
      subtitle: 'सुरक्षित और भरोसेमंद'
    }
  ];

  const toggleSideMenu = () => {
    if (showSideMenu) {
      Animated.timing(slideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 350,
        useNativeDriver: true,
      }).start(() => setShowSideMenu(false));
    } else {
      setShowSideMenu(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleMenuItemPress = (key: string) => {
    setActiveTab(key);
    toggleSideMenu();
  };

  const handlePlayNow = (game: any) => {
    setSelectedGame(game);
    setBetList([]);
    setShowBettingModal(true);
  };

  const handleNumberSelect = (number: any, type = 'numbers') => {
    setSelectedNumber(number);
    setCurrentBetType(type);
    setShowAmountModal(true);
  };

  const handleBetPlace = async (amount: number) => {
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
    if (currentWallet >= amount) {
      setWallet(`₹${(currentWallet - amount).toFixed(2)}`);

      const newBet = {
        id: Date.now(),
        number: selectedNumber,
        amount: amount,
        type: currentBetType,
        game: selectedGame.title
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
      setWithdrawAmount('');
      Alert.alert('Withdrawal Request', `₹${amount} withdrawal request submitted. Processing time: 5-10 minutes.`);
    } else {
      Alert.alert('Insufficient Balance', 'आपके wallet में पर्याप्त balance नहीं है।');
    }
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

    // Process payment
    const amount = parseFloat(depositAmount);
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
    setWallet(`₹${(currentWallet + amount).toFixed(2)}`);

    // Reset states
    setShowPaymentModal(false);
    setShowAddCashModal(false);
    setDepositAmount('');
    setUtrNumber('');
    setSelectedPaymentMethod('');

    Alert.alert(
      'Payment Successful!', 
      'Your payment has been confirmed. Amount will be added to your wallet within 5 minutes after admin verification.',
      [{ text: 'OK' }]
    );
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

            {/* Total Balance Card */}
            <View style={styles.totalBalanceCard}>
              <Text style={styles.totalBalanceTitle}>TOTAL BALANCE</Text>
              <Text style={styles.totalBalanceAmount}>{wallet}</Text>
              <Text style={styles.totalBalanceSubtitle}>Total amount</Text>
            </View>

            {/* Balance Breakdown */}
            <View style={styles.balanceBreakdown}>
              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemTitle}>WINNINGS AMOUNT</Text>
                <Text style={styles.winningsAmount}>{winnings}</Text>
                <Text style={styles.balanceItemSubtitle}>Available for withdrawal</Text>
              </View>

              <View style={styles.balanceItem}>
                <Text style={styles.balanceItemTitle}>BONUS AMOUNT</Text>
                <Text style={styles.bonusAmount}>₹0.00</Text>
                <Text style={styles.balanceItemSubtitle}>Includes direct bonus + commission earned</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.walletActions}>
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
          </View>
        );
      case 'history':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>📋 Bet History</Text>
            {betList.length > 0 ? (
              <FlatList
                data={betList}
                renderItem={({ item }) => (
                  <View style={styles.historyItem}>
                    <Text style={styles.historyNumber}>{item.number}</Text>
                    <Text style={styles.historyGame}>{item.game}</Text>
                    <Text style={styles.historyAmount}>₹{item.amount}</Text>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            ) : (
              <Text style={styles.noHistory}>कोई bet history नहीं है</Text>
            )}
          </View>
        );
      case 'profile':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>👤 Profile</Text>
            <View style={styles.profileCard}>
              <Text style={styles.profileName}>User Name</Text>
              <Text style={styles.profilePhone}>+91 98765 43210</Text>
              <TouchableOpacity style={styles.profileButton}>
                <Text style={styles.profileButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
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
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header Component */}
      <Header wallet={wallet} />

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Menu Component */}
      <BottomMenu
        showSideMenu={showSideMenu}
        slideAnim={slideAnim}
        activeTab={activeTab}
        onToggleMenu={toggleSideMenu}
        onMenuItemPress={handleMenuItemPress}
        onAuthPress={handleAuthPress}
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

      {/* Add Cash Modal */}
      <Modal
        visible={showAddCashModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddCashModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addCashModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💰 Add Money via UPI</Text>
              <TouchableOpacity onPress={() => setShowAddCashModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.addCashContent}>
              <Text style={styles.depositLabel}>Deposit Amount (₹)</Text>
              <TextInput
                style={styles.depositInput}
                placeholder="Enter amount"
                placeholderTextColor="#999"
                value={depositAmount}
                onChangeText={setDepositAmount}
                keyboardType="numeric"
              />

              <View style={styles.quickAmountsGrid}>
                {[100, 200, 500, 1000, 5000, 10000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAmountButton}
                    onPress={() => setDepositAmount(amount.toString())}
                  >
                    <Text style={styles.quickAmountText}>₹{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {depositAmount && parseFloat(depositAmount) >= 100 && (
                <View style={styles.depositSummary}>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Deposit Amount (Excl. Govt. Tax)</Text>
                    <Text style={styles.summaryValue}>₹{depositAmount}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Govt. Tax (28% GST)</Text>
                    <Text style={styles.summaryValue}>₹{calculateDepositDetails(parseFloat(depositAmount)).gst}</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Cashback Bonus</Text>
                    <Text style={styles.summaryValueGreen}>+₹{calculateDepositDetails(parseFloat(depositAmount)).cashback}</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabelTotal}>Total (A + B)</Text>
                    <Text style={styles.summaryValueTotal}>₹{calculateDepositDetails(parseFloat(depositAmount)).total}</Text>
                  </View>
                </View>
              )}

              <Text style={styles.paymentMethodLabel}>UPI Payment Method</Text>
              <View style={styles.paymentMethods}>
                <TouchableOpacity 
                  style={styles.paymentMethod}
                  onPress={() => handlePaymentMethodSelect('PhonePe')}
                >
                  <Text style={styles.paymentMethodText}>📱 PhonePe</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.paymentMethod}
                  onPress={() => handlePaymentMethodSelect('Google Pay')}
                >
                  <Text style={styles.paymentMethodText}>🟢 Google Pay</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.paymentMethod}
                  onPress={() => handlePaymentMethodSelect('Paytm')}
                >
                  <Text style={styles.paymentMethodText}>💙 Paytm</Text>
                </TouchableOpacity>
              </View>

              {/* Show deposit info only when no amount is entered or amount is below 100 */}
              {(!depositAmount || parseFloat(depositAmount) < 100) && (
                <View style={styles.depositInfo}>
                  <Text style={styles.depositInfoTitle}>📌 Deposit Information:</Text>
                  <Text style={styles.depositInfoText}>• Minimum deposit: ₹100</Text>
                  <Text style={styles.depositInfoText}>• Instant UPI deposits (Max ₹50,000)</Text>
                  <Text style={styles.depositInfoText}>• 28% GST applicable on all deposits</Text>
                  <Text style={styles.depositInfoText}>• 5% cashback on deposits above ₹2000</Text>
                  <Text style={styles.depositInfoText}>• Wallet balance updated after admin approval</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment QR Code Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.paymentQRModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Your Payment</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.paymentQRContent}>
              {/* QR Code Display */}
              <View style={styles.qrCodeContainer}>
                <View style={styles.qrCodePlaceholder}>
                  <View style={styles.qrSquare} />
                  <View style={styles.qrSquare} />
                  <View style={styles.qrSquare} />
                  <View style={styles.qrSquare} />
                </View>
              </View>

              <Text style={styles.scanInstructions}>
                Scan this code using <Text style={styles.highlightText}>{selectedPaymentMethod}</Text> to pay ₹{depositAmount && calculateDepositDetails(parseFloat(depositAmount)).total}
              </Text>

              {/* UTR Input */}
              <Text style={styles.utrLabel}>UTR Number</Text>
              <TextInput
                style={styles.utrInput}
                placeholder="Enter 12-digit UTR"
                placeholderTextColor="#999"
                value={utrNumber}
                onChangeText={setUtrNumber}
                keyboardType="numeric"
                maxLength={12}
              />

              <TouchableOpacity
                style={[
                  styles.confirmPaymentButton,
                  utrNumber.length !== 12 && styles.confirmPaymentButtonDisabled
                ]}
                onPress={handleUTRConfirmation}
                disabled={utrNumber.length !== 12}
              >
                <Text style={styles.confirmPaymentButtonText}>CONFIRM PAYMENT</Text>
              </TouchableOpacity>

              {/* UTR Help */}
              <View style={styles.utrHelp}>
                <Text style={styles.utrHelpTitle}>How to Find Your UTR Number:</Text>
                <Text style={styles.utrHelpText}>• Check your bank SMS for the transaction confirmation</Text>
                <Text style={styles.utrHelpText}>• Look for a 12-digit number labeled "UTR" or "Ref No"</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.withdrawModalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💳 Withdraw Chips to Your Account</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.withdrawContent}>
              <Text style={styles.withdrawLabel}>Amount (₹)</Text>
              <TextInput
                style={styles.withdrawInput}
                placeholder="Enter amount"
                placeholderTextColor="#999"
                value={withdrawAmount}
                onChangeText={setWithdrawAmount}
                keyboardType="numeric"
              />

              <View style={styles.quickAmountsGrid}>
                {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAmountButton}
                    onPress={() => setWithdrawAmount(amount.toString())}
                  >
                    <Text style={styles.quickAmountText}>₹{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.withdrawRequestButton, (!withdrawAmount || parseFloat(withdrawAmount) < 100) && styles.withdrawButtonDisabled]}
                onPress={() => {
                  const amount = parseFloat(withdrawAmount);
                  if (amount >= 100) {
                    handleWithdraw(amount);
                  } else {
                    Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₹100');
                  }
                }}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) < 100}
              >
                <Text style={styles.withdrawRequestButtonText}>REQUEST WITHDRAWAL</Text>
              </TouchableOpacity>

              <View style={styles.withdrawInfo}>
                <Text style={styles.withdrawInfoTitle}>ℹ️ Withdrawal Information:</Text>
                <Text style={styles.withdrawInfoText}>• Minimum withdrawal: ₹100</Text>
                <Text style={styles.withdrawInfoText}>• Maximum per request: ₹30,000</Text>
                <Text style={styles.withdrawInfoText}>• Processing time: 5 to 10 minutes</Text>
                <Text style={styles.withdrawInfoText}>• Daily limit: ₹50,000</Text>
                <Text style={styles.withdrawInfoText}>• Bank charges may apply</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

            {/* Payment Success Modal */}
            <Modal
                visible={showPaymentSuccessModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {}}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.paymentSuccessModalContainer}>
                        <View style={styles.successContent}>
                            {/* Success Icon */}
                            <View style={styles.successIcon}>
                                <Text style={styles.successIconText}>✅</Text>
                            </View>

                            {/* Success Message */}
                            <Text style={styles.successTitle}>Payment Pending!</Text>
                            <Text style={styles.successMessage}>
                                Your payment of ₹{depositAmount && calculateDepositDetails(parseFloat(depositAmount)).total} via {selectedPaymentMethod} is being processed.
                            </Text>

                            {/* UTR Display */}
                            <View style={styles.utrDisplayContainer}>
                                <Text style={styles.utrDisplayLabel}>UTR Number:</Text>
                                <Text style={styles.utrDisplayValue}>{utrNumber}</Text>
                            </View>

                            {/* Timer Message */}
                            <View style={styles.timerContainer}>
                                <Text style={styles.timerMessage}>
                                    💰 Wallet will be updated in 5 minutes
                                </Text>
                                <Text style={styles.timerNote}>
                                    Admin approval required for security
                                </Text>
                            </View>

                            {/* Countdown */}
                            <View style={styles.countdownContainer}>
                                <Text style={styles.countdownText}>
                                    Redirecting to home in {countdownSeconds} seconds...
                                </Text>
                            </View>

                            {/* Manual Home Button */}
                            <TouchableOpacity
                                style={styles.goHomeButton}
                                onPress={() => {
                                    setShowPaymentSuccessModal(false);
                                    setActiveTab('home');
                                    setUtrNumber('');
                                    setDepositAmount('');
                                    setSelectedPaymentMethod('');
                                }}
                            >
                                <Text style={styles.goHomeButtonText}>GO TO HOME</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    width: '100%',
  },
  totalBalanceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    letterSpacing: 1,
    marginBottom: 10,
  },
  totalBalanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FF88',
    marginBottom: 5,
  },
  totalBalanceSubtitle: {
    color: '#999',
    fontSize: 12,
  },
  balanceBreakdown: {
    width: '100%',
    marginBottom: 30,
  },
  balanceItem: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  balanceItemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4A90E2',
    letterSpacing: 1,
    marginBottom: 8,
  },
  winningsAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FF88',
    marginBottom: 5,
  },
  bonusAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  balanceItemSubtitle: {
    color: '#999',
    fontSize: 11,
    lineHeight: 16,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 15,
  },
  addCashButton: {
    flex: 1,
    backgroundColor: '#00FF88',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCashButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  withdrawButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  customAmountButtonText: {
    color: '#000',
    fontSize: 16,
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
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchModeText: {
    color: '#00FF88',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
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
    paddingVertical: 15,
    color: '#fff',
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    marginBottom: 20,
  },
  confirmPaymentButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmPaymentButtonDisabled: {
    backgroundColor: '#333',
  },
  confirmPaymentButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  utrHelp: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  utrHelpTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  utrHelpText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  // Withdraw Modal Styles
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
    borderColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  withdrawRequestButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  withdrawButtonDisabled: {
    backgroundColor: '#333',
  },
  withdrawRequestButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  withdrawInfo: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  withdrawInfoTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  withdrawInfoText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },

    // Payment Success Modal Styles
    paymentSuccessModalContainer: {
      backgroundColor: '#0a0a0a',
      width: '90%',
      borderRadius: 15,
      padding: 20,
      alignItems: 'center',
    },
    successContent: {
      alignItems: 'center',
    },
    successIcon: {
      backgroundColor: '#00FF88',
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    successIconText: {
      fontSize: 30,
      color: '#000',
    },
    successTitle: {
      color: '#FFD700',
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    successMessage: {
      color: '#999',
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 22,
    },
    utrDisplayContainer: {
      backgroundColor: '#1a1a1a',
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#333',
      width: '100%',
      marginBottom: 20,
    },
    utrDisplayLabel: {
      color: '#4A90E2',
      fontSize: 14,
      fontWeight: 'bold',
    },
    utrDisplayValue: {
      color: '#fff',
      fontSize: 16,
      marginTop: 5,
    },
    timerContainer: {
      marginBottom: 20,
      alignItems: 'center',
    },
    timerMessage: {
      color: '#00FF88',
      fontSize: 16,
      fontWeight: 'bold',
    },
    timerNote: {
      color: '#999',
      fontSize: 12,
    },
    countdownContainer: {
      marginBottom: 20,
    },
    countdownText: {
      color: '#FFD700',
      fontSize: 16,
    },
    goHomeButton: {
      backgroundColor: '#4A90E2',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
    },
    goHomeButtonText: {
      color: '#000',
      fontSize: 16,
      fontWeight: 'bold',
    },

});