import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors } from '../theme/colors';

const petTypes = [
  { id: 'dog', name: 'Dog', emoji: '🐕', breeds: ['Labrador', 'Golden Retriever', 'German Shepherd', 'Bulldog', 'Poodle', 'Beagle', 'Boxer', 'Husky', 'Shih Tzu', 'Pitbull', 'Indian Native', 'Other'] },
  { id: 'cat', name: 'Cat', emoji: '🐱', breeds: ['Persian', 'Maine Coon', 'Siamese', 'British Shorthair', 'Bengal', 'Ragdoll', 'Sphynx', 'Indian Street Cat', 'Other'] },
  { id: 'goat', name: 'Goat', emoji: '🐐', breeds: ['Indian Goat', 'Boer', 'Nubian', 'Saanen', 'Alpine', 'Local Breed', 'Other'] },
  { id: 'sheep', name: 'Sheep', emoji: '🐑', breeds: ['Merino', 'Dorper', 'Suffolk', 'Local Breed', 'Other'] },
  { id: 'cow', name: 'Cow', emoji: '🐄', breeds: ['Indian Cow', 'Buffalo', 'Holstein', 'Jersey', 'Gir', 'Sahiwal', 'Local Breed', 'Other'] },
  { id: 'bird', name: 'Bird', emoji: '🐦', breeds: ['Parrot', 'Parakeet', 'Cockatiel', 'Canary', 'Pigeon', 'Dove', 'Lovebird', 'Other'] },
  { id: 'rabbit', name: 'Rabbit', emoji: '🐰', breeds: ['Holland Lop', 'Mini Rex', 'Lionhead', 'Flemish Giant', 'Local Rabbit', 'Other'] },
  { id: 'fish', name: 'Fish', emoji: '🐟', breeds: ['Goldfish', 'Betta', 'Guppy', 'Tetra', 'Oscar', 'Koi', 'Other'] },
  { id: 'horse', name: 'Horse', emoji: '🐴', breeds: ['Arabian', 'Thoroughbred', 'Quarter Horse', 'Local Breed', 'Other'] },
  { id: 'pig', name: 'Pig', emoji: '🐖', breeds: ['Duroc', 'Yorkshire', 'Hampshire', 'Local Breed', 'Other'] },
  { id: 'camel', name: 'Camel', emoji: '🐪', breeds: ['Dromedary', 'Bactrian', 'Local Breed', 'Other'] },
  { id: 'other', name: 'Other', emoji: '🐾', breeds: ['Other'] },
];

export default function PetsScreen({ navigation }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  
  // Form state
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPetsFromStorage();
    fetchPets();
  }, []);

  const loadPetsFromStorage = async () => {
    try {
      const savedPets = await AsyncStorage.getItem('pawcare_pets');
      if (savedPets) {
        const parsed = JSON.parse(savedPets);
        if (parsed.length > 0) {
          setPets(parsed);
          setLoading(false);
        }
      }
    } catch (e) {
      console.log('Error loading from storage', e);
    }
  };

  const fetchPets = async () => {
    try {
      const resp = await api.get('/pets');
      setPets(resp.data.pets || []);
      await AsyncStorage.setItem('pawcare_pets', JSON.stringify(resp.data.pets || []));
    } catch (err) {
      console.log('Error fetching pets', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSelectedType(null);
    setBreed('');
    setAge('');
    setWeight('');
    setNotes('');
    setPhoto(null);
    setEditingPet(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (pet) => {
    const petType = petTypes.find(t => t.id === pet.type?.toLowerCase()) || petTypes[0];
    setName(pet.name || '');
    setSelectedType(petType);
    setBreed(pet.breed || '');
    setAge(String(pet.age || ''));
    setWeight(String(pet.weight || ''));
    setNotes(pet.notes || '');
    setPhoto(pet.photo || null);
    setEditingPet(pet);
    setShowModal(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera roll permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const savePet = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter pet name');
      return;
    }
    if (!selectedType) {
      Alert.alert('Error', 'Please select pet type');
      return;
    }

    // Check pet limit based on subscription
    const plan = await AsyncStorage.getItem('pawcare_plan');
    const isFree = !plan || plan === 'free';
    const isAdvance = plan === 'advance';
    
    if (isFree && pets.length >= 1) {
      Alert.alert('Pet Limit Reached! 🐾', 'Free plan allows only 1 pet. Upgrade to Advance or Pro for unlimited pets!', [
        { text: 'Later', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => navigation.navigate('Subscriptions') }
      ]);
      return;
    }
    
    if (isAdvance && pets.length >= 1) {
      Alert.alert('Pet Limit Reached! 🐾', 'Advance plan allows only 1 pet. Upgrade to Pro Family for unlimited pets!', [
        { text: 'Later', style: 'cancel' },
        { text: 'Upgrade Now', onPress: () => navigation.navigate('Subscriptions') }
      ]);
      return;
    }

    setSaving(true);
    try {
      const petData = {
        name: name.trim(),
        type: selectedType.id,
        breed: breed || selectedType.breeds[0],
        age: parseFloat(age) || 0,
        weight: parseFloat(weight) || 0,
        notes: notes.trim(),
        photo: photo,
      };

      if (editingPet) {
        await api.put(`/pets/${editingPet.id}`, petData);
        Alert.alert('Success', 'Pet updated successfully!');
      } else {
        await api.post('/pets', petData);
        Alert.alert('Success', 'Pet added successfully!');
      }

      setShowModal(false);
      fetchPets();
      resetForm();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to save pet');
    } finally {
      setSaving(false);
    }
  };

  const deletePet = (pet) => {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to delete ${pet.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/pets/${pet.id}`);
              fetchPets();
              Alert.alert('Success', 'Pet deleted');
            } catch (err) {
              Alert.alert('Error', 'Failed to delete pet');
            }
          },
        },
      ]
    );
  };

  const analyzeWithAI = (pet) => {
    AsyncStorage.setItem('selectedPetForAI', JSON.stringify(pet));
    navigation.navigate('AiScanner');
  };

  const renderPetCard = (pet) => {
    const petType = petTypes.find(t => t.id === pet.type?.toLowerCase()) || petTypes[11];
    return (
      <View key={pet.id} style={styles.card}>
        <View style={styles.cardHeader}>
          {pet.photo ? (
            <Image source={{ uri: pet.photo }} style={styles.petImage} />
          ) : (
            <View style={styles.petImagePlaceholder}>
              <Text style={styles.petEmoji}>{petType.emoji}</Text>
            </View>
          )}
          <View style={styles.cardInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petType}>{petType.emoji} {petType.name} • {pet.breed || 'Unknown'}</Text>
            {pet.age > 0 && <Text style={styles.petDetails}>Age: {pet.age} years</Text>}
            {pet.weight > 0 && <Text style={styles.petDetails}>Weight: {pet.weight} kg</Text>}
          </View>
        </View>
        {pet.notes ? (
          <Text style={styles.petNotes} numberOfLines={2}>📝 {pet.notes}</Text>
        ) : null}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(pet)}>
            <Text style={styles.actionBtnText}>✏️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.aiBtn]} onPress={() => analyzeWithAI(pet)}>
            <Text style={styles.actionBtnText}>🤖 AI Analyze</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => deletePet(pet)}>
            <Text style={styles.actionBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>My Pets 🐾</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
          <Text style={styles.addBtnText}>+ Add Pet</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}><Text style={styles.infoText}>Loading...</Text></View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={styles.emptyText}>No pets added yet</Text>
          <Text style={styles.emptySubtext}>Add your first pet to get AI-powered care recommendations</Text>
          <TouchableOpacity style={styles.btn} onPress={openAddModal}>
            <Text style={styles.btnText}>Add Your First Pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={item => item.id}
          renderItem={({ item }) => renderPetCard(item)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingPet ? 'Edit Pet' : 'Add New Pet'}</Text>

              {/* Photo */}
              <TouchableOpacity style={styles.photoPicker} onPress={pickImage}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoPreview} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Text style={styles.photoPlaceholderText}>📷</Text>
                    <Text style={styles.photoPlaceholderText2}>Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Name */}
              <Text style={styles.label}>Pet Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter pet name"
                value={name}
                onChangeText={setName}
              />

              {/* Pet Type */}
              <Text style={styles.label}>Pet Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {petTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeBtn, selectedType?.id === type.id && styles.typeBtnActive]}
                    onPress={() => { setSelectedType(type); setBreed(type.breeds[0]); }}
                  >
                    <Text style={styles.typeEmoji}>{type.emoji}</Text>
                    <Text style={[styles.typeName, selectedType?.id === type.id && styles.typeNameActive]}>{type.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Breed */}
              <Text style={styles.label}>Breed</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.breedScroll}>
                {selectedType?.breeds.map(b => (
                  <TouchableOpacity
                    key={b}
                    style={[styles.breedBtn, breed === b && styles.breedBtnActive]}
                    onPress={() => setBreed(b)}
                  >
                    <Text style={[styles.breedText, breed === b && styles.breedTextActive]}>{b}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Age & Weight */}
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Age (years)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 2"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 10"
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Notes */}
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any special notes about your pet..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowModal(false); resetForm(); }}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={savePet} disabled={saving}>
                  <Text style={styles.saveBtnText}>{saving ? 'Saving...' : (editingPet ? 'Update Pet' : 'Add Pet')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10 },
  heading: { fontSize: 24, fontWeight: 'bold', color: colors.primaryDark },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: 'white', fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 20, paddingTop: 0 },
  infoText: { fontSize: 16, color: colors.textSecondary },
  
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 60, marginBottom: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 30 },
  btn: { backgroundColor: colors.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 25 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 15, elevation: 2 },
  cardHeader: { flexDirection: 'row', marginBottom: 10 },
  petImage: { width: 70, height: 70, borderRadius: 35 },
  petImagePlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  petEmoji: { fontSize: 32 },
  cardInfo: { marginLeft: 12, flex: 1 },
  petName: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark },
  petType: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },
  petDetails: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  petNotes: { fontSize: 13, color: colors.textSecondary, marginBottom: 10, fontStyle: 'italic' },
  cardActions: { flexDirection: 'row', marginTop: 10, gap: 10 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: colors.background, borderRadius: 8 },
  aiBtn: { backgroundColor: '#E8F5E9' },
  deleteBtn: { backgroundColor: '#FFEBEE' },
  actionBtnText: { fontSize: 13, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: colors.primaryDark, textAlign: 'center', marginBottom: 20 },

  photoPicker: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 20, overflow: 'hidden' },
  photoPreview: { width: 100, height: 100 },
  photoPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: colors.border, borderStyle: 'dashed' },
  photoPlaceholderText: { fontSize: 30 },
  photoPlaceholderText2: { fontSize: 12, color: colors.textSecondary },

  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.background, padding: 14, borderRadius: 12, fontSize: 16, color: '#000', borderWidth: 1, borderColor: colors.border },
  textArea: { height: 80, textAlignVertical: 'top' },

  typeScroll: { marginBottom: 10 },
  typeBtn: { alignItems: 'center', padding: 12, marginRight: 10, borderRadius: 12, backgroundColor: colors.background, minWidth: 70 },
  typeBtnActive: { backgroundColor: colors.primary },
  typeEmoji: { fontSize: 24, marginBottom: 4 },
  typeName: { fontSize: 12, color: colors.textSecondary },
  typeNameActive: { color: 'white' },

  breedScroll: { marginBottom: 10 },
  breedBtn: { paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: colors.background },
  breedBtnActive: { backgroundColor: colors.primaryLight },
  breedText: { fontSize: 13, color: colors.textSecondary },
  breedTextActive: { color: colors.primaryDark, fontWeight: '600' },

  row: { flexDirection: 'row', gap: 15 },
  halfInput: { flex: 1 },

  modalButtons: { flexDirection: 'row', marginTop: 20, gap: 15 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center' },
  cancelBtnText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
  saveBtn: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
});