
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Transaction {
  id: string;
  date: string;
  time: string;
  type: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Failed';
}

interface TransactionProps {
  transactions?: Transaction[];
}

export default function Transaction({ transactions = [] }: TransactionProps) {
  const [searchText, setSearchText] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction =>
        transaction.type.toLowerCase().includes(text.toLowerCase()) ||
        transaction.amount.includes(text) ||
        transaction.status.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  };

  const showAllTransactions = () => {
    setSearchText('');
    setFilteredTransactions(transactions);
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionRow}>
      <View style={styles.dateTimeColumn}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.typeColumn}>
        <Text style={styles.typeText}>{item.type}</Text>
      </View>
      <View style={styles.amountColumn}>
        <Text style={styles.amountText}>{item.amount}</Text>
      </View>
      <View style={styles.statusColumn}>
        <View style={[
          styles.statusBadge,
          item.status === 'Success' && styles.successBadge,
          item.status === 'Pending' && styles.pendingBadge,
          item.status === 'Failed' && styles.failedBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'Success' && styles.successText,
            item.status === 'Pending' && styles.pendingText,
            item.status === 'Failed' && styles.failedText
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Transactions History</Text>

      {/* Search and Filter Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.showAllButton} onPress={showAllTransactions}>
          <Text style={styles.showAllButtonText}>Show All</Text>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={styles.dateTimeHeaderColumn}>
          <Text style={styles.headerText}>Date/Time</Text>
        </View>
        <View style={styles.typeHeaderColumn}>
          <Text style={styles.headerText}>Type</Text>
        </View>
        <View style={styles.amountHeaderColumn}>
          <Text style={styles.headerText}>Amount</Text>
        </View>
        <View style={styles.statusHeaderColumn}>
          <Text style={styles.headerText}>Status</Text>
        </View>
      </View>

      {/* Transaction List */}
      <View style={styles.tableBody}>
        {filteredTransactions.length > 0 ? (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noTransactionsContainer}>
            <Text style={styles.noTransactionsText}>No transactions found.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#FFD700',
    paddingBottom: 10,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  showAllButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  showAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  dateTimeHeaderColumn: {
    flex: 2,
  },
  typeHeaderColumn: {
    flex: 2,
  },
  amountHeaderColumn: {
    flex: 1.5,
  },
  statusHeaderColumn: {
    flex: 1.5,
  },
  headerText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableBody: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    borderRadius: 8,
    padding: 10,
  },
  transactionRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  dateTimeColumn: {
    flex: 2,
  },
  typeColumn: {
    flex: 2,
  },
  amountColumn: {
    flex: 1.5,
  },
  statusColumn: {
    flex: 1.5,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timeText: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
  typeText: {
    color: '#fff',
    fontSize: 14,
  },
  amountText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
  },
  successBadge: {
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  failedBadge: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  successText: {
    color: '#00FF88',
  },
  pendingText: {
    color: '#FFD700',
  },
  failedText: {
    color: '#FF4444',
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
  },
});
