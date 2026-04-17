import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import api from '../services/api';
import { requestNotificationPermissions, scheduleRoutineAlarm, cancelAlarm } from '../services/notifications';
import { colors } from '../theme/colors';

export default function RoutinesScreen() {
  const [routines, setRoutines] = useState([]);
  const [petId, setPetId] = useState(null);

  useEffect(() => {
    requestNotificationPermissions();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pResp = await api.get('/pets');
      const pet = pResp.data.pets?.[0];
      if (pet) {
        setPetId(pet.id);
        const rResp = await api.get('/routines');
        setRoutines(rResp.data.routines || []);
      }
    } catch (err) {
      console.log('Error fetching routines', err);
    }
  };

  const addDefaultRoutines = async () => {
    if (!petId) return;
    try {
      const timeStr = '08:00';
      const d = new Date(); d.setHours(8,0,0,0);
      
      await scheduleRoutineAlarm('🐾 Time to feed your pet!', 'Morning feeding routine', d);
      await api.post('/routines', {
        pet_id: petId,
        title: 'Morning Feeding',
        type: 'morning',
        time: timeStr
      });

      const eveningTime = new Date(); eveningTime.setHours(18,0,0,0);
      await scheduleRoutineAlarm('🚿 Grooming time for your pet!', 'Evening grooming routine', eveningTime);
      await api.post('/routines', {
        pet_id: petId,
        title: 'Evening Walk & Grooming',
        type: 'evening',
        time: '18:00'
      });

      fetchData();
    } catch (err) {
      Alert.alert('Error', 'Could not create routines.');
    }
  };

  const toggleRoutine = async (id, currentVal) => {
    try {
      await api.put(`/routines/${id}/toggle`, { enabled: !currentVal });
      fetchData();
    } catch(err) {
      console.log('Error toggling', err);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {routines.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No routines setup yet.</Text>
          <TouchableOpacity style={styles.btn} onPress={addDefaultRoutines}>
            <Text style={styles.btnText}>Generate Smart Schedule</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.heading}>Your Smart Care Protocol</Text>
          {routines.map(r => (
            <View key={r.id} style={styles.card}>
              <View>
                <Text style={styles.title}>{r.title}</Text>
                <Text style={styles.time}>{r.time}</Text>
              </View>
              <Switch 
                value={r.enabled === 1} 
                onValueChange={() => toggleRoutine(r.id, r.enabled === 1)} 
                trackColor={{ false: '#767577', true: colors.primaryLight }}
                thumbColor={r.enabled === 1 ? colors.primaryDark : '#f4f3f4'}
              />
            </View>
          ))}
          
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Natural Pet Care Tips 🌿</Text>
            <Text style={styles.infoText}>• Skin/Fur: Use coconut oil or aloe vera for dry spots.</Text>
            <Text style={styles.infoText}>• Hygiene: Use herbal, neem-based shampoos during bath.</Text>
            <Text style={styles.infoText}>• Nutrition: Avoid harmful foods like chocolate & grapes.</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    color: colors.textSecondary,
    marginTop: 5,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 15,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoBox: {
    marginTop: 30,
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
  },
  infoTitle: {
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  infoText: {
    color: colors.textSecondary,
    marginBottom: 5,
  }
});
