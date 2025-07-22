import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

interface GameHistoryProps {
  betHistory?: any[];
}

// Mock game history data for last 7 days
const mockGameHistory = [
  {
    id: '1',
    game: 'Jaipur King',
    number: '45',
    amount: 100,
    type: 'andar',
    status: 'win',
    winAmount: 180,
    timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '2',
    game: 'Delhi Bazaar',
    number: '23',
    amount: 50,
    type: 'bahar',
    status: 'loss',
    timestamp: Date.now() - (1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    game: 'Jaipur King',
    number: '8',
    amount: 200,
    type: 'andar',
    status: 'win',
    winAmount: 360,
    timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '4',
    game: 'Mumbai King',
    number: '91',
    amount: 150,
    type: 'bahar',
    status: 'pending',
    timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '5',
    game: 'Delhi Bazaar',
    number: '5',
    amount: 75,
    type: 'andar',
    status: 'loss',
    timestamp: Date.now() - (3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '6',
    game: 'Jaipur King',
    number: '34',
    amount: 300,
    type: 'bahar',
    status: 'win',
    winAmount: 540,
    timestamp: Date.now() - (4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: '7',
    game: 'Mumbai King',
    number: '7',
    amount: 100,
    type: 'andar',
    status: 'loss',
    timestamp: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
  }
];

export default function GameHistory({ betHistory = mockGameHistory }: GameHistoryProps) {
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

  const getBetTypeText = (type: string) => {
    switch (type) {
      case 'andar': return 'अंदर';
      case 'bahar': return 'बाहर';
      default: return type;
    }
  };

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
        <Text style={styles.headerTitle}>📊 Game History</Text>
        <Text style={styles.headerSubtitle}>पिछले 7 दिन की Game History देखो</Text>
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

              {/* Horizontal Scrollable Bets */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.betsScrollContainer}
                contentContainerStyle={styles.betsScrollContent}
              >
                {bets.map((bet, betIndex) => (
                  <View key={betIndex} style={styles.betCard}>
                    <View style={styles.gameNameContainer}>
                      <Text style={styles.gameName}>🎮 {bet.game}</Text>
                    </View>

                    <View style={styles.betDetailsContainer}>
                      <View style={styles.numberContainer}>
                        <Text style={styles.betNumber}>{bet.number}</Text>
                        <Text style={styles.betType}>{getBetTypeText(bet.type)}</Text>
                      </View>

                      <View style={styles.amountContainer}>
                        <Text style={styles.betAmount}>₹{bet.amount}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>कोई Game History नहीं मिली</Text>
            <Text style={styles.emptyMessage}>
              {selectedGame === 'All Games' 
                ? 'पिछले 7 दिनों में कोई game नहीं खेली गई'
                : `${selectedGame} के लिए कोई history नहीं मिली`
              }
            </Text>
            <Text style={styles.emptySubMessage}>
              🎮 पहले कोई game खेलो फिर यहां history देखो
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
  historyContainer: {
    flex: 1,
    padding: 15,
  },
  dateSection: {
    marginBottom: 25,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  dateBetCount: {
    fontSize: 12,
    color: '#999',
  },
  betsScrollContainer: {
    marginBottom: 10,
  },
  betsScrollContent: {
    paddingRight: 15,
    paddingLeft: 5,
  },
  betCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 140,
    maxWidth: 160,
  },
  gameNameContainer: {
    marginBottom: 12,
    alignItems: 'center',
  },
  gameName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  betDetailsContainer: {
    alignItems: 'center',
  },
  numberContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  betNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
  },
  betType: {
    fontSize: 12,
    color: '#4A90E2',
    backgroundColor: '#333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  amountContainer: {
    alignItems: 'center',
  },
  betAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00FF88',
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
    marginBottom: 10,
  },
  emptySubMessage: {
    fontSize: 12,
    color: '#4A90E2',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});