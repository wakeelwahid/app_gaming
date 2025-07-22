import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BettingModalProps {
  visible: boolean;
  selectedGame: any;
  currentBetType: string;
  betList: any[];
  onClose: () => void;
  onBetTypeChange: (type: string) => void;
  onNumberSelect: (number: any, type: string, amount: number) => void;
  onRemoveBet: (betId: number) => void;
  onPlaceBets: () => void;
}

export default function BettingModal({
  visible,
  selectedGame,
  currentBetType,
  betList,
  onClose,
  onBetTypeChange,
  onNumberSelect,
  onRemoveBet,
  onPlaceBets
}: BettingModalProps) {
  const [showAmountPopup, setShowAmountPopup] = React.useState(false);
  const [selectedNumber, setSelectedNumber] = React.useState<any>(null);
  const [selectedType, setSelectedType] = React.useState<string>('');
  const [customAmount, setCustomAmount] = React.useState<string>('');

  // Clear states when modal opens/closes
  React.useEffect(() => {
    if (!visible) {
      setShowAmountPopup(false);
      setSelectedNumber(null);
      setSelectedType('');
      setCustomAmount('');
    }
  }, [visible]);

  const getTotalBetAmount = () => {
    return betList.reduce((total, bet) => total + bet.amount, 0);
  };

  const getNumberButtonStyle = (number: number) => {
    // Create professional gradient colors
    const baseHue = (number * 137.5) % 360; // Golden ratio approximation for better distribution
    const isEven = number % 2 === 0;
    const isPrime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97].includes(number);

    let backgroundColor, borderColor, shadowColor;

    if (isPrime) {
      // Prime numbers get gold theme
      backgroundColor = '#1a1611';
      borderColor = '#d4af37';
      shadowColor = '#d4af37';
    } else if (isEven) {
      // Even numbers get blue theme
      backgroundColor = '#0f1419';
      borderColor = '#4a9eff';
      shadowColor = '#4a9eff';
    } else {
      // Odd numbers get purple theme
      backgroundColor = '#16111a';
      borderColor = '#8b5cf6';
      shadowColor = '#8b5cf6';
    }

    return {
      backgroundColor,
      borderWidth: 1.5,
      borderColor,
      shadowColor,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 6,
    };
  };

  const getNumberTextColor = (number: number) => {
    const isPrime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97].includes(number);
    const isEven = number % 2 === 0;

    if (isPrime) return '#ffd700';
    if (isEven) return '#60a5fa';
    return '#a78bfa';
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
            getNumberButtonStyle(i),
            isSelected && styles.selectedNumberButton
          ]}
          onPress={() => {
            if (isSelected) {
              onRemoveBet(bet.id);
            } else {
              setSelectedNumber(i);
              setSelectedType('numbers');
              setShowAmountPopup(true);
            }
          }}
        >
          <Text style={[
            styles.numberText,
            { color: getNumberTextColor(i) },
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
              onRemoveBet(bet.id);
            } else {
              setSelectedNumber(numberKey);
              setSelectedType('andar');
              setShowAmountPopup(true);
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
              onRemoveBet(bet.id);
            } else {
              setSelectedNumber(numberKey);
              setSelectedType('bahar');
              setShowAmountPopup(true);
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.bettingModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedGame?.title} - Select Numbers
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIconContainer}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.bettingTabs}>
              <TouchableOpacity 
                style={[styles.tab, currentBetType === 'numbers' && styles.activeTab]}
                onPress={() => onBetTypeChange('numbers')}
              >
                <Text style={[styles.tabText, currentBetType === 'numbers' && styles.activeTabText]}>
                  🎯 Numbers (1-100)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, currentBetType === 'andar' && styles.activeTab]}
                onPress={() => onBetTypeChange('andar')}
              >
                <Text style={[styles.tabText, currentBetType === 'andar' && styles.activeTabText]}>
                  🟢 Andar (0-9)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, currentBetType === 'bahar' && styles.activeTab]}
                onPress={() => onBetTypeChange('bahar')}
              >
                <Text style={[styles.tabText, currentBetType === 'bahar' && styles.activeTabText]}>
                  🔴 Bahar (0-9)
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.contentScrollView} showsVerticalScrollIndicator={false}>

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

            {currentBetType === 'numbers' && (
                <>
                  <Text style={styles.sectionTitle}>🎯 Select Numbers (1-100)</Text>
                  <View style={styles.numbersContainer}>
                    <ScrollView style={styles.numbersScrollContainer} showsVerticalScrollIndicator={false}>
                      <View style={styles.numbersGrid}>
                        {renderNumbers()}
                      </View>
                    </ScrollView>
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

            {/* Fixed Bottom Section - Only Place Bet Button */}
            {betList.length > 0 && (
              <View style={styles.fixedBottomSection}>
                <TouchableOpacity 
                  style={styles.placeBetButton}
                  onPress={() => {
                    console.log('Place bet button pressed, bet list:', betList);
                    console.log('Total amount:', getTotalBetAmount());
                    if (betList.length > 0) {
                      console.log('Calling onPlaceBets...');
                      onPlaceBets();
                    } else {
                      Alert.alert('No Bets', 'कोई bet select नहीं किया गया है।');
                    }
                  }}
                >
                  <Text style={styles.placeBetButtonText}>
                    🎯 Place All Bets (₹{getTotalBetAmount()})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Amount Selection Popup */}
      <Modal
        visible={showAmountPopup}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAmountPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.amountPopup}>
            <View style={styles.popupHeader}>
              <Text style={styles.popupTitle}>
                Bet Amount - {selectedNumber}
              </Text>
              <TouchableOpacity onPress={() => setShowAmountPopup(false)} style={styles.popupCloseIcon}>
                <Ionicons name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.popupContent}>
              <Text style={styles.amountLabel}>Quick Select:</Text>
              <View style={styles.quickAmountGrid}>
                {[10, 50, 100, 200, 500, 1000].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAmountButton}
                    onPress={() => {
                      onNumberSelect(selectedNumber, selectedType, amount);
                      setShowAmountPopup(false);
                    }}
                  >
                    <Text style={styles.quickAmountText}>₹{amount}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.amountLabel}>Custom Amount (₹10 - ₹5000):</Text>
              <TextInput
                style={styles.customAmountInput}
                placeholder="Enter amount"
                placeholderTextColor="#666666"
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
              />

              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={() => {
                  const amount = parseInt(customAmount);
                  if (amount >= 10 && amount <= 5000) {
                    onNumberSelect(selectedNumber, selectedType, amount);
                    setCustomAmount('');
                    setShowAmountPopup(false);
                  } else {
                    Alert.alert('Invalid Amount', 'Please enter amount between ₹10 and ₹5000');
                  }
                }}
              >
                <Text style={styles.confirmButtonText}>Confirm Bet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bettingModal: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1a1a1a',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
    backgroundColor: '#111111',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  closeIconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  contentScrollView: {
    flex: 1,
  },
  numbersContainer: {
    flex: 1,
    maxHeight: 300,
  },
  bettingTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#1a1a1a',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  tabText: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#ffffff',
  },
  selectionSummary: {
    backgroundColor: '#111111',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  selectedNumbersList: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  andarChip: {
    backgroundColor: '#0f2419',
    borderColor: '#00ff88',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  baharChip: {
    backgroundColor: '#241f0f',
    borderColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  selectedChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedChipAmount: {
    color: '#cccccc',
    fontSize: 10,
  },
  totalAmountDisplay: {
    marginTop: 12,
    alignItems: 'center',
  },
  totalAmountText: {
    color: '#00ff88',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  numbersScrollContainer: {
    flex: 1,
  },
  fixedBottomSection: {
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    padding: 16,
    marginHorizontal: -20,
    marginBottom: -20,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  andarBaharGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  numberButton: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  selectedNumberButton: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88',
    borderWidth: 2,
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
    transform: [{ scale: 1.05 }],
  },
  numberText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  selectedNumberText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '900',
  },
  betAmountBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#00ff88',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  betAmountBadgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '700',
  },
  betAmountBadgeSmall: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#000000',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  betAmountBadgeTextSmall: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '600',
  },
  andarBaharButton: {
    width: '48%',
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    borderWidth: 1.5,
  },
  andarButton: {
    backgroundColor: '#0f2419',
    borderColor: '#00ff88',
  },
  baharButton: {
    backgroundColor: '#241f0f',
    borderColor: '#ff6b6b',
  },
  selectedAndarButton: {
    backgroundColor: '#00ff88',
    borderColor: '#00ff88',
    borderWidth: 2,
    boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
  },
  selectedBaharButton: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
    borderWidth: 2,
    boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)',
  },
  andarBaharText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedAndarText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  selectedBaharText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  placeBetButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(0, 255, 136, 0.3)',
  },
  placeBetButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountPopup: {
    backgroundColor: '#111111',
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  popupCloseIcon: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
  },
  popupContent: {
    padding: 20,
  },
  amountLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  quickAmountButton: {
    width: '30%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  quickAmountText: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '600',
  },
  customAmountInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});