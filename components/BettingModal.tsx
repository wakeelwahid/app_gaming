import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BettingModalProps {
  visible: boolean;
  selectedGame: any;
  currentBetType: string;
  betList: any[];
  onClose: () => void;
  onBetTypeChange: (type: string) => void;
  onNumberSelect: (number: any, type: string) => void;
  onRemoveBet: (betId: number) => void;
}

export default function BettingModal({
  visible,
  selectedGame,
  currentBetType,
  betList,
  onClose,
  onBetTypeChange,
  onNumberSelect,
  onRemoveBet
}: BettingModalProps) {
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
              onRemoveBet(bet.id);
            } else {
              onNumberSelect(i, 'numbers', 0); // Just select, don't place bet
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
              onRemoveBet(bet.id);
            } else {
              onNumberSelect(numberKey, 'andar', 0); // Just select, don't place bet
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
              onNumberSelect(numberKey, 'bahar', 0); // Just select, don't place bet
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
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
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

            {betList.length > 0 && (
              <View style={styles.betAmountSection}>
                <Text style={styles.betAmountTitle}>💰 Select Bet Amount:</Text>
                <View style={styles.amountButtonsGrid}>
                  {[10, 50, 100, 200, 500, 1000].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.amountButton}
                      onPress={() => {
                        // Update all selected bets with this amount
                        const updatedBets = betList.map(bet => ({
                          ...bet,
                          amount: amount
                        }));
                        // This would need to be handled by parent component
                      }}
                    >
                      <Text style={styles.amountButtonText}>₹{amount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {betList.length > 0 && (
              <TouchableOpacity 
                style={styles.placeBetButton}
                onPress={() => {
                  // Place all bets at once
                  betList.forEach(bet => {
                    if (bet.amount > 0) {
                      // This will be handled by parent component
                      onNumberSelect(bet.number, bet.type, bet.amount);
                    }
                  });
                }}
              >
                <Text style={styles.placeBetButtonText}>
                  🎯 Place All Bets (₹{getTotalBetAmount()})
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    textAlign: 'center',
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  andarBaharGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
  },
  luckyNumberButton: {
    backgroundColor: '#2E8B57',
    borderColor: '#00FF88',
    borderWidth: 2,
    shadowColor: '#00FF88',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  luckyNumberText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
  },
  specialNumberButton: {
    backgroundColor: '#4A0E4E',
    borderColor: '#9B59B6',
    borderWidth: 2,
    shadowColor: '#9B59B6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  specialNumberText: {
    color: '#E74C3C',
    fontSize: 14,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
  },
  luckyIcon: {
    position: 'absolute',
    top: -5,
    left: -5,
    zIndex: 1,
  },
  luckyIconText: {
    fontSize: 12,
  },
  specialIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 1,
  },
  specialIconText: {
    fontSize: 10,
  },
  betAmountBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#00FF88',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#00FF88',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  betAmountBadgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
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
  andarBaharButton: {
    width: '48%',
    height: 60,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  andarButton: {
    backgroundColor: '#0D4F2B',
    borderColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOpacity: 0.5,
  },
  baharButton: {
    backgroundColor: '#4F1A1A',
    borderColor: '#E74C3C',
    shadowColor: '#E74C3C',
    shadowOpacity: 0.5,
  },
  selectedAndarButton: {
    backgroundColor: '#00FF88',
    borderColor: '#00FF88',
    borderWidth: 3,
    shadowColor: '#00FF88',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  selectedBaharButton: {
    backgroundColor: '#E74C3C',
    borderColor: '#E74C3C',
    borderWidth: 3,
    shadowColor: '#E74C3C',
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  andarBaharText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
  },
  selectedAndarText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
  },
  selectedBaharText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 1)',
  },
  betAmountSection: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  betAmountTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  amountButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  amountButton: {
    width: '30%',
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  amountButtonText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  placeBetButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeBetButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});