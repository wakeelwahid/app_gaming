
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  wallet: string;
}

export default function Header({ wallet }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>👑 VN Gaming</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.walletButton}>
          <Text style={styles.walletLabel}>Wallet</Text>
          <Text style={styles.walletAmount}>{wallet}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  walletButton: {
    backgroundColor: '#2a4a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  walletLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  walletAmount: {
    fontSize: 12,
    color: '#00FF88',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
