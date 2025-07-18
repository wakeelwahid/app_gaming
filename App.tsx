import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from './components/HomeScreen';
import Games from './components/Games';
import MyBet from './components/MyBet';
import BetHistory from './components/BetHistory';
import Profile from './components/Profile';
import Transaction from './components/Transaction';
import WalletOperations from './components/WalletOperations';
import PaymentSuccess from './components/PaymentSuccess';
import WithdrawSuccess from './components/WithdrawSuccess';
import BottomMenu from './components/BottomMenu';
import Header from './components/Header';
import BettingModal from './components/BettingModal';
import KYCPage from './components/KYCPage';
import AgeVerificationModal from './components/AgeVerificationModal';
import { GAME_CARDS, FEATURES } from './constants/gameData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isBettingModalVisible, setIsBettingModalVisible] = useState(false);
  const [isKYCVisible, setIsKYCVisible] = useState(false);
  const [isAgeVerificationVisible, setIsAgeVerificationVisible] = useState(true);
  const [user, setUser] = useState({
    username: 'राहुल कुमार',
    phone: '+91 98765 43210',
    wallet: 2500,
    winnings: 15000,
    isKYCVerified: false,
  });

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.9);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Screen transition animation
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    // Continuous rotation animation for special effects
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, [currentScreen]);

  const handleScreenChange = (screen) => {
    // Reset and start transition animation
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    scaleAnim.setValue(0.95);

    setCurrentScreen(screen);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePlayNow = (game) => {
    setSelectedGame(game);
    setIsBettingModalVisible(true);
  };

  const renderScreen = () => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ],
    };

    switch (currentScreen) {
      case 'home':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <HomeScreen
              gameCards={GAME_CARDS}
              features={FEATURES}
              onPlayNow={handlePlayNow}
              onKYCPress={() => setIsKYCVisible(true)}
            />
          </Animated.View>
        );
      case 'games':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <Games onPlayNow={handlePlayNow} />
          </Animated.View>
        );
      case 'mybet':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <MyBet />
          </Animated.View>
        );
      case 'history':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <BetHistory />
          </Animated.View>
        );
      case 'wallet':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <WalletOperations user={user} />
          </Animated.View>
        );
      case 'transaction':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <Transaction />
          </Animated.View>
        );
      case 'profile':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <Profile user={user} setUser={setUser} />
          </Animated.View>
        );
      case 'payment-success':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <PaymentSuccess
              amount="5000"
              method="UPI"
              onClose={() => handleScreenChange('wallet')}
            />
          </Animated.View>
        );
      case 'withdraw-success':
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <WithdrawSuccess
              amount="3000"
              upiId="rahul@paytm"
              onClose={() => handleScreenChange('wallet')}
            />
          </Animated.View>
        );
      default:
        return (
          <Animated.View style={[styles.screenContainer, animatedStyle]}>
            <HomeScreen
              gameCards={GAME_CARDS}
              features={FEATURES}
              onPlayNow={handlePlayNow}
              onKYCPress={() => setIsKYCVisible(true)}
            />
          </Animated.View>
        );
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      {/* Animated Background */}
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e', '#0a0a0a']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Rotating Background Elements */}
      <Animated.View style={[styles.backgroundElement1, { transform: [{ rotate: spin }] }]} />
      <Animated.View style={[styles.backgroundElement2, { transform: [{ rotate: spin }] }]} />

      {/* Header */}
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <Header user={user} currentScreen={currentScreen} />
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Menu */}
      <Animated.View style={[styles.bottomMenuContainer, { opacity: fadeAnim }]}>
        <BottomMenu
          currentScreen={currentScreen}
          onScreenChange={handleScreenChange}
        />
      </Animated.View>

      {/* Modals */}
      {isBettingModalVisible && (
        <BettingModal
          visible={isBettingModalVisible}
          game={selectedGame}
          onClose={() => setIsBettingModalVisible(false)}
        />
      )}

      {isKYCVisible && (
        <KYCPage
          visible={isKYCVisible}
          onClose={() => setIsKYCVisible(false)}
          onVerificationSuccess={() => {
            setUser(prev => ({ ...prev, isKYCVerified: true }));
            setIsKYCVisible(false);
          }}
        />
      )}

      {isAgeVerificationVisible && (
        <AgeVerificationModal
          visible={isAgeVerificationVisible}
          onConfirm={() => setIsAgeVerificationVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundElement1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 212, 0, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 212, 0, 0.1)',
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(0, 255, 136, 0.03)',
    borderWidth: 2,
    borderColor: 'rgba(0, 255, 136, 0.08)',
  },
  headerContainer: {
    zIndex: 1000,
  },
  content: {
    flex: 1,
    paddingTop: 10,
  },
  screenContainer: {
    flex: 1,
  },
  bottomMenuContainer: {
    zIndex: 1000,
  },
});