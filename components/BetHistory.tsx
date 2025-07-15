
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

  // Group bets by game and date
  const groupedBets = betHistory.reduce((acc, bet) => {
    const gameKey = bet.game || 'Unknown Game';
    const date = new Date(bet.timestamp).toDateString();
    const key = `${gameKey}_${date}`;
    
    if (!acc[key]) {
      acc[key] = {
        game: gameKey,
        date: date,
        bets: [],
        totalAmount: 0,
        totalNumbers: 0
      };
    }
    acc[key].bets.push(bet);
    acc[key].totalAmount += bet.amount;
    acc[key].totalNumbers += 1;
    return acc;
  }, {});

  const games = [...new Set(betHistory.map(bet => bet.game))];
  const allGames = ['All', ...games];
  
  const filteredGroups = selectedGameFilter === 'All' 
    ? Object.values(groupedBets)
    : Object.values(groupedBets).filter((group: any) => group.game === selectedGameFilter);

  const getBetChipColor = (bet: any) => {
    if (bet.type === 'andar') return '#00FF88';
    if (bet.type === 'bahar') return '#FF6B6B';
    return '#9D4EDD';
  };

  const getBetChipLetter = (bet: any) => {
    if (bet.type === 'andar') return 'A';
    if (bet.type === 'bahar') return 'B';
    return '';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'win': return '#00FF88';
      case 'loss': return '#FF6B6B';
      case 'pending': return '#FFD700';
      default: return '#FFD700';
    }
  };

  const renderGameGroup = ({ item }: { item: any }) => {
    const sessionTime = "09:00 PM - 04:50 PM"; // You can make this dynamic
    
    return (
      <View style={styles.gameGroup}>
        {/* Game Header */}
        <View style={styles.gameHeader}>
          <View style={styles.gameNameContainer}>
            <Text style={styles.gameName}>{item.game}</Text>
          </View>
          <Text style={styles.gameDate}>{new Date(item.date).toLocaleDateString()}</Text>
        </View>

        {/* Bet Chips Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.betChipsContainer}>
          <View style={styles.betChipsRow}>
            {item.bets.map((bet: any, index: number) => (
              <View 
                key={index} 
                style={[styles.betChip, { backgroundColor: getBetChipColor(bet) }]}
              >
                <View style={styles.betChipContent}>
                  <Text style={styles.betChipNumber}>
                    {getBetChipLetter(bet)}{bet.number}
                  </Text>
                  <Text style={styles.betChipAmount}>₹{bet.amount}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Game Summary */}
        <View style={styles.gameSummary}>
          <View style={styles.summaryLeft}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Pending</Text>
            </View>
            <Text style={styles.totalNumbers}>Total Numbers: {item.totalNumbers}</Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.totalAmountLabel}>amount: </Text>
            <Text style={styles.totalAmount}>₹{item.totalAmount}</Text>
            <Text style={styles.sessionTime}>Session: {sessionTime}</Text>
          </View>
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
            data={filteredGroups}
            renderItem={renderGameGroup}
            keyExtractor={(item, index) => `${item.game}_${item.date}_${index}`}
            style={styles.betsList}
            showsVerticalScrollIndicator={false}
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
  betsList: {
    flex: 1,
    padding: 15,
  },
  gameGroup: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  gameNameContainer: {
    backgroundColor: '#9D4EDD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  gameName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  gameDate: {
    color: '#999',
    fontSize: 12,
  },
  betChipsContainer: {
    marginBottom: 15,
  },
  betChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 15,
  },
  betChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  betChipContent: {
    alignItems: 'center',
  },
  betChipNumber: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  betChipAmount: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  gameSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  statusText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalNumbers: {
    color: '#fff',
    fontSize: 12,
  },
  summaryRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  totalAmountLabel: {
    color: '#00FF88',
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sessionTime: {
    color: '#999',
    fontSize: 10,
    marginTop: 2,
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
});
