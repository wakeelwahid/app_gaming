import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';

interface WithdrawSuccessProps {
  visible: boolean;
  amount: string;
  onClose: () => void;
}

export default function WithdrawSuccess({
  visible,
  amount,
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

            {/* Timer Message */}
            <View style={styles.timerContainer}>
              <Text style={styles.timerMessage}>
                💳 Payment 5 to 10 minutes में successful हो जाएगी
              </Text>
              <Text style={styles.timerNote}>
                Processing में थोड़ा समय लगता है
              </Text>
            </View>

            {/* Additional Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>📋 Important Information:</Text>
              <Text style={styles.infoText}>• आपके bank account में payment transfer हो जाएगी</Text>
              <Text style={styles.infoText}>• Processing time: 5-10 minutes</Text>
              <Text style={styles.infoText}>• SMS notification मिलेगा जब payment complete होगी</Text>
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