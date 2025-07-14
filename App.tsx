
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [wallet, setWallet] = useState('₹1000.00');
  const [winnings, setWinnings] = useState('₹0.00');
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

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

  const handlePlayNow = (game) => {
    setSelectedGame(game);
    setShowBettingModal(true);
  };

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    setShowAmountModal(true);
  };

  const handleBetPlace = (amount) => {
    const currentWallet = parseFloat(wallet.replace('₹', '').replace(',', ''));
    if (currentWallet >= amount) {
      setWallet(`₹${(currentWallet - amount).toFixed(2)}`);
      setShowAmountModal(false);
      setShowBettingModal(false);
      Alert.alert('Bet Placed!', `आपका ₹${amount} का bet number ${selectedNumber} पर लगा दिया गया है।`);
    } else {
      Alert.alert('Insufficient Balance', 'आपके wallet में पर्याप्त balance नहीं है।');
    }
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= 100; i++) {
      numbers.push(
        <TouchableOpacity
          key={i}
          style={styles.numberButton}
          onPress={() => handleNumberSelect(i)}
        >
          <Text style={styles.numberText}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return numbers;
  };

  const renderAndarBaharNumbers = () => {
    const numbers = [];
    for (let i = 0; i <= 9; i++) {
      numbers.push(
        <TouchableOpacity
          key={`andar-${i}`}
          style={styles.andarBaharButton}
          onPress={() => handleNumberSelect(`Andar ${i}`)}
        >
          <Text style={styles.andarBaharText}>Andar {i}</Text>
        </TouchableOpacity>
      );
    }
    for (let i = 0; i <= 9; i++) {
      numbers.push(
        <TouchableOpacity
          key={`bahar-${i}`}
          style={styles.andarBaharButton}
          onPress={() => handleNumberSelect(`Bahar ${i}`)}
        >
          <Text style={styles.andarBaharText}>Bahar {i}</Text>
        </TouchableOpacity>
      );
    }
    return numbers;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="#FFD700" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>👑 VN</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.walletButton}>
            <Text style={styles.walletLabel}>Wallet</Text>
            <Text style={styles.walletAmount}>{wallet}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.winningsButton}>
            <Text style={styles.winningsLabel}>Winnings</Text>
            <Text style={styles.winningsAmount}>{winnings}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Rules and My Bets */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.gameRulesButton}>
          <Text style={styles.buttonText}>📋 Game Rules</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.myBetsButton}>
          <Text style={styles.buttonText}>🎯 MY BETS</Text>
        </TouchableOpacity>
      </View>

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
      </ScrollView>

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
                {selectedGame?.title} - Select Number
              </Text>
              <TouchableOpacity onPress={() => setShowBettingModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.sectionTitle}>1 to 100 Numbers</Text>
              <View style={styles.numbersGrid}>
                {renderNumbers()}
              </View>

              <Text style={styles.sectionTitle}>Andar Bahar (0-9)</Text>
              <View style={styles.andarBaharGrid}>
                {renderAndarBaharNumbers()}
              </View>
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
                Select Bet Amount - {selectedNumber}
              </Text>
              <TouchableOpacity onPress={() => setShowAmountModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.amountContent}>
              <Text style={styles.amountLabel}>Quick Select:</Text>
              <View style={styles.amountButtonsGrid}>
                {[10, 50, 200, 500, 1000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.amountButton}
                    onPress={() => handleBetPlace(amount)}
                  >
                    <Text style={styles.amountButtonText}>₹{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.amountLabel}>Custom Amount:</Text>
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
                <Text style={styles.customAmountButtonText}>Place Bet</Text>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
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
  winningsButton: {
    backgroundColor: '#4a4a2a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  winningsLabel: {
    color: '#fff',
    fontSize: 12,
  },
  winningsAmount: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  gameRulesButton: {
    flex: 1,
    backgroundColor: '#00AA55',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  myBetsButton: {
    flex: 1,
    backgroundColor: '#00AA55',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
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
  },
  numberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  andarBaharGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  andarBaharButton: {
    width: '48%',
    padding: 15,
    backgroundColor: '#2a4a2a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#00AA55',
  },
  andarBaharText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
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
});
