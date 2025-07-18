
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

interface BottomMenuProps {
  activeTab: string;
  onMenuItemPress: (key: string) => void;
}

export default function BottomMenu({ activeTab, onMenuItemPress }: BottomMenuProps) {
  const [scaleAnims] = useState({
    home: new Animated.Value(1),
    mybets: new Animated.Value(1),
    wallet: new Animated.Value(1),
    games: new Animated.Value(1),
    profile: new Animated.Value(1),
  });

  const handlePress = (key: string) => {
    // Animate the pressed tab
    Animated.sequence([
      Animated.timing(scaleAnims[key], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnims[key], {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start();

    onMenuItemPress(key);
  };

  const TabItem = ({ tabKey, iconName, label }) => (
    <TouchableOpacity 
      style={[styles.tabItem, activeTab === tabKey && styles.activeTabItem]} 
      onPress={() => handlePress(tabKey)}
    >
      <Animated.View 
        style={[
          styles.tabContent,
          { transform: [{ scale: scaleAnims[tabKey] }] },
          activeTab === tabKey && styles.activeTabContent
        ]}
      >
        <Ionicons 
          name={iconName} 
          size={20} 
          color={activeTab === tabKey ? '#4A90E2' : '#999'} 
        />
        <Text style={[styles.tabText, activeTab === tabKey && styles.activeTabText]}>
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.bottomTabBar}>
      <TabItem tabKey="home" iconName="home" label="Home" />
      <TabItem tabKey="mybets" iconName="list-circle" label="My Bets" />
      <TabItem tabKey="wallet" iconName="wallet" label="Wallet" />
      <TabItem tabKey="games" iconName="game-controller" label="Games" />
      <TabItem tabKey="profile" iconName="person" label="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: isSmallDevice ? 4 : 6,
    paddingHorizontal: isSmallDevice ? 2 : 5,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: isSmallDevice ? 50 : 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: isSmallDevice ? 4 : 6,
    paddingHorizontal: isSmallDevice ? 2 : 4,
  },
  activeTabItem: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabContent: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabText: {
    fontSize: isSmallDevice ? 8 : 10,
    color: '#999',
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
});
