import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  wallet: string;
}

export default function Header({ wallet }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>👑 DREAM11</Text>
      </View>

      <View style={styles.headerRight}>
        <Text style={styles.walletAmount}>{wallet}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    height: 60,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  walletAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FF88',
  },
});