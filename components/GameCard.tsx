
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';

interface GameCardProps {
  game: {
    id: string;
    title: string;
    timing: string;
    status: 'open' | 'close';
    result?: string;
    nextDraw?: string;
  };
  onPlayNow: (game: any) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;
const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768;

export default function GameCard({ game, onPlayNow }: GameCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Glow animation for open games
    if (game.status === 'open') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }

    // Bounce animation on mount
    Animated.spring(bounceAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [game.status]);

  const handlePress = () => {
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
    ]).start();

    onPlayNow(game);
  };

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 255, 136, 0)', 'rgba(0, 255, 136, 0.3)'],
  });

  const getStatusColor = () => {
    return game.status === 'open' ? '#00FF88' : '#FF6B6B';
  };

  const getStatusIcon = () => {
    return game.status === 'open' ? '🟢' : '🔴';
  };

  const getCardStyle = () => {
    return game.status === 'open' ? styles.openCard : styles.closedCard;
  };

  return (
    <Animated.View 
      style={[
        styles.cardContainer,
        getCardStyle(),
        {
          transform: [
            { scale: scaleAnim },
            { scale: bounceAnim }
          ],
          shadowColor: getStatusColor(),
          borderColor: glowColor,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        {/* Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
              <Text style={[styles.status, { color: getStatusColor() }]}>
                {game.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Timing Section */}
        <View style={styles.timingContainer}>
          <Text style={styles.timingLabel}>🕐 Game Time</Text>
          <Text style={styles.timing}>{game.timing}</Text>
        </View>

        {/* Result Section */}
        {game.result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>🏆 Last Result</Text>
            <View style={styles.resultBox}>
              <Text style={styles.resultNumber}>{game.result}</Text>
            </View>
          </View>
        )}

        {/* Next Draw Section */}
        {game.nextDraw && (
          <View style={styles.nextDrawContainer}>
            <Text style={styles.nextDrawLabel}>⏰ Next Draw</Text>
            <Text style={styles.nextDrawTime}>{game.nextDraw}</Text>
          </View>
        )}

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <Animated.View style={[styles.playButton, { backgroundColor: getStatusColor() }]}>
            <Text style={styles.playButtonText}>
              {game.status === 'open' ? '🎯 PLAY NOW' : '⏰ COMING SOON'}
            </Text>
          </Animated.View>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeCorner}>
          <Text style={styles.cornerIcon}>💎</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: isSmallDevice ? '100%' : isMediumDevice ? '48%' : '31%',
    marginBottom: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 12 : 15,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  openCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderColor: '#00FF88',
  },
  closedCard: {
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderColor: '#FF6B6B',
  },
  card: {
    padding: isSmallDevice ? 15 : 18,
    borderRadius: isSmallDevice ? 10 : 13,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: isSmallDevice ? 12 : 15,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    color: '#FFD700',
    flex: 1,
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
  },
  status: {
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timingContainer: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    padding: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 6 : 8,
    marginBottom: isSmallDevice ? 10 : 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  timingLabel: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 3,
  },
  timing: {
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultContainer: {
    marginBottom: isSmallDevice ? 10 : 12,
  },
  resultLabel: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#FFD700',
    fontWeight: '600',
    marginBottom: 5,
  },
  resultBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 6 : 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  resultNumber: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nextDrawContainer: {
    marginBottom: isSmallDevice ? 12 : 15,
  },
  nextDrawLabel: {
    fontSize: isSmallDevice ? 10 : 11,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 3,
  },
  nextDrawTime: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#00FF88',
    fontWeight: 'bold',
  },
  actionContainer: {
    alignItems: 'center',
  },
  playButton: {
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 20 : 25,
    borderRadius: isSmallDevice ? 8 : 10,
    minWidth: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  playButtonText: {
    fontSize: isSmallDevice ? 11 : 12,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
  },
  decorativeCorner: {
    position: 'absolute',
    top: 8,
    right: 8,
    opacity: 0.3,
  },
  cornerIcon: {
    fontSize: 16,
  },
});
