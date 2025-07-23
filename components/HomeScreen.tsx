import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import GameCard from './GameCard';
import GameRulesModal from './GameRulesModal';
import { Ionicons } from '@expo/vector-icons';

interface HomeScreenProps {
  gameCards: any[];
  features: any[];
  onPlayNow: (game: any) => void;
  onKYCPress: () => void;
  isAuthenticated: boolean;
}

export default function HomeScreen({ gameCards, features, onPlayNow, onKYCPress, isAuthenticated }: HomeScreenProps) {
  const [showGameRules, setShowGameRules] = useState(false);
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

      {/* Enhanced Colorful Features Section */}
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={[
            styles.featureCard,
            index === 0 && styles.feature24x7,
            index === 1 && styles.feature5min,
            index === 2 && styles.feature100safe,
            index === 3 && styles.feature24x7Support
          ]}>
            <View style={[
              styles.featureIconContainer,
              index === 0 && styles.iconContainer24x7,
              index === 1 && styles.iconContainer5min,
              index === 2 && styles.iconContainer100safe,
              index === 3 && styles.iconContainer24x7Support
            ]}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
            </View>
            <Text style={[
              styles.featureTitle,
              index === 0 && styles.title24x7,
              index === 1 && styles.title5min,
              index === 2 && styles.title100safe,
              index === 3 && styles.title24x7Support
            ]}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
            {/* Colorful glow effect */}
            <View style={[
              styles.featureGlow,
              index === 0 && styles.glow24x7,
              index === 1 && styles.glow5min,
              index === 2 && styles.glow100safe,
              index === 3 && styles.glow24x7Support
            ]} />
          </View>
        ))}
      </View>

      {/* Game Rules, Time and KYC Section */}
      <View style={styles.timeKycContainer}>
        <TouchableOpacity style={styles.gameRulesButton} onPress={() => setShowGameRules(true)}>
          <Text style={styles.gameRulesText}>📋 Game Rules</Text>
        </TouchableOpacity>

        <View style={styles.timeCenterSection}>
          <Text style={styles.currentTime}>🕐12:28:27</Text>
        </View>

        <TouchableOpacity style={styles.kycButton} onPress={onKYCPress}>
          <Text style={styles.kycButtonIcon}>🔐</Text>
          <Text style={styles.kycButtonText}>Complete KYC</Text>
        </TouchableOpacity>
      </View>

      {/* Game Cards */}
      <View style={styles.gamesContainer}>
        <View style={styles.gameRow}>
          {isAuthenticated ? (
            gameCards.map((game) => (
              <GameCard key={game.id} game={game} onPlayNow={onPlayNow} />
            ))
          ) : (
            <View style={styles.authPromptContainer}>
              <Text style={styles.authPromptTitle}>🎮 Games Available</Text>
              <Text style={styles.authPromptMessage}>
                Login करके exciting games खेलें और पैसे जीतें!
              </Text>
              {/* You can add a preview or placeholder content here */}
            </View>
          )}
        </View>
      </View>
      <View style={styles.bottomSpacing} />

      {/* Game Rules Modal */}
      <GameRulesModal 
        visible={showGameRules} 
        onClose={() => setShowGameRules(false)} 
      />
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
    borderRadius: isSmallDevice ? 10 : 12,
    borderWidth: 1,
    borderColor: '#333',
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
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
  },
  featureIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.4)',
  },
  featureIcon: {
    fontSize: 20,
    color: '#4A90E2',
  },
  featureTitle: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
  },
  featureGlow: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
    zIndex: -1,
  },
  // 24x7 Feature Styles
  feature24x7: {
    backgroundColor: '#1a1a2e',
    borderColor: '#00FF88',
  },
  iconContainer24x7: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    borderColor: 'rgba(0, 255, 136, 0.4)',
  },
  title24x7: {
    color: '#00FF88',
  },
  glow24x7: {
    borderColor: 'rgba(0, 255, 136, 0.4)',
  },
  // 5 min Feature Styles
  feature5min: {
    backgroundColor: '#2e1a1a',
    borderColor: '#FFD700',
  },
  iconContainer5min: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  title5min: {
    color: '#FFD700',
  },
  glow5min: {
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  // 100% Safe Feature Styles
  feature100safe: {
    backgroundColor: '#1a2e1a',
    borderColor: '#FF6B6B',
  },
  iconContainer100safe: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  title100safe: {
    color: '#FF6B6B',
  },
  glow100safe: {
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
    // 24x7 Support Feature Styles
  feature24x7Support: {
    backgroundColor: '#1a1a1a',
    borderColor: '#00BFFF',
  },
  iconContainer24x7Support: {
    backgroundColor: 'rgba(0, 191, 255, 0.15)',
    borderColor: 'rgba(0, 191, 255, 0.4)',
  },
  title24x7Support: {
    color: '#00BFFF',
  },
  glow24x7Support: {
    borderColor: 'rgba(0, 191, 255, 0.4)',
  },
  timeKycContainer: {
    backgroundColor: '#1a1a1a',
    padding: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 10 : 12,
    marginBottom: isSmallDevice ? 15 : 20,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeCenterSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
      paddingHorizontal: isSmallDevice ? 8 : 10,
      paddingVertical: isSmallDevice ? 4 : 6,
    borderRadius: isSmallDevice ? 6 : 8,
      minHeight: isSmallDevice ? 32 : 36,
    marginHorizontal: isSmallDevice ? 8 : 10,


  },
  currentTime: {
    color: '#4A90E2',
    fontSize: isSmallDevice ? 10 : 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameRulesButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: isSmallDevice ? 10 : 12,
    paddingVertical: isSmallDevice ? 6 : 8,
    borderRadius: isSmallDevice ? 6 : 8,
    minHeight: isSmallDevice ? 32 : 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF8A8A',
  },
  gameRulesText: {
    color: '#fff',
    fontSize: isSmallDevice ? 9 : 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  kycButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: isSmallDevice ? 12 : 15,
    paddingVertical: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 8 : 10,
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
  gameRulesModal: {
    backgroundColor: '#1a1a1a',
    width: '95%',
    maxHeight: '80%',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  authPromptContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
    alignItems: 'center',
  },
  authPromptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  authPromptMessage: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  gamePreviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  gamePreviewCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    opacity: 0.6,
  },
  gamePreviewIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  gamePreviewTitle: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 16,
  },
});