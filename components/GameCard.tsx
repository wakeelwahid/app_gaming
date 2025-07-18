
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenWidth < 380;

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
  index: number;
}

export default function GameCard({ game, onPlayNow, index }: GameCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000 + index * 200,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Subtle rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000 + index * 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();

    // Pulse animation for play button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getGradientColors = () => {
    switch (game.color) {
      case '#4A90E2':
        return ['#4A90E2', '#357ABD', '#1E90FF'];
      case '#00FF88':
        return ['#00FF88', '#00CC6A', '#00AA55'];
      case '#9B59B6':
        return ['#9B59B6', '#8E44AD', '#6A1B9A'];
      case '#E74C3C':
        return ['#E74C3C', '#C0392B', '#A93226'];
      case '#FF1493':
        return ['#FF1493', '#DC143C', '#B22222'];
      default:
        return ['#4A90E2', '#357ABD', '#1E90FF'];
    }
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      {/* Animated Background Glow */}
      <Animated.View 
        style={[
          styles.glowEffect,
          {
            shadowColor: game.color,
            shadowOpacity: glowOpacity,
            transform: [{ rotate: rotateInterpolate }],
          }
        ]}
      />
      
      <TouchableOpacity
        style={styles.card}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Decorative Elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
          
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{game.title}</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>LIVE</Text>
              </View>
            </View>

            {/* Times */}
            <View style={styles.timesContainer}>
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Open</Text>
                <Text style={styles.timeValue}>{game.openTime}</Text>
              </View>
              <View style={styles.timeSeparator} />
              <View style={styles.timeItem}>
                <Text style={styles.timeLabel}>Close</Text>
                <Text style={styles.timeValue}>{game.closeTime}</Text>
              </View>
            </View>

            {/* Status */}
            <Text style={styles.status}>{game.status}</Text>

            {/* Play Button */}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => onPlayNow(game)}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.playButtonGradient}
                >
                  <Text style={styles.playButtonText}>▶ Play Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: isSmallDevice ? 10 : 15,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: isSmallDevice ? 18 : 20,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
    elevation: 10,
  },
  card: {
    borderRadius: isSmallDevice ? 15 : 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: isSmallDevice ? 15 : 18,
    minHeight: isSmallDevice ? 180 : 200,
    position: 'relative',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isSmallDevice ? 12 : 15,
  },
  title: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusText: {
    color: '#fff',
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: 'bold',
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: isSmallDevice ? 10 : 12,
    marginBottom: isSmallDevice ? 10 : 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeItem: {
    alignItems: 'center',
    flex: 1,
  },
  timeSeparator: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  timeLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: isSmallDevice ? 10 : 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeValue: {
    color: '#fff',
    fontSize: isSmallDevice ? 12 : 13,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  status: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: isSmallDevice ? 11 : 12,
    textAlign: 'center',
    marginBottom: isSmallDevice ? 12 : 15,
    fontWeight: '500',
  },
  playButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  playButtonGradient: {
    paddingVertical: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 20 : 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#000',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
