
import React, { useState } from 'react';
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
  const [scaleAnim] = useState(new Animated.Value(1));
  const [glowAnim] = useState(new Animated.Value(0));

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View style={[
      styles.gameCard,
      { 
        backgroundColor: game.bgColor,
        transform: [{ scale: scaleAnim }],
        shadowOpacity: glowAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.3, 0.6]
        })
      }
    ]}>
      <View style={styles.gameHeader}>
        <Text style={[styles.gameTitle, { color: game.color }]}>
          {game.id <= 4 ? '⭐' : '💎'} {game.title}
        </Text>
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

      <Text style={styles.gameStatus}>{game.status}</Text>

      <TouchableOpacity 
        style={[styles.playButton, { backgroundColor: game.color }]}
        onPress={() => onPlayNow(game)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={styles.playButtonText}>Play Now →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  gameHeader: {
    marginBottom: 10,
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
    color: '#00FF88',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
  },
  playButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  playButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
