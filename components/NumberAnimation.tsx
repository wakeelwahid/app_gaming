
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FloatingNumber {
  id: number;
  number: number;
  x: number;
  y: number;
  opacity: Animated.Value;
  scale: Animated.Value;
  translateY: Animated.Value;
  translateX: Animated.Value;
  color: string;
  size: number;
  speed: number;
}

const NumberAnimation: React.FC = () => {
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);

  const colors = [
    '#4A90E2', '#00FF88', '#FFD700', '#E74C3C', '#9B59B6', 
    '#FF1493', '#00CED1', '#32CD32', '#FF69B4', '#20B2AA'
  ];

  const generateRandomNumber = (): FloatingNumber => {
    const number = Math.floor(Math.random() * 100) + 1;
    const x = Math.random() * (SCREEN_WIDTH - 50);
    const y = SCREEN_HEIGHT + 100;
    const size = Math.random() * 20 + 20;
    const speed = Math.random() * 2000 + 3000;
    
    return {
      id: Math.random(),
      number,
      x,
      y,
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.5),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      color: colors[Math.floor(Math.random() * colors.length)],
      size,
      speed
    };
  };

  const animateNumber = (numberObj: FloatingNumber) => {
    const randomX = (Math.random() - 0.5) * 200;
    
    Animated.parallel([
      Animated.timing(numberObj.opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(numberObj.scale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(numberObj.translateY, {
        toValue: -(SCREEN_HEIGHT + 200),
        duration: numberObj.speed,
        useNativeDriver: true,
      }),
      Animated.timing(numberObj.translateX, {
        toValue: randomX,
        duration: numberObj.speed,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Remove number after animation completes
      setFloatingNumbers(prev => prev.filter(n => n.id !== numberObj.id));
    });

    // Fade out animation
    setTimeout(() => {
      Animated.timing(numberObj.opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, numberObj.speed - 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newNumber = generateRandomNumber();
      setFloatingNumbers(prev => [...prev, newNumber]);
      animateNumber(newNumber);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {floatingNumbers.map((numberObj) => (
        <Animated.View
          key={numberObj.id}
          style={[
            styles.numberContainer,
            {
              left: numberObj.x,
              top: numberObj.y,
              opacity: numberObj.opacity,
              transform: [
                { scale: numberObj.scale },
                { translateY: numberObj.translateY },
                { translateX: numberObj.translateX },
              ],
            },
          ]}
        >
          <Text
            style={[
              styles.numberText,
              {
                color: numberObj.color,
                fontSize: numberObj.size,
                textShadowColor: numberObj.color,
              },
            ]}
          >
            {numberObj.number}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  numberContainer: {
    position: 'absolute',
  },
  numberText: {
    fontWeight: 'bold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    opacity: 0.8,
  },
});

export default NumberAnimation;
