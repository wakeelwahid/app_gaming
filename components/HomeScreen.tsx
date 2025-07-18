
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GameCard from './GameCard';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;

interface HomeScreenProps {
  gameCards: any[];
  features: any[];
  onPlayNow: (game: any) => void;
  onKYCPress: () => void;
}

export default function HomeScreen({ gameCards, features, onPlayNow, onKYCPress }: HomeScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate components on mount
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <Animated.View 
        style={[
          styles.heroSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.heroGradient}>
          <Text style={styles.heroTitle}>🎯 DREAM11 PRO</Text>
          <Text style={styles.heroSubtitle}>भारत का सबसे भरोसेमंद गेमिंग प्लेटफॉर्म</Text>
          <View style={styles.heroStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>10L+</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₹50Cr+</Text>
              <Text style={styles.statLabel}>Winnings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Support</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Live Status Banner */}
      <Animated.View 
        style={[
          styles.liveStatusBanner,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.liveIndicator}>
          <View style={styles.pulseIndicator} />
          <Text style={styles.liveText}>🔴 LIVE</Text>
        </View>
        <Text style={styles.statusText}>🕐 Current Time: 12:28:27 PM</Text>
      </Animated.View>

      {/* Promotional Carousel */}
      <Animated.View 
        style={[
          styles.promoSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <Text style={styles.promoIcon}>🎊</Text>
              <Text style={styles.promoTitle}>Today's Jackpot</Text>
            </View>
            <Text style={styles.promoAmount}>₹25,00,000</Text>
            <Text style={styles.promoSubtext}>खेलें और जीतें!</Text>
          </View>
          
          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <Text style={styles.promoIcon}>🎮</Text>
              <Text style={styles.promoTitle}>New Game Launch</Text>
            </View>
            <Text style={styles.promoAmount}>Diamond King</Text>
            <Text style={styles.promoSubtext}>अभी खेलें!</Text>
          </View>
          
          <View style={styles.promoCard}>
            <View style={styles.promoHeader}>
              <Text style={styles.promoIcon}>🎁</Text>
              <Text style={styles.promoTitle}>Special Offer</Text>
            </View>
            <Text style={styles.promoAmount}>100% Bonus</Text>
            <Text style={styles.promoSubtext}>पहली डिपॉजिट पर</Text>
          </View>
        </ScrollView>
      </Animated.View>

      {/* Features Grid */}
      <Animated.View 
        style={[
          styles.featuresSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>✨ Premium Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Action Center */}
      <Animated.View 
        style={[
          styles.actionCenter,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.kycButton} onPress={onKYCPress}>
            <View style={styles.kycIconContainer}>
              <Ionicons name="shield-checkmark" size={24} color="#fff" />
            </View>
            <View style={styles.kycTextContainer}>
              <Text style={styles.kycButtonText}>Complete KYC</Text>
              <Text style={styles.kycSubtext}>Secure your account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Games Section */}
      <Animated.View 
        style={[
          styles.gamesSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.sectionTitle}>🎲 Live Games</Text>
        <View style={styles.gamesGrid}>
          {gameCards.map((game) => (
            <GameCard key={game.id} game={game} onPlayNow={onPlayNow} />
          ))}
        </View>
      </Animated.View>

      {/* Bottom Trust Section */}
      <Animated.View 
        style={[
          styles.trustSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.trustTitle}>🛡️ 100% Safe & Secure</Text>
        <View style={styles.trustFeatures}>
          <View style={styles.trustItem}>
            <Ionicons name="lock-closed" size={20} color="#00FF88" />
            <Text style={styles.trustText}>Encrypted</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="shield-checkmark" size={20} color="#00FF88" />
            <Text style={styles.trustText}>Verified</Text>
          </View>
          <View style={styles.trustItem}>
            <Ionicons name="flash" size={20} color="#00FF88" />
            <Text style={styles.trustText}>Instant</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  
  // Hero Section
  heroSection: {
    margin: isSmallDevice ? 10 : 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 20 : 25,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: isSmallDevice ? 12 : 14,
    color: '#4A90E2',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: '#00FF88',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isSmallDevice ? 10 : 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
  },

  // Live Status Banner
  liveStatusBanner: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: isSmallDevice ? 10 : 15,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  liveText: {
    color: '#FF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Promotional Section
  promoSection: {
    marginBottom: 20,
  },
  promoScroll: {
    paddingLeft: isSmallDevice ? 10 : 15,
  },
  promoCard: {
    backgroundColor: '#1a1a1a',
    width: isSmallDevice ? 180 : 200,
    padding: isSmallDevice ? 15 : 20,
    marginRight: isSmallDevice ? 10 : 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
    alignItems: 'center',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  promoIcon: {
    fontSize: 20,
  },
  promoTitle: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promoAmount: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  promoSubtext: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
  },

  // Features Section
  featuresSection: {
    paddingHorizontal: isSmallDevice ? 10 : 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  featureCard: {
    backgroundColor: '#1a1a1a',
    width: isSmallDevice ? '47%' : '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 100,
  },
  featureIconContainer: {
    backgroundColor: '#4A90E2',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 20,
    color: '#fff',
  },
  featureTitle: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  featureSubtitle: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
  },

  // Action Center
  actionCenter: {
    paddingHorizontal: isSmallDevice ? 10 : 15,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kycButton: {
    flex: 1,
    backgroundColor: '#FF4444',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kycIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kycTextContainer: {
    flex: 1,
  },
  kycButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  kycSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
  },

  // Games Section
  gamesSection: {
    paddingHorizontal: isSmallDevice ? 10 : 15,
    marginBottom: 20,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Trust Section
  trustSection: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: isSmallDevice ? 10 : 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FF88',
    alignItems: 'center',
    marginBottom: 20,
  },
  trustTitle: {
    color: '#00FF88',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  trustFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  trustItem: {
    alignItems: 'center',
    gap: 8,
  },
  trustText: {
    color: '#00FF88',
    fontSize: 12,
    fontWeight: 'bold',
  },

  bottomSpacing: {
    height: 100,
  },
});
