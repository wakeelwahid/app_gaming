
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

interface GameCardProps {
  game: any;
  onPlayNow: (game: any) => void;
}

export default function GameCard({ game, onPlayNow }: GameCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = () => {
    switch (game.status) {
      case 'LIVE':
        return '#00FF88';
      case 'CLOSED':
        return '#FF4444';
      case 'BETTING':
        return '#FFD700';
      default:
        return '#999';
    }
  };

  const getStatusIcon = () => {
    switch (game.status) {
      case 'LIVE':
        return 'radio-button-on';
      case 'CLOSED':
        return 'stop-circle';
      case 'BETTING':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  return (
    <Animated.View
      style={[
        styles.gameCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onPlayNow(game)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.gameTitle}>{game.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Ionicons name={getStatusIcon()} size={12} color="#000" />
              <Text style={styles.statusText}>{game.status}</Text>
            </View>
          </View>
        </View>

        {/* Game Info */}
        <View style={styles.gameInfo}>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={16} color="#4A90E2" />
            <Text style={styles.infoText}>{game.timing}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="trophy" size={16} color="#FFD700" />
            <Text style={styles.infoText}>Result: {game.result || 'Pending'}</Text>
          </View>
        </View>

        {/* Play Button */}
        <TouchableOpacity 
          style={[styles.playButton, { opacity: game.status === 'CLOSED' ? 0.5 : 1 }]}
          onPress={() => onPlayNow(game)}
          disabled={game.status === 'CLOSED'}
        >
          <Ionicons name="play" size={18} color="#000" />
          <Text style={styles.playButtonText}>
            {game.status === 'CLOSED' ? 'Closed' : 'Play Now'}
          </Text>
        </TouchableOpacity>

        {/* Decorative Elements */}
        <View style={styles.decorativeCorner} />
        <View style={styles.glowEffect} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gameCard: {
    width: isSmallDevice ? '47%' : '48%',
    marginBottom: 15,
  },
  cardContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gameTitle: {
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  gameInfo: {
    marginBottom: 15,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  playButton: {
    backgroundColor: '#00FF88',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  playButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  decorativeCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    backgroundColor: '#4A90E2',
    transform: [{ rotate: '45deg' }],
    opacity: 0.1,
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'transparent',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#4A90E2',
    opacity: 0.3,
  },
});
