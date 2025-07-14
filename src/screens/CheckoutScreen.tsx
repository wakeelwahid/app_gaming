
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { state } = useCart();
  const [selectedAddress, setSelectedAddress] = useState('home');
  const [selectedPayment, setSelectedPayment] = useState('cod');

  const addresses = [
    {
      id: 'home',
      type: 'Home',
      address: '123 Main Street, City, State - 12345',
      name: 'John Doe',
      phone: '+91 9876543210'
    },
    {
      id: 'office',
      type: 'Office',
      address: '456 Business Park, City, State - 54321',
      name: 'John Doe',
      phone: '+91 9876543210'
    }
  ];

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: 'cash', color: '#4CAF50' },
    { id: 'upi', name: 'UPI Payment', icon: 'phone-portrait', color: '#2196F3' },
    { id: 'card', name: 'Credit/Debit Card', icon: 'card', color: '#FF9800' },
    { id: 'wallet', name: 'Digital Wallet', icon: 'wallet', color: '#9C27B0' }
  ];

  const handleProceedToPayment = () => {
    if (selectedPayment === 'cod') {
      navigation.navigate('OrderConfirmation' as never, {
        orderDetails: {
          items: state.items,
          total: state.total * 80,
          address: addresses.find(addr => addr.id === selectedAddress),
          paymentMethod: paymentMethods.find(pm => pm.id === selectedPayment)
        }
      } as never);
    } else {
      navigation.navigate('PaymentScreen' as never, {
        orderDetails: {
          items: state.items,
          total: state.total * 80,
          address: addresses.find(addr => addr.id === selectedAddress),
          paymentMethod: paymentMethods.find(pm => pm.id === selectedPayment)
        }
      } as never);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === address.id && styles.selectedCard
              ]}
              onPress={() => setSelectedAddress(address.id)}
            >
              <View style={styles.addressHeader}>
                <View style={styles.addressType}>
                  <Ionicons 
                    name={address.type === 'Home' ? 'home' : 'business'} 
                    size={16} 
                    color="#667eea" 
                  />
                  <Text style={styles.addressTypeText}>{address.type}</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedAddress === address.id && styles.radioButtonSelected
                ]}>
                  {selectedAddress === address.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </View>
              <Text style={styles.addressName}>{address.name}</Text>
              <Text style={styles.addressText}>{address.address}</Text>
              <Text style={styles.addressPhone}>{address.phone}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addAddressButton}>
            <Ionicons name="add" size={20} color="#667eea" />
            <Text style={styles.addAddressText}>Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment === method.id && styles.selectedCard
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                <Ionicons name={method.icon as any} size={24} color={method.color} />
              </View>
              <Text style={styles.paymentText}>{method.name}</Text>
              <View style={[
                styles.radioButton,
                selectedPayment === method.id && styles.radioButtonSelected
              ]}>
                {selectedPayment === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Items ({state.items.length})</Text>
              <Text style={styles.summaryValue}>₹{(state.total * 100).toFixed(0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.discountValue}>-₹{(state.total * 20).toFixed(0)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.freeValue}>FREE</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Packaging Fee</Text>
              <Text style={styles.summaryValue}>₹29</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{(state.total * 80 + 29).toFixed(0)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.footerTotal}>₹{(state.total * 80 + 29).toFixed(0)}</Text>
          <Text style={styles.footerSavings}>You saved ₹{(state.total * 20).toFixed(0)}</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton} onPress={handleProceedToPayment}>
          <Text style={styles.proceedButtonText}>
            {selectedPayment === 'cod' ? 'PLACE ORDER' : 'PROCEED TO PAYMENT'}
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  addressCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#667eea',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#667eea',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#667eea',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#667eea',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  addAddressText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
    marginLeft: 10,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  summaryCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#2C3E50',
  },
  discountValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  freeValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
    marginTop: 5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
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
  footerSavings: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
  },
  proceedButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 20,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
