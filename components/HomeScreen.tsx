
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GameCard from './GameCard';

interface HomeScreenProps {
  gameCards: any[];
  features: any[];
  onPlayNow: (game: any) => void;
}

export default function HomeScreen({ gameCards, features, onPlayNow }: HomeScreenProps) {
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
      <Text style={styles.sectionTitle}>भारत का नंबर 1 गेमिंग प्लेटफॉर्म</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureIcon}>{feature.icon}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
          </View>
        ))}
      </View>

      {/* Current Time */}
      <View style={styles.timeContainer}>
        <Text style={styles.currentTime}>🕐 12:28:27 PM</Text>
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

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#0a0a0a',
  },
  promoScroll: {
    marginVertical: 15,
  },
  promoCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A90E2',
    minWidth: 250,
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  promoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: '#2a2a2a',
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#CCCCCC',
    fontSize: 11,
    textAlign: 'center',
  },
  timeContainer: {
    backgroundColor: '#2a2a2a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  currentTime: {
    color: '#00FF88',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gamesContainer: {
    marginBottom: 20,
  },
  gameRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    height: 100,
  },
});
