
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomMenuProps {
  activeTab: string;
  onMenuItemPress: (key: string) => void;
}

export default function BottomMenu({ 
  activeTab, 
  onMenuItemPress
}: BottomMenuProps) {
  return (
    <>
      <View style={styles.bottomTabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'home' && styles.activeTabItem]} 
          onPress={() => onMenuItemPress('home')}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color={activeTab === 'home' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'mybets' && styles.activeTabItem]} 
          onPress={() => onMenuItemPress('mybets')}
        >
          <Ionicons 
            name="list-circle" 
            size={24} 
            color={activeTab === 'mybets' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'mybets' && styles.activeTabText]}>My Bets</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'wallet' && styles.activeTabItem]} 
          onPress={() => onMenuItemPress('wallet')}
        >
          <Ionicons 
            name="wallet" 
            size={24} 
            color={activeTab === 'wallet' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'wallet' && styles.activeTabText]}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'games' && styles.activeTabItem]} 
          onPress={() => onMenuItemPress('games')}
        >
          <Ionicons 
            name="game-controller" 
            size={24} 
            color={activeTab === 'games' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'games' && styles.activeTabText]}>Games</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, activeTab === 'profile' && styles.activeTabItem]} 
          onPress={() => onMenuItemPress('profile')}
        >
          <Ionicons 
            name="person" 
            size={24} 
            color={activeTab === 'profile' ? '#4A90E2' : '#999'} 
          />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.activeTabText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 70,
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTabItem: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  
});
