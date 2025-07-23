
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GameResult {
  id: string;
  game: string;
  number: string;
  date: string;
  time: string;
  isLatest: boolean;
}

interface GameResultsProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function GameResults({ visible, onClose }: GameResultsProps) {
  const [selectedGame, setSelectedGame] = useState('All Games');
  const [selectedDate, setSelectedDate] = useState('Today');
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // Sample results data
  const [results] = useState<GameResult[]>([
    { id: '1', game: 'Jaipur King', number: '47', date: '2025-01-26', time: '04:50 PM', isLatest: true },
    { id: '2', game: 'Faridabad', number: '23', date: '2025-01-26', time: '06:40 PM', isLatest: false },
    { id: '3', game: 'Ghaziabad', number: '89', date: '2025-01-26', time: '07:50 PM', isLatest: false },
    { id: '4', game: 'Gali', number: '56', date: '2025-01-25', time: '10:30 PM', isLatest: false },
    { id: '5', game: 'Disawer', number: '12', date: '2025-01-25', time: '02:30 AM', isLatest: false },
    { id: '6', game: 'Diamond King', number: '78', date: '2025-01-25', time: '10:10 PM', isLatest: false },
  ]);

  const games = ['All Games', 'Jaipur King', 'Faridabad', 'Ghaziabad', 'Gali', 'Disawer', 'Diamond King'];
  const dates = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

  const filteredResults = results.filter(result => {
    const gameMatch = selectedGame === 'All Games' || result.game === selectedGame;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    let dateMatch = true;
    if (selectedDate === 'Today') {
      dateMatch = result.date === today;
    } else if (selectedDate === 'Yesterday') {
      dateMatch = result.date === yesterday;
    }
    
    return gameMatch && dateMatch;
  });

  const latestResult = results.find(result => result.isLatest);

  useEffect(() => {
    if (visible && latestResult) {
      // Start congratulations animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(confettiAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();

      // Continuous pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        })
      ).start();
    }
  }, [visible, latestResult]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 Game Results</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Game:</Text>
            {games.map((game) => (
              <TouchableOpacity
                key={game}
                style={[
                  styles.filterButton,
                  selectedGame === game && styles.activeFilterButton
                ]}
                onPress={() => setSelectedGame(game)}
              >
                <Text style={[
                  styles.filterText,
                  selectedGame === game && styles.activeFilterText
                ]}>
                  {game}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Date:</Text>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.filterButton,
                  selectedDate === date && styles.activeFilterButton
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[
                  styles.filterText,
                  selectedDate === date && styles.activeFilterText
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Latest Result with Animation */}
        {latestResult && (
          <View style={styles.latestResultContainer}>
            <Text style={styles.congratsTitle}>🎉 Congratulations! Latest Result 🎉</Text>
            
            <Animated.View 
              style={[
                styles.winningCircle,
                {
                  transform: [
                    { scale: Animated.multiply(scaleAnim, pulseAnim) },
                    { rotate: rotateInterpolate }
                  ]
                }
              ]}
            >
              <View style={styles.innerCircle}>
                <Text style={styles.winningNumber}>{latestResult.number}</Text>
                <Text style={styles.winningGame}>{latestResult.game}</Text>
                <Text style={styles.winningTime}>{latestResult.time}</Text>
              </View>
            </Animated.View>

            {/* Confetti Animation */}
            <Animated.View 
              style={[
                styles.confettiContainer,
                {
                  opacity: confettiAnim,
                  transform: [{
                    translateY: confettiAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -50]
                    })
                  }]
                }
              ]}
            >
              <Text style={styles.confetti}>🎊🎉✨🎊🎉✨🎊🎉</Text>
            </Animated.View>
          </View>
        )}

        {/* Results Table */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>📊 All Results</Text>
          
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Game</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Number</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Time</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Date</Text>
          </View>

          {filteredResults.length > 0 ? (
            filteredResults.map((result, index) => (
              <View 
                key={result.id}
                style={[
                  styles.tableRow,
                  result.isLatest && styles.latestRow,
                  index % 2 === 0 && styles.evenRow
                ]}
              >
                <Text style={[styles.tableCellText, { flex: 2 }]}>
                  {result.game}
                  {result.isLatest && <Text style={styles.latestBadge}> 🔥</Text>}
                </Text>
                <Text style={[
                  styles.tableCellText, 
                  { flex: 1, fontWeight: 'bold', fontSize: 16 },
                  result.isLatest && { color: '#FFD700' }
                ]}>
                  {result.number}
                </Text>
                <Text style={[styles.tableCellText, { flex: 1.5 }]}>{result.time}</Text>
                <Text style={[styles.tableCellText, { flex: 1.5 }]}>{result.date}</Text>
              </View>
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>📭 No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try changing the filters above
              </Text>
            </View>
          )}
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>💡 Legend:</Text>
          <View style={styles.legendItem}>
            <View style={styles.legendColor} />
            <Text style={styles.legendText}>🔥 Latest Result</Text>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  filtersContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  filterLabel: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#333',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#555',
  },
  activeFilterButton: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  latestResultContainer: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  congratsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  winningCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  winningNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  winningGame: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
  },
  winningTime: {
    fontSize: 10,
    color: '#333',
    marginTop: 2,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  confetti: {
    fontSize: 24,
    letterSpacing: 3,
  },
  tableContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  tableHeaderText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  evenRow: {
    backgroundColor: '#111',
  },
  latestRow: {
    backgroundColor: '#2a2a00',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  tableCellText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  latestBadge: {
    color: '#FFD700',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  noResultsText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  legendContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  legendTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 20,
    height: 15,
    backgroundColor: '#FFD700',
    marginRight: 10,
    borderRadius: 3,
  },
  legendText: {
    color: '#fff',
    fontSize: 12,
  },
});
