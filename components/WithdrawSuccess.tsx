import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface WithdrawSuccessProps {
  visible: boolean;
  amount: string;
  paymentMethod: string;
  onClose: () => void;
}

export default function WithdrawSuccess({ visible, amount, paymentMethod, onClose }: WithdrawSuccessProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onClose();
    }
  }, [visible, countdown, onClose]);

  useEffect(() => {
    if (visible) {
      setCountdown(5);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <Text style={styles.successIcon}>✅</Text>
          </View>
          
          <Text style={styles.successTitle}>Withdrawal Request Submitted!</Text>
          
          <View style={styles.detailsContainer}>
            <Text style={styles.amountText}>₹{amount}</Text>
            <Text style={styles.methodText}>via {paymentMethod}</Text>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              आपका withdrawal request submit हो गया है। आपको {paymentMethod} account में पैसे मिल जाएंगे।
            </Text>
            <Text style={styles.infoSubtext}>
              Processing time: 5-30 minutes
            </Text>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close ({countdown}s)</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  successContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FF88',
    maxWidth: 350,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 60,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF88',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  amountText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  methodText: {
    fontSize: 16,
    color: '#4A90E2',
  },
  infoContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoSubtext: {
    color: '#00FF88',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

interface WithdrawSuccessProps {
  visible: boolean;
  amount: string;
  paymentMethod: string;
  onClose: () => void;
}

export default function WithdrawSuccess({
  visible,
  amount,
  paymentMethod,
  onClose
}: WithdrawSuccessProps) {
  const [countdownSeconds, setCountdownSeconds] = useState(5);

  useEffect(() => {
    if (visible) {
      setCountdownSeconds(5);
      const timer = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.withdrawSuccessModalContainer}>
          <View style={styles.successContent}>
            {/* Success Icon */}
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>💰</Text>
            </View>

            {/* Success Message */}
            <Text style={styles.successTitle}>Redeem Request Submitted!</Text>
            <Text style={styles.successMessage}>
              आपका ₹{amount} का withdrawal request successfully submit हो गया है।
            </Text>

            {/* Amount Display */}
            <View style={styles.amountDisplayContainer}>
              <Text style={styles.amountDisplayLabel}>Withdrawal Amount:</Text>
              <Text style={styles.amountDisplayValue}>₹{amount}</Text>
            </View>

            {/* Payment Method Display */}
            <View style={styles.paymentMethodDisplayContainer}>
              <Text style={styles.paymentMethodDisplayLabel}>💳 Payment Method:</Text>
              <Text style={styles.paymentMethodDisplayValue}>{paymentMethod}</Text>
              <Text style={styles.paymentMethodNote}>
                आपको इसी account में payment मिलेगी
              </Text>
            </View>

            {/* Timer Message */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerMessage}>
                💳 Payment 5 to 10 minutes में {paymentMethod} account में successful हो जाएगी
              </Text>
              <Text style={styles.timerNote}>
                Processing में थोड़ा समय लगता है
              </Text>
            </View>

            {/* Additional Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>📋 Important Information:</Text>
              <Text style={styles.infoText}>• आपके {paymentMethod} account में payment transfer हो जाएगी</Text>
              <Text style={styles.infoText}>• Processing time: 5-10 minutes</Text>
              <Text style={styles.infoText}>• SMS notification मिलेगा जब payment complete होगी</Text>
              <Text style={styles.infoText}>• Same account से deposit किया था, उसी में withdrawal होगी</Text>
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
              onPress={onClose}
            >
              <Text style={styles.goHomeButtonText}>GO TO HOME</Text>
            </TouchableOpacity>
          </View>
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
  withdrawSuccessModalContainer: {
    backgroundColor: '#0a0a0a',
    width: '90%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    backgroundColor: '#4A90E2',
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
    color: '#4A90E2',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  successMessage: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  amountDisplayContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  amountDisplayLabel: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountDisplayValue: {
    color: '#00FF88',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  paymentMethodDisplayContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  paymentMethodDisplayLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentMethodDisplayValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  paymentMethodNote: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  timerContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
    width: '100%',
  },
  timerMessage: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  timerNote: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    marginBottom: 20,
  },
  infoTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoText: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  countdownContainer: {
    marginBottom: 20,
  },
  countdownText: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
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