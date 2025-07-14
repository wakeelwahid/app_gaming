
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  StatusBar,
  FlatList,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Employee {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
}

export default function AdminPage() {
  const [employees] = useState<Employee[]>([
    { id: '1', name: 'राहुल शर्मा', status: 'available' },
    { id: '2', name: 'प्रिया पटेल', status: 'busy' },
    { id: '3', name: 'अमित कुमार', status: 'available' },
    { id: '4', name: 'सुनीता गुप्ता', status: 'offline' },
    { id: '5', name: 'विकास सिंह', status: 'available' },
    { id: '6', name: 'अंजली मिश्रा', status: 'busy' },
  ]);

  const handleBuzzerPress = (employeeName: string) => {
    Alert.alert(
      'Buzzer Activated!',
      `Emergency alarm sent to ${employeeName}. Employee will be notified immediately.`,
      [
        {
          text: 'Stop Alarm',
          style: 'destructive',
          onPress: () => Alert.alert('Alarm Stopped', `Emergency alarm for ${employeeName} has been deactivated.`)
        },
        {
          text: 'Continue',
          style: 'default'
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'offline': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'उपलब्ध';
      case 'busy': return 'व्यस्त';
      case 'offline': return 'ऑफलाइन';
      default: return 'अज्ञात';
    }
  };

  const renderEmployee = ({ item }: { item: Employee }) => (
    <View style={styles.employeeCard}>
      <View style={styles.employeeInfo}>
        <View style={styles.employeeHeader}>
          <Ionicons name="person-circle" size={40} color="#1565C0" />
          <View style={styles.employeeDetails}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.buzzerButton} 
        onPress={() => handleBuzzerPress(item.name)}
      >
        <Ionicons name="warning" size={20} color="#fff" />
        <Text style={styles.buzzerText}>BUZZER</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#D32F2F" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Employee Emergency Control</Text>
      </View>

      {/* Employee List Section */}
      <View style={styles.employeeSection}>
        <Text style={styles.sectionTitle}>Employee List - Emergency Control</Text>
        <FlatList
          data={employees}
          renderItem={renderEmployee}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.employeeList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#D32F2F',
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.9,
    marginTop: 4,
  },
  employeeSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  employeeList: {
    paddingBottom: 20,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  buzzerButton: {
    backgroundColor: '#D32F2F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: 6,
  },
  buzzerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
