
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
  return (
    <TouchableOpacity style={[styles.gameCard, { backgroundColor: game.bgColor }]}>
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
      >
        <Text style={styles.playButtonText}>Play Now →</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#4A90E2',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gameHeader: {
    marginBottom: 10,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
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
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '600',
  },
  timeValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameStatus: {
    color: '#00FF88',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  playButton: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  playButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
