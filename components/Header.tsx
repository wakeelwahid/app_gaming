
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenWidth < 380;

interface HeaderProps {
  user: {
    username: string;
    wallet: number;
    winnings: number;
  };
  currentScreen: string;
}

export default function Header({ user, currentScreen }: HeaderProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const walletPulse = useRef(new Animated.Value(1)).current;
  const winningsPulse = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: false,
      }),
    ]).start();

    // Wallet pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(walletPulse, {
          toValue: 1.05,
          duration: 2000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(walletPulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Winnings pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(winningsPulse, {
          toValue: 1.08,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(winningsPulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  const sparkleScale = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1.2, 0.5],
  });

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return '🏠 होम';
      case 'games': return '🎮 गेम्स';
      case 'mybet': return '🎯 मेरा बेट';
      case 'history': return '📊 हिस्ट्री';
      case 'wallet': return '💰 वॉलेट';
      case 'transaction': return '💳 ट्रांजैक्शन';
      case 'profile': return '👤 प्रोफाइल';
      default: return '🏠 होम';
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative Elements */}
        <View style={styles.decorativePattern} />
        
        {/* Top Row */}
        <View style={styles.topRow}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>नमस्ते</Text>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          
          <View style={styles.screenTitle}>
            <Text style={styles.screenTitleText}>{getScreenTitle()}</Text>
          </View>
        </View>

        {/* Balance Row */}
        <View style={styles.balanceRow}>
          {/* Wallet Balance */}
          <Animated.View 
            style={[
              styles.balanceCard,
              styles.walletCard,
              { transform: [{ scale: walletPulse }] }
            ]}
          >
            <LinearGradient
              colors={['#00FF88', '#00CC6A', '#00AA55']}
              style={styles.balanceGradient}
            >
              <View style={styles.balanceContent}>
                <Text style={styles.balanceLabel}>💰 वॉलेट</Text>
                <Text style={styles.balanceAmount}>₹{user.wallet.toLocaleString('hi-IN')}</Text>
              </View>
              
              {/* Sparkle Effect */}
              <Animated.View 
                style={[
                  styles.sparkle,
                  styles.sparkle1,
                  {
                    opacity: sparkleOpacity,
                    transform: [{ scale: sparkleScale }],
                  }
                ]}
              >
                <Text style={styles.sparkleText}>✨</Text>
              </Animated.View>
            </LinearGradient>
          </Animated.View>

          {/* Winnings */}
          <Animated.View 
            style={[
              styles.balanceCard,
              styles.winningsCard,
              { transform: [{ scale: winningsPulse }] }
            ]}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF8C00']}
              style={styles.balanceGradient}
            >
              <View style={styles.balanceContent}>
                <Text style={styles.balanceLabel}>🏆 जीत</Text>
                <Text style={styles.balanceAmount}>₹{user.winnings.toLocaleString('hi-IN')}</Text>
              </View>
              
              {/* Sparkle Effect */}
              <Animated.View 
                style={[
                  styles.sparkle,
                  styles.sparkle2,
                  {
                    opacity: sparkleOpacity,
                    transform: [{ scale: sparkleScale }],
                  }
                ]}
              >
                <Text style={styles.sparkleText}>⭐</Text>
              </Animated.View>
            </LinearGradient>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  gradient: {
    paddingHorizontal: isSmallDevice ? 15 : 20,
    paddingTop: isSmallDevice ? 15 : 20,
    paddingBottom: isSmallDevice ? 15 : 20,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativePattern: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 212, 0, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 212, 0, 0.1)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallDevice ? 15 : 20,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    color: '#999',
    fontSize: isSmallDevice ? 12 : 14,
    marginBottom: 2,
  },
  username: {
    color: '#fff',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  screenTitle: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 15 : 18,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  screenTitleText: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 10 : 15,
  },
  balanceCard: {
    flex: 1,
    borderRadius: isSmallDevice ? 12 : 15,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  walletCard: {
    shadowColor: '#00FF88',
  },
  winningsCard: {
    shadowColor: '#FFD700',
  },
  balanceGradient: {
    padding: isSmallDevice ? 12 : 15,
    position: 'relative',
    minHeight: isSmallDevice ? 60 : 70,
  },
  balanceContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  balanceLabel: {
    color: '#000',
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  balanceAmount: {
    color: '#000',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 5,
    right: 10,
  },
  sparkle2: {
    bottom: 8,
    left: 12,
  },
  sparkleText: {
    fontSize: isSmallDevice ? 12 : 14,
  },
});
