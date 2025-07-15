
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
  const groupedBetsByGame = betHistory.reduce((acc, bet) => {
    const gameKey = bet.game || 'Unknown Game';
    const dateKey = bet.timestamp ? new Date(bet.timestamp).toDateString() : 'Unknown Date';
    
    if (!acc[gameKey]) {
      acc[gameKey] = {};
    }
    if (!acc[gameKey][dateKey]) {
      acc[gameKey][dateKey] = [];
    }
    acc[gameKey][dateKey].push(bet);
    return acc;
  }, {});

  const games = Object.keys(groupedBetsByGame);
  const allGames = ['All', ...games];
  
  const filteredGames = selectedGameFilter === 'All' 
    ? groupedBetsByGame 
    : { [selectedGameFilter]: groupedBetsByGame[selectedGameFilter] };

  const getBetChipColor = (bet: any) => {
    const { type, number, status } = bet;
    
    // Base colors for different bet types
    if (type?.toLowerCase() === 'andar') {
      return status === 'win' ? '#00FF88' : '#4CAF50';
    } else if (type?.toLowerCase() === 'bahar') {
      return status === 'win' ? '#FF6B6B' : '#E74C3C';
    } else {
      // Number-based colors
      const numValue = parseInt(number?.toString() || '0');
      const colors = [
        '#9C27B0', '#3F51B5', '#2196F3', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107'
      ];
      return colors[numValue % colors.length];
    }
  };

  const getBetChipStyle = (bet: any) => {
    const baseStyle = [styles.betChip];
    
    if (bet.status === 'win') {
      baseStyle.push(styles.winChip);
    } else if (bet.status === 'loss') {
      baseStyle.push(styles.lossChip);
    }
    
    return baseStyle;
  };

  const renderGameSection = (gameName: string, dateData: any) => {
    const totalBets = Object.values(dateData).reduce((sum: number, bets: any) => sum + bets.length, 0);
    const totalAmount = Object.values(dateData).reduce((sum: number, bets: any) => 
      sum + bets.reduce((betSum: number, bet: any) => betSum + (bet.amount || 0), 0), 0);

    return (
      <View key={gameName} style={styles.gameSection}>
        {/* Game Header */}
        <View style={styles.gameHeader}>
          <Text style={styles.gameName}>{gameName}</Text>
          <Text style={styles.gameDate}>2025-07-15</Text>
        </View>

        {/* Date-wise bet grouping */}
        {Object.entries(dateData).map(([date, bets]: [string, any]) => (
          <View key={date} style={styles.dateSection}>
            {/* Bet Chips Row */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
              {bets.map((bet: any, index: number) => (
                <View
                  key={index}
                  style={[
                    ...getBetChipStyle(bet),
                    { backgroundColor: getBetChipColor(bet) }
                  ]}
                >
                  <Text style={styles.chipNumber}>{bet.number}</Text>
                  <Text style={styles.chipAmount}>₹{bet.amount}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Session Info */}
            <View style={styles.sessionInfo}>
              <View style={styles.sessionLeft}>
                <Text style={styles.statusBadge}>
                  {bets[0]?.status === 'pending' ? 'Pending' : 
                   bets[0]?.status === 'win' ? 'Win' : 'Loss'}
                </Text>
                <Text style={styles.sessionDetails}>
                  Total Numbers: {bets.length}
                </Text>
              </View>
              <View style={styles.sessionRight}>
                <Text style={styles.sessionAmount}>
                  amount: ₹{bets.reduce((sum: number, bet: any) => sum + (bet.amount || 0), 0)}
                </Text>
                <Text style={styles.sessionTime}>
                  Session: {bets[0]?.sessionTime || '09:00 PM - 04:50 PM'}
                </Text>
              </View>
            </View>
          </View>
        ))}
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
          <ScrollView style={styles.gamesList} showsVerticalScrollIndicator={false}>
            {Object.entries(filteredGames).map(([gameName, dateData]) => 
              renderGameSection(gameName, dateData)
            )}
          </ScrollView>
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
  gamesList: {
    flex: 1,
    padding: 15,
  },
  gameSection: {
    marginBottom: 20,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  gameName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#9C27B0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gameDate: {
    fontSize: 12,
    color: '#999',
  },
  dateSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  chipsContainer: {
    marginBottom: 15,
  },
  betChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  winChip: {
    shadowColor: '#00FF88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  },
  lossChip: {
    opacity: 0.7,
  },
  chipNumber: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chipAmount: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
  sessionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionLeft: {
    flex: 1,
  },
  sessionRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 5,
  },
  sessionDetails: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionAmount: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  sessionTime: {
    color: '#999',
    fontSize: 10,
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
