
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Alert, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface WalletOperationsProps {
  showAddCashModal: boolean;
  showWithdrawModal: boolean;
  showPaymentModal: boolean;
  depositAmount: string;
  withdrawAmount: string;
  selectedPaymentMethod: string;
  utrNumber: string;
  onCloseAddCash: () => void;
  onCloseWithdraw: () => void;
  onClosePayment: () => void;
  onDepositAmountChange: (amount: string) => void;
  onWithdrawAmountChange: (amount: string) => void;
  onPaymentMethodSelect: (method: string) => void;
  onUtrChange: (utr: string) => void;
  onConfirmPayment: () => void;
  onWithdrawRequest: (amount: number) => void;
}

export default function WalletOperations({
  showAddCashModal,
  showWithdrawModal,
  showPaymentModal,
  depositAmount,
  withdrawAmount,
  selectedPaymentMethod,
  utrNumber,
  onCloseAddCash,
  onCloseWithdraw,
  onClosePayment,
  onDepositAmountChange,
  onWithdrawAmountChange,
  onPaymentMethodSelect,
  onUtrChange,
  onConfirmPayment,
  onWithdrawRequest
}: WalletOperationsProps) {
  const [showPaymentWarningModal, setShowPaymentWarningModal] = useState(false);
  const [selectedMethodForWarning, setSelectedMethodForWarning] = useState('');
  const [showWithdrawConfirmModal, setShowWithdrawConfirmModal] = useState(false);
  const [paymentTimer, setPaymentTimer] = useState(300);
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.3));
  const [slideAnim] = useState(new Animated.Value(50));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (showAddCashModal || showWithdrawModal || showPaymentModal) {
      startEntranceAnimation();
    }
  }, [showAddCashModal, showWithdrawModal, showPaymentModal]);

  useEffect(() => {
    startPulseAnimation();
    startGlowAnimation();
  }, []);

  const startEntranceAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const startGlowAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sine),
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    if (showPaymentModal) {
      setPaymentTimer(300);
      const timer = setInterval(() => {
        setPaymentTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClosePayment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showPaymentModal, onClosePayment]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const calculateDepositDetails = (amount: number) => {
    const gst = Math.round(amount * 0.28);
    const cashback = amount >= 2000 ? Math.round(amount * 0.05) : 0;
    const total = amount + gst;
    return { gst, cashback, total };
  };

  const handleWithdrawSubmit = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount >= 100) {
      setShowWithdrawConfirmModal(true);
    } else {
      Alert.alert('Invalid Amount', 'Minimum withdrawal amount is ₹100');
    }
  };

  const handleConfirmWithdraw = () => {
    setShowWithdrawConfirmModal(false);
    const amount = parseFloat(withdrawAmount);
    onWithdrawRequest(amount);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedMethodForWarning(method);
    setShowPaymentWarningModal(true);
  };

  const handleConfirmPaymentMethod = () => {
    setShowPaymentWarningModal(false);
    onPaymentMethodSelect(selectedMethodForWarning);
  };

  return (
    <>
      {/* Add Cash Modal */}
      <Modal
        visible={showAddCashModal}
        animationType="fade"
        transparent={true}
        onRequestClose={onCloseAddCash}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[
            styles.addCashModalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}>
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
              style={styles.gradientHeader}
            >
              <View style={styles.modalHeader}>
                <View style={styles.headerIconContainer}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Ionicons name="wallet" size={28} color="#FFD700" />
                  </Animated.View>
                  <Text style={styles.modalTitle}>💰 UPI से पैसे Add करें</Text>
                </View>
                <TouchableOpacity onPress={onCloseAddCash} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.addCashContent}>
              <Animated.View style={[styles.amountSection, { opacity: fadeAnim }]}>
                <Text style={styles.depositLabel}>💸 Amount डालें (₹)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.depositInput}
                    placeholder="Enter amount"
                    placeholderTextColor="#666"
                    value={depositAmount}
                    onChangeText={onDepositAmountChange}
                    keyboardType="numeric"
                  />
                  <Animated.View style={[styles.inputGlow, {
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8]
                    })
                  }]} />
                </View>
              </Animated.View>

              <View style={styles.quickAmountsContainer}>
                <Text style={styles.sectionTitle}>⚡ Quick Select</Text>
                <View style={styles.quickAmountsGrid}>
                  {[100, 200, 500, 1000, 5000, 10000].map((amount, index) => (
                    <Animated.View
                      key={amount}
                      style={{
                        transform: [{
                          scale: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1]
                          })
                        }]
                      }}
                    >
                      <TouchableOpacity
                        style={styles.quickAmountButton}
                        onPress={() => onDepositAmountChange(amount.toString())}
                      >
                        <LinearGradient
                          colors={['#2d2d2d', '#404040', '#2d2d2d']}
                          style={styles.quickButtonGradient}
                        >
                          <Text style={styles.quickAmountText}>₹{amount}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  ))}
                </View>
              </View>

              {depositAmount && parseFloat(depositAmount) >= 100 && (
                <Animated.View style={[styles.depositSummary, { opacity: fadeAnim }]}>
                  <LinearGradient
                    colors={['#1a1a1a', '#2d2d2d']}
                    style={styles.summaryGradient}
                  >
                    <Text style={styles.summaryTitle}>📊 Payment Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Deposit Amount</Text>
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
                      <Text style={styles.summaryLabelTotal}>Total Amount</Text>
                      <Text style={styles.summaryValueTotal}>₹{calculateDepositDetails(parseFloat(depositAmount)).total}</Text>
                    </View>
                  </LinearGradient>
                </Animated.View>
              )}

              <View style={styles.paymentMethodsContainer}>
                <Text style={styles.sectionTitle}>💳 UPI Payment Methods</Text>
                <View style={styles.paymentMethods}>
                  {[
                    { name: 'PhonePe', icon: '📱', colors: ['#5f259f', '#7b3bb8'] },
                    { name: 'Google Pay', icon: '🟢', colors: ['#1a73e8', '#4285f4'] },
                    { name: 'Paytm', icon: '💙', colors: ['#00baf2', '#0099cc'] }
                  ].map((method) => (
                    <TouchableOpacity 
                      key={method.name}
                      style={styles.paymentMethod}
                      onPress={() => handlePaymentMethodSelect(method.name)}
                    >
                      <LinearGradient
                        colors={method.colors}
                        style={styles.paymentMethodGradient}
                      >
                        <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                        <Text style={styles.paymentMethodText}>{method.name}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {(!depositAmount || parseFloat(depositAmount) < 100) && (
                <Animated.View style={[styles.depositInfo, { opacity: fadeAnim }]}>
                  <LinearGradient
                    colors={['#1a1a1a', '#2d2d2d']}
                    style={styles.infoGradient}
                  >
                    <Text style={styles.depositInfoTitle}>📌 Deposit Information</Text>
                    <Text style={styles.depositInfoText}>• Minimum deposit: ₹100</Text>
                    <Text style={styles.depositInfoText}>• Instant UPI deposits (Max ₹50,000)</Text>
                    <Text style={styles.depositInfoText}>• 28% GST applies on all deposits</Text>
                    <Text style={styles.depositInfoText}>• 5% cashback on deposits ₹2000+</Text>
                    <Text style={styles.depositWarningText}>⚠️ Withdrawal only to deposit account</Text>
                  </LinearGradient>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Payment QR Code Modal */}
      <Modal
        visible={showPaymentModal}
        animationType="fade"
        transparent={true}
        onRequestClose={onClosePayment}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[
            styles.paymentQRModalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}>
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
              style={styles.gradientHeader}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🔄 Complete Payment</Text>
                <TouchableOpacity onPress={onClosePayment} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.paymentQRContent}>
              <Animated.View style={[styles.timerContainer, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.timerText}>{formatTime(paymentTimer)}</Text>
                <Text style={styles.timerNote}>Time remaining to complete payment</Text>
              </Animated.View>

              <View style={styles.qrCodeContainer}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.qrBorder}
                >
                  <View style={styles.qrCodePlaceholder}>
                    <View style={styles.qrSquare} />
                    <View style={styles.qrSquare} />
                    <View style={styles.qrSquare} />
                    <View style={styles.qrSquare} />
                  </View>
                </LinearGradient>
              </View>

              <Text style={styles.scanInstructions}>
                Scan this code using <Text style={styles.highlightText}>{selectedPaymentMethod}</Text> to pay ₹{depositAmount && calculateDepositDetails(parseFloat(depositAmount)).total}
              </Text>

              <View style={styles.utrSection}>
                <Text style={styles.utrLabel}>🔢 UTR Number</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.utrInput}
                    placeholder="Enter 12-digit UTR"
                    placeholderTextColor="#666"
                    value={utrNumber}
                    onChangeText={onUtrChange}
                    keyboardType="numeric"
                    maxLength={12}
                  />
                  <Animated.View style={[styles.inputGlow, {
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8]
                    })
                  }]} />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmPaymentButton,
                  utrNumber.length !== 12 && styles.confirmPaymentButtonDisabled
                ]}
                onPress={onConfirmPayment}
                disabled={utrNumber.length !== 12}
              >
                <LinearGradient
                  colors={utrNumber.length === 12 ? ['#FFD700', '#FFA500'] : ['#333', '#555']}
                  style={styles.confirmButtonGradient}
                >
                  <Text style={styles.confirmPaymentButtonText}>✅ CONFIRM PAYMENT</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.utrHelp}>
                <Text style={styles.utrHelpTitle}>💡 How to Find UTR:</Text>
                <Text style={styles.utrHelpText}>• Check bank SMS for transaction confirmation</Text>
                <Text style={styles.utrHelpText}>• Look for 12-digit "UTR" or "Ref No"</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        animationType="fade"
        transparent={true}
        onRequestClose={onCloseWithdraw}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[
            styles.withdrawModalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim }
              ]
            }
          ]}>
            <LinearGradient
              colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
              style={styles.gradientHeader}
            >
              <View style={styles.modalHeader}>
                <View style={styles.headerIconContainer}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <Ionicons name="card" size={28} color="#4A90E2" />
                  </Animated.View>
                  <Text style={styles.modalTitle}>💳 Redeem Coins</Text>
                </View>
                <TouchableOpacity onPress={onCloseWithdraw} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.withdrawContent}>
              <View style={styles.amountSection}>
                <Text style={styles.withdrawLabel}>💰 Amount (₹)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.withdrawInput}
                    placeholder="Enter amount"
                    placeholderTextColor="#666"
                    value={withdrawAmount}
                    onChangeText={onWithdrawAmountChange}
                    keyboardType="numeric"
                  />
                  <Animated.View style={[styles.inputGlow, {
                    opacity: glowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 0.8]
                    })
                  }]} />
                </View>
              </View>

              <View style={styles.quickAmountsContainer}>
                <Text style={styles.sectionTitle}>⚡ Quick Select</Text>
                <View style={styles.quickAmountsGrid}>
                  {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.quickAmountButton}
                      onPress={() => onWithdrawAmountChange(amount.toString())}
                    >
                      <LinearGradient
                        colors={['#2d2d2d', '#404040', '#2d2d2d']}
                        style={styles.quickButtonGradient}
                      >
                        <Text style={styles.quickAmountText}>₹{amount}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.withdrawRequestButton, (!withdrawAmount || parseFloat(withdrawAmount) < 100) && styles.withdrawButtonDisabled]}
                onPress={handleWithdrawSubmit}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) < 100}
              >
                <LinearGradient
                  colors={withdrawAmount && parseFloat(withdrawAmount) >= 100 ? ['#4A90E2', '#357ABD'] : ['#333', '#555']}
                  style={styles.withdrawButtonGradient}
                >
                  <Text style={styles.withdrawRequestButtonText}>🚀 REQUEST WITHDRAWAL</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.withdrawInfo}>
                <LinearGradient
                  colors={['#1a1a1a', '#2d2d2d']}
                  style={styles.infoGradient}
                >
                  <Text style={styles.withdrawInfoTitle}>ℹ️ Withdrawal Information</Text>
                  <Text style={styles.withdrawInfoText}>• Minimum withdrawal: ₹100</Text>
                  <Text style={styles.withdrawInfoText}>• Maximum per request: ₹30,000</Text>
                  <Text style={styles.withdrawInfoText}>• Processing time: 5-10 minutes</Text>
                  <Text style={styles.withdrawInfoText}>• Daily limit: ₹50,000</Text>
                </LinearGradient>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Payment Warning Modal */}
      <Modal
        visible={showPaymentWarningModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowPaymentWarningModal(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[
            styles.warningModalContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <LinearGradient
              colors={['#FF6B6B', '#E55555']}
              style={styles.warningHeader}
            >
              <Text style={styles.warningModalTitle}>⚠️ महत्वपूर्ण सूचना</Text>
              <TouchableOpacity onPress={() => setShowPaymentWarningModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.warningModalContent}>
              <Animated.View style={[styles.warningIconContainer, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.warningIcon}>⚠️</Text>
              </Animated.View>

              <Text style={styles.warningMainText}>
                जब आप <Text style={styles.highlightText}>{selectedMethodForWarning}</Text> से deposit करते हैं, तो withdrawal भी इसी account में होगी।
              </Text>

              <View style={styles.warningButtonsContainer}>
                <TouchableOpacity
                  style={styles.cancelWarningButton}
                  onPress={() => setShowPaymentWarningModal(false)}
                >
                  <Text style={styles.cancelWarningButtonText}>❌ Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmWarningButton}
                  onPress={handleConfirmPaymentMethod}
                >
                  <LinearGradient
                    colors={['#FF6B6B', '#E55555']}
                    style={styles.confirmWarningGradient}
                  >
                    <Text style={styles.confirmWarningButtonText}>✅ Proceed</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Withdrawal Confirmation Modal */}
      <Modal
        visible={showWithdrawConfirmModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowWithdrawConfirmModal(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <Animated.View style={[
            styles.withdrawConfirmModalContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <LinearGradient
              colors={['#4A90E2', '#357ABD']}
              style={styles.confirmHeader}
            >
              <Text style={styles.confirmModalTitle}>💰 Confirm Withdrawal</Text>
              <TouchableOpacity onPress={() => setShowWithdrawConfirmModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.confirmModalContent}>
              <Animated.View style={[styles.confirmIconContainer, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.confirmIcon}>💳</Text>
              </Animated.View>

              <Text style={styles.confirmMainText}>
                Are you sure you want to withdraw ₹{withdrawAmount}?
              </Text>

              <View style={styles.confirmButtonsContainer}>
                <TouchableOpacity
                  style={styles.cancelConfirmButton}
                  onPress={() => setShowWithdrawConfirmModal(false)}
                >
                  <Text style={styles.cancelConfirmButtonText}>❌ Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmWithdrawButton}
                  onPress={handleConfirmWithdraw}
                >
                  <LinearGradient
                    colors={['#4A90E2', '#357ABD']}
                    style={styles.confirmWithdrawGradient}
                  >
                    <Text style={styles.confirmWithdrawButtonText}>✅ Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientHeader: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addCashModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  addCashContent: {
    flex: 1,
    padding: 20,
  },
  amountSection: {
    marginBottom: 25,
  },
  depositLabel: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
  },
  depositInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 17,
    backgroundColor: '#FFD700',
    zIndex: -1,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  quickAmountsContainer: {
    marginBottom: 25,
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAmountButton: {
    width: '30%',
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
  },
  quickButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAmountText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  depositSummary: {
    marginBottom: 25,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryGradient: {
    padding: 20,
  },
  summaryTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#ccc',
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
    marginVertical: 10,
  },
  paymentMethodsContainer: {
    marginBottom: 25,
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  paymentMethod: {
    flex: 1,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentMethodGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  paymentMethodIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  paymentMethodText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  depositInfo: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  infoGradient: {
    padding: 15,
  },
  depositInfoTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  depositInfoText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 6,
  },
  depositWarningText: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 8,
  },
  paymentQRModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  paymentQRContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  timerContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  timerNote: {
    color: '#ccc',
    fontSize: 13,
    textAlign: 'center',
  },
  qrCodeContainer: {
    marginBottom: 25,
  },
  qrBorder: {
    padding: 4,
    borderRadius: 20,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  qrSquare: {
    width: '48%',
    height: '48%',
    backgroundColor: '#333',
    margin: '1%',
    borderRadius: 8,
  },
  scanInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  highlightText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  utrSection: {
    width: '100%',
    marginBottom: 25,
  },
  utrLabel: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  utrInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmPaymentButton: {
    width: '100%',
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  confirmPaymentButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPaymentButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  utrHelp: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 12,
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
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  withdrawModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  withdrawContent: {
    flex: 1,
    padding: 20,
  },
  withdrawLabel: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  withdrawInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  withdrawRequestButton: {
    height: 55,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 25,
  },
  withdrawButtonDisabled: {
    opacity: 0.5,
  },
  withdrawButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawRequestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  withdrawInfo: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  withdrawInfoTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  withdrawInfoText: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 6,
  },
  warningModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    maxWidth: 400,
  },
  warningHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  warningModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  warningModalContent: {
    padding: 20,
  },
  warningIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  warningIcon: {
    fontSize: 60,
    color: '#FF6B6B',
  },
  warningMainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  warningButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelWarningButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelWarningButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmWarningButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmWarningGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmWarningButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  withdrawConfirmModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '90%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    maxWidth: 400,
  },
  confirmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  confirmModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  confirmModalContent: {
    padding: 20,
  },
  confirmIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmIcon: {
    fontSize: 60,
    color: '#4A90E2',
  },
  confirmMainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 26,
  },
  confirmButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelConfirmButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#666',
  },
  cancelConfirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  confirmWithdrawButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmWithdrawGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmWithdrawButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
