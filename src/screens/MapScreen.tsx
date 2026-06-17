import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getUnidades } from '../services/unidadesService';
import { mockHospitals } from '../data/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Map'> };

interface Unidade {
  id: number | string;
  nome?: string;
  name?: string;
  tipo?: string;
  endereco?: string;
  address?: string;
  telefone?: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
}

const tipoColors: Record<string, string> = {
  UBS: '#22c55e',
  UPA: '#f59e0b',
  Hospital: '#ef4444',
};

export default function MapScreen({ navigation }: Props) {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      }

      try {
        const data = await getUnidades();
        setUnidades(data);
      } catch (e) {
        setUnidades(mockHospitals as any);
      }

      setLoading(false);
    })();
  }, []);

  const lat = userLocation?.latitude ?? -15.7801;
  const lng = userLocation?.longitude ?? -47.9292;

  const markers = unidades.map(u => {
    const uLat = u.latitude ?? u.lat;
    const uLng = u.longitude ?? u.lng;
    const nome = (u.nome ?? u.name ?? '').replace(/'/g, "\\'");
    const tipo = u.tipo ?? (u as any).occupancy ?? 'Hospital';
    const end = (u.endereco ?? u.address ?? '').replace(/'/g, "\\'");
    const tel = u.telefone ?? u.phone ?? '';
    const cor = tipoColors[tipo] ?? '#ef4444';
    return `
      L.circleMarker([${uLat}, ${uLng}], {
        radius: 10,
        fillColor: '${cor}',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(map).bindPopup('<b>${nome}</b><br>${end}<br>Tel: ${tel}');
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; }
    #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([${lat}, ${lng}], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap',
      maxZoom: 18
    }).addTo(map);
    ${userLocation ? `L.circleMarker([${lat}, ${lng}], { radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 2, fillOpacity: 1 }).addTo(map).bindPopup('Você está aqui');` : ''}
    ${markers}
  </script>
</body>
</html>`;

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
          <Text style={styles.loadingText}>Carregando unidades...</Text>
        </View>
      ) : (
        <WebView
          source={{ html }}
          style={styles.map}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color="#1e3a5f" />
            </View>
          )}
        />
      )}

      <View style={styles.legend}>
        {([['UBS', '#22c55e'], ['UPA', '#f59e0b'], ['Hospital', '#ef4444']] as const).map(([tipo, color]) => (
          <View key={tipo} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{tipo}</Text>
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