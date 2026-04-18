import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors } from '../theme/colors';

const petTypesEmoji = {
  dog: '🐕', cat: '🐱', goat: '🐐', sheep: '🐑', cow: '🐄',
  bird: '🐦', rabbit: '🐰', fish: '🐟', horse: '🐴', pig: '🐖', camel: '🐪', other: '🐾'
};

export default function AiScannerScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [activeTab, setActiveTab] = useState('styling');

  useEffect(() => {
    loadPets();
    loadScanCount();
  }, []);

  const loadPets = async () => {
    try {
      const resp = await api.get('/pets');
      setPets(resp.data.pets || []);
      if (resp.data.pets?.length > 0) {
        setSelectedPet(resp.data.pets[0]);
      }
    } catch (err) {
      console.log('Error loading pets', err);
    }
  };

  const loadScanCount = async () => {
    const count = await AsyncStorage.getItem('pawcare_scan_count');
    const plan = await AsyncStorage.getItem('pawcare_plan');
    if (plan !== 'premium' && plan !== 'paid') {
      setScanCount(parseInt(count || '0'));
    }
  };

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
    const plan = await AsyncStorage.getItem('pawcare_plan');
    if (plan !== 'premium' && plan !== 'paid' && plan !== 'advance' && plan !== 'pro' && scanCount >= 5) {
      Alert.alert('Free Limit Reached! 🚫', 'You have used all 5 free AI scans. Upgrade to Premium for unlimited scans!', [
        { text: 'Later', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => navigation.navigate('Subscriptions') }
      ]);
      return;
    }

    if (!image) {
      Alert.alert('Error', 'Please select a photo first');
      return;
    }

    if (!selectedPet) {
      Alert.alert('Error', 'Please select a pet first');
      return;
    }

    setLoading(true);
    try {
      // Get both styling and health data
      const [styleRes, healthRes] = await Promise.all([
        api.post(`/ai/style/${selectedPet.id}`),
        api.post(`/ai/health/${selectedPet.id}`)
      ]);

      setResult({
        pet: selectedPet,
        styling: styleRes.data.styles || [],
        health: healthRes.data.tips || [],
        analysis: healthRes.data.analysis || {}
      });

      const newCount = scanCount + 1;
      setScanCount(newCount);
      await AsyncStorage.setItem('pawcare_scan_count', String(newCount));
    } catch (error) {
      Alert.alert('Scan Error', error.response?.data?.error || 'Failed to analyze pet image.');
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setImage(null);
    setResult(null);
  };

  const tabs = [
    { id: 'styling', label: '💇 Styling', icon: '✂️' },
    { id: 'health', label: '💊 Health', icon: '🏥' },
    { id: 'exercise', label: '🏃 Exercise', icon: '🎾' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, flexGrow: 1, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>🤖 AI Pet Analysis</Text>
      <Text style={styles.subtitle}>Get personalized styling, health & exercise recommendations</Text>

      <View style={styles.scanLimitBox}>
        <Text style={styles.scanLimitText}>📊 Free Scans: {scanCount}/5</Text>
      </View>

      {/* Pet Selection */}
      {pets.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🐾 Select Pet for Analysis</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petScroll}>
            {pets.map(pet => (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petChip, selectedPet?.id === pet.id && styles.petChipActive]}
                onPress={() => setSelectedPet(pet)}
              >
                <Text style={styles.petChipEmoji}>{petTypesEmoji[pet.type?.toLowerCase()] || '🐾'}</Text>
                <Text style={[styles.petChipName, selectedPet?.id === pet.id && styles.petChipNameActive]}>{pet.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {pets.length === 0 && (
        <TouchableOpacity style={styles.addPetBtn} onPress={() => navigation.navigate('Pets')}>
          <Text style={styles.addPetBtnText}>➕ Add a Pet First</Text>
        </TouchableOpacity>
      )}

      {/* Photo Upload */}
      <TouchableOpacity style={styles.uploadBox} onPress={requestPermissionAndPick}>
        {image ? (
          <Image source={{ uri: image }} style={styles.preview} />
        ) : (
          <View>
            <Text style={styles.uploadEmoji}>📷</Text>
            <Text style={styles.uploadText}>Tap to select pet photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {image && !loading && !result && (
        <TouchableOpacity style={styles.scanBtn} onPress={handleScan}>
          <Text style={styles.scanText}>🔍 Analyze with AI</Text>
        </TouchableOpacity>
      )}

      {loading && (
        <View style={styles.loaderArea}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>🤖 AI is analyzing {selectedPet?.name}...</Text>
          <Text style={styles.loaderSubtext}>Detecting breed, health & creating personalized recommendations</Text>
        </View>
      )}

      {/* Results */}
      {result && (
        <ScrollView style={styles.resultCard} showsVerticalScrollIndicator={true} nestedScrollEnabled={true}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>✨ Analysis Complete for {result.pet.name}</Text>
            <TouchableOpacity onPress={resetScan}>
              <Text style={styles.newScanBtn}>🔄 New Scan</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
                <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Styling Tab */}
          {activeTab === 'styling' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabSectionTitle}>✂️ Recommended Haircuts</Text>
              {result.styling?.map((style, i) => (
                <View key={i} style={styles.recommendCard}>
                  <Text style={styles.recommendTitle}>{style.name}</Text>
                  <Text style={styles.recommendDesc}>{style.description}</Text>
                  <View style={styles.recommendMeta}>
                    <Text>💰 {style.estimatedCost}</Text>
                    <Text>⏱️ {style.estimatedTime}</Text>
                  </View>
                  <View style={styles.tagContainer}>
                    {(style.tags || []).map((tag, j) => (
                      <Text key={j} style={styles.tag}>{tag}</Text>
                    ))}
                  </View>
                </View>
              ))}
              {result.styling?.length === 0 && (
                <Text style={styles.noData}>No styling recommendations available</Text>
              )}
            </View>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabSectionTitle}>💊 Health Tips</Text>
              <View style={styles.healthGrid}>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>🐕 Fur Condition</Text>
                  <Text style={styles.healthValue}>{result.analysis?.furCondition || 'Healthy'}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>🩺 Skin Issues</Text>
                  <Text style={styles.healthValue}>{result.analysis?.skinIssues || 'None'}</Text>
                </View>
                <View style={styles.healthItem}>
                  <Text style={styles.healthLabel}>⚖️ Body Condition</Text>
                  <Text style={styles.healthValue}>{result.analysis?.bodyCondition || 'Healthy'}</Text>
                </View>
              </View>
              <Text style={styles.tabSectionTitle}>🍎 Nutrition Recommendations</Text>
              {result.health?.map((tip, i) => (
                <View key={i} style={styles.tipCard}>
                  <Text style={styles.tipCategory}>{tip.category}</Text>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipText}>{tip.tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Exercise Tab - Pet Specific */}
          {activeTab === 'exercise' && (
            <View style={styles.tabContent}>
              <Text style={styles.tabSectionTitle}>🏃 Exercise & Training for {result.pet.name}</Text>
              
              {result.pet.type?.toLowerCase() === 'dog' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🐕 Daily Walks</Text>
                    <Text style={styles.exerciseText}>30-60 minutes of walking daily. Great for physical health and mental stimulation.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🎾 Fetch & Retrieve</Text>
                    <Text style={styles.exerciseText}>15-20 minutes of fetch to burn energy and strengthen bond.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🧠 Training Sessions</Text>
                    <Text style={styles.exerciseText}>Teach new commands for mental exercise. 10-15 mins daily.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🐕 Dog Park Playdate</Text>
                    <Text style={styles.exerciseText}>Socialize with other dogs at local park 1-2 times per week.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'cat' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🧶 Interactive Play</Text>
                    <Text style={styles.exerciseText}>Use feather wands or laser pointers for 15-20 minutes daily.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>️ Climbing & Perching</Text>
                    <Text style={styles.exerciseText}>Provide cat trees and high perches for jumping exercise.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🧠 Puzzle Feeders</Text>
                    <Text style={styles.exerciseText}>Use puzzle toys to stimulate hunting instincts and mental activity.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🐁 Toy Hunting</Text>
                    <Text style={styles.exerciseText}>Hide toys around house for simulated hunting games.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'bird' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🕊️ Flight Time</Text>
                    <Text style={styles.exerciseText}>Allow supervised flight in safe room for 20-30 minutes daily.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🎵 Music & Singing</Text>
                    <Text style={styles.exerciseText}>Talk and whistle to your bird - social interaction is exercise!</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🌿 Foraging Activities</Text>
                    <Text style={styles.exerciseText}>Hide treats in toys to encourage natural foraging behavior.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🪜 Perch Hopping</Text>
                    <Text style={styles.exerciseText}>Multiple perches at different heights encourage movement.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'goat' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🌿 Grazing & Browsing</Text>
                    <Text style={styles.exerciseText}>Allow 4-6 hours of grazing daily - natural exercise for goats.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🪨 Climbing Structures</Text>
                    <Text style={styles.exerciseText}>Provide rocks and platforms for climbing exercise.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>👥 Herd Interaction</Text>
                    <Text style={styles.exerciseText}>Socialize with other goats - they need companionship.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🎯 Target Training</Text>
                    <Text style={styles.exerciseText}>Teach simple commands using clicker training for mental stimulation.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'sheep' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🌾 Grazing Movement</Text>
                    <Text style={styles.exerciseText}>Rotate pastures to encourage walking while grazing - 4-6 hours daily.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🏃 Flock Walking</Text>
                    <Text style={styles.exerciseText}>Gentle walking with the flock provides natural exercise.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🧠 Handling Practice</Text>
                    <Text style={styles.exerciseText}>Regular gentle handling for grooming builds trust and movement.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'fish' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>💧 Water Current</Text>
                    <Text style={styles.exerciseText}>Adjust filter to create gentle current - fish swim against it for exercise.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🎯 Feeding Time</Text>
                    <Text style={styles.exerciseText}>Scatter food at different tank areas to encourage swimming.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🪸 Tank Enrichment</Text>
                    <Text style={styles.exerciseText}>Add decorations and plants to encourage exploration and movement.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'rabbit' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🐇 Hop Space</Text>
                    <Text style={styles.exerciseText}>Allow 3-4 hours of supervised hopping outside cage daily.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🧱 Tunnel Running</Text>
                    <Text style={styles.exerciseText}>Provide tunnels and hide treats inside for running exercise.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🥬 Veggie Chase</Text>
                    <Text style={styles.exerciseText}>Place vegetables in different spots to encourage hopping around.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'cow' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🌱 Grazing Movement</Text>
                    <Text style={styles.exerciseText}>Allow 6-8 hours of grazing - natural walking exercise.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🚶 Pasture Rotation</Text>
                    <Text style={styles.exerciseText}>Move between pastures to encourage walking and variety.</Text>
                  </View>
                </>
              )}

              {result.pet.type?.toLowerCase() === 'horse' && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🏇 Riding Exercise</Text>
                    <Text style={styles.exerciseText}>30-60 minutes of riding 3-5 times per week.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🐴 Turnout Time</Text>
                    <Text style={styles.exerciseText}>Allow free movement in paddock for 4-6 hours daily.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🎯 Lunging</Text>
                    <Text style={styles.exerciseText}>Ground training and lunging for exercise without riding.</Text>
                  </View>
                </>
              )}

              {['pig', 'camel', 'other'].includes(result.pet.type?.toLowerCase()) && (
                <>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🏃 Free Movement</Text>
                    <Text style={styles.exerciseText}>Allow supervised exploration time outside enclosure daily.</Text>
                  </View>
                  <View style={styles.exerciseCard}>
                    <Text style={styles.exerciseTitle}>🧠 Training Games</Text>
                    <Text style={styles.exerciseText}>Simple commands and tricks for mental stimulation.</Text>
                  </View>
                </>
              )}
            </View>
          )}

          <Text style={styles.disclaimer}>⚠️ Please consult a veterinarian for serious health issues</Text>
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.primaryDark, textAlign: 'center', marginTop: 10 },
  subtitle: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', marginTop: 5, marginBottom: 15 },
  
  scanLimitBox: { backgroundColor: colors.surface, padding: 10, borderRadius: 10, marginBottom: 15, alignItems: 'center' },
  scanLimitText: { fontSize: 14, color: colors.primaryDark, fontWeight: '600' },
  
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 10 },
  petScroll: { marginBottom: 10 },
  petChip: { alignItems: 'center', padding: 12, marginRight: 10, borderRadius: 12, backgroundColor: colors.surface, minWidth: 70 },
  petChipActive: { backgroundColor: colors.primary },
  petChipEmoji: { fontSize: 24, marginBottom: 4 },
  petChipName: { fontSize: 12, color: colors.textSecondary },
  petChipNameActive: { color: 'white', fontWeight: '600' },
  
  addPetBtn: { backgroundColor: colors.primaryLight, padding: 15, borderRadius: 12, marginBottom: 15, alignItems: 'center' },
  addPetBtnText: { color: colors.primaryDark, fontWeight: '600' },

  uploadBox: { height: 220, backgroundColor: '#E8F5E9', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#C8E6C9', borderStyle: 'dashed', overflow: 'hidden', marginBottom: 15 },
  uploadEmoji: { fontSize: 40, marginBottom: 10 },
  uploadText: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  preview: { width: '100%', height: '100%' },

  scanBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 15, alignItems: 'center', marginBottom: 20 },
  scanText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  loaderArea: { alignItems: 'center', marginVertical: 30 },
  loaderText: { marginTop: 15, fontSize: 16, fontWeight: '600', color: colors.primaryDark },
  loaderSubtext: { marginTop: 5, fontSize: 13, color: colors.textSecondary, textAlign: 'center' },

  resultCard: { backgroundColor: colors.surface, padding: 20, borderRadius: 20, elevation: 3, maxHeight: 600 },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', color: colors.success, flex: 1 },
  newScanBtn: { color: colors.primary, fontWeight: '600', fontSize: 14 },

  tabs: { flexDirection: 'row', marginBottom: 20, backgroundColor: colors.background, borderRadius: 12, padding: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10 },
  tabActive: { backgroundColor: colors.primary },
  tabIcon: { fontSize: 16, marginRight: 4 },
  tabLabel: { fontSize: 13, color: colors.textSecondary },
  tabLabelActive: { color: 'white', fontWeight: '600' },

  tabContent: { marginTop: 10 },
  tabSectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 12 },

  recommendCard: { backgroundColor: colors.background, padding: 14, borderRadius: 12, marginBottom: 10 },
  recommendTitle: { fontSize: 15, fontWeight: 'bold', color: colors.text },
  recommendDesc: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  recommendMeta: { flexDirection: 'row', marginTop: 8, gap: 15, fontSize: 12, color: colors.textSecondary },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 },
  tag: { backgroundColor: colors.primaryLight, color: colors.primaryDark, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 11 },
  noData: { textAlign: 'center', color: colors.textSecondary, padding: 20 },

  healthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 15 },
  healthItem: { backgroundColor: colors.background, padding: 12, borderRadius: 10, width: '48%' },
  healthLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  healthValue: { fontSize: 14, fontWeight: '600', color: colors.primaryDark },

  tipCard: { backgroundColor: colors.background, padding: 12, borderRadius: 10, marginBottom: 10 },
  tipCategory: { fontSize: 11, color: colors.primary, fontWeight: '600', textTransform: 'uppercase', marginBottom: 4 },
  tipTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  tipText: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },

  exerciseCard: { backgroundColor: colors.background, padding: 14, borderRadius: 12, marginBottom: 10 },
  exerciseTitle: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  exerciseText: { fontSize: 13, color: colors.textSecondary },

  disclaimer: { marginTop: 20, fontSize: 12, color: colors.warning, textAlign: 'center' },
});