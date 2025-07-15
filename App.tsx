
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

  const gameCards = [
    {
      id: 1,
      title: 'Jaipur King',
      openTime: '05:00 PM',
      closeTime: '04:50 PM',
      status: 'Open for Play',
      color: '#FFD700',
      bgColor: '#2A2A2A'
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
    { icon: 'home', title: 'Home', key: 'home' },
    { icon: 'game-controller', title: 'Play', key: 'play' },
    { icon: 'person', title: 'My Profile', key: 'profile' },
    { icon: 'wallet', title: 'My Wallet', key: 'wallet' },
    { icon: 'time', title: 'Game History', key: 'history' },
    { icon: 'swap-horizontal', title: 'Transactions', key: 'transactions' },
    { icon: 'people', title: 'Refer & Earn', key: 'refer' },
    { icon: 'document-text', title: 'Terms & Conditions', key: 'terms' },
    { icon: 'refresh', title: 'Refund Policy', key: 'refund' },
    { icon: 'shield-checkmark', title: 'Privacy Policy', key: 'privacy' },
  ];

  const authItems = [
    { icon: 'log-in', title: 'Login', key: 'login', color: '#00FF88' },
    { icon: 'person-add', title: 'Register', key: 'register', color: '#FFD700' },
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
                  <Ionicons name="close" size={24} color="#FFD700" />
                </TouchableOpacity>
              </View>

              {/* Authentication Buttons */}
              <View style={styles.authSection}>
                <View style={styles.authButtonsContainer}>
                  {authItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.authButton, { backgroundColor: item.color }]}
                      onPress={() => handleMenuItemPress(item.key)}
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
                        activeTab === item.key && styles.activeBottomMenuItem
                      ]}
                      onPress={() => handleMenuItemPress(item.key)}
                    >
                      <View style={[
                        styles.bottomMenuItemIcon,
                        activeTab === item.key && styles.activeBottomMenuItemIcon
                      ]}>
                        <Ionicons 
                          name={item.icon} 
                          size={24} 
                          color={activeTab === item.key ? '#000' : '#FFD700'} 
                        />
                      </View>
                      <Text style={[
                        styles.bottomMenuItemText,
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
    color: '#FFD700',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  walletButton: {
    backgroundColor: '#2a4a2a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  walletLabel: {
    color: '#fff',
    fontSize: 12,
  },
  walletAmount: {
    color: '#00FF88',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100,
  },
  bottomMenuButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomMenuText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  bottomMenuBackdrop: {
    flex: 1,
  },
  bottomMenu: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '85%',
    minHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 20,
    borderTopWidth: 3,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#FFD700',
  },
  handleBar: {
    width: 50,
    height: 5,
    backgroundColor: '#FFD700',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  bottomMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    backgroundColor: '#2a2a2a',
  },
  menuHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bottomMenuTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bottomMenuSubtitle: {
    color: '#ccc',
    fontSize: 14,
    opacity: 0.8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#333',
    position: 'absolute',
    right: 20,
  },
  authSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#2a2a2a',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 15,
  },
  authButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  authButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomMenuContent: {
    flex: 1,
    paddingVertical: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  bottomMenuItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#444',
  },
  activeBottomMenuItem: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomMenuItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activeBottomMenuItemIcon: {
    backgroundColor: '#000',
  },
  bottomMenuItemText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeBottomMenuItemText: {
    color: '#000',
    fontWeight: 'bold',
  },
  bottomMenuFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  footerText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  footerCopyright: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  tabTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  comingSoonText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  walletCard: {
    backgroundColor: '#2a4a2a',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00FF88',
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FF88',
    marginBottom: 10,
  },
  winningsCard: {
    backgroundColor: '#4a4a2a',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  winningsBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  winningsLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  historyNumber: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyGame: {
    color: '#ccc',
    fontSize: 14,
  },
  historyAmount: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noHistory: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  profileCard: {
    backgroundColor: '#2a2a2a',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  profilePhone: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  profileButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  profileButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  promoScroll: {
    paddingVertical: 10,
  },
  promoCard: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  promoText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#1a3a3a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00AA55',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  timeContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  currentTime: {
    backgroundColor: '#FFD700',
    color: '#000',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  gamesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  gameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  gameHeader: {
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
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
    color: '#ccc',
    fontSize: 12,
  },
  timeValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  gameStatus: {
    color: '#00FF88',
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  playButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bettingModal: {
    backgroundColor: '#1a1a1a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
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
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  selectionSummary: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  summaryTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedNumbersList: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedChip: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 5,
  },
  andarChip: {
    backgroundColor: '#00AA55',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 5,
  },
  baharChip: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 5,
  },
  selectedChipText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectedChipAmount: {
    color: '#FF0000',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  totalAmountDisplay: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  totalAmountText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  numberButton: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
    position: 'relative',
  },
  selectedNumberButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  numberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedNumberText: {
    color: '#000',
  },
  betAmountBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#00FF88',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  betAmountBadgeText: {
    color: '#FF0000',
    fontSize: 8,
    fontWeight: 'bold',
  },
  betAmountBadgeSmall: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#00FF88',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  betAmountBadgeTextSmall: {
    color: '#FF0000',
    fontSize: 7,
    fontWeight: 'bold',
  },
  andarBaharGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  andarBaharButton: {
    width: '48%',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    position: 'relative',
  },
  andarButton: {
    backgroundColor: '#2a4a2a',
    borderColor: '#00AA55',
  },
  baharButton: {
    backgroundColor: '#4a2a2a',
    borderColor: '#E74C3C',
  },
  selectedAndarButton: {
    backgroundColor: '#00FF88',
    borderColor: '#00FF88',
    borderWidth: 2,
  },
  selectedBaharButton: {
    backgroundColor: '#FF4444',
    borderColor: '#FF4444',
    borderWidth: 2,
  },
  andarBaharText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedAndarText: {
    color: '#000',
  },
  selectedBaharText: {
    color: '#fff',
  },
  amountModal: {
    backgroundColor: '#1a1a1a',
    width: '90%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  amountContent: {
    padding: 20,
  },
  betPreview: {
    backgroundColor: '#2a2a4a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#9B59B6',
    alignItems: 'center',
  },
  betPreviewText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  betPreviewGame: {
    color: '#ccc',
    fontSize: 14,
  },
  amountLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  amountButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  amountButton: {
    width: '30%',
    padding: 15,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  amountButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customAmountInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#444',
    marginBottom: 15,
  },
  customAmountButton: {
    backgroundColor: '#00AA55',
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customAmountButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bettingTabs: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFD700',
  },
  tabText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
