
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

interface HeaderProps {
  wallet: string;
  onMenuItemPress?: (key: string) => void;
}

export default function Header({ wallet, onMenuItemPress }: HeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  const profileMenuItems = [
    { icon: 'swap-horizontal', title: 'Transactions', key: 'transactions' },
    { icon: 'time', title: 'Game History', key: 'history' },
    { icon: 'people', title: 'Refer & Earn', key: 'refer' },
    { icon: 'document-text', title: 'Terms & Conditions', key: 'terms' },
    { icon: 'shield-checkmark', title: 'Privacy Policy', key: 'privacy' },
    { icon: 'help-circle', title: 'Help & Support', key: 'help' },
    { icon: 'log-out', title: 'Logout', key: 'logout' },
  ];

  React.useEffect(() => {
    // Pulse animation for wallet
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handleMenuItemPress = (key: string) => {
    setShowProfileMenu(false);
    if (onMenuItemPress) {
      onMenuItemPress(key);
    }
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => setShowProfileMenu(true)}
          >
            <Animated.View style={[
              styles.profileIcon,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <Ionicons name="person" size={20} color="#fff" />
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>👑 DREAM11</Text>
            <Text style={styles.tagline}>Premium Gaming Platform</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Animated.View style={[
            styles.walletContainer,
            { transform: [{ scale: pulseAnim }] }
          ]}>
            <Ionicons name="wallet" size={20} color="#00FF88" />
            <Text style={styles.walletAmount}>{wallet}</Text>
          </Animated.View>
        </View>
      </View>

      <Modal
        visible={showProfileMenu}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <Animated.View style={styles.profileMenuContainer}>
            <View style={styles.profileMenuHeader}>
              <View style={styles.profileMenuIcon}>
                <Ionicons name="person" size={24} color="#4A90E2" />
              </View>
              <Text style={styles.profileMenuTitle}>Menu</Text>
            </View>
            
            {profileMenuItems.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.profileMenuItem}
                onPress={() => handleMenuItemPress(item.key)}
              >
                <Ionicons 
                  name={item.icon as any} 
                  size={20} 
                  color={item.key === 'logout' ? '#FF4444' : '#4A90E2'} 
                />
                <Text 
                  style={[
                    styles.profileMenuItemText,
                    item.key === 'logout' && styles.logoutText
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    marginRight: 12,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  tagline: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  walletAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00FF88',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  profileMenuContainer: {
    backgroundColor: '#0a0a0a',
    marginTop: 60,
    marginLeft: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
    minWidth: 200,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  profileMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileMenuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  profileMenuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  profileMenuItemText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutText: {
    color: '#FF4444',
  },
});
