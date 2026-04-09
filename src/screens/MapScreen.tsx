import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator, ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Hospital, OccupancyLevel } from '../types';
import { mockHospitals } from '../data/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Map'> };

const occColors: Record<OccupancyLevel, string> = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const occLabels: Record<OccupancyLevel, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export default function MapScreen({ navigation }: Props) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Hospital | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }
      setLoading(false);
    })();
  }, []);

  const lat = userLocation?.latitude ?? -15.7801;
  const lng = userLocation?.longitude ?? -47.9292;

  const markers = mockHospitals.map(h => `
    L.circleMarker([${h.lat}, ${h.lng}], {
      radius: 10,
      fillColor: '${occColors[h.occupancy]}',
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(map).bindPopup('<b>${h.name}</b><br>Lotação: ${occLabels[h.occupancy]}<br>Espera: ~${h.waitTime} min');
  `).join('\n');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        #map { width: 100vw; height: 100vh; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${lat}, ${lng}], 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'OpenStreetMap'
        }).addTo(map);
        ${userLocation ? `L.circleMarker([${lat}, ${lng}], { radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 2, fillOpacity: 1 }).addTo(map).bindPopup('Você está aqui');` : ''}
        ${markers}
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mapa de Hospitais</Text>
        <Text style={styles.headerSub}>Toque nos marcadores para ver detalhes</Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1e3a5f" />
          <Text style={styles.loadingText}>Obtendo sua localização...</Text>
        </View>
      ) : (
        <WebView source={{ html }} style={styles.map} />
      )}

      <View style={styles.legend}>
        {([['low', '#22c55e', 'Baixa'], ['medium', '#f59e0b', 'Média'], ['high', '#ef4444', 'Alta']] as const).map(([key, color, label]) => (
          <View key={key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{label}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  backArrow: { color: '#93c5fd', fontSize: 20, lineHeight: 22 },
  backText: { color: '#93c5fd', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 2 },
  headerSub: { fontSize: 13, color: '#bfdbfe' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#64748b' },
  map: { flex: 1 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 20, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: '#374151', fontWeight: '500' },
});
