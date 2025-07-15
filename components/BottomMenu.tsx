
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
      <TouchableOpacity style={styles.bottomMenuButton} onPress={onToggleMenu}>
        <Ionicons name="menu" size={28} color="#000" />
        <Text style={styles.bottomMenuText}>Menu</Text>
      </TouchableOpacity>

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
                <View style={styles.menuGrid}>
                  {menuItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.bottomMenuItem,
                        { backgroundColor: activeTab === item.key ? item.color : item.bgColor },
                        activeTab === item.key && styles.activeBottomMenuItem
                      ]}
                      onPress={() => onMenuItemPress(item.key)}
                    >
                      <View style={[
                        styles.bottomMenuItemIcon,
                        { backgroundColor: activeTab === item.key ? '#000' : item.bgColor },
                        activeTab === item.key && styles.activeBottomMenuItemIcon
                      ]}>
                        <Ionicons 
                          name={item.icon} 
                          size={26} 
                          color={activeTab === item.key ? item.color : item.color} 
                        />
                      </View>
                      <Text style={[
                        styles.bottomMenuItemText,
                        { color: activeTab === item.key ? '#000' : item.color },
                        activeTab === item.key && styles.activeBottomMenuItemText
                      ]}>
                        {item.title}
                      </Text>
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
  bottomMenuButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomMenuText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
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
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  bottomMenuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  activeBottomMenuItem: {
    borderColor: '#4A90E2',
  },
  bottomMenuItemIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeBottomMenuItemIcon: {
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  bottomMenuItemText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeBottomMenuItemText: {
    color: '#000',
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
