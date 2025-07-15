import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BetHistoryProps {
  visible: boolean;
  betHistory: any[];
  onClose: () => void;
}

export default function BetHistory({ visible, betHistory = [], onClose }: BetHistoryProps) {
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('All');
  
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
  const allGames = ['All', ...games];
  
  const filteredBets = selectedGameFilter === 'All' 
    ? betHistory 
    : betHistory.filter(bet => bet.game === selectedGameFilter);

  const renderBetItem = ({ item }: { item: any }) => {
    const getStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'win': return '#00FF88';
        case 'loss': return '#FF6B6B';
        case 'pending': return '#FFD700';
        default: return '#FFD700';
      }
    };

    const getTypeIcon = (type: string) => {
      switch (type?.toLowerCase()) {
        case 'andar': return '🟢';
        case 'bahar': return '🔴';
        case 'single': return '🎯';
        case 'jodi': return '🔢';
        case 'panna': return '📊';
        default: return '🎲';
      }
    };

    return (
      <View style={styles.betItem}>
        <View style={styles.betHeader}>
          <View style={styles.betNumberContainer}>
            <Text style={styles.betIcon}>{getTypeIcon(item.type)}</Text>
            <View>
              <Text style={styles.betNumber}>Number: {item.number}</Text>
              <Text style={styles.betGame}>{item.game}</Text>
            </View>
          </View>
          <View style={styles.betAmountContainer}>
            <Text style={styles.betAmount}>₹{item.amount}</Text>
            {item.winAmount && (
              <Text style={styles.winAmount}>Win: ₹{item.winAmount}</Text>
            )}
          </View>
        </View>

        <View style={styles.betDetails}>
          <View style={styles.betDetailRow}>
            <Text style={styles.betType}>Type: {item.type}</Text>
            <Text style={[styles.betStatus, { color: getStatusColor(item.status) }]}>
              {item.status || 'Pending'}
            </Text>
          </View>
          <Text style={styles.betTime}>
            {item.timestamp ? new Date(item.timestamp).toLocaleString('hi-IN') : 'Unknown time'}
          </Text>
        </View>
      </View>
    );
  };

  const renderGameFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
    >
      {allGames.map((game) => (
        <TouchableOpacity
          key={game}
          style={[
            styles.filterButton,
            selectedGameFilter === game && styles.activeFilterButton
          ]}
          onPress={() => setSelectedGameFilter(game)}
        >
          <Text style={[
            styles.filterButtonText,
            selectedGameFilter === game && styles.activeFilterButtonText
          ]}>
            {game}
            {game !== 'All' && ` (${groupedBets[game]?.length || 0})`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 My Bets History</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {betHistory && betHistory.length > 0 ? (
        <>
          {renderGameFilter()}
          <FlatList
            data={filteredBets}
            renderItem={renderBetItem}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            style={styles.betsList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                  {selectedGameFilter === 'All' 
                    ? `All Bets (${filteredBets.length})`
                    : `${selectedGameFilter} Bets (${filteredBets.length})`
                  }
                </Text>
              </View>
            )}
          />
        </>
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
        <Text style={styles.summaryTitle}>Summary - {selectedGameFilter}</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Bets:</Text>
          <Text style={styles.summaryValue}>{filteredBets.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Amount:</Text>
          <Text style={styles.summaryValueAmount}>
            ₹{filteredBets.reduce((sum, bet) => sum + (bet.amount || 0), 0)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Winnings:</Text>
          <Text style={styles.summaryValueWin}>
            ₹{filteredBets.reduce((sum, bet) => sum + (bet.winAmount || 0), 0)}
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
  filterContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterContent: {
    paddingHorizontal: 15,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  activeFilterButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterButtonText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listHeader: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  betsList: {
    flex: 1,
    padding: 15,
  },
  betItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  betNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  betIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  betNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  betGame: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 2,
  },
  betAmountContainer: {
    alignItems: 'flex-end',
  },
  betAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  winAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 2,
  },
  betDetails: {
    gap: 5,
  },
  betDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  betType: {
    fontSize: 12,
    color: '#999',
  },
  betStatus: {
    fontSize: 12,
    fontWeight: 'bold',
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
  summaryValueWin: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});