
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MyBetProps {
  placedBets?: any[];
}

const MyBet = ({ placedBets = [] }: MyBetProps) => {
  // Group user's placed bets by game and date
  const groupBetsByGameAndDate = (bets: any[]) => {
    const grouped = bets.reduce((acc, bet) => {
      const key = `${bet.game}-${bet.date}`;
      if (!acc[key]) {
        acc[key] = {
          game: bet.game,
          date: bet.date,
          sessionTime: bet.sessionTime,
          bets: []
        };
      }
      acc[key].bets.push(bet);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const userBets = groupBetsByGameAndDate(placedBets);
  
  // Dummy data for testing - grouped by game and date (fallback when no user bets)
  const dummyBets = placedBets.length > 0 ? [] : [
    {
      game: 'Jaipur King',
      date: '2024-01-15',
      status: 'pending',
      sessionTime: '09:00 PM - 04:50 PM',
      bets: [
        { id: 1, number: '14', amount: 100, type: 'single', status: 'pending' },
        { id: 2, number: '2', amount: 100, type: 'andar', status: 'pending' },
        { id: 3, number: '61', amount: 100, type: 'single', status: 'pending' },
        { id: 4, number: '5', amount: 50, type: 'bahar', status: 'pending' },
        { id: 5, number: '77', amount: 200, type: 'jodi', status: 'pending' },
        { id: 6, number: '9', amount: 150, type: 'single', status: 'pending' }
      ]
    },
    {
      game: 'Faridabad',
      date: '2024-01-15',
      status: 'mixed',
      sessionTime: '10:00 PM - 06:40 PM',
      bets: [
        { id: 7, number: '6', amount: 100, type: 'single', status: 'win', winAmount: 900 },
        { id: 8, number: '8', amount: 100, type: 'single', status: 'win', winAmount: 900 },
        { id: 9, number: '1', amount: 100, type: 'andar', status: 'win', winAmount: 180 },
        { id: 10, number: '27', amount: 100, type: 'single', status: 'loss' },
        { id: 11, number: '33', amount: 100, type: 'single', status: 'loss' },
        { id: 12, number: '4', amount: 100, type: 'bahar', status: 'loss' }
      ]
    },
    {
      game: 'Ghaziabad',
      date: '2024-01-14',
      status: 'mixed',
      sessionTime: '11:00 PM - 07:50 PM',
      bets: [
        { id: 13, number: '89', amount: 200, type: 'jodi', status: 'loss' },
        { id: 14, number: '45', amount: 150, type: 'single', status: 'win', winAmount: 1350 },
        { id: 15, number: '3', amount: 100, type: 'single', status: 'win', winAmount: 900 },
        { id: 16, number: '7', amount: 50, type: 'bahar', status: 'loss' }
      ]
    },
    {
      game: 'Gali',
      date: '2024-01-14',
      status: 'pending',
      sessionTime: '04:00 AM - 10:30 PM',
      bets: [
        { id: 17, number: '12', amount: 300, type: 'single', status: 'pending' },
        { id: 18, number: '3', amount: 200, type: 'bahar', status: 'pending' },
        { id: 19, number: '88', amount: 150, type: 'jodi', status: 'pending' },
        { id: 20, number: '5', amount: 100, type: 'single', status: 'pending' }
      ]
    },
    {
      game: 'Disawer',
      date: '2024-01-13',
      status: 'mixed',
      sessionTime: '07:00 AM - 02:30 AM',
      bets: [
        { id: 21, number: '23', amount: 100, type: 'single', status: 'win', winAmount: 900 },
        { id: 22, number: '67', amount: 200, type: 'jodi', status: 'loss' },
        { id: 23, number: '4', amount: 50, type: 'bahar', status: 'win', winAmount: 90 },
        { id: 24, number: '1', amount: 150, type: 'single', status: 'loss' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'win': return '#00FF88';
      case 'loss': return '#FF4444';
      case 'pending': return '#FFD700';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'win': return 'checkmark-circle';
      case 'loss': return 'close-circle';
      case 'pending': return 'time';
      default: return 'help-circle';
    }
  };

  const getBetTypeDisplay = (type: string) => {
    switch (type) {
      case 'single': return 'Single';
      case 'jodi': return 'Jodi';
      case 'andar': return 'Andar';
      case 'bahar': return 'Bahar';
      default: return type;
    }
  };

  const calculateGroupStats = (bets: any[]) => {
    const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
    const totalWin = bets.reduce((sum, bet) => sum + (bet.winAmount || 0), 0);
    const winCount = bets.filter(bet => bet.status === 'win').length;
    const lossCount = bets.filter(bet => bet.status === 'loss').length;
    const pendingCount = bets.filter(bet => bet.status === 'pending').length;

    return { totalAmount, totalWin, winCount, lossCount, pendingCount };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.betHeader}>
        <Text style={styles.betLogo}>My Bets</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.myContainer}>
          {(userBets.length === 0 && dummyBets.length === 0) ? (
            <Text style={styles.noBetsText}>No bets found.</Text>
          ) : (
            (userBets.length > 0 ? userBets : dummyBets).map((group, idx) => {
              const stats = calculateGroupStats(group.bets);
              return (
                <View key={idx} style={styles.betCard}>
                  {/* Game Header */}
                  <View style={styles.gameHeader}>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameTitle}>{group.game}</Text>
                      <Text style={styles.gameDate}>{group.date}</Text>
                      <Text style={styles.sessionTime}>{group.sessionTime}</Text>
                    </View>
                    <View style={styles.gameStats}>
                      <Text style={styles.totalBets}>{group.bets.length} Bets</Text>
                      <Text style={styles.totalAmount}>₹{stats.totalAmount}</Text>
                      {stats.totalWin > 0 && (
                        <Text style={styles.totalWin}>Won: ₹{stats.totalWin}</Text>
                      )}
                    </View>
                  </View>

                  {/* Game Status Summary */}
                  <View style={styles.statusSummary}>
                    {stats.pendingCount > 0 && (
                      <View style={styles.statusItem}>
                        <Ionicons name="time" size={12} color="#FFD700" />
                        <Text style={[styles.statusText, { color: '#FFD700' }]}>
                          {stats.pendingCount} Pending
                        </Text>
                      </View>
                    )}
                    {stats.winCount > 0 && (
                      <View style={styles.statusItem}>
                        <Ionicons name="checkmark-circle" size={12} color="#00FF88" />
                        <Text style={[styles.statusText, { color: '#00FF88' }]}>
                          {stats.winCount} Won
                        </Text>
                      </View>
                    )}
                    {stats.lossCount > 0 && (
                      <View style={styles.statusItem}>
                        <Ionicons name="close-circle" size={12} color="#FF4444" />
                        <Text style={[styles.statusText, { color: '#FF4444' }]}>
                          {stats.lossCount} Lost
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Individual Bets - Horizontal Scrollable */}
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    style={styles.betsScrollContainer}
                    contentContainerStyle={styles.betsScrollContent}
                  >
                    {group.bets.map((bet, betIdx) => (
                      <View key={bet.id} style={styles.betItemCard}>
                        <View style={styles.betNumberContainer}>
                          <Text style={styles.betNumber}>{bet.number}</Text>
                          <Text style={styles.betType}>{getBetTypeDisplay(bet.type)}</Text>
                        </View>

                        <View style={styles.betAmountContainer}>
                          <Text style={styles.betAmount}>₹{bet.amount}</Text>
                          {bet.winAmount && (
                            <Text style={styles.winAmount}>₹{bet.winAmount}</Text>
                          )}
                        </View>

                        
                      </View>
                    ))}
                  </ScrollView>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  betHeader: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    marginBottom: 10,
  },
  betLogo: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
  },
  scrollView: {
    flex: 1,
  },
  myContainer: {
    padding: 15,
  },
  noBetsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  betCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  gameDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  sessionTime: {
    fontSize: 11,
    color: '#666',
  },
  gameStats: {
    alignItems: 'flex-end',
  },
  totalBets: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
    marginTop: 2,
  },
  totalWin: {
    fontSize: 14,
    color: '#00FF88',
    fontWeight: 'bold',
    marginTop: 2,
  },
  statusSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  betsScrollContainer: {
    marginBottom: 10,
  },
  betsScrollContent: {
    paddingRight: 15,
    gap: 10,
  },
  betItemCard: {
    backgroundColor: '#0f0f0f',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  betNumberContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  betNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  betType: {
    fontSize: 10,
    color: '#999',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
  },
  betAmountContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  betAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  winAmount: {
    fontSize: 11,
    color: '#00FF88',
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
    minWidth: 60,
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: 'bold',
  },
});

export default MyBet;
