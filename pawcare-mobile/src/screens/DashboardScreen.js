import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { colors } from '../theme/colors';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchUser();
    }, [])
  );

  const fetchUser = async () => {
    try {
      const resp = await api.get('/auth/me');
      setUser(resp.data.user);
    } catch (e) {
      console.log('Error fetching user', e);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {user && (
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user.name}!</Text>
          <Text style={styles.subtext}>Free Scans Used: {user.scans_used} / 3</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>What do you want to do?</Text>
      
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AiScanner')}>
          <Text style={styles.cardTitle}>🐾 AI Pet Scan</Text>
          <Text style={styles.cardDesc}>Analyze health & styling</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Routines')}>
          <Text style={styles.cardTitle}>⏰ Routines</Text>
          <Text style={styles.cardDesc}>Set smart care alarms</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Location')}>
          <Text style={styles.cardTitle}>📍 Location</Text>
          <Text style={styles.cardDesc}>View your live GPS</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Donation')}>
          <Text style={styles.cardTitle}>❤️ Donate</Text>
          <Text style={styles.cardDesc}>Support stray animals</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    marginTop: 30,
    marginBottom: 30,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  subtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: colors.surface,
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logoutBtn: {
    marginTop: 30,
    padding: 15,
    backgroundColor: colors.border,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.text,
    fontWeight: 'bold',
  }
});
