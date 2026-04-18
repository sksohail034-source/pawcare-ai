import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch, TextInput } from 'react-native';
import api from '../services/api';
import { requestNotificationPermissions, scheduleRoutineAlarm, cancelAlarm } from '../services/notifications';
import { colors } from '../theme/colors';

export default function RoutinesScreen() {
  const [routines, setRoutines] = useState([]);
  const [petId, setPetId] = useState(null);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('');

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
      }
      // fetch routines regardless of pet right now to ensure alarms show up
      const rResp = await api.get('/routines');
      setRoutines(rResp.data.routines || []);
    } catch (err) {
      console.log('Error fetching routines', err);
    }
  };

  const addCustomAlarm = async () => {
    if (!newTitle || !newTime) {
      Alert.alert('Missing Info', 'Please enter a title and a time (HH:MM).');
      return;
    }
    try {
      const [hour, min] = newTime.split(':');
      if (!hour || !min || isNaN(hour) || isNaN(min)) {
        Alert.alert('Invalid Format', 'Please use HH:MM format like 08:30 or 14:00');
        return;
      }
      
      const d = new Date(); 
      d.setHours(parseInt(hour), parseInt(min), 0, 0);
      
      await scheduleRoutineAlarm('🐾 ' + newTitle, 'It is time for your custom routine.', d);
      
      await api.post('/routines', {
        pet_id: petId || 'default-device-pet',
        title: newTitle,
        type: 'custom',
        time: newTime
      });

      setNewTitle('');
      setNewTime('');
      fetchData();
      Alert.alert('Alarm Set', `Your alarm for ${newTitle} at ${newTime} has been scheduled!`);
    } catch (err) {
      Alert.alert('Error', 'Could not create routine alarm.');
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
      
      <View style={styles.addSection}>
        <Text style={styles.heading}>➕ Add Custom Alarm</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Alarm Title (e.g., Feeding time)" 
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput 
          style={styles.input} 
          placeholder="Time (HH:MM) - 24 hour" 
          value={newTime}
          onChangeText={setNewTime}
          keyboardType="numeric"
          maxLength={5}
        />
        <TouchableOpacity style={styles.btn} onPress={addCustomAlarm}>
          <Text style={styles.btnText}>Set Alarm</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.heading, { marginTop: 30 }]}>Your Smart Care Protocol</Text>
      
      {routines.length === 0 ? (
        <Text style={styles.emptyText}>No routines setup yet.</Text>
      ) : (
        <View>
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
        </View>
      )}
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Natural Pet Care Tips 🌿</Text>
        <Text style={styles.infoText}>• Skin/Fur: Use coconut oil or aloe vera for dry spots.</Text>
        <Text style={styles.infoText}>• Hygiene: Use herbal, neem-based shampoos during bath.</Text>
        <Text style={styles.infoText}>• Nutrition: Avoid harmful foods like chocolate & grapes.</Text>
      </View>
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
  addSection: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#000',
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
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
