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
import { useAuth } from '../hooks/useAuth';

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
  onClose: () => void;
  visible: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallDevice = SCREEN_WIDTH < 375;

export default function AuthScreen({ onAuthSuccess, onClose, visible }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

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
      const result = await login(loginData);

      if (result.success && result.user) {
        // Close modal and redirect to home
        onAuthSuccess(result.user);
        onClose();
      } else {
        Alert.alert('Error', result.error || 'Login failed. Please try again.');
      }
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
      const result = await register(registerData);

      if (result.success && result.user) {
        const userWithNewFlag = { ...result.user, isNewUser: true };
        // Close modal and redirect to home
        onAuthSuccess(userWithNewFlag);
        onClose();
      } else {
        Alert.alert('Error', result.error || 'Registration failed. Please try again.');
      }
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
            <View style={styles.header}>
              <Text style={styles.title}>
                {isLogin ? '🔐 Login करें' : '📝 Register करें'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.scrollContainer} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >

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

                {/* Test Login Button */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>OR</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={styles.testLoginButton}
                  onPress={() => {
                    const randomPhone = Math.floor(7000000000 + Math.random() * 3000000000).toString();
                    const testUser = {
                      id: Date.now().toString(),
                      name: 'Test User',
                      phone: randomPhone,
                      email: 'test@example.com',
                      kycStatus: 'PENDING',
                      referralCode: 'TEST' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                      walletBalance: 5000,
                      isVerified: true,
                      joinedAt: new Date().toISOString()
                    };
                    // Close modal and redirect to home
                    onAuthSuccess(testUser);
                    onClose();
                  }}
                >
                  <Text style={styles.testLoginText}>🎮 Quick Test Login</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  keyboardAvoidingView: {
    width: '100%',
    maxWidth: isSmallDevice ? 340 : 380,
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  modalContainer: {
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00FF88',
    overflow: 'hidden',
    shadowColor: '#00FF88',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    backdropFilter: 'blur(10px)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(26, 26, 26, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#00FF88',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00FF88',
    flex: 1,
  },
  closeButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  scrollContainer: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#00FF88',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#00FF88',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999999',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '700',
  },
  formContainer: {
    padding: 12,
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00FF88',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(26, 26, 26, 0.8)',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#ffffff',
    minHeight: 40,
  },
  authButton: {
    backgroundColor: '#00FF88',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00FF88',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: 12,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  termsContainer: {
    marginTop: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  termsText: {
    color: '#999999',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});