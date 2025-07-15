
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomMenuProps {
  showSideMenu: boolean;
  slideAnim: Animated.Value;
  activeTab: string;
  onToggleMenu: () => void;
  onMenuItemPress: (key: string) => void;
  onAuthPress: (mode: string) => void;
}

const menuItems = [
  { icon: 'home', title: 'Home', key: 'home', color: '#4A90E2', bgColor: '#001A2A' },
  { icon: 'game-controller', title: 'Play Games', key: 'play', color: '#00FF88', bgColor: '#002A1A' },
  { icon: 'person', title: 'My Profile', key: 'profile', color: '#4A90E2', bgColor: '#001A2A' },
  { icon: 'wallet', title: 'My Wallet', key: 'wallet', color: '#9B59B6', bgColor: '#2A1A2A' },
  { icon: 'time', title: 'Game History', key: 'history', color: '#E74C3C', bgColor: '#2A1A1A' },
  { icon: 'swap-horizontal', title: 'Transactions', key: 'transactions', color: '#FF8C00', bgColor: '#2A1A00' },
  { icon: 'people', title: 'Refer & Earn', key: 'refer', color: '#1ABC9C', bgColor: '#1A2A2A' },
  { icon: 'document-text', title: 'Terms & Conditions', key: 'terms', color: '#95A5A6', bgColor: '#2A2A2A' },
  { icon: 'refresh', title: 'Refund Policy', key: 'refund', color: '#F39C12', bgColor: '#2A2200' },
  { icon: 'shield-checkmark', title: 'Privacy Policy', key: 'privacy', color: '#8E44AD', bgColor: '#2A1A2A' },
];

const authItems = [
  { icon: 'log-in', title: 'Login', key: 'login', color: '#00FF88' },
  { icon: 'person-add', title: 'Register', key: 'register', color: '#4A90E2' },
];

export default function BottomMenu({ 
  showSideMenu, 
  slideAnim, 
  activeTab, 
  onToggleMenu, 
  onMenuItemPress, 
  onAuthPress 
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

        <TouchableOpacity style={styles.dreamPlayButton} onPress={onToggleMenu}>
          <View style={styles.dreamPlayButtonInner}>
            <Text style={styles.dreamPlayText}>VN</Text>
            <Text style={styles.dreamPlaySubtext}>PLAY</Text>
          </View>
        </TouchableOpacity>
      </View>

      {showSideMenu && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showSideMenu}
          onRequestClose={onToggleMenu}
        >
          <View style={styles.bottomMenuOverlay}>
            <TouchableOpacity 
              style={styles.bottomMenuBackdrop} 
              onPress={onToggleMenu}
              activeOpacity={1}
            />
            <Animated.View style={[styles.bottomMenu, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.handleBar} />

              <View style={styles.bottomMenuHeader}>
                <View style={styles.menuHeaderCenter}>
                  <Text style={styles.bottomMenuTitle}>👑 VN Gaming</Text>
                  <Text style={styles.bottomMenuSubtitle}>Main Menu</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onToggleMenu}>
                  <Ionicons name="close" size={24} color="#4A90E2" />
                </TouchableOpacity>
              </View>

              <View style={styles.authSection}>
                <View style={styles.authButtonsContainer}>
                  {authItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.authButton, { backgroundColor: item.color }]}
                      onPress={() => {
                        onAuthPress(item.key);
                        onToggleMenu();
                      }}
                    >
                      <Ionicons name={item.icon} size={20} color="#000" />
                      <Text style={styles.authButtonText}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <ScrollView style={styles.bottomMenuContent} showsVerticalScrollIndicator={false}>
                <View style={styles.menuList}>
                  {menuItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.bottomMenuItem,
                        activeTab === item.key && styles.activeBottomMenuItem
                      ]}
                      onPress={() => onMenuItemPress(item.key)}
                    >
                      <View style={styles.bottomMenuItemIcon}>
                        <Ionicons 
                          name={item.icon} 
                          size={24} 
                          color={activeTab === item.key ? '#4A90E2' : item.color} 
                        />
                      </View>
                      <Text style={[
                        styles.bottomMenuItemText,
                        { color: activeTab === item.key ? '#4A90E2' : '#fff' }
                      ]}>
                        {item.title}
                      </Text>
                      <Ionicons 
                        name="chevron-forward" 
                        size={20} 
                        color={activeTab === item.key ? '#4A90E2' : '#666'} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.bottomMenuFooter}>
                <Text style={styles.footerText}>Version 1.0.0</Text>
                <Text style={styles.footerCopyright}>© 2024 VN Gaming</Text>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
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
  dreamPlayButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dreamPlayButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dreamPlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  dreamPlaySubtext: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    lineHeight: 10,
  },
  bottomMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  bottomMenuBackdrop: {
    flex: 1,
  },
  bottomMenu: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 10,
    maxHeight: '85%',
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#4A90E2',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  bottomMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuHeaderCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bottomMenuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  bottomMenuSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  authSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  authButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  authButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 8,
  },
  authButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomMenuContent: {
    flex: 1,
    paddingHorizontal: 15,
  },
  menuList: {
    paddingVertical: 10,
  },
  bottomMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 2,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeBottomMenuItem: {
    backgroundColor: '#2a2a2a',
    borderColor: '#4A90E2',
  },
  bottomMenuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    backgroundColor: '#333',
  },
  bottomMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  bottomMenuFooter: {
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
  footerCopyright: {
    color: '#666',
    fontSize: 10,
    marginTop: 2,
  },
});
