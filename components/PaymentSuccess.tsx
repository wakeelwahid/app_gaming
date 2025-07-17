import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface PaymentSuccessProps {
  visible: boolean;
  amount: string;
  utrNumber: string;
  paymentMethod: string;
  onClose: () => void;
}

export default function PaymentSuccess({
  visible,
  amount,
  utrNumber,
  paymentMethod,
  onClose
}: PaymentSuccessProps) {
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
        <View style={styles.paymentSuccessModalContainer}>
          <View style={styles.successContent}>
            {/* Success Icon */}
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✅</Text>
            </View>

            {/* Success Message */}
            <Text style={styles.successTitle}>Payment Pending!</Text>
            <Text style={styles.successMessage}>
              Your payment of ₹{amount} via {paymentMethod} is being processed.
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