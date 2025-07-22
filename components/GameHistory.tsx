
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

interface GameHistoryProps {
  betHistory?: any[];
}

export default function GameHistory({ betHistory = [] }: GameHistoryProps) {
  const [selectedGame, setSelectedGame] = useState<string>('All Games');
  const [filteredHistory, setFilteredHistory] = useState<any[]>([]);

  // Get last 7 days of bet history
  const getLast7DaysHistory = () => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    return betHistory.filter(bet => bet.timestamp && bet.timestamp >= sevenDaysAgo);
  };

  // Get unique game names for dropdown
  const getUniqueGames = () => {
    const games = [...new Set(betHistory.map(bet => bet.game))];
    return ['All Games', ...games];
  };

  useEffect(() => {
    const last7DaysHistory = getLast7DaysHistory();
    
    if (selectedGame === 'All Games') {
      setFilteredHistory(last7DaysHistory);
    } else {
      setFilteredHistory(last7DaysHistory.filter(bet => bet.game === selectedGame));
    }
  }, [selectedGame, betHistory]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'आज';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'कल';
    } else {
      return date.toLocaleDateString('hi-IN', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'win': return '#00FF88';
      case 'loss': return '#FF6B6B';
      case 'pending': return '#FFD700';
      default: return '#999';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'win': return '🏆 जीत';
      case 'loss': return '❌ हार';
      case 'pending': return '⏳ पेंडिंग';
      default: return status;
    }
  };

  const getBetTypeText = (type: string) => {
    switch (type) {
      case 'single': return 'सिंगल';
      case 'jodi': return 'जोड़ी';
      case 'andar': return 'अंदर';
      case 'bahar': return 'बाहर';
      default: return type;
    }
  };

  const calculateTotalStats = () => {
    const totalBets = filteredHistory.length;
    const totalAmount = filteredHistory.reduce((sum, bet) => sum + (bet.amount || 0), 0);
    const totalWinnings = filteredHistory.reduce((sum, bet) => sum + (bet.winAmount || 0), 0);
    const wins = filteredHistory.filter(bet => bet.status === 'win').length;
    
    return { totalBets, totalAmount, totalWinnings, wins };
  };

  const stats = calculateTotalStats();

  // Group bets by date
  const groupBetsByDate = () => {
    const grouped = filteredHistory.reduce((acc, bet) => {
      const dateKey = formatDate(bet.timestamp);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(bet);
      return acc;
    }, {} as Record<string, any[]>);
    
    return Object.entries(grouped).sort((a, b) => {
      // Sort by date, with today first
      const aDate = a[1][0]?.timestamp || 0;
      const bDate = b[1][0]?.timestamp || 0;
      return bDate - aDate;
    });
  };

  const groupedBets = groupBetsByDate();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 Game History</Text>
        <Text style={styles.headerSubtitle}>पिछले 7 दिन का रिकॉर्ड</Text>
      </View>

      {/* Game Filter Dropdown */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>🎮 Game Select करें:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedGame}
            onValueChange={(itemValue) => setSelectedGame(itemValue)}
            style={styles.picker}
            dropdownIconColor="#4A90E2"
          >
            {getUniqueGames().map((game, index) => (
              <Picker.Item
                key={index}
                label={game}
                value={game}
                color="#fff"
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalBets}</Text>
          <Text style={styles.statLabel}>कुल Bets</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{stats.totalAmount}</Text>
          <Text style={styles.statLabel}>कुल Amount</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>₹{stats.totalWinnings}</Text>
          <Text style={styles.statLabel}>कुल Winnings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.wins}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
      </View>

      {/* History List */}
      <ScrollView style={styles.historyContainer} showsVerticalScrollIndicator={false}>
        {groupedBets.length > 0 ? (
          groupedBets.map(([date, bets], dateIndex) => (
            <View key={dateIndex} style={styles.dateSection}>
              {/* Date Header */}
              <View style={styles.dateHeader}>
                <Text style={styles.dateTitle}>{date}</Text>
                <Text style={styles.dateBetCount}>{bets.length} bets</Text>
              </View>

              {/* Bets for this date */}
              {bets.map((bet, betIndex) => (
                <View key={betIndex} style={styles.betCard}>
                  <View style={styles.betHeader}>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameName}>{bet.game}</Text>
                      <Text style={styles.sessionTime}>{bet.sessionTime}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bet.status) }]}>
                      <Text style={styles.statusText}>{getStatusText(bet.status)}</Text>
                    </View>
                  </View>

                  <View style={styles.betDetails}>
                    <View style={styles.betInfo}>
                      <View style={styles.numberContainer}>
                        <Text style={styles.betNumber}>{bet.number}</Text>
                        <Text style={styles.betType}>{getBetTypeText(bet.type)}</Text>
                      </View>
                      
                      <View style={styles.amountContainer}>
                        <Text style={styles.betAmount}>₹{bet.amount}</Text>
                        {bet.winAmount && (
                          <Text style={styles.winAmount}>Win: ₹{bet.winAmount}</Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.timeContainer}>
                      <Text style={styles.betTime}>
                        {new Date(bet.timestamp).toLocaleTimeString('hi-IN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>कोई History नहीं मिली</Text>
            <Text style={styles.emptyMessage}>
              {selectedGame === 'All Games' 
                ? 'पिछले 7 दिनों में कोई bet नहीं लगाई गई'
                : `${selectedGame} के लिए कोई bet नहीं मिली`
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  filterContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterLabel: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  historyContainer: {
    flex: 1,
    padding: 15,
  },
  dateSection: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  dateBetCount: {
    fontSize: 12,
    color: '#999',
  },
  betCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  betHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 11,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  betDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  betInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numberContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  betNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  betType: {
    fontSize: 10,
    color: '#999',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  amountContainer: {
    alignItems: 'flex-start',
  },
  betAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  winAmount: {
    fontSize: 12,
    color: '#00FF88',
    fontWeight: 'bold',
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  betTime: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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
    paddingHorizontal: 40,
  },
});
