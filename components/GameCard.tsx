import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';

interface GameCardProps {
  game: {
    id: number;
    title: string;
    openTime: string;
    closeTime: string;
    status: string;
    color: string;
    bgColor: string;
  };
  onPlayNow: (game: any) => void;
}

export default function GameCard({ game, onPlayNow }: GameCardProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Simple pulse animation for status only
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    onPlayNow(game);
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity 
        style={[
          styles.gameCard, 
          { 
            backgroundColor: '#1a1a1a',
            borderColor: '#4A90E2',
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.gameHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.gameIcon}>
              {game.title.includes('24') ? '🎯' : game.id <= 4 ? '⭐' : '💎'}
            </Text>
            <Text style={[styles.gameTitle, { color: '#4A90E2' }]}>
              {game.title}
            </Text>
          </View>
        </View>

        <View style={styles.gameDetails}>
          <View style={styles.gameTime}>
            <Text style={styles.timeLabel}>Open:</Text>
            <Text style={styles.timeValue}>{game.openTime}</Text>
          </View>
          <View style={styles.gameTime}>
            <Text style={styles.timeLabel}>Close:</Text>
            <Text style={styles.timeValue}>{game.closeTime}</Text>
          </View>
        </View>

        <Animated.Text 
          style={[
            styles.gameStatus,
            {
              transform: [{ scale: pulseAnim }],
            }
          ]}
        >
          {game.status}
        </Animated.Text>

        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: '#4A90E2' }]}
          onPress={handlePress}
        >
          <Text style={styles.playButtonText}>Play Now →</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '48%',
    marginBottom: 15,
  },
  gameCard: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 3,
  },
  gameHeader: {
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gameDetails: {
    marginBottom: 10,
  },
  gameTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeLabel: {
    color: '#999',
    fontSize: 12,
  },
  timeValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameStatus: {
    color: '#4A90E2',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  playButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});