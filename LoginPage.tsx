
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginPageProps {
  onLogin: (role: 'admin' | 'user') => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'user' | null>(null);

  const handleLogin = () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select your role first');
      return;
    }

    Alert.alert(
      'Login Successful',
      `Welcome ${selectedRole === 'admin' ? 'Admin' : 'User'}!`,
      [
        {
          text: 'Continue',
          onPress: () => onLogin(selectedRole)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565C0" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Login</Text>
        <Text style={styles.headerSubtitle}>Select your role to continue</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.welcomeSection}>
          <Ionicons name="lock-closed" size={80} color="#1565C0" />
          <Text style={styles.welcomeText}>Welcome!</Text>
          <Text style={styles.descriptionText}>Please select your role to access the system</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleSection}>
          <Text style={styles.sectionTitle}>Select Role</Text>
          
          <TouchableOpacity 
            style={[
              styles.roleButton,
              selectedRole === 'admin' && styles.selectedRole
            ]}
            onPress={() => setSelectedRole('admin')}
          >
            <Ionicons 
              name="shield-checkmark" 
              size={24} 
              color={selectedRole === 'admin' ? '#fff' : '#D32F2F'} 
            />
            <Text style={[
              styles.roleButtonText,
              selectedRole === 'admin' && styles.selectedRoleText
            ]}>
              Admin
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.roleButton,
              selectedRole === 'user' && styles.selectedRole
            ]}
            onPress={() => setSelectedRole('user')}
          >
            <Ionicons 
              name="person" 
              size={24} 
              color={selectedRole === 'user' ? '#fff' : '#1565C0'} 
            />
            <Text style={[
              styles.roleButtonText,
              selectedRole === 'user' && styles.selectedRoleText
            ]}>
              User/Employee
            </Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity 
          style={[
            styles.loginButton,
            !selectedRole && styles.disabledButton
          ]} 
          onPress={handleLogin}
          disabled={!selectedRole}
        >
          <Ionicons name="log-in" size={24} color="#fff" />
          <Text style={styles.loginButtonText}>Login</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  roleSection: {
    width: '100%',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  roleButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    gap: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedRole: {
    backgroundColor: '#1565C0',
    borderColor: '#1565C0',
  },
  roleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedRoleText: {
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#1565C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: 12,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
