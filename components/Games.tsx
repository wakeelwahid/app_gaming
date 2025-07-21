
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import GameCard from './GameCard';

interface GamesProps {
  gameCards: any[];
  onGameSelect: (game: any) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Games({ gameCards, onGameSelect }: GamesProps) {
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={styles.titleWrapper}>
          <Text style={styles.titleEmoji}>🎮</Text>
          <Text style={styles.title}>All Games</Text>
          <Text style={styles.titleEmoji}>🎮</Text>
        </View>
        <Text style={styles.subtitle}>Choose your lucky game and win big!</Text>
        <View style={styles.decorativeLine} />
      </Animated.View>
      
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
            <Animated.View
              key={game.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 50],
                      outputRange: [0, 50 + (index * 20)],
                    }),
                  },
                ],
              }}
            >
              <GameCard 
                game={game} 
                onPlayNow={onGameSelect} 
                animationDelay={index * 150}
              />
            </Animated.View>
          ))}
        </Animated.View>
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Elements */}
      <View style={styles.floatingElements}>
        <Animated.View 
          style={[
            styles.floatingCard,
            styles.floatingCard1,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.floatingText}>💰</Text>
        </Animated.View>
        <Animated.View 
          style={[
            styles.floatingCard,
            styles.floatingCard2,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.floatingText}>🎯</Text>
        </Animated.View>
        <Animated.View 
          style={[
            styles.floatingCard,
            styles.floatingCard3,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <Text style={styles.floatingText}>⭐</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    position: 'relative',
  },
  headerContainer: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleEmoji: {
    fontSize: 28,
    marginHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    textShadowColor: 'rgba(74, 144, 226, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFD700',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 15,
    opacity: 0.9,
  },
  decorativeLine: {
    height: 3,
    width: SCREEN_WIDTH * 0.6,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
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
    height: 120,
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingCard: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  floatingCard1: {
    top: '20%',
    right: '10%',
  },
  floatingCard2: {
    top: '60%',
    left: '5%',
  },
  floatingCard3: {
    top: '40%',
    right: '15%',
  },
  floatingText: {
    fontSize: 18,
  },
});
