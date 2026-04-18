import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

const protocols = {
  skin: [
    { title: 'Coconut Oil Treatment', description: 'Apply warm coconut oil to dry skin. Leave for 15 mins, then rinse.', icon: '🥥' },
    { title: 'Aloe Vera Gel', description: 'Apply pure aloe vera gel to irritated skin. Soothes rashes and dryness.', icon: '🌿' },
    { title: 'Oatmeal Bath', description: 'Blend oats into powder, mix with warm water. Soothes itchy skin.', icon: '🌾' },
  ],
  hygiene: [
    { title: 'Herbal Shampoo', description: 'Use shampoo with neem, rosemary, or lavender. Natural cleansing.', icon: '🧴' },
    { title: 'Neem-Based Cleaning', description: 'Neem water spray for external cleaning. Fights bacteria.', icon: '🌱' },
    { title: 'Ear Cleaning', description: 'Use vet-approved ear cleaner. Never use cotton buds deep inside.', icon: '👂' },
  ],
  nutrition: [
    { title: 'High Protein Diet', description: 'Dogs: chicken, beef, fish. Cats: mostly animal protein.', icon: '🍖' },
    { title: 'Clean Water Schedule', description: 'Fresh water 2-3 times daily. Clean bowl every day.', icon: '💧' },
    { title: 'Avoid Harmful Foods', description: 'NO: chocolate, grapes, onions, xylitol, caffeine.', icon: '🚫' },
  ],
};

const warnings = [
  'Consult a veterinarian for serious issues',
  'Test natural remedies on small area first',
  'Do not overfeed - follow portion guidelines',
  'Never give human medications to pets',
  'Keep all cleaning products out of reach',
];

export default function CareProtocolsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('skin');

  const tabs = [
    { id: 'skin', label: '🌿 Skin & Fur' },
    { id: 'hygiene', label: '💧 Hygiene' },
    { id: 'nutrition', label: '🍖 Nutrition' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.title}>🌿 Natural Care Protocols</Text>
      <Text style={styles.subtitle}>Safe, natural remedies for your pet's wellbeing</Text>

      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {protocols[activeTab].map((item, index) => (
        <View key={index} style={styles.protocolCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.protocolTitle}>{item.title}</Text>
            <Text style={styles.protocolDesc}>{item.description}</Text>
          </View>
        </View>
      ))}

      <View style={styles.disclaimerBox}>
        <View style={styles.disclaimerHeader}>
          <Text style={styles.disclaimerTitle}>⚠️ Important Safety Notes</Text>
        </View>
        {warnings.map((warning, index) => (
          <View key={index} style={styles.warningItem}>
            <Text style={styles.warningIcon}>✓</Text>
            <Text style={styles.warningText}>{warning}</Text>
          </View>
        ))}
      </View>
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
    marginTop: 5,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.surface,
  },
  protocolCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  protocolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  protocolDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disclaimerBox: {
    marginTop: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  disclaimerHeader: {
    marginBottom: 12,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  warningIcon: {
    color: colors.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 13,
    color: colors.text,
    flex: 1,
  },
});