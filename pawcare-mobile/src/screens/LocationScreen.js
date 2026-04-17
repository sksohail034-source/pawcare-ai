import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';

export default function LocationScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);

      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude
      });

      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        setAddress(`${addr.city || addr.subregion}, ${addr.country}`);
      } else {
        setAddress('Address not found');
      }
    } catch (e) {
      setErrorMsg('Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Location Data</Text>
      
      <View style={styles.card}>
        {loading ? (
          <View style={styles.center}>
             <ActivityIndicator size="large" color={colors.primary} />
             <Text style={styles.loadingText}>Fetching GPS coordinates...</Text>
          </View>
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : location ? (
          <>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.addressText}>{address}</Text>
            <Text style={styles.coordsText}>
              Lat: {location.coords.latitude.toFixed(4)} • Lng: {location.coords.longitude.toFixed(4)}
            </Text>
          </>
        ) : (
          <Text style={styles.errorText}>No location detected</Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.btn} onPress={fetchLocation}>
        <Text style={styles.btnText}>Refresh Location</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 30,
    minHeight: 200,
    justifyContent: 'center'
  },
  center: {
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 15,
    color: colors.textSecondary,
    fontSize: 16
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center'
  },
  icon: {
    fontSize: 50,
    marginBottom: 10
  },
  addressText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center'
  },
  coordsText: {
    fontSize: 14,
    color: colors.textSecondary
  },
  btn: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  }
});
