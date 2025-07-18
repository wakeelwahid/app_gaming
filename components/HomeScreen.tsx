
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameCard from './GameCard';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallDevice = screenWidth < 380;

interface HomeScreenProps {
  gameCards: any[];
  features: any[];
  onPlayNow: (game: any) => void;
  onKYCPress: () => void;
}

export default function HomeScreen({ gameCards, features, onPlayNow, onKYCPress }: HomeScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Animation values
  const fadeAnims = useRef(gameCards.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(gameCards.map(() => new Animated.Value(50))).current;
  const scaleAnims = useRef(gameCards.map(() => new Animated.Value(0.8))).current;
  const promoAnim = useRef(new Animated.Value(0)).current;
  const featureAnims = useRef(features.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const jackpotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Time update
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Staggered animations for game cards
    const cardAnimations = gameCards.map((_, index) => {
      return Animated.sequence([
        Animated.delay(index * 150),
        Animated.parallel([
          Animated.timing(fadeAnims[index], {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
          Animated.timing(slideAnims[index], {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: false,
          }),
          Animated.timing(scaleAnims[index], {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
        ]),
      ]);
    });

    // Feature animations
    const featureAnimations = features.map((_, index) => {
      return Animated.sequence([
        Animated.delay(index * 100 + 500),
        Animated.timing(featureAnims[index], {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]);
    });

    // Promo animation
    Animated.timing(promoAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Jackpot pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(jackpotAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(jackpotAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Pulse animation for KYC button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Start all animations
    Animated.parallel([...cardAnimations, ...featureAnimations]).start();

    return () => clearInterval(timer);
  }, []);

  const jackpotGlow = jackpotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255, 212, 0, 0.3)', 'rgba(255, 212, 0, 0.8)'],
  });

  const jackpotScale = jackpotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Animated Promotional Banner */}
      <Animated.View style={[styles.promoContainer, { opacity: promoAnim }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
          <Animated.View style={[styles.promoCard, styles.jackpotCard, { 
            transform: [{ scale: jackpotScale }],
            shadowColor: jackpotGlow
          }]}>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF6347']}
              style={styles.promoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.promoText}>🎊 आज का जैकपॉट: ₹25,00,000</Text>
            </LinearGradient>
          </Animated.View>
          
          <View style={[styles.promoCard, styles.gameCard]}>
            <LinearGradient
              colors={['#4A90E2', '#357ABD', '#1E90FF']}
              style={styles.promoGradient}
            >
              <Text style={styles.promoText}>🎮 नया गेम लॉन्च: डायमंड किंग</Text>
            </LinearGradient>
          </View>
          
          <View style={[styles.promoCard, styles.bonusCard]}>
            <LinearGradient
              colors={['#00FF88', '#00CC6A', '#00AA55']}
              style={styles.promoGradient}
            >
              <Text style={styles.promoText}>🎁 विशेष ऑफर: पहली डिपॉजिट पर 100% बोनस</Text>
            </LinearGradient>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Animated Features Section */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Animated.View 
            key={index} 
            style={[
              styles.featureCard,
              {
                opacity: featureAnims[index],
                transform: [{
                  translateY: featureAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0],
                  })
                }]
              }
            ]}
          >
            <LinearGradient
              colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
              style={styles.featureGradient}
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>

      {/* Time and KYC Section */}
      <View style={styles.timeKycContainer}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          style={styles.timeKycGradient}
        >
          <View style={styles.timeSection}>
            <Text style={styles.currentTime}>
              🕐 {currentTime.toLocaleTimeString('hi-IN', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: true 
              })}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity style={styles.kycButton} onPress={onKYCPress}>
              <LinearGradient
                colors={['#FF4444', '#CC3333']}
                style={styles.kycGradient}
              >
                <Text style={styles.kycButtonIcon}>⚠️</Text>
                <Text style={styles.kycButtonText}>KYC करें</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>
      </View>

      {/* Animated Games Container */}
      <View style={styles.gamesContainer}>
        <View style={styles.gameRow}>
          {gameCards.map((game, index) => (
            <Animated.View
              key={game.id}
              style={[
                styles.gameCardContainer,
                {
                  opacity: fadeAnims[index],
                  transform: [
                    { translateY: slideAnims[index] },
                    { scale: scaleAnims[index] }
                  ],
                }
              ]}
            >
              <GameCard
                game={game}
                onPlayNow={onPlayNow}
                index={index}
              />
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  promoContainer: {
    marginBottom: isSmallDevice ? 15 : 20,
  },
  promoScroll: {
    paddingHorizontal: isSmallDevice ? 10 : 15,
  },
  promoCard: {
    width: isSmallDevice ? 280 : 320,
    height: isSmallDevice ? 60 : 70,
    marginRight: isSmallDevice ? 10 : 15,
    borderRadius: isSmallDevice ? 10 : 15,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  jackpotCard: {
    shadowColor: '#FFD700',
    borderWidth: 2,
    borderColor: 'rgba(255, 212, 0, 0.5)',
  },
  gameCard: {
    shadowColor: '#4A90E2',
  },
  bonusCard: {
    shadowColor: '#00FF88',
  },
  promoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  promoText: {
    color: '#000',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: isSmallDevice ? 10 : 15,
    marginBottom: isSmallDevice ? 15 : 20,
  },
  featureCard: {
    width: isSmallDevice ? 100 : 110,
    height: isSmallDevice ? 80 : 90,
    borderRadius: isSmallDevice ? 8 : 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  featureGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  featureIcon: {
    fontSize: isSmallDevice ? 20 : 24,
    marginBottom: 5,
  },
  featureTitle: {
    color: '#FFD700',
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
    marginHorizontal: isSmallDevice ? 10 : 15,
    marginBottom: isSmallDevice ? 15 : 20,
    borderRadius: isSmallDevice ? 8 : 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timeKycGradient: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isSmallDevice ? 12 : 15,
    gap: isSmallDevice ? 10 : 0,
  },
  timeSection: {
    flex: isSmallDevice ? 0 : 1,
  },
  currentTime: {
    color: '#00FF88',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    textAlign: isSmallDevice ? 'center' : 'left',
    textShadowColor: 'rgba(0, 255, 136, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  kycButton: {
    borderRadius: isSmallDevice ? 6 : 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  kycGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    gap: 5,
    minHeight: isSmallDevice ? 35 : 40,
  },
  kycButtonIcon: {
    fontSize: isSmallDevice ? 12 : 14,
  },
  kycButtonText: {
    color: '#fff',
    fontSize: isSmallDevice ? 10 : 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gamesContainer: {
    marginBottom: isSmallDevice ? 15 : 20,
    paddingHorizontal: isSmallDevice ? 5 : 10,
  },
  gameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCardContainer: {
    width: '48%',
    marginBottom: isSmallDevice ? 10 : 15,
  },
});
