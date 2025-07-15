import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal, TextInput, Alert, FlatList, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function App() {
  const [wallet, setWallet] = useState('₹1000.00');
  const [winnings, setWinnings] = useState('₹0.00');
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [betList, setBetList] = useState([]);
  const [currentBetType, setCurrentBetType] = useState('numbers'); // 'numbers', 'andar', 'bahar'
  const [activeTab, setActiveTab] = useState('home');
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [slideAnim] = useState(new Animated.Value(SCREEN_WIDTH));
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const gameCards = [
    {
      id: 1,
      title: 'Jaipur King',
      openTime: '05:00 PM',
      closeTime: '04:50 PM',
      status: 'Open for Play',
      color: '#4A90E2',
      bgColor: '#1A2A3A'
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

  const menuItems = [
    { icon: 'home', title: 'Home', key: 'home', color: '#4A90E2', bgColor: '#1A2A3A' },
    { icon: 'game-controller', title: 'Play Games', key: 'play', color: '#00FF88', bgColor: '#002A1A' },
    { icon: 'person', title: 'My Profile', key: 'profile', color: '#4A90E2', bgColor: '#001A2A' },
    { icon: 'wallet', title: 'My Wallet', key: 'wallet', color: '#9B59B6', bgColor: '#2A1A2A' },
    { icon: 'time', title: 'Game History', key: 'history', color: '#E74C3C', bgColor: '#2A1A1A' },
    { icon: 'swap-horizontal', title: 'Transactions', key: 'transactions', color: '#FF8C00', bgColor: '#2A1A00' },
    { icon: 'people', title: 'Refer & Earn', key: 'refer', color: '#1ABC9C', bgColor: '#1A2A2A' },
    { icon: 'document-text', title: 'Terms & Conditions', key: 'terms', color: '#95A5A6', bgColor: '#2A2A2A' },
    { icon: 'refresh', title: 'Refund Policy', key: 'refund', color: '#F39C12', bgColor: '#2A2200' },
    { icon: 'shield-checkmark', title: 'Privacy Policy', key: 'privacy', color: '#8E44AD', bgColor: '#2A1A2A' },
  ];

  const authItems = [
    { icon: 'log-in', title: 'Login', key: 'login', color: '#00FF88' },
    { icon: 'person-add', title: 'Register', key: 'register', color: '#4A90E2' },
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

  const handleMenuItemPress = (key) => {
    setActiveTab(key);
    toggleSideMenu();
  };

  const handlePlayNow = (game) => {
    setSelectedGame(game);
    setBetList([]);
    setShowBettingModal(true);
  };

  const handleNumberSelect = (number, type = 'numbers') => {
    setSelectedNumber(number);
    setCurrentBetType(type);
    setShowAmountModal(true);
  };

  const handleBetPlace = (amount) => {
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

      setBetList([...betList, newBet]);
      setShowAmountModal(false);
      Alert.alert('Bet Placed!', `आपका ₹${amount} का bet ${selectedNumber} पर लगा दिया गया है।`);
    } else {
      Alert.alert('Insufficient Balance', 'आपके wallet में पर्याप्त balance नहीं है।');
    }
  };

  const removeBet = (betId) => {
    const bet = betList.find(b => b.id === betId);
    if (bet) {
      const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
      setWallet(`₹${(currentWallet + bet.amount).toFixed(2)}`);
      setBetList(betList.filter(b => b.id !== betId));
    }
  };

  const getTotalBetAmount = () => {
    return betList.reduce((total, bet) => total + bet.amount, 0);
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 100; i++) {
      const bet = betList.find(b => b.number === i && b.type === 'numbers');
      const isSelected = !!bet;
      numbers.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.numberButton,
            isSelected && styles.selectedNumberButton
          ]}
          onPress={() => {
            if (isSelected) {
              removeBet(bet.id);
            } else {
              handleNumberSelect(i, 'numbers');
            }
          }}
        >
          <Text style={[
            styles.numberText,
            isSelected && styles.selectedNumberText
          ]}>{i}</Text>
          {isSelected && (
            <View style={styles.betAmountBadge}>
              <Text style={styles.betAmountBadgeText}>₹{bet.amount}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return numbers;
  };

  const renderAndarNumbers = () => {
    const numbers = [];
    for (let i = 0; i <= 9; i++) {
      const numberKey = `Andar ${i}`;
      const bet = betList.find(b => b.number === numberKey && b.type === 'andar');
      const isSelected = !!bet;
      numbers.push(
        <TouchableOpacity
          key={numberKey}
          style={[
            styles.andarBaharButton,
            styles.andarButton,
            isSelected && styles.selectedAndarButton
          ]}
          onPress={() => {
            if (isSelected) {
              removeBet(bet.id);
            } else {
              handleNumberSelect(numberKey, 'andar');
            }
          }}
        >
          <Text style={[
            styles.andarBaharText,
            isSelected && styles.selectedAndarText
          ]}>Andar {i}</Text>
          {isSelected && (
            <View style={styles.betAmountBadgeSmall}>
              <Text style={styles.betAmountBadgeTextSmall}>₹{bet.amount}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return numbers;
  };

  const renderBaharNumbers = () => {
    const numbers = [];
    for (let i = 0; i <= 9; i++) {
      const numberKey = `Bahar ${i}`;
      const bet = betList.find(b => b.number === numberKey && b.type === 'bahar');
      const isSelected = !!bet;
      numbers.push(
        <TouchableOpacity
          key={numberKey}
          style={[
            styles.andarBaharButton,
            styles.baharButton,
            isSelected && styles.selectedBaharButton
          ]}
          onPress={() => {
            if (isSelected) {
              removeBet(bet.id);
            } else {
              handleNumberSelect(numberKey, 'bahar');
            }
          }}
        >
          <Text style={[
            styles.andarBaharText,
            isSelected && styles.selectedBaharText
          ]}>Bahar {i}</Text>
          {isSelected && (
            <View style={styles.betAmountBadgeSmall}>
              <Text style={styles.betAmountBadgeTextSmall}>₹{bet.amount}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return numbers;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Promotional Banner */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
              <View style={styles.promoCard}>
                <Text style={styles.promoText}>🎊 आज का जैकपॉट: ₹25,00,000</Text>
              </View>
              <View style={styles.promoCard}>
                <Text style={styles.promoText}>🎮 नया गेम लॉन्च: डायमंड किंग</Text>
              </View>
              <View style={styles.promoCard}>
                <Text style={styles.promoText}>🎁 विशेष ऑफर: पहली डिपॉजिट पर 100% बोनस</Text>
              </View>
            </ScrollView>

            {/* Features Section */}
            <Text style={styles.sectionTitle}>भारत का नंबर 1 गेमिंग प्लेटफॉर्म</Text>
            <View style={styles.featuresContainer}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                </View>
              ))}
            </View>

            {/* Current Time */}
            <View style={styles.timeContainer}>
              <Text style={styles.currentTime}>🕐 12:28:27 PM</Text>
            </View>

            {/* Game Cards */}
            <View style={styles.gamesContainer}>
              <View style={styles.gameRow}>
                {gameCards.map((game, index) => (
                  <TouchableOpacity key={game.id} style={[styles.gameCard, { backgroundColor: game.bgColor }]}>
                    <View style={styles.gameHeader}>
                      <Text style={[styles.gameTitle, { color: game.color }]}>
                        {game.id <= 4 ? '⭐' : '💎'} {game.title}
                      </Text>
                    </View>

                    <View style={styles.gameDetails}>
                      <View style={styles.gameTime}>
                        <Text style={styles.timeLabel}>Open:</Text>
                        <Text style={styles.timeValue}>{game.openTime}</Text>
                      </View>
                      <View style={styles.gameTime}>
                        <Text style={styles.timeLabel}>Close:</Text>
                        <Text style={styles.timeValue}>{game.closeTime}</Text>
                      </View>
                    </View>

                    <Text style={styles.gameStatus}>{game.status}</Text>

                    <TouchableOpacity 
                      style={[styles.playButton, { backgroundColor: game.color }]}
                      onPress={() => handlePlayNow(game)}
                    >
                      <Text style={styles.playButtonText}>Play Now →</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.bottomSpacing} />
          </ScrollView>
        );
      case 'wallet':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>💰 Wallet</Text>
            <View style={styles.walletCard}>
              <Text style={styles.walletBalance}>{wallet}</Text>
              <Text style={styles.walletLabel}>Current Balance</Text>
            </View>
            <View style={styles.winningsCard}>
              <Text style={styles.winningsBalance}>{winnings}</Text>
              <Text style={styles.winningsLabel}>Total Winnings</Text>
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

  const handleLogin = () => {
    // Implement your login logic here
    Alert.alert('Login', 'Login functionality to be implemented');
    setShowAuthModal(false);
  };

  const handleRegister = () => {
    // Implement your registration logic here
    Alert.alert('Register', 'Registration functionality to be implemented');
    setShowAuthModal(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>👑 VN Gaming</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.walletButton}>
            <Text style={styles.walletLabel}>Wallet</Text>
            <Text style={styles.walletAmount}>{wallet}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Menu Button */}
      <TouchableOpacity style={styles.bottomMenuButton} onPress={toggleSideMenu}>
        <Ionicons name="menu" size={28} color="#000" />
        <Text style={styles.bottomMenuText}>Menu</Text>
      </TouchableOpacity>

      {/* Bottom Slide Menu */}
      {showSideMenu && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showSideMenu}
          onRequestClose={toggleSideMenu}
        >
          <View style={styles.bottomMenuOverlay}>
            <TouchableOpacity 
              style={styles.bottomMenuBackdrop} 
              onPress={toggleSideMenu}
              activeOpacity={1}
            />
            <Animated.View style={[styles.bottomMenu, { transform: [{ translateY: slideAnim }] }]}>
              {/* Handle Bar */}
              <View style={styles.handleBar} />

              {/* Menu Header */}
              <View style={styles.bottomMenuHeader}>
                <View style={styles.menuHeaderCenter}>
                  <Text style={styles.bottomMenuTitle}>👑 VN Gaming</Text>
                  <Text style={styles.bottomMenuSubtitle}>Main Menu</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={toggleSideMenu}>
                  <Ionicons name="close" size={24} color="#4A90E2" />
                </TouchableOpacity>
              </View>

              {/* Authentication Buttons */}
              <View style={styles.authSection}>
                <View style={styles.authButtonsContainer}>
                  {authItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.authButton, { backgroundColor: item.color }]}
                      onPress={() => {
                        setAuthMode(item.key);
                        setShowAuthModal(true);
                        toggleSideMenu();
                      }}
                    >
                      <Ionicons name={item.icon} size={20} color="#000" />
                      <Text style={styles.authButtonText}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Menu Items */}
              <ScrollView style={styles.bottomMenuContent} showsVerticalScrollIndicator={false}>
                <View style={styles.menuGrid}>
                  {menuItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.bottomMenuItem,
                        { backgroundColor: activeTab === item.key ? item.color : item.bgColor },
                        activeTab === item.key && styles.activeBottomMenuItem
                      ]}
                      onPress={() => handleMenuItemPress(item.key)}
                    >
                      <View style={[
                        styles.bottomMenuItemIcon,
                        { backgroundColor: activeTab === item.key ? '#000' : item.bgColor },
                        activeTab === item.key && styles.activeBottomMenuItemIcon
                      ]}>
                        <Ionicons 
                          name={item.icon} 
                          size={26} 
                          color={activeTab === item.key ? item.color : item.color} 
                        />
                      </View>
                      <Text style={[
                        styles.bottomMenuItemText,
                        { color: activeTab === item.key ? '#000' : item.color },
                        activeTab === item.key && styles.activeBottomMenuItemText
                      ]}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.bottomMenuFooter}>
                <Text style={styles.footerText}>Version 1.0.0</Text>
                <Text style={styles.footerCopyright}>© 2024 VN Gaming</Text>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}

      {/* Betting Modal */}
      <Modal
        visible={showBettingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBettingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bettingModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedGame?.title} - Select Numbers
              </Text>
              <TouchableOpacity onPress={() => setShowBettingModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Betting Type Tabs */}
              <View style={styles.bettingTabs}>
                <TouchableOpacity 
                  style={[styles.tab, currentBetType === 'numbers' && styles.activeTab]}
                  onPress={() => setCurrentBetType('numbers')}
                >
                  <Text style={[styles.tabText, currentBetType === 'numbers' && styles.activeTabText]}>
                    🎯 Numbers (1-100)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tab, currentBetType === 'andar' && styles.activeTab]}
                  onPress={() => setCurrentBetType('andar')}
                >
                  <Text style={[styles.tabText, currentBetType === 'andar' && styles.activeTabText]}>
                    🟢 Andar (0-9)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tab, currentBetType === 'bahar' && styles.activeTab]}
                  onPress={() => setCurrentBetType('bahar')}
                >
                  <Text style={[styles.tabText, currentBetType === 'bahar' && styles.activeTabText]}>
                    🔴 Bahar (0-9)
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Selection Summary with Amount */}
              {betList.length > 0 && (
                <View style={styles.selectionSummary}>
                  <Text style={styles.summaryTitle}>
                    Total Bets ({betList.length}):
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.selectedNumbersList}>
                      {betList.map((bet, index) => {
                        const chipStyle = bet.type === 'andar' ? styles.andarChip : 
                                        bet.type === 'bahar' ? styles.baharChip : 
                                        styles.selectedChip;
                        return (
                          <View key={index} style={chipStyle}>
                            <Text style={styles.selectedChipText}>{bet.number}</Text>
                            <Text style={styles.selectedChipAmount}>₹{bet.amount}</Text>
                          </View>
                        );
                      })}
                    </View>
                  </ScrollView>
                  <View style={styles.totalAmountDisplay}>
                    <Text style={styles.totalAmountText}>
                      Total Bet Amount: ₹{getTotalBetAmount()}
                    </Text>
                  </View>
                </View>
              )}

              {/* Dynamic Content based on selected tab */}
              {currentBetType === 'numbers' && (
                <>
                  <Text style={styles.sectionTitle}>🎯 Select Numbers (1-100)</Text>
                  <View style={styles.numbersGrid}>
                    {renderNumbers()}
                  </View>
                </>
              )}

              {currentBetType === 'andar' && (
                <>
                  <Text style={styles.sectionTitle}>🟢 Select Andar Numbers (0-9)</Text>
                  <View style={styles.andarBaharGrid}>
                    {renderAndarNumbers()}
                  </View>
                </>
              )}

              {currentBetType === 'bahar' && (
                <>
                  <Text style={styles.sectionTitle}>🔴 Select Bahar Numbers (0-9)</Text>
                  <View style={styles.andarBaharGrid}>
                    {renderBaharNumbers()}
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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

            <ScrollView style={styles.authModalContent}>
              {authMode === 'login' ? (
                // Login Form
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

                  <TouchableOpacity style={styles.submitButton} onPress={() => handleLogin({})}>
                    <Text style={styles.submitButtonText}>Login</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setAuthMode('register')}>
                    <Text style={styles.switchModeText}>
                      Don't have an account? Register here
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Register Form
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

                  <TouchableOpacity style={styles.submitButton} onPress={() => handleRegister({})}>
                    <Text style={styles.submitButtonText}>Register</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setAuthMode('login')}>
                    <Text style={styles.switchModeText}>
                      Already have an account? Login here
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  headerRight:{
    flexDirection: 'row',
    gap: 10,
  },
  walletButton: {
    backgroundColor: '#2a4a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  walletLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  walletAmount: {
    fontSize: 12,
    color: '#00FF88',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  promoScroll: {
    marginVertical: 15,
  },
  promoCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
    minWidth: 250,
  },
  promoText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#1a1a1a',
    width: '48%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
  },
  timeContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  currentTime: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamesContainer: {
    marginBottom: 20,
  },
  gameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  gameHeader: {
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameDetails: {
    marginBottom: 10,
  },
  gameTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeLabel: {
    color: '#999',
    fontSize: 12,
  },
  timeValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameStatus: {
    color: '#00FF88',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
  },
  playButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 100,
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
  walletCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00FF88',
    width: '100%',
  },
  walletBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  walletLabel: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
  },
  winningsCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    width: '100%',
  },
  winningsBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  winningsLabel: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
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
  bottomMenuButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomMenuText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  bottomMenuBackdrop: {
    flex: 1,
  },
  bottomMenu: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 10,
    maxHeight: '85%',
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#4A90E2',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  bottomMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bottomMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  bottomMenuSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  authSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  authButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 8,
  },
  authButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomMenuContent: {
    flex: 1,
    paddingHorizontal: 15,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  bottomMenuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeBottomMenuItem: {
    borderColor: '#4A90E2',
  },
  bottomMenuItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeBottomMenuItemIcon: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  bottomMenuItemText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeBottomMenuItemText: {
    color: '#000',
  },
  bottomMenuFooter: {
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
  footerCopyright: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bettingModal: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
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
  modalContent: {
    padding: 20,
  },
  bettingTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    marginRight: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  tabText: {
    color: '#999',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#000',
  },
  selectionSummary: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedNumbersList: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedChip: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
  },
  andarChip: {
    backgroundColor: '#00FF88',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
  },
  baharChip: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignItems: 'center',
  },
  selectedChipText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedChipAmount: {
    color: '#000',
    fontSize: 10,
  },
  totalAmountDisplay: {
    marginTop: 10,
    alignItems: 'center',
  },
  totalAmountText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numberButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  selectedNumberButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  numberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedNumberText: {
    color: '#000',
  },
  betAmountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#E74C3C',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  betAmountBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  andarBaharGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  andarBaharButton: {
    width: '48%',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    borderWidth: 2,
  },
  andarButton: {
    backgroundColor: '#1a4a1a',
    borderColor: '#00FF88',
  },
  selectedAndarButton: {
    backgroundColor: '#00FF88',
  },
  baharButton: {
    backgroundColor: '#4a1a1a',
    borderColor: '#E74C3C',
  },
  selectedBaharButton: {
    backgroundColor: '#E74C3C',
  },
  andarBaharText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedAndarText: {
    color: '#000',
  },
  selectedBaharText: {
    color: '#000',
  },
  betAmountBadgeSmall: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#000',
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  betAmountBadgeTextSmall: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  amountModal: {
    backgroundColor: '#0a0a0a',
    width: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
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
  }
});