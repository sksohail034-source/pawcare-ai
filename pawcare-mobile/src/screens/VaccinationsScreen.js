import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors } from '../theme/colors';

const vaccineTypes = [
  { id: 'dhpp', name: 'DHPP (Distemper)', type: 'dog', interval: 1 },
  { id: 'rabies', name: 'Rabies', type: 'all', interval: 1 },
  { id: 'bordetella', name: 'Bordetella (Kennel Cough)', type: 'dog', interval: 1 },
  { id: 'leptospirosis', name: 'Leptospirosis', type: 'dog', interval: 1 },
  { id: 'lyme', name: 'Lyme Disease', type: 'dog', interval: 1 },
  { id: 'fvr', name: 'FVR (Feline Viral Rhinotracheitis)', type: 'cat', interval: 1 },
  { id: 'fcp', name: 'FCP (Feline Calicivirus)', type: 'cat', interval: 1 },
  { id: 'fiv', name: 'FIV (Feline Immunodeficiency)', type: 'cat', interval: 1 },
  { id: 'felv', name: 'FeLV (Feline Leukemia)', type: 'cat', interval: 1 },
  { id: 'goat_enterotoxemia', name: 'Enterotoxemia (Clostridium)', type: 'goat', interval: 6 },
  { id: 'goat_ppr', name: 'PPR (Peste des Petits Ruminants)', type: 'goat', interval: 1 },
  { id: 'sheep_clostridial', name: 'Clostridial Vaccination', type: 'sheep', interval: 6 },
  { id: 'fowl_pox', name: 'Fowl Pox', type: 'bird', interval: 1 },
  { id: 'newcastle', name: 'Newcastle Disease', type: 'bird', interval: 1 },
  { id: 'fish_khv', name: 'Koi Herpes Virus', type: 'fish', interval: 1 },
  { id: 'rabbit_myxi', name: 'Myxomatosis', type: 'rabbit', interval: 1 },
  { id: 'horse_equine', name: 'Equine Influenza', type: 'horse', interval: 1 },
  { id: 'custom', name: 'Custom Vaccine', type: 'all', interval: 1 },
];

export default function VaccinationsScreen({ navigation }) {
  const [vaccines, setVaccines] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVax, setEditingVax] = useState(null);

  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedVaxType, setSelectedVaxType] = useState(null);
  const [dateGiven, setDateGiven] = useState(new Date().toISOString().split('T')[0]);
  const [nextDue, setNextDue] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vaxResp, petResp] = await Promise.all([
        api.get('/vaccinations'),
        api.get('/pets')
      ]);
      setVaccines(vaxResp.data.vaccinations || []);
      setPets(petResp.data.pets || []);
    } catch (err) {
      console.log('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPet(null);
    setSelectedVaxType(null);
    setDateGiven(new Date().toISOString().split('T')[0]);
    setNextDue('');
    setNotes('');
    setEditingVax(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (vax) => {
    const pet = pets.find(p => p.id === vax.pet_id) || pets[0];
    const vaxType = vaccineTypes.find(v => v.id === vax.vaccine_type) || vaccineTypes[vaccineTypes.length - 1];
    setSelectedPet(pet);
    setSelectedVaxType(vaxType);
    setDateGiven(vax.date_given || '');
    setNextDue(vax.next_due || '');
    setNotes(vax.notes || '');
    setEditingVax(vax);
    setShowModal(true);
  };

  const calculateNextDue = (type, date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + type.interval);
    return d.toISOString().split('T')[0];
  };

  const saveVaccine = async () => {
    if (!selectedPet) {
      Alert.alert('Error', 'Please select a pet');
      return;
    }
    if (!selectedVaxType) {
      Alert.alert('Error', 'Please select a vaccine');
      return;
    }

    const nextDueDate = nextDue || calculateNextDue(selectedVaxType, dateGiven);

    setSaving(true);
    try {
      const vaxData = {
        pet_id: selectedPet.id,
        vaccine_name: selectedVaxType.name,
        vaccine_type: selectedVaxType.id,
        date_given: dateGiven,
        next_due: nextDueDate,
        notes: notes,
        status: new Date(nextDueDate) > new Date() ? 'pending' : 'completed'
      };

      if (editingVax) {
        await api.put(`/vaccinations/${editingVax.id}`, vaxData);
        Alert.alert('Success', 'Vaccination updated!');
      } else {
        await api.post('/vaccinations', vaxData);
        Alert.alert('Success', 'Vaccination added!');
      }

      setShowModal(false);
      fetchData();
      resetForm();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const deleteVaccine = (vax) => {
    Alert.alert('Delete Vaccination', `Delete ${vax.vaccine_name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/vaccinations/${vax.id}`);
            fetchData();
            Alert.alert('Success', 'Deleted');
          } catch (err) {
            Alert.alert('Error', 'Failed to delete');
          }
        },
      },
    ]);
  };

  const getPetName = (petId) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || 'Unknown';
  };

  const getStatusColor = (nextDue) => {
    if (!nextDue) return colors.textSecondary;
    const dueDate = new Date(nextDue);
    const today = new Date();
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return '#EF4444'; // Overdue - red
    if (diffDays < 30) return '#F59E0B'; // Due soon - orange
    return '#10B981'; // OK - green
  };

  const pendingCount = vaccines.filter(v => {
    if (!v.next_due) return false;
    return new Date(v.next_due) <= new Date();
  }).length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={styles.header}>
          <Text style={styles.heading}>💉 Vaccinations</Text>
          <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {pendingCount > 0 && (
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>⚠️ {pendingCount} vaccination(s) due or overdue!</Text>
          </View>
        )}

        {loading ? (
          <Text style={styles.infoText}>Loading...</Text>
        ) : vaccines.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💉</Text>
            <Text style={styles.emptyText}>No vaccinations recorded</Text>
            <Text style={styles.emptySubtext}>Add your pet's vaccination records to track reminders</Text>
            <TouchableOpacity style={styles.btn} onPress={openAddModal}>
              <Text style={styles.btnText}>Add First Vaccination</Text>
            </TouchableOpacity>
          </View>
        ) : (
          vaccines.map(v => (
            <View key={v.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.cardInfo}>
                  <Text style={styles.petName}>🐾 {getPetName(v.pet_id)}</Text>
                  <Text style={styles.vaxName}>{v.vaccine_name}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(v.next_due) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(v.next_due) }]}>
                    {new Date(v.next_due || '2099-01-01') <= new Date() ? 'Due' : 'OK'}
                  </Text>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.detailText}>📅 Given: {v.date_given || 'N/A'}</Text>
                <Text style={styles.detailText}>⏰ Next: {v.next_due || 'Unknown'}</Text>
                {v.notes ? <Text style={styles.notesText}>📝 {v.notes}</Text> : null}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => openEditModal(v)}>
                  <Text style={styles.actionBtnText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => deleteVaccine(v)}>
                  <Text style={styles.actionBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingVax ? 'Edit Vaccination' : 'Add Vaccination'}</Text>

              <Text style={styles.label}>Select Pet *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petScroll}>
                {pets.map(pet => (
                  <TouchableOpacity
                    key={pet.id}
                    style={[styles.petChip, selectedPet?.id === pet.id && styles.petChipActive]}
                    onPress={() => setSelectedPet(pet)}
                  >
                    <Text style={styles.petChipName}>{pet.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Vaccine Type *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vaxScroll}>
                {vaccineTypes.filter(v => !selectedPet || v.type === 'all' || v.type === selectedPet.type?.toLowerCase()).map(v => (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.vaxChip, selectedVaxType?.id === v.id && styles.vaxChipActive]}
                    onPress={() => {
                      setSelectedVaxType(v);
                      setNextDue(calculateNextDue(v, dateGiven));
                    }}
                  >
                    <Text style={[styles.vaxChipName, selectedVaxType?.id === v.id && styles.vaxChipNameActive]}>{v.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Date Given</Text>
              <TextInput
                style={styles.input}
                value={dateGiven}
                onChangeText={setDateGiven}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.label}>Next Due Date</Text>
              <TextInput
                style={styles.input}
                value={nextDue}
                onChangeText={setNextDue}
                placeholder="YYYY-MM-DD"
              />

              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special notes..."
                multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowModal(false); resetForm(); }}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={saveVaccine} disabled={saving}>
                  <Text style={styles.saveBtnText}>{saving ? 'Saving...' : (editingVax ? 'Update' : 'Add')}</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  heading: { fontSize: 24, fontWeight: 'bold', color: colors.primaryDark },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  addBtnText: { color: 'white', fontWeight: '600' },

  alertBox: { backgroundColor: '#FEF3C7', padding: 12, borderRadius: 10, marginBottom: 15 },
  alertText: { color: '#D97706', fontWeight: '600' },

  infoText: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 50 },
  emptyState: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 50, marginBottom: 15 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark },
  emptySubtext: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  btn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 25 },
  btnText: { color: 'white', fontWeight: 'bold' },

  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  cardInfo: { flex: 1 },
  petName: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  vaxName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  cardDetails: { marginBottom: 10 },
  detailText: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  notesText: { fontSize: 12, color: colors.textSecondary, fontStyle: 'italic', marginTop: 4 },
  cardActions: { flexDirection: 'row', gap: 10 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: colors.background, borderRadius: 8 },
  actionBtnText: { fontSize: 13 },
  deleteBtn: { backgroundColor: '#FFEBEE' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, maxHeight: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.primaryDark, textAlign: 'center', marginBottom: 20 },

  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8, marginTop: 12 },
  petScroll: { marginBottom: 5 },
  petChip: { paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, borderRadius: 20, backgroundColor: colors.background },
  petChipActive: { backgroundColor: colors.primary },
  petChipName: { fontSize: 13, color: colors.textSecondary },
  
  vaxScroll: { marginBottom: 5 },
  vaxChip: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderRadius: 12, backgroundColor: colors.background },
  vaxChipActive: { backgroundColor: colors.primaryLight },
  vaxChipName: { fontSize: 12, color: colors.textSecondary },
  vaxChipNameActive: { color: colors.primaryDark, fontWeight: '600' },

  input: { backgroundColor: colors.background, padding: 12, borderRadius: 10, fontSize: 14, borderWidth: 1, borderColor: colors.border },
  textArea: { height: 80, textAlignVertical: 'top' },

  modalButtons: { flexDirection: 'row', marginTop: 20, gap: 15 },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center' },
  cancelBtnText: { fontSize: 16, color: colors.textSecondary },
  saveBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  saveBtnText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
});