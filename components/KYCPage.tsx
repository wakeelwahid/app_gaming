
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

interface KYCPageProps {
  onBack: () => void;
}

export default function KYCPage({ onBack }: KYCPageProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    pincode: '',
    panNumber: '',
    aadharNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitKYC = () => {
    Alert.alert(
      'KYC Submitted',
      'आपका KYC verification submit हो गया है। 24-48 घंटे में verify हो जाएगा।',
      [
        {
          text: 'ठीक है',
          onPress: () => onBack()
        }
      ]
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>व्यक्तिगत जानकारी</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>पूरा नाम *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="अपना पूरा नाम दर्ज करें"
          placeholderTextColor="#999"
          value={formData.fullName}
          onChangeText={(value) => handleInputChange('fullName', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>जन्म तिथि *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="DD/MM/YYYY"
          placeholderTextColor="#999"
          value={formData.dateOfBirth}
          onChangeText={(value) => handleInputChange('dateOfBirth', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>पूरा पता *</Text>
        <TextInput
          style={[styles.textInput, { height: 80 }]}
          placeholder="अपना पूरा पता दर्ज करें"
          placeholderTextColor="#999"
          multiline
          value={formData.address}
          onChangeText={(value) => handleInputChange('address', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>पिन कोड *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="6 अंकों का पिन कोड"
          placeholderTextColor="#999"
          keyboardType="numeric"
          maxLength={6}
          value={formData.pincode}
          onChangeText={(value) => handleInputChange('pincode', value)}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>दस्तावेज की जानकारी</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>PAN Card Number *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="ABCDE1234F"
          placeholderTextColor="#999"
          value={formData.panNumber}
          onChangeText={(value) => handleInputChange('panNumber', value.toUpperCase())}
          maxLength={10}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Aadhar Card Number *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="1234 5678 9012"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={formData.aadharNumber}
          onChangeText={(value) => handleInputChange('aadharNumber', value)}
          maxLength={12}
        />
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteIcon}>ℹ️</Text>
        <Text style={styles.noteText}>
          सभी documents clear और readable होने चाहिए। Blurred या damaged documents accept नहीं होंगे।
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>बैंक की जानकारी</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Account Holder Name *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="जैसा कि बैंक में है"
          placeholderTextColor="#999"
          value={formData.accountHolderName}
          onChangeText={(value) => handleInputChange('accountHolderName', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Bank Account Number *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="1234567890123456"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={formData.bankAccountNumber}
          onChangeText={(value) => handleInputChange('bankAccountNumber', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>IFSC Code *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="SBIN0001234"
          placeholderTextColor="#999"
          value={formData.ifscCode}
          onChangeText={(value) => handleInputChange('ifscCode', value.toUpperCase())}
          maxLength={11}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Bank Name *</Text>
        <TextInput
          style={styles.textInput}
          placeholder="State Bank of India"
          placeholderTextColor="#999"
          value={formData.bankName}
          onChangeText={(value) => handleInputChange('bankName', value)}
        />
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteIcon}>⚠️</Text>
        <Text style={styles.noteText}>
          बैंक की जानकारी सही होनी चाहिए। गलत information के कारण withdrawal में problem हो सकती है।
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header - Removed Back Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔐 KYC Verification</Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressStep, step >= 1 && styles.activeStep]}>
            <Text style={[styles.progressStepText, step >= 1 && styles.activeStepText]}>1</Text>
          </View>
          <View style={[styles.progressLine, step >= 2 && styles.activeProgressLine]} />
          <View style={[styles.progressStep, step >= 2 && styles.activeStep]}>
            <Text style={[styles.progressStepText, step >= 2 && styles.activeStepText]}>2</Text>
          </View>
          <View style={[styles.progressLine, step >= 3 && styles.activeProgressLine]} />
          <View style={[styles.progressStep, step >= 3 && styles.activeStep]}>
            <Text style={[styles.progressStepText, step >= 3 && styles.activeStepText]}>3</Text>
          </View>
        </View>
        
        <View style={styles.progressLabels}>
          <Text style={styles.progressLabel}>व्यक्तिगत</Text>
          <Text style={styles.progressLabel}>दस्तावेज</Text>
          <Text style={styles.progressLabel}>बैंक</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.pageTitle}>KYC Verification</Text>
        <Text style={styles.pageSubtitle}>
          अपनी account को verify करें और secure withdrawals का आनंद लें
        </Text>

        {/* Step Content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.previousButton} onPress={handlePreviousStep}>
              <Ionicons name="chevron-back" size={20} color="#4A90E2" />
              <Text style={styles.previousButtonText}>पिछला</Text>
            </TouchableOpacity>
          )}
          
          <View style={{ flex: 1 }} />
          
          {step < 3 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
              <Text style={styles.nextButtonText}>अगला</Text>
              <Ionicons name="chevron-forward" size={20} color="#000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitKYC}>
              <Text style={styles.submitButtonText}>KYC Submit करें</Text>
              <Ionicons name="checkmark" size={20} color="#000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Benefits Section */}
      <View style={styles.benefitsContainer}>
        <Text style={styles.benefitsTitle}>🏆 KYC के फायदे</Text>
        <View style={styles.benefitsList}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✅</Text>
            <Text style={styles.benefitText}>Fast और secure withdrawals</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✅</Text>
            <Text style={styles.benefitText}>Higher withdrawal limits</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✅</Text>
            <Text style={styles.benefitText}>Account security increase</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>✅</Text>
            <Text style={styles.benefitText}>Priority customer support</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: isSmallDevice ? 15 : 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStep: {
    backgroundColor: '#4A90E2',
  },
  progressStepText: {
    color: '#999',
    fontWeight: 'bold',
  },
  activeStepText: {
    color: '#000',
  },
  progressLine: {
    width: 50,
    height: 2,
    backgroundColor: '#333',
  },
  activeProgressLine: {
    backgroundColor: '#4A90E2',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
  },
  content: {
    padding: isSmallDevice ? 15 : 20,
  },
  pageTitle: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 10,
  },
  pageSubtitle: {
    fontSize: isSmallDevice ? 14 : 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 25,
  },
  stepContainer: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 16,
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#2a1a00',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  noteIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  noteText: {
    color: '#fff',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  previousButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00FF88',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  benefitsContainer: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF88',
    textAlign: 'center',
    marginBottom: 15,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  benefitText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});
