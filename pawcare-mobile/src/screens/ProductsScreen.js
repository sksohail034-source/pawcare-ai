import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import { colors } from '../theme/colors';

export default function ProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const resp = await api.get('/products');
      setProducts(resp.data.products || []);
    } catch (err) {
      console.log('Error fetching products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (prodName) => {
    Alert.alert('Checkout Affiliate', `Redirecting to purchase ${prodName}...`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      <Text style={styles.heading}>Recommended Products 🛍️</Text>
      
      {loading ? (
        <Text style={styles.infoText}>Loading shop...</Text>
      ) : products.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No products available right now.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {products.map(p => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.emoji}>{p.image}</Text>
              <Text style={styles.prodName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.price}>${p.price}</Text>
              <TouchableOpacity style={styles.btn} onPress={() => handleBuy(p.name)}>
                <Text style={styles.btnText}>View Deal</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heading: { fontSize: 24, fontWeight: 'bold', color: colors.primaryDark, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    backgroundColor: colors.surface, width: '48%', padding: 15, borderRadius: 12, marginBottom: 15, elevation: 2, alignItems: 'center'
  },
  emoji: { fontSize: 40, marginBottom: 10 },
  prodName: { fontSize: 12, fontWeight: 'bold', color: colors.text, marginBottom: 5, textAlign: 'center' },
  price: { fontSize: 14, color: '#2E7D32', fontWeight: 'bold', marginBottom: 10 },
  btn: { backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  emptyState: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: colors.textSecondary },
  infoText: { fontSize: 16, color: colors.textSecondary }
});
