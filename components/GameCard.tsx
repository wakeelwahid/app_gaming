
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

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
  animationDelay?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GameCard({ game, onPlayNow, animationDelay = 0 }: GameCardProps) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.sequence([
      Animated.delay(animationDelay),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous pulse animation
    const pulseAnimation = Animated.loop(
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
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, [animationDelay]);

  const handlePress = () => {
    // Press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onPlayNow(game);
    });
  };

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
            { scale: pulseAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.gameCard, { backgroundColor: game.bgColor }]}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Glowing border effect */}
        <View style={[styles.glowBorder, { borderColor: game.color }]} />
        
        {/* Game Header with enhanced styling */}
        <View style={styles.gameHeader}>
          <View style={styles.iconContainer}>
            <Text style={styles.gameIcon}>
              {game.id <= 4 ? '⭐' : '💎'}
            </Text>
            <Animated.View style={styles.sparkle}>
              <Text style={styles.sparkleText}>✨</Text>
            </Animated.View>
          </View>
          <Text style={[styles.gameTitle, { color: game.color }]}>
            {game.title}
          </Text>
        </View>

        {/* Enhanced Game Details */}
        <View style={styles.gameDetails}>
          <View style={[styles.timeContainer, styles.openTimeContainer]}>
            <View style={styles.timeIcon}>
              <Text style={styles.timeIconText}>🕐</Text>
            </View>
            <View>
              <Text style={styles.timeLabel}>Open</Text>
              <Text style={styles.timeValue}>{game.openTime}</Text>
            </View>
          </View>
          
          <View style={[styles.timeContainer, styles.closeTimeContainer]}>
            <View style={styles.timeIcon}>
              <Text style={styles.timeIconText}>🕕</Text>
            </View>
            <View>
              <Text style={styles.timeLabel}>Close</Text>
              <Text style={styles.timeValue}>{game.closeTime}</Text>
            </View>
          </View>
        </View>

        {/* Enhanced Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusIndicator} />
          <Text style={styles.gameStatus}>{game.status}</Text>
        </View>

        {/* Enhanced Play Button */}
        <TouchableOpacity 
          style={[styles.playButton, { backgroundColor: game.color }]}
          onPress={() => onPlayNow(game)}
        >
          <View style={styles.playButtonContent}>
            <Text style={styles.playButtonText}>Play Now</Text>
            <Animated.Text style={[styles.playButtonArrow, {
              transform: [{ translateX: pulseAnim.interpolate({
                inputRange: [1, 1.05],
                outputRange: [0, 3],
              })}]
            }]}>→</Animated.Text>
          </View>
          <View style={[styles.playButtonGlow, { backgroundColor: game.color }]} />
        </TouchableOpacity>

        {/* Decorative elements */}
        <View style={[styles.cornerDecoration, styles.topLeftCorner]} />
        <View style={[styles.cornerDecoration, styles.topRightCorner]} />
        <View style={[styles.cornerDecoration, styles.bottomLeftCorner]} />
        <View style={[styles.cornerDecoration, styles.bottomRightCorner]} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    width: SCREEN_WIDTH < 375 ? '100%' : '48%',
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  glowBorder: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    borderWidth: 1,
    opacity: 0.3,
  },
  gameHeader: {
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  gameIcon: {
    fontSize: 24,
    textAlign: 'center',
  },
  sparkle: {
    position: 'absolute',
    top: -5,
    right: -5,
  },
  sparkleText: {
    fontSize: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  gameDetails: {
    marginBottom: 15,
    gap: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 8,
    borderRadius: 8,
    gap: 10,
  },
  openTimeContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#00FF88',
  },
  closeTimeContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B6B',
  },
  timeIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeIconText: {
    fontSize: 14,
  },
  timeLabel: {
    color: '#999',
    fontSize: 11,
    fontWeight: '600',
  },
  timeValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF88',
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  gameStatus: {
    color: '#00FF88',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 255, 136, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  playButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  playButtonArrow: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
    borderRadius: 10,
  },
  cornerDecoration: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: '#4A90E2',
    opacity: 0.5,
  },
  topLeftCorner: {
    top: 8,
    left: 8,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRightCorner: {
    top: 8,
    right: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeftCorner: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRightCorner: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});
