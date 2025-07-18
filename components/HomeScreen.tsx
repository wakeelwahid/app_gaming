
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import GameCard from './GameCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;

interface HomeScreenProps {
  gameCards: any[];
  features: any[];
  onPlayNow: (game: any) => void;
  onKYCPress: () => void;
}

export default function HomeScreen({ gameCards, features, onPlayNow, onKYCPress }: HomeScreenProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: false,
      }),
    ]).start();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Promotional Banner */}
        <Animated.View style={[styles.promoContainer, { opacity: fadeAnim }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
            <View style={styles.promoCard}>
              <Text style={styles.promoText}>🎊 Today's Jackpot: ₹25,00,000</Text>
            </View>
            <View style={styles.promoCard}>
              <Text style={styles.promoText}>🎮 New Game Launch: Diamond King</Text>
            </View>
            <View style={styles.promoCard}>
              <Text style={styles.promoText}>🎁 Special Offer: 100% Bonus on First Deposit</Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Features Section */}
        <Animated.View style={[styles.featuresContainer, { opacity: fadeAnim }]}>
          {features.map((feature, index) => (
            <Animated.View 
              key={index} 
              style={[
                styles.featureCard,
                {
                  transform: [{ 
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + (index * 10)]
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Current Time and KYC Section */}
        <Animated.View style={[styles.timeKycContainer, { opacity: fadeAnim }]}>
          <View style={styles.timeSection}>
            <Text style={styles.currentTime}>🕐 {formatTime(currentTime)}</Text>
          </View>
          <TouchableOpacity style={styles.kycButton} onPress={onKYCPress}>
            <Text style={styles.kycButtonIcon}>🔐</Text>
            <Text style={styles.kycButtonText}>Complete KYC</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Game Cards with staggered animation */}
        <Animated.View style={[styles.gamesContainer, { opacity: fadeAnim }]}>
          <View style={styles.gameRow}>
            {gameCards.map((game, index) => (
              <Animated.View 
                key={game.id}
                style={{
                  transform: [{ 
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + (index * 5)]
                    })
                  }]
                }}
              >
                <GameCard game={game} onPlayNow={onPlayNow} />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 10 : 15,
  },
  promoContainer: {
    marginVertical: isSmallDevice ? 10 : 15,
  },
  promoScroll: {
    marginVertical: isSmallDevice ? 5 : 10,
  },
  promoCard: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 12 : 15,
    marginRight: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 8 : 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
    minWidth: isSmallDevice ? 200 : 250,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  promoText: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: isSmallDevice ? 15 : 20,
    gap: isSmallDevice ? 8 : 10,
  },
  featureCard: {
    backgroundColor: '#1a1a1a',
    width: isSmallDevice ? '47%' : '48%',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 8 : 10,
    alignItems: 'center',
    marginBottom: isSmallDevice ? 8 : 10,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: isSmallDevice ? 80 : 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIcon: {
    fontSize: isSmallDevice ? 20 : 24,
    marginBottom: isSmallDevice ? 6 : 8,
  },
  featureTitle: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 10 : 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#999',
    fontSize: isSmallDevice ? 8 : 10,
    textAlign: 'center',
  },
  timeKycContainer: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 8 : 10,
    marginBottom: isSmallDevice ? 15 : 20,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: isSmallDevice ? 10 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  timeSection: {
    flex: isSmallDevice ? 0 : 1,
  },
  currentTime: {
    color: '#00FF88',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    textAlign: isSmallDevice ? 'center' : 'left',
  },
  kycButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 6 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: isSmallDevice ? 35 : 40,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  kycButtonIcon: {
    fontSize: isSmallDevice ? 12 : 14,
  },
  kycButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 10 : 12,
    fontWeight: 'bold',
  },
  gamesContainer: {
    marginBottom: isSmallDevice ? 15 : 20,
  },
  gameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 8 : 10,
  },
  bottomSpacing: {
    height: isSmallDevice ? 80 : 100,
  },
});
