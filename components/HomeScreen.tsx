import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import GameCard from './GameCard';

interface HomeScreenProps {
  gameCards: any[];
  features: any[];
  onPlayNow: (game: any) => void;
  onKYCPress: () => void;
}

export default function HomeScreen({ gameCards, features, onPlayNow, onKYCPress }: HomeScreenProps) {
  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Promotional Banner */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promoScroll}>
        <View style={styles.promoCard}>
          <Text style={styles.promoText}>🎊 आज का जैकपॉट: ₹25,00,000</Text>
        </View>
        <View style={styles.promoCard}>
          <Text style={styles.promoText}>🎮 नया गेम लॉन्च: डायमंड किंग</Text>
        </View>
        <View style={styles.promoCard}>
          <Text style={styles.promoText}>🎁 विशेष ऑफर: पहली डिपॉजिट पर 100% बोनस</Text>
        </View>
      </ScrollView>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
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

      {/* Current Time and KYC Section */}
      <View style={styles.timeKycContainer}>
        <View style={styles.timeSection}>
          <Text style={styles.currentTime}>🕐 12:28:27 PM</Text>
        </View>
        <TouchableOpacity style={styles.kycButton} onPress={onKYCPress}>
          <Text style={styles.kycButtonIcon}>🔐</Text>
          <Text style={styles.kycButtonText}>Complete KYC</Text>
        </TouchableOpacity>
      </View>

      {/* Game Cards */}
      <View style={styles.gamesContainer}>
        <View style={styles.gameRow}>
          {gameCards.map((game) => (
            <GameCard key={game.id} game={game} onPlayNow={onPlayNow} />
          ))}
        </View>
      </View>
      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 10 : 15,
  },
  promoScroll: {
    marginVertical: isSmallDevice ? 10 : 15,
  },
  promoCard: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 12 : 15,
    marginRight: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 8 : 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
    minWidth: isSmallDevice ? 200 : 250,
  },
  promoText: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: isSmallDevice ? 12 : 15,
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(74, 144, 226, 0.15), 0 4px 16px rgba(0, 255, 136, 0.1)',
    elevation: 12,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  featureIcon: {
    fontSize: 24,
    color: '#4A90E2',
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featureSubtitle: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
  featureGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#4A90E2',
    zIndex: -1,
    boxShadow: '0 0 20px rgba(74, 144, 226, 0.5)',
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