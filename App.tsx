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
import AgeVerificationModal from './components/AgeVerificationModal';
import Transaction from './components/Transaction';
import KYCPage from './components/KYCPage';

// Import API services
import { userService } from './services/userService';
import { walletService } from './services/walletService';
import { gameService } from './services/gameService';

// Import constants
import { GAME_CARDS, FEATURES } from './constants/gameData';

// Import hooks
import { useAuth } from './hooks/useAuth';
import { useWallet } from './hooks/useWallet';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;
const isLargeDevice = SCREEN_WIDTH >= 768;

export default function App() {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.8);

  // Auth state
  const { user, isAuthenticated, login, register, logout, updateProfile } = useAuth();

  // Wallet state
  const { wallet, winnings, bonus, addMoney, withdrawMoney } = useWallet();

  // Core state
  const [activeTab, setActiveTab] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [betList, setBetList] = useState([]);
  const [placedBets, setPlacedBets] = useState([]);
  const [lastBetDetails, setLastBetDetails] = useState(null);
  const [userData, setUserData] = useState({
    name: 'Player',
    phone: '+91 98765 43210',
    email: 'player@example.com',
    referralCode: 'REF12345',
    kycStatus: 'VERIFIED' as 'VERIFIED' | 'PENDING' | 'REJECTED'
  });

  // Modal states
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [showBetSuccess, setShowBetSuccess] = useState(false);
  const [showAddCashModal, setShowAddCashModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  // Form states
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [currentBetType, setCurrentBetType] = useState('numbers');

  // Sample bet history with cleaner structure
  const [betHistory] = useState([
    {
      id: '1',
      game: 'Premium Game',
      number: '14',
      amount: 100,
      type: 'single',
      status: 'pending',
      timestamp: Date.now() - 3600000,
      sessionTime: '09:00 PM - 04:50 PM'
    },
    {
      id: '2',
      game: 'Premium Game',
      number: '77',
      amount: 200,
      type: 'jodi',
      status: 'win',
      winAmount: 1800,
      timestamp: Date.now() - 7200000,
      sessionTime: '10:00 PM - 06:40 PM'
    }
  ]);

  const gameCards = GAME_CARDS;
  const features = FEATURES;

  // Initialize animations
  useEffect(() => {
    setShowAgeVerification(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // Tab animation
  const animateTabChange = (newTab: string) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
    setActiveTab(newTab);
  };

  const handlePlayNow = (game: any) => {
    setSelectedGame(game);
    setShowBettingModal(true);
  };

  const handleBetSuccess = (betDetails: any) => {
    setLastBetDetails(betDetails);
    setShowBetSuccess(true);
    setShowBettingModal(false);

    setTimeout(() => {
      setShowBetSuccess(false);
      animateTabChange('mybets');
    }, 3000);
  };

  const handleKYCPress = () => {
    setShowKYCPage(true);
  };

  const handleAgeVerificationAccept = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
  };

  const handleAgeVerificationReject = () => {
    Alert.alert(
      'Access Denied',
      'You must be 18+ to use this gaming platform.',
      [
        {
          text: 'Exit',
          onPress: () => {
            // Handle app exit
          }
        }
      ]
    );
  };

  const handleMenuItemPress = (key: string) => {
    animateTabChange(key);
  };

  const handleGameSelect = (game: any) => {
    setSelectedGame(game);
    setBetList([]);
    setShowBettingModal(true);
  };

  const handleNumberSelect = (number: any, type: string, amount: number) => {
    const existingBetIndex = betList.findIndex(b => b.number === number && b.type === type);

    if (existingBetIndex >= 0) {
      const updatedBetList = [...betList];
      updatedBetList[existingBetIndex].amount = amount;
      setBetList(updatedBetList);
    } else {
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
      Alert.alert('No Selection', 'Please select numbers to place bet.');
      return;
    }

    const totalAmount = betList.reduce((total, bet) => total + bet.amount, 0);
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));

    if (currentWallet >= totalAmount) {
      withdrawMoney(totalAmount);
    }

    const newBets = betList.map(bet => ({
      ...bet,
      id: Date.now() + Math.random(),
      game: selectedGame?.title || 'Premium Game',
      status: 'pending' as const,
      timestamp: Date.now(),
      sessionTime: selectedGame?.timing || '09:00 PM - 04:50 PM',
      date: new Date().toISOString().split('T')[0]
    }));

    const betDetails = {
      number: betList.length > 1 ? `${betList.length} Numbers` : String(betList[0].number),
      amount: totalAmount,
      type: betList.length > 1 ? 'Multiple' : betList[0].type,
      gameName: selectedGame?.title || '',
      betCount: betList.length
    };

    setPlacedBets(prevBets => [...prevBets, ...newBets]);
    setLastBetDetails(betDetails);
    setBetList([]);
    setShowBettingModal(false);
    setShowBetSuccess(true);

    setTimeout(() => {
      setShowBetSuccess(false);
      animateTabChange('mybets');
    }, 3000);
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
    setShowPaymentModal(false);
    setShowPaymentSuccess(true);
  };

  const handleWithdrawRequest = (amount: number) => {
    setShowWithdrawModal(false);
    setShowWithdrawSuccess(true);
  };

  const handlePaymentSuccessClose = () => {
    setShowPaymentSuccess(false);
    animateTabChange('home');
    setUtrNumber('');
    setDepositAmount('');
    setSelectedPaymentMethod('');
  };

  const handleWithdrawSuccessClose = () => {
    setShowWithdrawSuccess(false);
    setWithdrawAmount('');
    animateTabChange('wallet');
  };

  const handleHeaderMenuItemPress = (key: string) => {
    animateTabChange(key);
  };

  const removeBet = (betId: number) => {
    setBetList(betList.filter(b => b.id !== betId));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            gameCards={gameCards}
            features={features}
            onPlayNow={handlePlayNow}
            onKYCPress={handleKYCPress}
          />
        );
      case 'wallet':
        return (
          <Animated.View style={[styles.walletContainer, { opacity: fadeAnim }]}>
            <View style={styles.mainBalanceCard}>
              <Text style={styles.walletTitle}>💰 My Wallet</Text>
              <Text style={styles.mainBalanceAmount}>{wallet}</Text>
              <Text style={styles.balanceSubtitle}>Total Available Balance</Text>
            </View>

            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.actionButtonAdd}
                onPress={() => setShowAddCashModal(true)}
              >
                <Text style={styles.actionButtonIcon}>➕</Text>
                <Text style={[styles.actionButtonText, { color: '#000' }]}>Add Money</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButtonWithdraw}
                onPress={() => setShowWithdrawModal(true)}
              >
                <Text style={styles.actionButtonIcon}>💳</Text>
                <Text style={[styles.actionButtonText, { color: '#4A90E2' }]}>Withdraw</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.balanceBreakdown}>
              <View style={styles.breakdownItem}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownIcon}>🏆</Text>
                  <View>
                    <Text style={styles.breakdownTitle}>Winnings</Text>
                    <Text style={styles.breakdownSubtitle}>Withdrawable</Text>
                  </View>
                </View>
                <Text style={styles.breakdownAmount}>₹1,250</Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownIcon}>🎁</Text>
                  <View>
                    <Text style={styles.breakdownTitle}>Bonus</Text>
                    <Text style={styles.breakdownSubtitle}>Game only</Text>
                  </View>
                </View>
                <Text style={styles.breakdownAmountBonus}>₹500</Text>
              </View>
            </View>
          </Animated.View>
        );
      case 'mybets':
        return <MyBet placedBets={placedBets} />;
      case 'transactions':
        return <Transaction />;
      case 'games':
        return <Games gameCards={gameCards} onGameSelect={handleGameSelect} />;
      case 'profile':
        return <Profile userData={userData} onUpdateProfile={setUserData} onCompleteKYC={handleKYCPress} />;
      case 'refer':
        return (
          <View style={styles.tabContent}>
            {/* Refer & Earn Component */}
            <View style={styles.referContainer}>
              <View style={styles.referHeaderCard}>
                <Text style={styles.referMainTitle}>Invite Your Friends & Earn</Text>
                <Text style={styles.referSubtitle}>Get ₹500 for every friend who joins using your code!</Text>
              </View>

              <View style={styles.referCodeCard}>
                <Text style={styles.referCodeLabel}>Your Referral Code</Text>
                <View style={styles.codeContainer}>
                  <Text style={styles.referralCode}>{userData.referralCode}</Text>
                  <TouchableOpacity style={styles.copyButton}>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.shareButton}>
                  <Ionicons name="share-social" size={24} color="#fff" />
                  <Text style={styles.shareButtonText}>Share Code</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.howItWorksCard}>
                <Text style={styles.howItWorksTitle}>How It Works</Text>
                <View style={styles.stepContainer}>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>1</Text>
                    <Text style={styles.stepText}>Share your referral code with friends.</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>2</Text>
                    <Text style={styles.stepText}>Your friend signs up using your code.</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>3</Text>
                    <Text style={styles.stepText}>You both get ₹500 when they make their first deposit!</Text>
                  </View>
                </View>
              </View>

              <View style={styles.referStatsCard}>
                <Text style={styles.statsTitle}>Your Referral Stats</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Friends Invited</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Friends Joined</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>₹2500</Text>
                    <Text style={styles.statLabel}>Total Earnings</Text>
                  </View>
                </View>
              </View>

              <View style={styles.termsCard}>
                <Text style={styles.termsTitle}>Terms & Conditions</Text>
                <Text style={styles.termText}>• Referrals must be new users.</Text>
                <Text style={styles.termText}>• Rewards are credited upon first deposit.</Text>
                <Text style={styles.termText}>• Terms are subject to change.</Text>
              </View>
            </View>
          </View>
        );
      case 'terms':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>📋 Terms & Conditions</Text>
            <View style={styles.policyContainer}>
              <Text style={styles.policySection}>🔞 Age Requirement</Text>
              <Text style={styles.policyText}>• You must be 18+ years old to use this app</Text>
              <Text style={styles.policyText}>• Age verification may be required</Text>

              <Text style={styles.policySection}>💰 Betting Rules</Text>
              <Text style={styles.policyText}>• Minimum bet amount is ₹10</Text>
              <Text style={styles.policyText}>• Maximum daily bet limit applies</Text>
              <Text style={styles.policyText}>• All bets are final once placed</Text>
              <Text style={styles.policyText}>• Results are declared as per official timing</Text>

              <Text style={styles.policySection}>💳 Payment Terms</Text>
              <Text style={styles.policyText}>• Deposits are processed instantly</Text>
              <Text style={styles.policyText}>• Withdrawals take 5-30 minutes</Text>
              <Text style={styles.policyText}>• GST charges apply on deposits</Text>
              <Text style={styles.policyText}>• TDS deducted as per government rules</Text>

              <Text style={styles.policySection}>⚠️ Responsible Gaming</Text>
              <Text style={styles.policyText}>• Set betting limits for yourself</Text>
              <Text style={styles.policyText}>• Never bet more than you can afford</Text>
              <Text style={styles.policyText}>• Seek help if gambling becomes a problem</Text>

              <Text style={styles.policySection}>🚫 Prohibited Activities</Text>
              <Text style={styles.policyText}>• Creating multiple accounts</Text>
              <Text style={styles.policyText}>• Using automated betting systems</Text>
              <Text style={styles.policyText}>• Attempting to manipulate results</Text>
            </View>
          </View>
        );
      case 'privacy':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>🛡️ Privacy Policy</Text>
            <View style={styles.policyContainer}>
              <Text style={styles.policySection}>📋 Information We Collect</Text>
              <Text style={styles.policyText}>• Personal information (name, phone, email)</Text>
              <Text style={styles.policyText}>• Transaction history and betting records</Text>
              <Text style={styles.policyText}>• Device information and app usage data</Text>

              <Text style={styles.policySection}>🔒 How We Use Your Information</Text>
              <Text style={styles.policyText}>• To provide gaming services</Text>
              <Text style={styles.policyText}>• To process deposits and withdrawals</Text>
              <Text style={styles.policyText}>• To ensure account security</Text>
              <Text style={styles.policyText}>• To comply with legal requirements</Text>

              <Text style={styles.policySection}>🛡️ Data Protection</Text>
              <Text style={styles.policyText}>• We use industry-standard encryption</Text>
              <Text style={styles.policyText}>• Your data is stored securely</Text>
              <Text style={styles.policyText}>• We never share personal data with third parties</Text>

              <Text style={styles.policySection}>📞 Contact Us</Text>
              <Text style={styles.policyText}>For privacy concerns, contact our support team.</Text>
            </View>
          </View>
        );
      case 'help':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>🆘 Help & Support</Text>
            <View style={styles.helpContainer}>
              <Text style={styles.helpWelcome}>हमारी सपोर्ट टीम 24x7 आपकी सेवा में है!</Text>

              {/* Contact Methods */}
              <View style={styles.contactSection}>
                <Text style={styles.contactTitle}>📱 Contact Us</Text>

                <TouchableOpacity style={styles.contactButton} onPress={() => {
                  // Open WhatsApp
                  Alert.alert('WhatsApp Support', 'WhatsApp पर संपर्क करने के लिए +91 98765 43210 पर मैसेज करें।');
                }}>
                  <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactMethod}>WhatsApp Support</Text>
                    <Text style={styles.contactDetails}>+91 98765 43210</Text>
                    <Text style={styles.contactTiming}>24x7 Available</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.contactButton} onPress={() => {
                  // Open Telegram
                  Alert.alert('Telegram Support', 'Telegram पर @SattaKingSupport से संपर्क करें।');
                }}>
                  <Ionicons name="paper-plane" size={24} color="#0088CC" />
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactMethod}>Telegram Support</Text>
                    <Text style={styles.contactDetails}>@SattaKingSupport</Text>
                    <Text style={styles.contactTiming}>Instant Response</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* FAQ Section */}
              <View style={styles.faqSection}>
                <Text style={styles.faqTitle}>❓ Frequently Asked Questions</Text>

                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>Q: How to deposit money?</Text>
                  <Text style={styles.faqAnswer}>A: Go to Wallet → Add Cash → Select UPI method → Enter amount → Pay through UPI app</Text>
                </View>

                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>Q: How long does withdrawal take?</Text>
                  <Text style={styles.faqAnswer}>A: Withdrawals are processed within 5-30 minutes to your bank account.</Text>
                </View>

                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>Q: What is minimum bet amount?</Text>
                  <Text style={styles.faqAnswer}>A: Minimum bet amount is ₹10 for all games.</Text>
                </View>

                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>Q: When are results declared?</Text>
                  <Text style={styles.faqAnswer}>A: Results are declared as per official timing shown on each game card.</Text>
                </View>

                <View style={styles.faqItem}>
                  <Text style={styles.faqQuestion}>Q: Is my money safe?</Text>
                  <Text style={styles.faqAnswer}>A: Yes, all transactions are secured with bank-level encryption.</Text>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.quickActions}>
                <Text style={styles.quickActionsTitle}>⚡ Quick Actions</Text>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => animateTabChange('transactions')}>
                  <Ionicons name="receipt" size={20} color="#4A90E2" />
                  <Text style={styles.quickActionText}>Check Transaction History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => animateTabChange('mybets')}>
                  <Ionicons name="list" size={20} color="#4A90E2" />
                  <Text style={styles.quickActionText}>View My Bets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton} onPress={() => animateTabChange('wallet')}>
                  <Ionicons name="wallet" size={20} color="#4A90E2" />
                  <Text style={styles.quickActionText}>Check Wallet Balance</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      default:
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>🚧 Coming Soon</Text>
            <Text style={styles.comingSoonText}>This feature will be available soon</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <Header wallet={wallet} onMenuItemPress={handleHeaderMenuItemPress} />

      <Animated.View style={[
        styles.content,
        { 
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        },
        !isAgeVerified && styles.blurredContent
      ]}>
        {showKYCPage ? (
          <KYCPage onBack={() => setShowKYCPage(false)} />
        ) : (
          renderContent()
        )}
      </Animated.View>

      <BottomMenu
        activeTab={activeTab}
        onMenuItemPress={handleMenuItemPress}
      />

      {!isAgeVerified && !showAgeVerification && (
        <View style={styles.verificationOverlay}>
          <Text style={styles.overlayText}>Age verification required</Text>
        </View>
      )}

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
        onWithdrawRequest={handleWithdrawRequest}
      />

      <PaymentSuccess
        visible={showPaymentSuccess}
        amount={depositAmount}
        utrNumber={utrNumber}
        paymentMethod={selectedPaymentMethod}
        onClose={handlePaymentSuccessClose}
      />

      <WithdrawSuccess
        visible={showWithdrawSuccess}
        amount={withdrawAmount}
        paymentMethod={selectedPaymentMethod || 'Selected UPI'}
        onClose={handleWithdrawSuccessClose}
      />

      <BetSuccessModal
        visible={showBetSuccess}
        betDetails={lastBetDetails}
        onClose={() => {
          setShowBetSuccess(false);
          animateTabChange('mybets');
        }}
        onNavigateToMyBets={() => {
          setShowBetSuccess(false);
          animateTabChange('mybets');
        }}
      />

      <AgeVerificationModal
        visible={showAgeVerification}
        onAccept={handleAgeVerificationAccept}
        onReject={handleAgeVerificationReject}
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
    justifyContent: 'center',
  },
  tabTitle: {
    fontSize: isSmallDevice ? 20 : isMediumDevice ? 22 : 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: isSmallDevice ? 15 : 20,
  },
  comingSoonText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
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
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  walletTitle: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mainBalanceAmount: {
    color: '#00FF88',
    fontSize: isSmallDevice ? 24 : isMediumDevice ? 28 : 32,
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
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
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
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  actionButtonIcon: {
    fontSize: 18,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  balanceBreakdown: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
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
  blurredContent: {
    opacity: 0.3,
  },
  referContainer: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
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
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  // Enhanced Refer & Earn Styles
  referHeaderCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  referMainTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  referSubtitle: {
    color: '#00FF88',
    fontSize: 14,
    textAlign: 'center',
  },
  referCodeCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  referCodeLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  referralCode: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginRight: 10,
  },
  copyButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
  },
  howItWorksCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  howItWorksTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  stepContainer: {
    gap: 12,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 30,
    marginRight: 15,
  },
  stepText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  referStatsCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  statsTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#00FF88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  termsCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  termsTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  termText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
    paddingLeft: 10,
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
});