
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
  const borderColorAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const borderWidthAnim = useRef(new Animated.Value(1)).current;

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

    // Border color cycling animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderColorAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(borderColorAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Border width pulsing
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderWidthAnim, {
          toValue: 3,
          duration: 2500,
          useNativeDriver: false,
        }),
        Animated.timing(borderWidthAnim, {
          toValue: 1,
          duration: 2500,
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

  const borderColorInterpolate = borderColorAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [game.color, '#FFD700', '#00FF88'],
  });

  const glowOpacityInterpolate = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const borderWidthInterpolate = borderWidthAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 3],
  });

  return (
    <Animated.View style={[
      styles.cardContainer,
      {
        transform: [{ scale: scaleAnim }],
      }
    ]}>
      {/* Animated border glow effect */}
      <Animated.View 
        style={[
          styles.glowBorder,
          {
            borderColor: borderColorInterpolate,
            borderWidth: borderWidthInterpolate,
            opacity: glowOpacityInterpolate,
            shadowColor: borderColorInterpolate,
          }
        ]}
      />
      
      <TouchableOpacity 
        style={[
          styles.gameCard, 
          { 
            backgroundColor: game.bgColor,
            borderColor: borderColorInterpolate,
            borderWidth: borderWidthInterpolate,
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Corner accent decorations */}
        <View style={styles.cornerDecorations}>
          <Animated.View 
            style={[
              styles.cornerAccent,
              styles.topLeft,
              { backgroundColor: borderColorInterpolate }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cornerAccent,
              styles.topRight,
              { backgroundColor: borderColorInterpolate }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cornerAccent,
              styles.bottomLeft,
              { backgroundColor: borderColorInterpolate }
            ]} 
          />
          <Animated.View 
            style={[
              styles.cornerAccent,
              styles.bottomRight,
              { backgroundColor: borderColorInterpolate }
            ]} 
          />
        </View>

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
    position: 'relative',
  },
  glowBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 14,
    zIndex: 0,
  },
  gameCard: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
    zIndex: 1,
    boxShadow: '0 8px 32px rgba(0, 255, 136, 0.2)',
    elevation: 12,
  },
  cornerDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  cornerAccent: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  topLeft: {
    top: 4,
    left: 4,
  },
  topRight: {
    top: 4,
    right: 4,
  },
  bottomLeft: {
    bottom: 4,
    left: 4,
  },
  bottomRight: {
    bottom: 4,
    right: 4,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: [{ skewX: '-20deg' }],
    zIndex: 1,
  },
  gameHeader: {
    marginBottom: 10,
    zIndex: 2,
    position: 'relative',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  gameIcon: {
    fontSize: 16,
    marginRight: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameDetails: {
    marginBottom: 10,
    zIndex: 2,
    position: 'relative',
  },
  gameTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  timeLabel: {
    color: '#999',
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  timeValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameStatus: {
    color: '#00FF88',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 255, 136, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  playButton: {
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    zIndex: 2,
    position: 'relative',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  playButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
