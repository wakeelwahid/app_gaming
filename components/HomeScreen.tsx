
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import GameCard from './GameCard';

interface HomeScreenProps {
  gameCards: any[];
  features: any[];
  onPlayNow: (game: any) => void;
  onKYCPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;

export default function HomeScreen({ gameCards, features, onPlayNow, onKYCPress }: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous pulse animation for KYC button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotate animation for promotional cards
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();

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
      second: '2-digit',
    });
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Animated Header */}
        <Animated.View style={[styles.headerContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.welcomeText}>🎰 Welcome to Satta King</Text>
          <Text style={styles.subWelcomeText}>Your Lucky Destination!</Text>
        </Animated.View>

        {/* Promotional Banner with Animation */}
        <Animated.View style={[styles.promoContainer, { transform: [{ scale: scaleAnim }] }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
            <Animated.View style={[styles.promoCard, styles.jackpotCard]}>
              <Animated.Text style={[styles.jackpotIcon, { transform: [{ rotate: spin }] }]}>💎</Animated.Text>
              <Text style={styles.promoText}>🎊 आज का जैकपॉट: ₹25,00,000</Text>
              <Text style={styles.promoSubtext}>Win Big Today!</Text>
            </Animated.View>
            
            <View style={[styles.promoCard, styles.newGameCard]}>
              <Text style={styles.newGameIcon}>🚀</Text>
              <Text style={styles.promoText}>🎮 नया गेम लॉन्च: डायमंड किंग</Text>
              <Text style={styles.promoSubtext}>Play Now!</Text>
            </View>
            
            <View style={[styles.promoCard, styles.bonusCard]}>
              <Text style={styles.bonusIcon}>🎁</Text>
              <Text style={styles.promoText}>🎁 विशेष ऑफर: पहली डिपॉजिट पर 100% बोनस</Text>
              <Text style={styles.promoSubtext}>Limited Time!</Text>
            </View>
          </ScrollView>
        </Animated.View>

        {/* Features Section with Staggered Animation */}
        <Animated.View style={[styles.featuresContainer, { transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.sectionTitle}>✨ Why Choose Us?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <Animated.View 
                key={index} 
                style={[
                  styles.featureCard,
                  {
                    transform: [{
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, index * 10],
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
          </View>
        </Animated.View>

        {/* Enhanced Time and KYC Section */}
        <Animated.View style={[styles.timeKycContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.timeSection}>
            <Text style={styles.timeLabel}>🕐 Current Time</Text>
            <Text style={styles.currentTime}>{formatTime(currentTime)}</Text>
            <Text style={styles.dateText}>{currentTime.toLocaleDateString('en-IN')}</Text>
          </View>
          
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.kycButton} onPress={onKYCPress}>
              <Text style={styles.kycButtonIcon}>🔐</Text>
              <View>
                <Text style={styles.kycButtonText}>Complete KYC</Text>
                <Text style={styles.kycSubtext}>Verify Now</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        {/* Games Section with Enhanced Animation */}
        <Animated.View style={[styles.gamesContainer, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>🎯 Live Games</Text>
          <View style={styles.gameRow}>
            {gameCards.map((game, index) => (
              <Animated.View
                key={game.id}
                style={{
                  transform: [{
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, index * 20],
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
  headerContainer: {
    alignItems: 'center',
    marginVertical: isSmallDevice ? 15 : 20,
    paddingVertical: isSmallDevice ? 15 : 20,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  welcomeText: {
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subWelcomeText: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#4A90E2',
    textAlign: 'center',
    fontWeight: '600',
  },
  promoContainer: {
    marginBottom: isSmallDevice ? 15 : 20,
  },
  promoScroll: {
    marginVertical: isSmallDevice ? 10 : 15,
  },
  promoCard: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 15 : 18,
    marginRight: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 12 : 15,
    borderWidth: 2,
    minWidth: isSmallDevice ? 220 : 270,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  jackpotCard: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  newGameCard: {
    borderColor: '#00FF88',
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
  },
  bonusCard: {
    borderColor: '#FF6B6B',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
  },
  jackpotIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  newGameIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  bonusIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  promoText: {
    color: '#fff',
    fontSize: isSmallDevice ? 13 : 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  promoSubtext: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: isSmallDevice ? 15 : 18,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuresContainer: {
    marginBottom: isSmallDevice ? 20 : 25,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 10 : 12,
  },
  featureCard: {
    backgroundColor: '#1a1a1a',
    width: isSmallDevice ? '47%' : '48%',
    padding: isSmallDevice ? 15 : 18,
    borderRadius: isSmallDevice ? 12 : 15,
    alignItems: 'center',
    marginBottom: isSmallDevice ? 10 : 12,
    borderWidth: 2,
    borderColor: '#333',
    minHeight: isSmallDevice ? 100 : 110,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  featureIcon: {
    fontSize: isSmallDevice ? 24 : 28,
    marginBottom: isSmallDevice ? 8 : 10,
  },
  featureTitle: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  featureSubtitle: {
    color: '#999',
    fontSize: isSmallDevice ? 10 : 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  timeKycContainer: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 15 : 20,
    borderRadius: isSmallDevice ? 12 : 15,
    marginBottom: isSmallDevice ? 20 : 25,
    borderWidth: 2,
    borderColor: '#4A90E2',
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: isSmallDevice ? 15 : 0,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timeSection: {
    flex: isSmallDevice ? 0 : 1,
    alignItems: isSmallDevice ? 'center' : 'flex-start',
  },
  timeLabel: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  currentTime: {
    color: '#00FF88',
    fontSize: isSmallDevice ? 18 : 22,
    fontWeight: 'bold',
    marginBottom: 3,
    textShadowColor: 'rgba(0, 255, 136, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dateText: {
    color: '#999',
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: '500',
  },
  kycButton: {
    backgroundColor: '#FF4444',
    paddingHorizontal: isSmallDevice ? 15 : 18,
    paddingVertical: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 10 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: isSmallDevice ? 50 : 55,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  kycButtonIcon: {
    fontSize: isSmallDevice ? 16 : 18,
  },
  kycButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  kycSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: '500',
  },
  gamesContainer: {
    marginBottom: isSmallDevice ? 20 : 25,
  },
  gameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 10 : 12,
  },
  bottomSpacing: {
    height: isSmallDevice ? 100 : 120,
  },
});
