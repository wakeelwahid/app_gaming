
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
  onClose: () => void;
  visible: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

export default function AuthScreen({ onAuthSuccess, onClose, visible }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  const handleLogin = async () => {
    if (!loginData.phone || !loginData.password) {
      Alert.alert('Error', 'कृपया सभी फील्ड भरें');
      return;
    }

    if (loginData.phone.length !== 10) {
      Alert.alert('Error', 'कृपया वैध मोबाइल नंबर डालें');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful login
      const user = {
        id: '1',
        name: 'Test User',
        phone: loginData.phone,
        email: 'test@example.com',
        kycStatus: 'PENDING',
        referralCode: 'REF123'
      };
      
      onAuthSuccess(user);
      // Alert will be shown in parent component
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.name || !registerData.phone || !registerData.password || !registerData.confirmPassword) {
      Alert.alert('Error', 'कृपया सभी आवश्यक फील्ड भरें');
      return;
    }

    if (registerData.phone.length !== 10) {
      Alert.alert('Error', 'कृपया वैध मोबाइल नंबर डालें');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert('Error', 'Password match नहीं कर रहा');
      return;
    }

    if (registerData.password.length < 6) {
      Alert.alert('Error', 'Password कम से कम 6 characters का होना चाहिए');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful registration
      const user = {
        id: '1',
        name: registerData.name,
        phone: registerData.phone,
        email: registerData.email,
        kycStatus: 'PENDING',
        referralCode: 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase()
      };
      
      onAuthSuccess(user);
      // Alert will be shown in parent component
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <ScrollView 
              style={styles.scrollContainer} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={20} color="#ffffff" />
                </TouchableOpacity>
                <Text style={styles.title}>
                  {isLogin ? '🔐 Login' : '📝 Register'}
                </Text>
              </View>

              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.activeTab]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>

              {isLogin ? (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>अपने Account में Login करें</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>📱 Mobile Number</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="10 digit mobile number"
                      placeholderTextColor="#666"
                      value={loginData.phone}
                      onChangeText={(text) => setLoginData({...loginData, phone: text})}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🔒 Password</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your password"
                      placeholderTextColor="#666"
                      value={loginData.password}
                      onChangeText={(text) => setLoginData({...loginData, password: text})}
                      secureTextEntry
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.authButton, loading && styles.authButtonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <Text style={styles.authButtonText}>
                      {loading ? 'Login हो रहा है...' : '🚀 Login करें'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      Password भूल गए?
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>नया Account बनाएं</Text>
                  
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>👤 Full Name *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your full name"
                      placeholderTextColor="#666"
                      value={registerData.name}
                      onChangeText={(text) => setRegisterData({...registerData, name: text})}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>📱 Mobile Number *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="10 digit mobile number"
                      placeholderTextColor="#666"
                      value={registerData.phone}
                      onChangeText={(text) => setRegisterData({...registerData, phone: text})}
                      keyboardType="numeric"
                      maxLength={10}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>📧 Email (Optional)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter your email"
                      placeholderTextColor="#666"
                      value={registerData.email}
                      onChangeText={(text) => setRegisterData({...registerData, email: text})}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🔒 Password *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Minimum 6 characters"
                      placeholderTextColor="#666"
                      value={registerData.password}
                      onChangeText={(text) => setRegisterData({...registerData, password: text})}
                      secureTextEntry
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🔒 Confirm Password *</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Re-enter your password"
                      placeholderTextColor="#666"
                      value={registerData.confirmPassword}
                      onChangeText={(text) => setRegisterData({...registerData, confirmPassword: text})}
                      secureTextEntry
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>🎁 Referral Code (Optional)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter referral code"
                      placeholderTextColor="#666"
                      value={registerData.referralCode}
                      onChangeText={(text) => setRegisterData({...registerData, referralCode: text.toUpperCase()})}
                      autoCapitalize="characters"
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.authButton, loading && styles.authButtonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    <Text style={styles.authButtonText}>
                      {loading ? 'Account बन रहा है...' : '✨ Account बनाएं'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      By registering, you agree to our Terms & Conditions
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
  },
  modalContainer: {
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    backgroundColor: '#1a1a1a',
  },
  closeButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: '#333333',
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#00ff88',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#000000',
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: '#ffffff',
  },
  authButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  termsText: {
    color: '#666666',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
  },
});
