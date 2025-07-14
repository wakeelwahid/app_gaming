
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  StatusBar 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserInfoFormProps {
  onBack: () => void;
}

export default function UserInfoForm({ onBack }: UserInfoFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    mobile: '',
    email: '',
    department: '',
    designation: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    joiningDate: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.fullName || !formData.employeeId || !formData.mobile || !formData.email) {
      Alert.alert('Error', 'Please fill all required fields (Name, Employee ID, Mobile, Email)');
      return;
    }

    Alert.alert(
      'Information Saved!',
      'Your employee information has been saved successfully.',
      [{ text: 'OK', onPress: onBack }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employee Information</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Employee ID *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter employee ID"
              value={formData.employeeId}
              onChangeText={(text) => handleInputChange('employeeId', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              value={formData.mobile}
              onChangeText={(text) => handleInputChange('mobile', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email address"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Department</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter department"
              value={formData.department}
              onChangeText={(text) => handleInputChange('department', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Designation</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter designation"
              value={formData.designation}
              onChangeText={(text) => handleInputChange('designation', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Group</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter blood group (e.g., A+, B-, O+)"
              value={formData.bloodGroup}
              onChangeText={(text) => handleInputChange('bloodGroup', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Joining Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={formData.joiningDate}
              onChangeText={(text) => handleInputChange('joiningDate', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter complete address"
              multiline
              numberOfLines={3}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Emergency contact number"
              keyboardType="phone-pad"
              value={formData.emergencyContact}
              onChangeText={(text) => handleInputChange('emergencyContact', text)}
            />
          </View>
        </View>

        {/* Information Note */}
        <View style={styles.section}>
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color="#1565C0" />
            <Text style={styles.infoText}>
              Please provide accurate information for HR records and emergency purposes
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Information</Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
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
    backgroundColor: '#1565C0',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    marginTop: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F3F8FF',
    padding: 16,
    borderRadius: 8,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  bottomPadding: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButton: {
    backgroundColor: '#1565C0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
