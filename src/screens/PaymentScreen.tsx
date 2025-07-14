
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dispatch } = useCart();
  const { orderDetails } = route.params as any;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (orderDetails.paymentMethod.id === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        Alert.alert('Error', 'Please fill all card details');
        return;
      }
    } else if (orderDetails.paymentMethod.id === 'upi') {
      if (!upiId) {
        Alert.alert('Error', 'Please enter UPI ID');
        return;
      }
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      dispatch({ type: 'CLEAR_CART' });
      navigation.navigate('OrderConfirmation' as never, { orderDetails } as never);
    }, 3000);
  };

  const renderCardForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Card Details</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={19}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="MM/YY"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            value={cvv}
            onChangeText={setCvv}
            placeholder="123"
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          value={cardholderName}
          onChangeText={setCardholderName}
          placeholder="John Doe"
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const renderUPIForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>UPI Payment</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>UPI ID</Text>
        <TextInput
          style={styles.input}
          value={upiId}
          onChangeText={setUpiId}
          placeholder="example@upi"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.upiApps}>
        <Text style={styles.upiAppsTitle}>Or pay with</Text>
        <View style={styles.upiAppsList}>
          {['PhonePe', 'Google Pay', 'Paytm', 'BHIM'].map((app) => (
            <TouchableOpacity key={app} style={styles.upiAppButton}>
              <Text style={styles.upiAppText}>{app}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Payment Method Info */}
        <View style={styles.paymentMethodCard}>
          <View style={[styles.paymentIcon, { backgroundColor: orderDetails.paymentMethod.color + '20' }]}>
            <Ionicons 
              name={orderDetails.paymentMethod.icon as any} 
              size={24} 
              color={orderDetails.paymentMethod.color} 
            />
          </View>
          <Text style={styles.paymentMethodText}>{orderDetails.paymentMethod.name}</Text>
        </View>

        {/* Payment Form */}
        {orderDetails.paymentMethod.id === 'card' && renderCardForm()}
        {orderDetails.paymentMethod.id === 'upi' && renderUPIForm()}
        {orderDetails.paymentMethod.id === 'wallet' && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Digital Wallet</Text>
            <Text style={styles.walletText}>Choose your preferred wallet</Text>
            <View style={styles.walletOptions}>
              {['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik'].map((wallet) => (
                <TouchableOpacity key={wallet} style={styles.walletButton}>
                  <Text style={styles.walletButtonText}>{wallet}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>₹{orderDetails.total + 29}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>You Save</Text>
            <Text style={styles.saveValue}>₹{Math.round(orderDetails.total * 0.25)}</Text>
          </View>
        </View>

        {processing && (
          <View style={styles.processingContainer}>
            <Text style={styles.processingText}>Processing your payment...</Text>
            <Text style={styles.processingSubtext}>Please don't close this page</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotal}>₹{orderDetails.total + 29}</Text>
          <Text style={styles.footerMethod}>{orderDetails.paymentMethod.name}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.payButton, processing && styles.payButtonDisabled]} 
          onPress={handlePayment}
          disabled={processing}
        >
          <Text style={styles.payButtonText}>
            {processing ? 'Processing...' : 'PAY NOW'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentMethodText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  formContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FB',
  },
  row: {
    flexDirection: 'row',
  },
  upiApps: {
    marginTop: 20,
  },
  upiAppsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  upiAppsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  upiAppButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  upiAppText: {
    color: 'white',
    fontWeight: '600',
  },
  walletText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  walletOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  walletButton: {
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  walletButtonText: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  saveValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  processingContainer: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  processingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
    marginBottom: 5,
  },
  processingSubtext: {
    fontSize: 14,
    color: '#FF9800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalContainer: {
    flex: 1,
  },
  footerTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  footerMethod: {
    fontSize: 12,
    color: '#666',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 20,
  },
  payButtonDisabled: {
    backgroundColor: '#CCC',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen;
