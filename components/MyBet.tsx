
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Bet {
  id: string;
  number: string;
  amount: number;
  bet_type: 'andar' | 'bahar' | 'single';
  status: 'pending' | 'won' | 'lost';
  created_at: string;
  game: string;
  session_start?: string;
  session_end?: string;
}

interface BetGroup {
  game: string;
  date: string;
  status: string;
  bets: Bet[];
}

export default function MyBet() {
  const [loading] = useState(false);
  
  // Dummy data for testing
  const [bets] = useState<BetGroup[]>([
    {
      game: 'Jaipur King',
      date: '2025-01-15',
      status: 'pending',
      bets: [
        {
          id: '1',
          number: '14',
          amount: 100,
          bet_type: 'single',
          status: 'pending',
          created_at: '2025-01-15T14:30:00Z',
          game: 'Jaipur King',
          session_start: '2025-01-15T09:00:00Z',
          session_end: '2025-01-15T16:50:00Z'
        },
        {
          id: '2',
          number: '2',
          amount: 50,
          bet_type: 'andar',
          status: 'pending',
          created_at: '2025-01-15T14:30:00Z',
          game: 'Jaipur King',
          session_start: '2025-01-15T09:00:00Z',
          session_end: '2025-01-15T16:50:00Z'
        },
        {
          id: '3',
          number: '7',
          amount: 75,
          bet_type: 'bahar',
          status: 'pending',
          created_at: '2025-01-15T14:30:00Z',
          game: 'Jaipur King',
          session_start: '2025-01-15T09:00:00Z',
          session_end: '2025-01-15T16:50:00Z'
        }
      ]
    },
    {
      game: 'Delhi Bazar',
      date: '2025-01-15',
      status: 'won',
      bets: [
        {
          id: '4',
          number: '25',
          amount: 200,
          bet_type: 'single',
          status: 'won',
          created_at: '2025-01-15T12:15:00Z',
          game: 'Delhi Bazar',
          session_start: '2025-01-15T10:00:00Z',
          session_end: '2025-01-15T18:00:00Z'
        },
        {
          id: '5',
          number: '8',
          amount: 100,
          bet_type: 'andar',
          status: 'won',
          created_at: '2025-01-15T12:15:00Z',
          game: 'Delhi Bazar',
          session_start: '2025-01-15T10:00:00Z',
          session_end: '2025-01-15T18:00:00Z'
        }
      ]
    },
    {
      game: 'Gali Disawar',
      date: '2025-01-14',
      status: 'lost',
      bets: [
        {
          id: '6',
          number: '42',
          amount: 150,
          bet_type: 'single',
          status: 'lost',
          created_at: '2025-01-14T15:45:00Z',
          game: 'Gali Disawar',
          session_start: '2025-01-14T11:00:00Z',
          session_end: '2025-01-14T19:00:00Z'
        },
        {
          id: '7',
          number: '3',
          amount: 80,
          bet_type: 'bahar',
          status: 'lost',
          created_at: '2025-01-14T15:45:00Z',
          game: 'Gali Disawar',
          session_start: '2025-01-14T11:00:00Z',
          session_end: '2025-01-14T19:00:00Z'
        }
      ]
    }
  ]);

  const getBetChipStyle = (bet: Bet) => {
    const baseStyle = [styles.betNumberChip];
    
    if (bet.bet_type === 'andar') {
      baseStyle.push(styles.andarChip);
    } else if (bet.bet_type === 'bahar') {
      baseStyle.push(styles.baharChip);
    }
    
    return baseStyle;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'won':
        return styles.betStatusWon;
      case 'lost':
        return styles.betStatusLost;
      default:
        return styles.betStatusPending;
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.betHeader}>
        <Text style={styles.betLogo}>My Bets</Text>
      </View>

      <ScrollView style={styles.myContainer} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={styles.centerText}>Loading...</Text>
        ) : bets.length === 0 ? (
          <Text style={styles.centerText}>No bets found.</Text>
        ) : (
          bets.map((group, idx) => (
            <View key={idx} style={styles.betCard}>
              {/* Card Header */}
              <View style={styles.betCardHeader}>
                <Text style={styles.betMarket}>{group.game?.toUpperCase()}</Text>
                <Text style={styles.betDate}>{group.date}</Text>
              </View>

              {/* Bet Numbers */}
              <View style={styles.betNumbers}>
                {group.bets.map((bet, i) => (
                  <View key={i} style={getBetChipStyle(bet)}>
                    <Text style={styles.chipText}>
                      {bet.number} ₹{bet.amount}
                    </Text>
                    {bet.bet_type === 'andar' && (
                      <Text style={styles.betSectionMarkAndar}>A</Text>
                    )}
                    {bet.bet_type === 'bahar' && (
                      <Text style={styles.betSectionMarkBahar}>B</Text>
                    )}
                  </View>
                ))}
              </View>

              {/* Card Footer */}
              <View style={styles.betFooter}>
                <View style={styles.footerRow}>
                  <Text style={[styles.betStatus, getStatusStyle(group.status)]}>
                    {group.status === 'pending' ? 'Pending' : 
                     group.status === 'won' ? 'Won' : 'Lost'}
                  </Text>
                  <Text style={styles.betAmount}>
                    Total Numbers: {group.bets.length}
                  </Text>
                </View>
                
                <View style={styles.footerRow}>
                  <Text style={styles.betPayout}>
                    Amount: ₹{group.bets.reduce((sum, b) => sum + Number(b.amount), 0)}
                  </Text>
                </View>

                {/* Session Info */}
                {group.bets[0]?.session_start && group.bets[0]?.session_end && (
                  <View style={styles.sessionInfo}>
                    <Text style={styles.betSession}>
                      Session: {formatTime(group.bets[0].session_start)} - {formatTime(group.bets[0].session_end)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        {/* Back Button */}
        <TouchableOpacity style={styles.betBackBtn}>
          <Ionicons name="arrow-back" size={16} color="#000" />
          <Text style={styles.backBtnText}> Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  betHeader: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  betLogo: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 2,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    paddingVertical: 15,
    marginHorizontal: 20,
  },
  myContainer: {
    maxWidth: 1200,
    paddingHorizontal: 20,
  },
  centerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
  betCard: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 3,
  },
  betCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  betMarket: {
    backgroundColor: '#8A2BE2',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontWeight: 'bold',
    color: '#191619',
    fontSize: 12,
  },
  betDate: {
    color: '#aaa',
    fontSize: 12,
  },
  betNumbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  betNumberChip: {
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#A55CD3',
  },
  andarChip: {
    backgroundColor: 'rgba(0, 100, 0, 0.5)',
    borderLeftWidth: 3,
    borderLeftColor: '#00FF00',
  },
  baharChip: {
    backgroundColor: 'rgba(139, 0, 0, 0.5)',
    borderLeftWidth: 3,
    borderLeftColor: '#FF0000',
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  betSectionMarkAndar: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#00FF88',
  },
  betSectionMarkBahar: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  betFooter: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  betStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  betStatusPending: {
    backgroundColor: 'rgba(255, 165, 0, 0.2)',
    color: '#FFA500',
  },
  betStatusWon: {
    backgroundColor: 'rgba(0, 255, 0, 0.2)',
    color: '#00FF88',
  },
  betStatusLost: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    color: '#FF6B6B',
  },
  betAmount: {
    fontWeight: 'bold',
    color: '#FFD700',
    fontSize: 12,
  },
  betPayout: {
    color: '#00FF88',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sessionInfo: {
    marginTop: 8,
  },
  betSession: {
    color: '#4A90E2',
    fontSize: 11,
    fontStyle: 'italic',
  },
  betBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FFD700',
    borderRadius: 5,
    alignSelf: 'center',
  },
  backBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
