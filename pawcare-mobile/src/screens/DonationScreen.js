import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import api from '../services/api';
import { colors } from '../theme/colors';

export default function DonationScreen() {
  const [amount, setAmount] = useState('5');
  const presetAmounts = ['1', '5', '10', '50'];

  const handleDonate = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid donation amount.');
      return;
    }
    try {
      await api.post('/donations', {
        amount: Number(amount),
        organization: 'Global Stray Animal Rescue',
        message: 'Mobile app donation'
      });
      // In a real app we would redirect to Stripe/PayPal here
      Alert.alert('Thank You!', `Your donation of $${amount} will change a life. ❤️🐾`);
      setAmount('');
    } catch(err) {
      Alert.alert('Error', 'Donation processing failed.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <View style={styles.heroBox}>
         <Text style={styles.heroText}>🐾 Donate for stray pets</Text>
         <Text style={styles.heroSub}>Your small contribution can change a life.</Text>
      </View>

      <Text style={styles.label}>Select Amount ($)</Text>
      <View style={styles.presets}>
        {presetAmounts.map(preset => (
          <TouchableOpacity 
            key={preset} 
            style={[styles.presetBtn, amount === preset && styles.presetActive]}
            onPress={() => setAmount(preset)}
          >
            <Text style={[styles.presetText, amount === preset && styles.presetTextActive]}>
              ${preset}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Or Enter Custom Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g. 20"
      />

      <TouchableOpacity style={styles.donateBtn} onPress={handleDonate}>
        <Text style={styles.donateBtnText}>Donate Now</Text>
      </TouchableOpacity>

      <View style={styles.trustBadge}>
        <Text style={styles.trustText}>🛡️ 100% goes to animal care</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBox: {
    backgroundColor: colors.primaryLight,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  heroText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.primaryDark,
    marginBottom: 10,
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  presetBtn: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  presetActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  presetText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  presetTextActive: {
    color: 'white',
  },
  input: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 18,
    marginBottom: 30,
  },
  donateBtn: {
    backgroundColor: colors.primaryDark,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  donateBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  trustBadge: {
    marginTop: 20,
    alignItems: 'center',
  },
  trustText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
  }
});
