
import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
  onClose: () => void;
}

export default function AuthScreen({ onAuthSuccess, onClose }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  
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

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      ),
    ]).start();
  }, []);

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

  const sparkleOpacity = sparkleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const floatTranslate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Animated Background Elements */}
      <Animated.View style={[styles.backgroundElements, { opacity: sparkleOpacity }]}>
        <Text style={styles.backgroundIcon}>✨</Text>
        <Text style={styles.backgroundIcon}>🌟</Text>
        <Text style={styles.backgroundIcon}>💫</Text>
        <Text style={styles.backgroundIcon}>⭐</Text>
        <Text style={styles.backgroundIcon}>🎆</Text>
      </Animated.View>

      <Animated.View style={[
        styles.mainContainer,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Animated.Text style={[
              styles.title,
              { transform: [{ translateY: floatTranslate }] }
            ]}>
              {isLogin ? '🔐 Welcome Back!' : '🎉 Join Us!'}
            </Animated.Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'अपने खाते में लॉगिन करें' : 'नया खाता बनाएं और जीतना शुरू करें'}
            </Text>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.activeTab]}
              onPress={() => setIsLogin(true)}
            >
              <Animated.View style={[styles.tabContent, { transform: [{ scale: isLogin ? 1.05 : 1 }] }]}>
                <Text style={[styles.tabIcon, isLogin && styles.activeTabIcon]}>🔑</Text>
                <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                  Login
                </Text>
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.activeTab]}
              onPress={() => setIsLogin(false)}
            >
              <Animated.View style={[styles.tabContent, { transform: [{ scale: !isLogin ? 1.05 : 1 }] }]}>
                <Text style={[styles.tabIcon, !isLogin && styles.activeTabIcon]}>✨</Text>
                <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                  Register
                </Text>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {isLogin ? (
            <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
              <Text style={styles.formTitle}>🚀 Login करें और जीतना शुरू करें!</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>📱 Mobile Number</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="10 digit mobile number"
                    placeholderTextColor="#666"
                    value={loginData.phone}
                    onChangeText={(text) => setLoginData({...loginData, phone: text})}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <Ionicons name="phone-portrait" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>🔒 Password</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your password"
                    placeholderTextColor="#666"
                    value={loginData.password}
                    onChangeText={(text) => setLoginData({...loginData, password: text})}
                    secureTextEntry
                  />
                  <Ionicons name="lock-closed" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.authButton, loading && styles.authButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Animated.View style={[styles.buttonContent, { transform: [{ scale: loading ? 0.95 : 1 }] }]}>
                  {loading && <Text style={styles.loadingIcon}>⏳</Text>}
                  <Text style={styles.authButtonText}>
                    {loading ? 'Login हो रहा है...' : '🚀 Login करें'}
                  </Text>
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>
                  🤔 Password भूल गए?
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
              <Text style={styles.formTitle}>🎊 नया Account बनाएं और Winner बनें!</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>👤 Full Name *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor="#666"
                    value={registerData.name}
                    onChangeText={(text) => setRegisterData({...registerData, name: text})}
                  />
                  <Ionicons name="person" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>📱 Mobile Number *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="10 digit mobile number"
                    placeholderTextColor="#666"
                    value={registerData.phone}
                    onChangeText={(text) => setRegisterData({...registerData, phone: text})}
                    keyboardType="numeric"
                    maxLength={10}
                  />
                  <Ionicons name="phone-portrait" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>📧 Email (Optional)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your email"
                    placeholderTextColor="#666"
                    value={registerData.email}
                    onChangeText={(text) => setRegisterData({...registerData, email: text})}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Ionicons name="mail" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>🔒 Password *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Minimum 6 characters"
                    placeholderTextColor="#666"
                    value={registerData.password}
                    onChangeText={(text) => setRegisterData({...registerData, password: text})}
                    secureTextEntry
                  />
                  <Ionicons name="lock-closed" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>🔒 Confirm Password *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Re-enter your password"
                    placeholderTextColor="#666"
                    value={registerData.confirmPassword}
                    onChangeText={(text) => setRegisterData({...registerData, confirmPassword: text})}
                    secureTextEntry
                  />
                  <Ionicons name="checkmark-circle" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>🎁 Referral Code (Optional)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter referral code"
                    placeholderTextColor="#666"
                    value={registerData.referralCode}
                    onChangeText={(text) => setRegisterData({...registerData, referralCode: text.toUpperCase()})}
                    autoCapitalize="characters"
                  />
                  <Ionicons name="gift" size={20} color="#00ff88" style={styles.inputIcon} />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.authButton, loading && styles.authButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Animated.View style={[styles.buttonContent, { transform: [{ scale: loading ? 0.95 : 1 }] }]}>
                  {loading && <Text style={styles.loadingIcon}>⏳</Text>}
                  <Text style={styles.authButtonText}>
                    {loading ? 'Account बन रहा है...' : '✨ Account बनाएं'}
                  </Text>
                </Animated.View>
              </TouchableOpacity>

              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  🔒 By registering, you agree to our Terms & Conditions
                </Text>
              </View>
            </Animated.View>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 100,
    zIndex: 0,
  },
  backgroundIcon: {
    fontSize: 30,
    color: '#FFD700',
  },
  mainContainer: {
    flex: 1,
    zIndex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#00ff88',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: '#00ff88',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#111111',
    borderRadius: 15,
    padding: 6,
    elevation: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    transition: 'all 0.3s ease',
  },
  activeTab: {
    backgroundColor: '#00ff88',
    elevation: 8,
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabContent: {
    alignItems: 'center',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    fontSize: 22,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  activeTabText: {
    color: '#000000',
    fontWeight: '700',
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333333',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#ffffff',
    elevation: 3,
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: 18,
  },
  authButton: {
    background: 'linear-gradient(135deg, #00ff88, #00cc6a)',
    backgroundColor: '#00ff88',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#00ff88',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  authButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '900',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
  },
  forgotPasswordText: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(26, 26, 26, 0.5)',
    borderRadius: 10,
  },
  termsText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomSpace: {
    height: 50,
  },
});
