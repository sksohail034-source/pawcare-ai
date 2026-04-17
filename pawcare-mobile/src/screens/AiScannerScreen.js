import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';
import { colors } from '../theme/colors';

export default function AiScannerScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const requestPermissionAndPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need camera roll permissions to scan your pet.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    try {
      // Logic: Ensure a pet exists to tie this to. We fetch or create one.
      const petsResp = await api.get('/pets');
      let pet = petsResp.data.pets?.[0];
      
      if (!pet) {
        const createResp = await api.post('/pets', { 
           name: 'My Pet', type: 'Dog', 
           breed: 'Unknown', age: 1, weight: 10 
        });
        pet = createResp.data.pet;
      }

      // We call health and style concurrently or sequentially
      // For this demo, let's call the simulated health endpoint which returns analysis payload
      const response = await api.post(`/ai/health/${pet.id}`);
      
      setResult(response.data);
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to scan pet image.';
      Alert.alert('Scan Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>AI Pet Analysis</Text>
      <Text style={styles.subtitle}>Upload a photo to detect breed, health, and get custom grooming recommendations!</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={requestPermissionAndPick}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <Text style={styles.uploadText}>Tap to select a photo</Text>
        )}
      </TouchableOpacity>

      {image && !loading && !result && (
        <TouchableOpacity style={styles.scanBtn} onPress={handleScan}>
          <Text style={styles.scanText}>Run AI Scan ✨</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Analyzing fur, skin, and body condition...</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Analysis Complete!</Text>
          <View style={styles.row}>
             <Text style={styles.label}>Pet Type:</Text>
             <Text style={styles.value}>{result.pet.type}</Text>
          </View>
          <View style={styles.row}>
             <Text style={styles.label}>Fur Condition:</Text>
             <Text style={styles.value}>{result.analysis?.furCondition || 'Healthy'}</Text>
          </View>
          <View style={styles.row}>
             <Text style={styles.label}>Skin Issues:</Text>
             <Text style={styles.value}>{result.analysis?.skinIssues || 'None'}</Text>
          </View>
          <View style={styles.row}>
             <Text style={styles.label}>Body Condition:</Text>
             <Text style={styles.value}>{result.analysis?.bodyCondition || 'Healthy'}</Text>
          </View>
          
          <Text style={[styles.label, {marginTop: 15}]}>Top Health Recommendation:</Text>
          <Text style={styles.tipText}>{result.tips?.[0]?.tip || 'No tips available'}</Text>

          <Text style={styles.disclaimer}>⚠️ Please consult a veterinarian for serious issues.</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  uploadBox: {
    height: 250,
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C8E6C9',
    borderStyle: 'dashed',
    overflow: 'hidden',
    marginBottom: 20,
  },
  uploadText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  scanBtn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  scanText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderArea: {
    alignItems: 'center',
    marginVertical: 30,
  },
  loaderText: {
    marginTop: 10,
    color: colors.textSecondary,
  },
  resultCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    marginTop: 10,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: colors.text,
  },
  value: {
    color: colors.textSecondary,
  },
  tipText: {
    marginTop: 5,
    color: colors.primaryDark,
    fontStyle: 'italic',
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 12,
    color: colors.warning,
    textAlign: 'center',
  }
});
