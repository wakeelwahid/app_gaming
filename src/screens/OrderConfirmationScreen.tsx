
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const OrderConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderDetails } = route.params as any;
  const [countdown, setCountdown] = useState(5);

  const orderNumber = Math.floor(Math.random() * 1000000).toString();
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  // Auto redirect to home after 5 seconds with countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigation.navigate('Home' as never);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Success Icon */}
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully! 🎉</Text>
          <Text style={styles.successSubtitle}>
            Thank you for shopping with us. Your order has been confirmed and will be delivered soon.
          </Text>
          <Text style={styles.redirectText}>
            Redirecting to home in {countdown} seconds...
          </Text>
        </View>

        {/* Order Details */}
        <View style={styles.orderCard}>
          <Text style={styles.orderCardTitle}>Order Details</Text>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order Number</Text>
            <Text style={styles.orderValue}>#{orderNumber}</Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order Date</Text>
            <Text style={styles.orderValue}>{new Date().toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Expected Delivery</Text>
            <Text style={styles.orderValue}>{deliveryDate.toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Payment Method</Text>
            <Text style={styles.orderValue}>{orderDetails.paymentMethod.name}</Text>
          </View>
          
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Total Amount</Text>
            <Text style={styles.orderValueBold}>₹{orderDetails.total + 29}</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <Text style={styles.addressTitle}>Delivery Address</Text>
          <Text style={styles.addressName}>{orderDetails.address.name}</Text>
          <Text style={styles.addressText}>{orderDetails.address.address}</Text>
          <Text style={styles.addressPhone}>{orderDetails.address.phone}</Text>
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>Order Items ({orderDetails.items.length})</Text>
          {orderDetails.items.slice(0, 3).map((item: any, index: number) => (
            <View key={item.id} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>₹{(item.price * 80).toFixed(0)} × {item.quantity}</Text>
              </View>
            </View>
          ))}
          {orderDetails.items.length > 3 && (
            <Text style={styles.moreItems}>+{orderDetails.items.length - 3} more items</Text>
          )}
        </View>

        {/* Track Order Timeline */}
        <View style={styles.trackingCard}>
          <Text style={styles.trackingTitle}>Order Tracking</Text>
          <View style={styles.trackingSteps}>
            <View style={styles.trackingStep}>
              <View style={[styles.trackingDot, styles.trackingDotActive]} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingStepTitle}>Order Confirmed</Text>
                <Text style={styles.trackingStepTime}>Just now</Text>
              </View>
            </View>
            <View style={styles.trackingLine} />
            <View style={styles.trackingStep}>
              <View style={styles.trackingDot} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingStepTitle}>Order Packed</Text>
                <Text style={styles.trackingStepTime}>In process</Text>
              </View>
            </View>
            <View style={styles.trackingLine} />
            <View style={styles.trackingStep}>
              <View style={styles.trackingDot} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingStepTitle}>Out for Delivery</Text>
                <Text style={styles.trackingStepTime}>Pending</Text>
              </View>
            </View>
            <View style={styles.trackingLine} />
            <View style={styles.trackingStep}>
              <View style={styles.trackingDot} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackingStepTitle}>Delivered</Text>
                <Text style={styles.trackingStepTime}>Pending</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.trackButton}>
            <Ionicons name="location" size={20} color="#667eea" />
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download" size={20} color="#4CAF50" />
            <Text style={styles.downloadButtonText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Shopping */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('Home' as never)}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  content: {
    paddingVertical: 40,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  successIcon: {
    width: 120,
    height: 120,
    backgroundColor: '#E8F5E8',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  redirectText: {
    fontSize: 14,
    color: '#667eea',
    textAlign: 'center',
    marginTop: 15,
    fontWeight: '600',
  },
  orderCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  orderCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 14,
    color: '#666',
  },
  orderValue: {
    fontSize: 14,
    color: '#2C3E50',
    fontWeight: '500',
  },
  orderValueBold: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: 'bold',
  },
  addressCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
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
  itemsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  moreItems: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    textAlign: 'center',
  },
  trackingCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  trackingSteps: {
    paddingLeft: 10,
  },
  trackingStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E5E5',
    marginRight: 15,
  },
  trackingDotActive: {
    backgroundColor: '#4CAF50',
  },
  trackingContent: {
    flex: 1,
    paddingVertical: 8,
  },
  trackingStepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  trackingStepTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  trackingLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E5E5',
    marginLeft: 5,
    marginRight: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 8,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
  continueButton: {
    backgroundColor: '#667eea',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderConfirmationScreen;
