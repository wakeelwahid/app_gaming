
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
    borderWidth: 1,
    borderColor: '#333',
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
  },
  playButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
