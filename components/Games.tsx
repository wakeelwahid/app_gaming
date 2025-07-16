
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import GameCard from './GameCard';

interface GamesProps {
  gameCards: any[];
  onGameSelect: (game: any) => void;
}

export default function Games({ gameCards, onGameSelect }: GamesProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 All Games</Text>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.gamesGrid}>
          {gameCards.map((game) => (
            <GameCard 
              key={game.id} 
              game={game} 
              onPlayNow={onGameSelect} 
            />
          ))}
        </View>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 15,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bottomSpacing: {
    height: 100,
  },
});
