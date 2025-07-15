import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BetHistoryProps {
  visible: boolean;
  betHistory: any[];
  onClose: () => void;
}

export default function BetHistory({ visible, betHistory = [], onClose }: BetHistoryProps) {
  if (!visible) return null;

  const groupedBets = betHistory.reduce((acc, bet) => {
    const gameKey = bet.game || 'Unknown Game';
    if (!acc[gameKey]) {
      acc[gameKey] = [];
    }
    acc[gameKey].push(bet);
    return acc;
  }, {});

  const games = Object.keys(groupedBets);

  const renderBetItem = ({ item }: { item: any }) => (
    <View style={styles.betItem}>
      <View style={styles.betHeader}>
        <Text style={styles.betNumber}>
          {item.type === 'andar' ? '🟢' : item.type === 'bahar' ? '🔴' : '🎯'} {item.number}
        </Text>
        <Text style={styles.betAmount}>₹{item.amount}</Text>
      </View>

      <View style={styles.betDetails}>
        <Text style={styles.betType}>Type: {item.type}</Text>
        <Text style={styles.betStatus}>Status: {item.status || 'Pending'}</Text>
        <Text style={styles.betTime}>
          {item.timestamp ? new Date(item.timestamp).toLocaleString('hi-IN') : 'Unknown time'}
        </Text>
      </View>
    </View>
  );

  const renderGameSection = (game: string) => {
    const gameBets = groupedBets[game] || [];
    const totalAmount = gameBets.reduce((sum, bet) => sum + (bet.amount || 0), 0);

    return (
      <View key={game} style={styles.gameSection}>
        <View style={styles.gameSectionHeader}>
          <Text style={styles.gameTitle}>{game}</Text>
          <Text style={styles.gameTotalAmount}>Total: ₹{totalAmount}</Text>
        </View>

        <FlatList
          data={gameBets}
          renderItem={renderBetItem}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 My Bets History</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {betHistory.length > 0 ? (
        <FlatList
          data={games}
          renderItem={({ item }) => renderGameSection(item)}
          keyExtractor={(item) => item}
          style={styles.betsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎲</Text>
          <Text style={styles.emptyTitle}>कोई bet history नहीं है</Text>
          <Text style={styles.emptyMessage}>
            अपना पहला bet लगाएं और यहां अपनी history देखें
          </Text>
        </View>
      )}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Bets:</Text>
          <Text style={styles.summaryValue}>{betHistory.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.summaryValueAmount}>
            ₹{betHistory.reduce((sum, bet) => sum + (bet.amount || 0), 0)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  closeButton: {
    padding: 5,
  },
  betsList: {
    flex: 1,
    padding: 15,
  },
  gameSection: {
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  gameSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  gameTotalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  betItem: {
    backgroundColor: '#0a0a0a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  betNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  betAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  betDetails: {
    gap: 4,
  },
  betType: {
    fontSize: 12,
    color: '#999',
  },
  betStatus: {
    fontSize: 12,
    color: '#FFD700',
  },
  betTime: {
    fontSize: 11,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#999',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryValueAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00FF88',
  },
});