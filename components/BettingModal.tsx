
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BettingModalProps {
  visible: boolean;
  onClose: () => void;
  game: any;
  onPlaceBet: (numbers: number[], amount: number) => void;
  isAuthenticated: boolean;
}

export default function BettingModal({
  visible,
  onClose,
  game,
  onPlaceBet,
  isAuthenticated
}: BettingModalProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedNumberType, setSelectedNumberType] = useState<'number' | 'andar' | 'bahar'>('number');
  const [betAmount, setBetAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'numbers' | 'andar' | 'bahar'>('numbers');

  // Animation references
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const numberAnims = useRef(Array.from({ length: 100 }, () => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Reset animations
      slideAnim.setValue(SCREEN_HEIGHT);
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.3);
      numberAnims.forEach(anim => anim.setValue(0));

      // Start entrance animations
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Staggered number animations
      const numberAnimations = numberAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: index * 20,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      );

      Animated.stagger(10, numberAnimations).start();

      // Continuous pulse animation
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sine),
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.start();

      return () => pulseLoop.stop();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setSelectedNumbers([]);
      setBetAmount('');
    });
  };

  const toggleNumber = (number: number) => {
    const animIndex = number - 1;
    
    Animated.sequence([
      Animated.timing(numberAnims[animIndex], {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(numberAnims[animIndex], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedNumbers(prev => {
      if (prev.includes(number)) {
        return prev.filter(n => n !== number);
      } else {
        return [...prev, number];
      }
    });
  };

  const handlePlaceBet = () => {
    if (!isAuthenticated) {
      Alert.alert('Login Required', 'Please login to place bets');
      return;
    }

    if (selectedNumbers.length === 0) {
      Alert.alert('Error', 'Please select at least one number');
      return;
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid bet amount');
      return;
    }

    onPlaceBet(selectedNumbers, parseFloat(betAmount));
    closeModal();
  };

  const renderNumberGrid = () => {
    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);
    
    return (
      <View style={styles.numbersGrid}>
        {numbers.map((number, index) => {
          const isSelected = selectedNumbers.includes(number);
          const animatedStyle = {
            transform: [
              { scale: numberAnims[index] },
              isSelected ? { scale: pulseAnim } : { scale: 1 }
            ],
          };

          return (
            <Animated.View key={number} style={animatedStyle}>
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  isSelected && styles.selectedNumberButton,
                ]}
                onPress={() => toggleNumber(number)}
                activeOpacity={0.7}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53', '#FF6B6B']}
                    style={styles.gradientButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.selectedNumberText}>{number}</Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={['#2a2a2a', '#1a1a1a']}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.numberText}>{number}</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderTabButton = (tab: 'numbers' | 'andar' | 'bahar', label: string, icon: string, color: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab && styles.activeTabButton,
        { borderColor: color }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <View style={[styles.tabIconContainer, { backgroundColor: color + '20' }]}>
        <Text style={[styles.tabIcon, { color }]}>{icon}</Text>
      </View>
      <Text style={[
        styles.tabLabel,
        activeTab === tab ? { color } : styles.inactiveTabLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Header with gradient */}
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.header}
          >
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <LinearGradient
                  colors={['#4A90E2', '#357ABD']}
                  style={styles.gameIconContainer}
                >
                  <Text style={styles.gameIcon}>🎯</Text>
                </LinearGradient>
                <View>
                  <Text style={styles.modalTitle}>{game?.name || 'Disawer'} - Select Numbers</Text>
                  <Text style={styles.modalSubtitle}>Choose your lucky numbers</Text>
                </View>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <LinearGradient
                  colors={['#FF6B6B', '#FF8E53']}
                  style={styles.closeButtonGradient}
                >
                  <Ionicons name="close" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {renderTabButton('numbers', 'Numbers (1-100)', '🎲', '#FF6B6B')}
            {renderTabButton('andar', 'Andar (0-9)', '🟢', '#00FF88')}
            {renderTabButton('bahar', 'Bahar (0-9)', '🔴', '#FFD700')}
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'numbers' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53']}
                    style={styles.sectionIconContainer}
                  >
                    <Text style={styles.sectionIcon}>🎯</Text>
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>Select Numbers (1-100)</Text>
                </View>
                {renderNumberGrid()}
              </View>
            )}

            {activeTab === 'andar' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={['#00FF88', '#00CC6F']}
                    style={styles.sectionIconContainer}
                  >
                    <Text style={styles.sectionIcon}>🟢</Text>
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>Andar (0-9)</Text>
                </View>
                <View style={styles.andarBaharGrid}>
                  {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                    <TouchableOpacity
                      key={`andar-${number}`}
                      style={[
                        styles.andarBaharButton,
                        selectedNumbers.includes(number) && styles.selectedAndarBaharButton,
                      ]}
                      onPress={() => toggleNumber(number)}
                    >
                      <LinearGradient
                        colors={selectedNumbers.includes(number) 
                          ? ['#00FF88', '#00CC6F'] 
                          : ['#2a2a2a', '#1a1a1a']
                        }
                        style={styles.gradientButton}
                      >
                        <Text style={[
                          styles.andarBaharText,
                          selectedNumbers.includes(number) && styles.selectedAndarBaharText
                        ]}>
                          {number}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {activeTab === 'bahar' && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <LinearGradient
                    colors={['#FFD700', '#FFC107']}
                    style={styles.sectionIconContainer}
                  >
                    <Text style={styles.sectionIcon}>🔴</Text>
                  </LinearGradient>
                  <Text style={styles.sectionTitle}>Bahar (0-9)</Text>
                </View>
                <View style={styles.andarBaharGrid}>
                  {Array.from({ length: 10 }, (_, i) => i).map((number) => (
                    <TouchableOpacity
                      key={`bahar-${number}`}
                      style={[
                        styles.andarBaharButton,
                        selectedNumbers.includes(number) && styles.selectedAndarBaharButton,
                      ]}
                      onPress={() => toggleNumber(number)}
                    >
                      <LinearGradient
                        colors={selectedNumbers.includes(number) 
                          ? ['#FFD700', '#FFC107'] 
                          : ['#2a2a2a', '#1a1a1a']
                        }
                        style={styles.gradientButton}
                      >
                        <Text style={[
                          styles.andarBaharText,
                          selectedNumbers.includes(number) && styles.selectedAndarBaharText
                        ]}>
                          {number}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Bet Amount Section */}
            <View style={styles.betSection}>
              <LinearGradient
                colors={['#1a1a1a', '#2a2a2a']}
                style={styles.betContainer}
              >
                <View style={styles.betHeader}>
                  <Text style={styles.betTitle}>💰 Bet Amount</Text>
                  <Text style={styles.selectedCount}>
                    {selectedNumbers.length} number{selectedNumbers.length !== 1 ? 's' : ''} selected
                  </Text>
                </View>
                
                <View style={styles.betInputContainer}>
                  <TextInput
                    style={styles.betInput}
                    value={betAmount}
                    onChangeText={setBetAmount}
                    placeholder="Enter amount..."
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                  <Text style={styles.rupeeSymbol}>₹</Text>
                </View>

                <View style={styles.quickAmounts}>
                  {[10, 50, 100, 500].map(amount => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.quickAmountButton}
                      onPress={() => setBetAmount(amount.toString())}
                    >
                      <LinearGradient
                        colors={['#4A90E2', '#357ABD']}
                        style={styles.quickAmountGradient}
                      >
                        <Text style={styles.quickAmountText}>₹{amount}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </LinearGradient>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.placeBetButton,
                (!selectedNumbers.length || !betAmount) && styles.disabledButton
              ]} 
              onPress={handlePlaceBet}
              disabled={!selectedNumbers.length || !betAmount}
            >
              <LinearGradient
                colors={selectedNumbers.length && betAmount 
                  ? ['#00FF88', '#00CC6F'] 
                  : ['#666', '#555']
                }
                style={styles.placeBetGradient}
              >
                <Text style={styles.placeBetText}>
                  🎯 Place Bet {betAmount && `(₹${betAmount})`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#000',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderWidth: 2,
    borderColor: '#333',
  },
  header: {
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  gameIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  gameIcon: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonGradient: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  activeTabButton: {
    backgroundColor: '#2a2a2a',
  },
  tabIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inactiveTabLabel: {
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  numberButton: {
    width: (SCREEN_WIDTH - 60) / 5 - 6,
    height: 45,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedNumberButton: {
    transform: [{ scale: 1.05 }],
  },
  gradientButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  numberText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  andarBaharGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  andarBaharButton: {
    width: (SCREEN_WIDTH - 70) / 5 - 4,
    height: 50,
    borderRadius: 15,
  },
  selectedAndarBaharButton: {
    transform: [{ scale: 1.1 }],
  },
  andarBaharText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedAndarBaharText: {
    color: '#fff',
  },
  betSection: {
    marginBottom: 20,
  },
  betContainer: {
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  betTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  selectedCount: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  betInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A90E2',
    marginBottom: 15,
  },
  betInput: {
    flex: 1,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rupeeSymbol: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
    paddingRight: 15,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAmountButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
  },
  quickAmountGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  quickAmountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  placeBetButton: {
    flex: 2,
    borderRadius: 12,
  },
  disabledButton: {
    opacity: 0.5,
  },
  placeBetGradient: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeBetText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
