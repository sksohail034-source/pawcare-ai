import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';

const plans = [
  {
    id: 'free',
    name: 'Free Plan',
    price: '$0',
    period: 'Forever',
    priceYearly: '$0',
    scans: '5 Scans',
    scansLabel: 'per month',
    pets: '1 Pet',
    features: [
      '📷 5 AI scans per month',
      '🐾 Add 1 pet profile',
      '💊 Basic health tips',
      '📅 Basic routine reminders',
    ],
    notIncluded: [
      '❌ Unlimited scans',
      '❌ Multiple pets',
      '❌ Advanced grooming',
    ],
    color: '#9CA3AF',
    popular: false,
  },
  {
    id: 'advance',
    name: 'Advance Plan',
    price: '$7',
    period: '/month',
    priceYearly: '$51',
    priceYearlyLabel: '/year (Save $33)',
    scans: 'Unlimited',
    scansLabel: 'scans',
    pets: '1 Pet',
    features: [
      '♾️ Unlimited AI scans',
      '🐾 Add 1 pet profile',
      '✨ Advanced grooming styles',
      '💊 Full health insights',
      '🏃 Personalized exercise plans',
      '📅 Smart routine & alarms',
      '🌿 Natural care protocols',
      '🔔 Push notifications',
    ],
    notIncluded: [
      '❌ Multiple pets',
    ],
    color: '#8B5CF6',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro Family',
    price: '$15',
    period: '/month',
    priceYearly: '$111',
    priceYearlyLabel: '/year (Save $69)',
    scans: 'Unlimited',
    scansLabel: 'scans',
    pets: 'Unlimited',
    features: [
      '♾️ Unlimited AI scans',
      '🐾 Unlimited pet profiles',
      '✨ All advanced grooming styles',
      '💊 Full health insights',
      '🏃 Personalized exercise plans',
      '📅 Smart routine & alarms',
      '🌿 Natural care protocols',
      '🔔 Push notifications',
      '👨‍👩‍👧‍👦 Family sharing (up to 5)',
      '📊 Advanced analytics',
      '🎯 Priority support',
    ],
    notIncluded: [],
    color: '#F59E0B',
    popular: false,
  },
];

export default function SubscriptionsScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleSubscribe = async (plan) => {
    Alert.alert(
      `Subscribe to ${plan.name}?`,
      `You will be charged ${billingCycle === 'monthly' ? plan.price : plan.priceYearly} ${billingCycle === 'monthly' ? plan.period : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: async () => {
            try {
              // In production, integrate with payment gateway (Razorpay, Stripe, etc.)
              await AsyncStorage.setItem('pawcare_plan', plan.id);
              Alert.alert('Success! 🎉', `You are now subscribed to ${plan.name}!`);
              navigation.goBack();
            } catch (e) {
              Alert.alert('Error', 'Failed to update subscription');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>🐾 Upgrade Your Pet Care</Text>
        <Text style={styles.heroSubtitle}>Unlock premium features for your furry friends!</Text>
        
        {/* Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleBtn, billingCycle === 'monthly' && styles.toggleBtnActive]}
            onPress={() => setBillingCycle('monthly')}
          >
            <Text style={[styles.toggleText, billingCycle === 'monthly' && styles.toggleTextActive]}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleBtn, billingCycle === 'yearly' && styles.toggleBtnActive]}
            onPress={() => setBillingCycle('yearly')}
          >
            <Text style={[styles.toggleText, billingCycle === 'yearly' && styles.toggleTextActive]}>Yearly</Text>
          </TouchableOpacity>
        </View>
        {billingCycle === 'yearly' && (
          <Text style={styles.saveBadge}>🎉 Save up to 40%</Text>
        )}
      </View>

      {/* Current Plan */}
      <View style={styles.currentPlanCard}>
        <Text style={styles.currentPlanLabel}>Current Plan</Text>
        <View style={styles.currentPlanInfo}>
          <Text style={styles.currentPlanName}>🐾 Free Plan</Text>
          <Text style={styles.currentPlanScans}>5 scans remaining this month</Text>
        </View>
      </View>

      {/* Plans */}
      {plans.map((plan) => (
        <View 
          key={plan.id} 
          style={[
            styles.planCard, 
            plan.popular && styles.planCardPopular,
            plan.id === 'free' && styles.planCardFree
          ]}
        >
          {plan.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>⭐ Most Popular</Text>
            </View>
          )}

          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planScans}>
                {plan.scans} {plan.scansLabel} • {plan.pets}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.planPrice}>
                {billingCycle === 'monthly' ? plan.price : plan.priceYearly}
              </Text>
              <Text style={styles.planPeriod}>
                {billingCycle === 'monthly' ? plan.period : '/year'}
              </Text>
            </View>
          </View>

          {billingCycle === 'yearly' && plan.priceYearlyLabel && (
            <Text style={styles.yearlyLabel}>{plan.priceYearlyLabel}</Text>
          )}

          {/* Features */}
          <View style={styles.featuresContainer}>
            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>✅</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
            {plan.notIncluded.map((feature, index) => (
              <View key={index} style={[styles.featureItem, styles.featureItemDisabled]}>
                <Text style={styles.featureIconDisabled}>{feature.split(' ')[0]}</Text>
                <Text style={styles.featureTextDisabled}>{feature.substring(2)}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity 
            style={[
              styles.subscribeBtn,
              plan.id === 'free' && styles.subscribeBtnDisabled,
              plan.popular && styles.subscribeBtnPopular,
            ]}
            onPress={() => handleSubscribe(plan)}
            disabled={plan.id === 'free'}
          >
            <Text style={[
              styles.subscribeBtnText,
              plan.id === 'free' && styles.subscribeBtnTextDisabled,
              plan.popular && styles.subscribeBtnTextPopular,
            ]}>
              {plan.id === 'free' ? 'Current Plan' : 'Subscribe Now'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* AdMob Section */}
      <View style={styles.adSection}>
        <Text style={styles.adTitle}>📺 Watch Ads & Earn Rewards</Text>
        <Text style={styles.adDesc}>Support us and get free scans by watching occasional ads!</Text>
        <TouchableOpacity style={styles.adBtn} onPress={() => Alert.alert('AdMob', 'Ad integration coming soon!')}>
          <Text style={styles.adBtnText}>🎥 Watch Ad for +1 Free Scan</Text>
        </TouchableOpacity>
      </View>

      {/* FAQ */}
      <View style={styles.faqSection}>
        <Text style={styles.faqTitle}>❓ Frequently Asked Questions</Text>
        
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
          <Text style={styles.faqAnswer}>Yes! You can cancel your subscription anytime from settings.</Text>
        </View>
        
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>What payment methods are accepted?</Text>
          <Text style={styles.faqAnswer}>We accept UPI, Cards, Net Banking, Wallets and more.</Text>
        </View>
        
        <View style={styles.faqItem}>
          <Text style={styles.faqQuestion}>Is there a free trial?</Text>
          <Text style={styles.faqAnswer}>Yes! Free plan includes 5 scans to try before upgrading.</Text>
        </View>
      </View>

      <Text style={styles.footer}>© 2024 PawCare AI. All rights reserved.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  
  // Hero Section
  heroSection: { paddingVertical: 24, alignItems: 'center' },
  heroTitle: { fontSize: 26, fontWeight: 'bold', color: colors.primaryDark, textAlign: 'center' },
  heroSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, marginBottom: 20 },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 25, padding: 4 },
  toggleBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  toggleBtnActive: { backgroundColor: colors.primary },
  toggleText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  toggleTextActive: { color: 'white' },
  
  saveBadge: { marginTop: 10, backgroundColor: '#FEF3C7', color: '#D97706', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, fontSize: 12, fontWeight: '600' },

  // Current Plan
  currentPlanCard: { backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  currentPlanLabel: { fontSize: 12, color: colors.textSecondary },
  currentPlanInfo: { alignItems: 'flex-end' },
  currentPlanName: { fontSize: 16, fontWeight: 'bold', color: colors.primaryDark },
  currentPlanScans: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  // Plan Cards
  planCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: 'transparent' },
  planCardPopular: { borderColor: '#8B5CF6', elevation: 4 },
  planCardFree: { opacity: 0.8 },
  
  popularBadge: { position: 'absolute', top: -12, right: 20, backgroundColor: '#8B5CF6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  popularText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  planName: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  planScans: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
  
  priceContainer: { alignItems: 'flex-end' },
  planPrice: { fontSize: 24, fontWeight: 'bold', color: colors.primaryDark },
  planPeriod: { fontSize: 12, color: colors.textSecondary },
  yearlyLabel: { fontSize: 12, color: '#10B981', marginBottom: 12, fontWeight: '600' },

  featuresContainer: { marginVertical: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  featureIcon: { fontSize: 14, marginRight: 8 },
  featureText: { fontSize: 13, color: colors.text, flex: 1 },
  
  featureItemDisabled: { opacity: 0.5 },
  featureIconDisabled: { fontSize: 14, marginRight: 8 },
  featureTextDisabled: { fontSize: 13, color: colors.textSecondary, flex: 1 },

  subscribeBtn: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  subscribeBtnDisabled: { backgroundColor: colors.border },
  subscribeBtnPopular: { backgroundColor: '#8B5CF6' },
  subscribeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  subscribeBtnTextDisabled: { color: colors.textSecondary },
  subscribeBtnTextPopular: { color: 'white' },

  // Ad Section
  adSection: { backgroundColor: '#FEF3C7', borderRadius: 20, padding: 20, marginTop: 10, marginBottom: 20 },
  adTitle: { fontSize: 18, fontWeight: 'bold', color: '#D97706', marginBottom: 8 },
  adDesc: { fontSize: 14, color: '#92400E', marginBottom: 16 },
  adBtn: { backgroundColor: '#F59E0B', padding: 14, borderRadius: 12, alignItems: 'center' },
  adBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  // FAQ
  faqSection: { marginBottom: 20 },
  faqTitle: { fontSize: 18, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 16 },
  faqItem: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, marginBottom: 10 },
  faqQuestion: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  faqAnswer: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  footer: { textAlign: 'center', color: colors.textLight, fontSize: 12, marginBottom: 30, marginTop: 10 },
});