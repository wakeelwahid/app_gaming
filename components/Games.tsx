
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import GameCard from './GameCard';

interface GamesProps {
  gameCards: any[];
  onGameSelect: (game: any) => void;
}

export default function Games({ gameCards, onGameSelect }: GamesProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text 
        style={[
          styles.title,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        🎮 All Games
      </Animated.Text>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.gamesGrid,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {gameCards.map((game, index) => (
            <View key={game.id} style={{ 
              opacity: 1,
              transform: [{ 
                translateY: 0
              }]
            }}>
              <GameCard 
                game={game} 
                onPlayNow={onGameSelect} 
              />
            </View>
          ))}
        </Animated.View>
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
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
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
