
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Bet {
  id: number;
  number: string | number;
  amount: number;
  type: string;
  game: string;
  timestamp: Date;
  status: 'pending' | 'won' | 'lost';
  winAmount?: number;
}

interface BetHistoryProps {
  betList: Bet[];
  gameCards: any[];
}

export default function BetHistory({ betList, gameCards }: BetHistoryProps) {
  const [filteredBets, setFilteredBets] = useState<Bet[]>(betList);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    filterBets();
  }, [betList, selectedGame, selectedStatus]);

  const filterBets = () => {
    let filtered = betList;

    // Filter by game
    if (selectedGame !== 'all') {
      filtered = filtered.filter(bet => bet.game === selectedGame);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(bet => bet.status === selectedStatus);
    }

    setFilteredBets(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return '#00FF88';
      case 'lost':
        return '#E74C3C';
      default:
        return '#FFD700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'won':
        return 'checkmark-circle';
      case 'lost':
        return 'close-circle';
      default:
        return 'time';
    }
  };

  const getTotalAmount = () => {
    return filteredBets.reduce((total, bet) => total + bet.amount, 0);
  };

  const getTotalWinAmount = () => {
    return filteredBets
      .filter(bet => bet.status === 'won')
      .reduce((total, bet) => total + (bet.winAmount || 0), 0);
  };

  const renderBetItem = ({ item }: { item: Bet }) => (
    <View style={styles.betItem}>
      <View style={styles.betHeader}>
        <View style={styles.betGameInfo}>
          <Text style={styles.betGameName}>{item.game}</Text>
          <Text style={styles.betNumber}>
            {item.type === 'numbers' ? `🎯 ${item.number}` : 
             item.type === 'andar' ? `🟢 ${item.number}` : 
             `🔴 ${item.number}`}
          </Text>
        </View>
        <View style={styles.betStatus}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={20} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.betDetails}>
        <View style={styles.betAmount}>
          <Text style={styles.betAmountLabel}>Bet Amount:</Text>
          <Text style={styles.betAmountValue}>₹{item.amount}</Text>
        </View>
        {item.status === 'won' && item.winAmount && (
          <View style={styles.winAmount}>
            <Text style={styles.winAmountLabel}>Win Amount:</Text>
            <Text style={styles.winAmountValue}>₹{item.winAmount}</Text>
          </View>
        )}
      </View>

      <View style={styles.betFooter}>
        <Text style={styles.betTimestamp}>
          {new Date(item.timestamp).toLocaleDateString('en-IN')} • {new Date(item.timestamp).toLocaleTimeString('en-IN')}
        </Text>
        <View style={styles.betTypeChip}>
          <Text style={styles.betTypeText}>{item.type}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Statistics Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Bets</Text>
          <Text style={styles.summaryValue}>{filteredBets.length}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Amount</Text>
          <Text style={styles.summaryValue}>₹{getTotalAmount()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Won</Text>
          <Text style={[styles.summaryValue, { color: '#00FF88' }]}>₹{getTotalWinAmount()}</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>🎮 Filter by Game:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterChip, selectedGame === 'all' && styles.activeFilterChip]}
            onPress={() => setSelectedGame('all')}
          >
            <Text style={[styles.filterChipText, selectedGame === 'all' && styles.activeFilterChipText]}>
              All Games
            </Text>
          </TouchableOpacity>
          {gameCards.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.filterChip, selectedGame === game.title && styles.activeFilterChip]}
              onPress={() => setSelectedGame(game.title)}
            >
              <Text style={[styles.filterChipText, selectedGame === game.title && styles.activeFilterChipText]}>
                {game.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>📊 Filter by Status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {['all', 'pending', 'won', 'lost'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, selectedStatus === status && styles.activeFilterChip]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[styles.filterChipText, selectedStatus === status && styles.activeFilterChipText]}>
                {status === 'all' ? 'All Status' : status.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bet List */}
      {filteredBets.length > 0 ? (
        <FlatList
          data={filteredBets}
          renderItem={renderBetItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.betList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="document-text-outline" size={60} color="#666" />
          <Text style={styles.emptyStateText}>No bets found</Text>
          <Text style={styles.emptyStateSubtext}>
            {selectedGame !== 'all' || selectedStatus !== 'all' 
              ? 'Try changing the filters' 
              : 'Place your first bet to see it here'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 15,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 5,
  },
  summaryValue: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterScroll: {
    marginBottom: 15,
  },
  filterChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeFilterChip: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterChipText: {
    color: '#999',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeFilterChipText: {
    color: '#000',
  },
  betList: {
    flex: 1,
  },
  betItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  betGameInfo: {
    flex: 1,
  },
  betGameName: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  betNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },
  betStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  betDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  betAmount: {
    flex: 1,
  },
  betAmountLabel: {
    color: '#999',
    fontSize: 12,
  },
  betAmountValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  winAmount: {
    flex: 1,
    alignItems: 'flex-end',
  },
  winAmountLabel: {
    color: '#999',
    fontSize: 12,
  },
  winAmountValue: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  betFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  betTimestamp: {
    color: '#666',
    fontSize: 11,
  },
  betTypeChip: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  betTypeText: {
    color: '#fff',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});
