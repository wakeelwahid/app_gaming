
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
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: false,
    }).start();

    // Continuous pulse animation for status
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Shimmer effect for premium games
    if (game.id > 4) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        })
      ).start();
    }

    // Rotation animation for icon
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start(() => {
      onPlayNow(game);
    });
  };

  const shimmerInterpolate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[
      styles.cardContainer,
      {
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      <TouchableOpacity 
        style={[styles.gameCard, { backgroundColor: game.bgColor }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Shimmer overlay for premium games */}
        {game.id > 4 && (
          <Animated.View 
            style={[
              styles.shimmerOverlay,
              {
                transform: [{ translateX: shimmerInterpolate }],
              }
            ]}
          />
        )}

        <View style={styles.gameHeader}>
          <View style={styles.titleContainer}>
            <Animated.Text 
              style={[
                styles.gameIcon,
                {
                  transform: [{ rotate: rotateInterpolate }],
                }
              ]}
            >
              {game.id <= 4 ? '⭐' : '💎'}
            </Animated.Text>
            <Text style={[styles.gameTitle, { color: game.color }]}>
              {game.title}
            </Text>
          </View>
        </View>

        <View style={styles.gameDetails}>
          <Animated.View style={[
            styles.gameTime,
            { transform: [{ translateX: 0 }] }
          ]}>
            <Text style={styles.timeLabel}>Open:</Text>
            <Text style={styles.timeValue}>{game.openTime}</Text>
          </Animated.View>
          <Animated.View style={[
            styles.gameTime,
            { transform: [{ translateX: 0 }] }
          ]}>
            <Text style={styles.timeLabel}>Close:</Text>
            <Text style={styles.timeValue}>{game.closeTime}</Text>
          </Animated.View>
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
          style={[styles.playButton, { backgroundColor: game.color }]}
          onPress={handlePress}
        >
          <Text style={styles.playButtonText}>Play Now →</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
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
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
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
    color: '#00FF88',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  playButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  playButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
