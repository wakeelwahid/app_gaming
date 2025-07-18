
import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const isSmallDevice = screenWidth < 380;

interface BottomMenuProps {
  currentScreen: string;
  onScreenChange: (screen: string) => void;
}

export default function BottomMenu({ currentScreen, onScreenChange }: BottomMenuProps) {
  const menuItems = [
    { key: 'home', icon: '🏠', label: 'होम' },
    { key: 'games', icon: '🎮', label: 'गेम्स' },
    { key: 'mybet', icon: '🎯', label: 'मेरा बेट' },
    { key: 'history', icon: '📊', label: 'हिस्ट्री' },
    { key: 'wallet', icon: '💰', label: 'वॉलेट' },
  ];

  const animatedValues = useRef(
    menuItems.reduce((acc, item) => {
      acc[item.key] = {
        scale: new Animated.Value(currentScreen === item.key ? 1.2 : 1),
        glow: new Animated.Value(currentScreen === item.key ? 1 : 0),
        bounce: new Animated.Value(0),
      };
      return acc;
    }, {} as any)
  ).current;

  const containerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Container slide up animation
    Animated.timing(containerAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.back(1.1)),
      useNativeDriver: false,
    }).start();

    // Continuous pulse animation for active item
    Object.keys(animatedValues).forEach(key => {
      if (currentScreen === key) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValues[key].bounce, {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: false,
            }),
            Animated.timing(animatedValues[key].bounce, {
              toValue: 0,
              duration: 1000,
              easing: Easing.inOut(Easing.cubic),
              useNativeDriver: false,
            }),
          ])
        ).start();
      }
    });
  }, [currentScreen]);

  const handlePress = (screen: string) => {
    // Animate current item out
    if (currentScreen !== screen) {
      Animated.parallel([
        Animated.timing(animatedValues[currentScreen]?.scale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues[currentScreen]?.glow, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();

      // Animate new item in
      Animated.parallel([
        Animated.spring(animatedValues[screen]?.scale, {
          toValue: 1.2,
          tension: 100,
          friction: 3,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValues[screen]?.glow, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }

    onScreenChange(screen);
  };

  const containerTranslateY = containerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: containerTranslateY }] }]}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((item) => {
            const isActive = currentScreen === item.key;
            const scale = animatedValues[item.key]?.scale;
            const glow = animatedValues[item.key]?.glow;
            const bounce = animatedValues[item.key]?.bounce;

            const glowOpacity = glow?.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.8],
            });

            const bounceTranslate = bounce?.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -5],
            });

            return (
              <TouchableOpacity
                key={item.key}
                style={styles.menuItem}
                onPress={() => handlePress(item.key)}
                activeOpacity={0.7}
              >
                <Animated.View
                  style={[
                    styles.itemContainer,
                    {
                      transform: [
                        { scale: scale },
                        { translateY: bounceTranslate || 0 }
                      ],
                    },
                  ]}
                >
                  {/* Glow Effect */}
                  <Animated.View
                    style={[
                      styles.glowEffect,
                      {
                        opacity: glowOpacity,
                        shadowColor: isActive ? '#FFD700' : '#4A90E2',
                      },
                    ]}
                  />
                  
                  {/* Icon Container */}
                  <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                    <LinearGradient
                      colors={isActive ? ['#FFD700', '#FFA500'] : ['#4A90E2', '#357ABD']}
                      style={styles.iconGradient}
                    >
                      <Text style={[styles.icon, isActive && styles.activeIcon]}>
                        {item.icon}
                      </Text>
                    </LinearGradient>
                  </View>
                  
                  {/* Label */}
                  <Text style={[styles.label, isActive && styles.activeLabel]}>
                    {item.label}
                  </Text>
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <Animated.View style={[styles.activeIndicator, { opacity: glow }]} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  gradient: {
    paddingTop: isSmallDevice ? 10 : 15,
    paddingBottom: isSmallDevice ? 20 : 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 10 : 20,
  },
  menuItem: {
    alignItems: 'center',
    flex: 1,
  },
  itemContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: {
    width: isSmallDevice ? 35 : 40,
    height: isSmallDevice ? 35 : 40,
    borderRadius: isSmallDevice ? 17.5 : 20,
    overflow: 'hidden',
    marginBottom: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  activeIconContainer: {
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  iconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: isSmallDevice ? 16 : 18,
  },
  activeIcon: {
    fontSize: isSmallDevice ? 18 : 20,
  },
  label: {
    color: '#999',
    fontSize: isSmallDevice ? 9 : 10,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  activeLabel: {
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 212, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 20,
    height: 3,
    backgroundColor: '#FFD700',
    borderRadius: 1.5,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
});
