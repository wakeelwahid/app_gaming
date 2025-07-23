
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Animated,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

interface ResultsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface GameResult {
  id: string;
  gameId: number;
  gameName: string;
  result: string;
  date: string;
  time: string;
}

// Mock data for last 2 months
const mockResults: GameResult[] = [
  // Current results (today)
  { id: '1', gameId: 1, gameName: 'Jaipur King', result: '45', date: '2025-01-15', time: '04:50 PM' },
  { id: '2', gameId: 2, gameName: 'Faridabad', result: '23', date: '2025-01-15', time: '06:40 PM' },
  { id: '3', gameId: 3, gameName: 'Ghaziabad', result: '8', date: '2025-01-15', time: '07:50 PM' },
  { id: '4', gameId: 4, gameName: 'Gali', result: '91', date: '2025-01-15', time: '10:30 PM' },
  { id: '5', gameId: 5, gameName: 'Disawer', result: '5', date: '2025-01-15', time: '02:30 AM' },
  { id: '6', gameId: 6, gameName: 'Diamond King', result: '34', date: '2025-01-15', time: '10:10 PM' },

  // Previous days data
  { id: '7', gameId: 1, gameName: 'Jaipur King', result: '67', date: '2025-01-14', time: '04:50 PM' },
  { id: '8', gameId: 2, gameName: 'Faridabad', result: '12', date: '2025-01-14', time: '06:40 PM' },
  { id: '9', gameId: 3, gameName: 'Ghaziabad', result: '89', date: '2025-01-14', time: '07:50 PM' },
  { id: '10', gameId: 4, gameName: 'Gali', result: '33', date: '2025-01-14', time: '10:30 PM' },
  { id: '11', gameId: 5, gameName: 'Disawer', result: '76', date: '2025-01-14', time: '02:30 AM' },
  { id: '12', gameId: 6, gameName: 'Diamond King', result: '54', date: '2025-01-14', time: '10:10 PM' },

  // More historical data (last 2 months)
  { id: '13', gameId: 1, gameName: 'Jaipur King', result: '21', date: '2025-01-13', time: '04:50 PM' },
  { id: '14', gameId: 2, gameName: 'Faridabad', result: '87', date: '2025-01-13', time: '06:40 PM' },
  { id: '15', gameId: 1, gameName: 'Jaipur King', result: '99', date: '2025-01-12', time: '04:50 PM' },
  { id: '16', gameId: 3, gameName: 'Ghaziabad', result: '14', date: '2025-01-12', time: '07:50 PM' },
  { id: '17', gameId: 1, gameName: 'Jaipur King', result: '43', date: '2025-01-11', time: '04:50 PM' },
  { id: '18', gameId: 4, gameName: 'Gali', result: '62', date: '2025-01-11', time: '10:30 PM' },
  { id: '19', gameId: 2, gameName: 'Faridabad', result: '18', date: '2025-01-10', time: '06:40 PM' },
  { id: '20', gameId: 5, gameName: 'Disawer', result: '95', date: '2025-01-10', time: '02:30 AM' },
];

export default function ResultsModal({ visible, onClose }: ResultsModalProps) {
  const [selectedGame, setSelectedGame] = useState<string>('All Games');
  const [selectedMonth, setSelectedMonth] = useState<string>('January 2025');
  const [filteredResults, setFilteredResults] = useState<GameResult[]>([]);
  const [currentResults, setCurrentResults] = useState<GameResult[]>([]);

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const congratsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Start multiple animations when modal opens
      Animated.parallel([
        // Pulse animation for winning number
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.3,
              duration: 800,
              useNativeDriver: false,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: false,
            }),
          ])
        ),
        // Rotation animation
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
          })
        ),
        // Scale animation for modal
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: false,
        }),
        // Bounce animation for flowers
        Animated.loop(
          Animated.sequence([
            Animated.timing(bounceAnim, {
              toValue: 1,
              duration: 1200,
              useNativeDriver: false,
            }),
            Animated.timing(bounceAnim, {
              toValue: 0,
              duration: 1200,
              useNativeDriver: false,
            }),
          ])
        ),
        // Sparkle animation
        Animated.loop(
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          })
        ),
        // Confetti animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(confettiAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: false,
            }),
            Animated.timing(confettiAnim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: false,
            }),
          ])
        ),
        // Congratulations text animation
        Animated.loop(
          Animated.sequence([
            Animated.timing(congratsAnim, {
              toValue: 1.1,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(congratsAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: false,
            }),
          ])
        ),
      ]).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    filterResults();
  }, [selectedGame, selectedMonth]);

  const filterResults = () => {
    let filtered = mockResults;

    // Filter by game
    if (selectedGame !== 'All Games') {
      filtered = filtered.filter(result => result.gameName === selectedGame);
    }

    // Filter by month (for simplicity, just showing current month data)
    if (selectedMonth === 'December 2024') {
      filtered = filtered.filter(result => result.date.includes('2024-12'));
    } else {
      filtered = filtered.filter(result => result.date.includes('2025-01'));
    }

    // Get current results (today's results) - showing only one for testing
    const today = '2025-01-15';
    const todaysResults = mockResults.filter(result => result.date === today);
    // Show only first result for testing
    setCurrentResults(todaysResults.slice(0, 1));

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredResults(filtered);
  };

  const getUniqueGames = () => {
    const games = [...new Set(mockResults.map(result => result.gameName))];
    return ['All Games', ...games];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGameColor = (gameName: string) => {
    const colors: { [key: string]: string } = {
      'Jaipur King': '#FFD700',
      'Faridabad': '#00FF88',
      'Ghaziabad': '#4A90E2',
      'Gali': '#9B59B6',
      'Disawer': '#FF6B6B',
      'Diamond King': '#FF1493',
    };
    return colors[gameName] || '#4A90E2';
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bounceInterpolate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const confettiTranslate = confettiAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, height],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* Animated Background Effects */}
        <Animated.View style={[styles.confettiContainer, { transform: [{ translateY: confettiTranslate }] }]}>
          <Text style={styles.confetti}>🎊</Text>
          <Text style={styles.confetti}>🎉</Text>
          <Text style={styles.confetti}>✨</Text>
          <Text style={styles.confetti}>🌟</Text>
          <Text style={styles.confetti}>💫</Text>
        </Animated.View>

        <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Animated.Text style={[styles.headerTitle, { transform: [{ scale: congratsAnim }] }]}>
              🏆 CONGRATULATIONS! 🏆
            </Animated.Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Congratulations Banner */}
          <View style={styles.congratsBanner}>
            <Animated.View style={[styles.sparkleRow, { opacity: sparkleOpacity }]}>
              <Text style={styles.sparkleText}>✨ WINNER ✨</Text>
            </Animated.View>
            <Text style={styles.congratsText}>आपका भाग्यशाली नंबर!</Text>
          </View>

          {/* Current Winning Numbers - Centered */}
          <View style={styles.currentResultsContainer}>
            <Text style={styles.sectionTitle}>🎯 TODAY'S WINNING NUMBER</Text>
            
            {/* Flower decorations */}
            <Animated.View style={[styles.flowerDecorations, { transform: [{ translateY: bounceInterpolate }] }]}>
              <Text style={styles.flower}>🌸</Text>
              <Text style={styles.flower}>🌺</Text>
              <Text style={styles.flower}>🌻</Text>
              <Text style={styles.flower}>🌹</Text>
              <Text style={styles.flower}>🌷</Text>
            </Animated.View>

            <View style={styles.centeredWinningNumber}>
              {currentResults.map((result, index) => (
                <Animated.View
                  key={result.id}
                  style={[
                    styles.centeredResultCircle,
                    {
                      backgroundColor: getGameColor(result.gameName),
                      transform: [
                        { scale: pulseAnim },
                        { rotate: rotateInterpolate }
                      ],
                    }
                  ]}
                >
                  <Text style={styles.centeredResultNumber}>{result.result}</Text>
                  <Text style={styles.centeredResultGame}>{result.gameName}</Text>
                  <Text style={styles.centeredResultTime}>{result.time}</Text>
                </Animated.View>
              ))}
            </View>

            {/* More flower decorations */}
            <Animated.View style={[styles.flowerDecorations, { transform: [{ translateY: bounceInterpolate }] }]}>
              <Text style={styles.flower}>💐</Text>
              <Text style={styles.flower}>🌼</Text>
              <Text style={styles.flower}>🥀</Text>
              <Text style={styles.flower}>🏵️</Text>
              <Text style={styles.flower}>🌿</Text>
            </Animated.View>
          </View>

          {/* Filters */}
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>🎮 Game</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedGame}
                    onValueChange={(value) => setSelectedGame(value)}
                    style={styles.picker}
                    dropdownIconColor="#4A90E2"
                  >
                    {getUniqueGames().map((game, index) => (
                      <Picker.Item key={index} label={game} value={game} color="#fff" />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>📅 Month</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(value) => setSelectedMonth(value)}
                    style={styles.picker}
                    dropdownIconColor="#4A90E2"
                  >
                    <Picker.Item label="January 2025" value="January 2025" color="#fff" />
                    <Picker.Item label="December 2024" value="December 2024" color="#fff" />
                  </Picker>
                </View>
              </View>
            </View>
          </View>

          {/* Winning Number History Section */}
          <View style={styles.winningHistoryContainer}>
            <Text style={styles.sectionTitle}>🏆 WINNING NUMBER HISTORY</Text>
            
            {/* Quick Stats */}
            <View style={styles.quickStatsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{filteredResults.length}</Text>
                <Text style={styles.statLabel}>Total Results</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{getUniqueGames().length - 1}</Text>
                <Text style={styles.statLabel}>Games</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {selectedMonth === 'January 2025' ? '15' : '31'}
                </Text>
                <Text style={styles.statLabel}>Days</Text>
              </View>
            </View>

            {/* Animated Winning Numbers Grid */}
            <ScrollView style={styles.winningNumbersGrid} showsVerticalScrollIndicator={false}>
              {filteredResults.map((result, index) => (
                <Animated.View
                  key={result.id}
                  style={[
                    styles.winningNumberCard,
                    {
                      opacity: sparkleOpacity,
                      transform: [
                        { 
                          scale: index < 3 ? pulseAnim : scaleAnim 
                        }
                      ]
                    }
                  ]}
                >
                  {/* Card Header */}
                  <View style={styles.winningCardHeader}>
                    <Text style={styles.winningCardDate}>{formatDate(result.date)}</Text>
                    <Text style={styles.winningCardTime}>{result.time}</Text>
                  </View>

                  {/* Game Name */}
                  <Text style={[styles.winningCardGame, { color: getGameColor(result.gameName) }]}>
                    🎮 {result.gameName}
                  </Text>

                  {/* Winning Number Circle */}
                  <View style={[styles.winningNumberCircle, { backgroundColor: getGameColor(result.gameName) }]}>
                    <Text style={styles.winningNumber}>{result.result}</Text>
                  </View>

                  {/* Winner Badge */}
                  <View style={styles.winnerBadge}>
                    <Text style={styles.winnerBadgeText}>🏆 WINNER</Text>
                  </View>

                  {/* Decorative Elements */}
                  <View style={styles.cardDecorations}>
                    <Text style={styles.cardDecoration}>✨</Text>
                    <Text style={styles.cardDecoration}>🌟</Text>
                    <Text style={styles.cardDecoration}>✨</Text>
                  </View>
                </Animated.View>
              ))}

              {filteredResults.length === 0 && (
                <View style={styles.emptyHistoryContainer}>
                  <Text style={styles.emptyHistoryIcon}>🏆</Text>
                  <Text style={styles.emptyHistoryTitle}>No Winning History Found</Text>
                  <Text style={styles.emptyHistoryMessage}>
                    {selectedGame === 'All Games' 
                      ? 'No winning numbers found for selected period'
                      : `No winning numbers found for ${selectedGame}`
                    }
                  </Text>
                  <Text style={styles.emptyHistorySubMessage}>
                    Try changing the filters to see more results
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Results Table */}
          <View style={styles.tableContainer}>
            <Text style={styles.sectionTitle}>📊 Detailed Historical Results</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Date</Text>
              <Text style={styles.tableHeaderText}>Game</Text>
              <Text style={styles.tableHeaderText}>Result</Text>
              <Text style={styles.tableHeaderText}>Time</Text>
            </View>

            <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
              {filteredResults.map((result, index) => (
                <Animated.View
                  key={result.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.evenRow : styles.oddRow
                  ]}
                >
                  <Text style={styles.tableCellDate}>{formatDate(result.date)}</Text>
                  <Text style={[styles.tableCellGame, { color: getGameColor(result.gameName) }]}>
                    {result.gameName}
                  </Text>
                  <View style={[styles.resultBadge, { backgroundColor: getGameColor(result.gameName) }]}>
                    <Text style={styles.resultNumber}>{result.result}</Text>
                  </View>
                  <Text style={styles.tableCellTime}>{result.time}</Text>
                </Animated.View>
              ))}

              {filteredResults.length === 0 && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>📊 No results found</Text>
                  <Text style={styles.emptySubText}>Try adjusting your filters</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1,
  },
  confetti: {
    fontSize: 30,
    textAlign: 'center',
  },
  modalContainer: {
    width: width * 0.95,
    height: '90%',
    backgroundColor: '#0a0a0a',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFD700',
    overflow: 'hidden',
    elevation: 20,
  },
  header: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#FFA500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  congratsBanner: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
  },
  sparkleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  sparkleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
  },
  congratsText: {
    fontSize: 14,
    color: '#00FF88',
    fontWeight: '600',
  },
  currentResultsContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  flowerDecorations: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
  },
  flower: {
    fontSize: 25,
    textAlign: 'center',
  },
  centeredWinningNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  centeredResultCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    borderWidth: 5,
    borderColor: '#FFD700',
  },
  centeredResultNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  centeredResultGame: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 5,
  },
  centeredResultTime: {
    fontSize: 10,
    color: '#000',
    opacity: 0.8,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 15,
  },
  filterSection: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
    height: 40,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#333',
    height: 40,
  },
  tableContainer: {
    flex: 1,
    padding: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  tableHeaderText: {
    flex: 1,
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginBottom: 5,
    minHeight: 50,
  },
  evenRow: {
    backgroundColor: '#1a1a1a',
  },
  oddRow: {
    backgroundColor: '#222',
  },
  tableCellDate: {
    flex: 1,
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
  },
  tableCellGame: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
  },
  resultBadge: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  resultNumber: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tableCellTime: {
    flex: 1,
    color: '#999',
    fontSize: 10,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubText: {
    fontSize: 12,
    color: '#999',
  },
  
  // Winning Number History Styles
  winningHistoryContainer: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    maxHeight: 400,
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  winningNumbersGrid: {
    maxHeight: 280,
  },
  winningNumberCard: {
    backgroundColor: '#222',
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  winningCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  winningCardDate: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  winningCardTime: {
    fontSize: 11,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  winningCardGame: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  winningNumberCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  winningNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  winnerBadge: {
    backgroundColor: '#FFD700',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 10,
  },
  winnerBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 0.5,
  },
  cardDecorations: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  cardDecoration: {
    fontSize: 16,
  },
  emptyHistoryContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyHistoryIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyHistoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyHistoryMessage: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 30,
    marginBottom: 8,
  },
  emptyHistorySubMessage: {
    fontSize: 10,
    color: '#4A90E2',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
