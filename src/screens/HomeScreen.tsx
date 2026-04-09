import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  StatusBar, TextInput, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, Hospital, OccupancyLevel } from '../types';
import { mockHospitals } from '../data/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Home'> };

const occConfig: Record<OccupancyLevel, { color: string; bg: string; label: string; bar: string }> = {
  low:    { color: '#059669', bg: '#ecfdf5', label: 'Baixa', bar: '#34d399' },
  medium: { color: '#d97706', bg: '#fffbeb', label: 'Média', bar: '#fbbf24' },
  high:   { color: '#dc2626', bg: '#fef2f2', label: 'Alta',  bar: '#f87171' },
};

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
}

function HospitalCard({ hospital, onPress }: { hospital: Hospital; onPress: () => void }) {
  const occ = occConfig[hospital.occupancy];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.cardAccent, { backgroundColor: occ.bar }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardName} numberOfLines={1}>{hospital.name}</Text>
          <View style={[styles.occPill, { backgroundColor: occ.bg }]}>
            <View style={[styles.occDot, { backgroundColor: occ.color }]} />
            <Text style={[styles.occPillText, { color: occ.color }]}>{occ.label}</Text>
          </View>
        </View>
        <Text style={styles.cardAddr} numberOfLines={1}>📍 {hospital.address}</Text>
        <View style={styles.cardStats}>
          <View style={styles.statChip}>
            <Text style={styles.statChipVal}>{hospital.distance} km</Text>
            <Text style={styles.statChipLabel}>distância</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statChipVal}>~{hospital.waitTime} min</Text>
            <Text style={styles.statChipLabel}>espera</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statChip}>
            <Text style={styles.statChipVal}>{hospital.specialties.length}</Text>
            <Text style={styles.statChipLabel}>especialidades</Text>
          </View>
        </View>
        <View style={styles.tagsRow}>
          {hospital.specialties.slice(0, 3).map((s) => (
            <View key={s} style={styles.tag}><Text style={styles.tagText}>{s}</Text></View>
          ))}
          {hospital.specialties.length > 3 && (
            <View style={styles.tag}><Text style={styles.tagText}>+{hospital.specialties.length - 3}</Text></View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OccupancyLevel | 'all'>('all');
  const [locationGranted, setLocationGranted] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const loadHospitals = useCallback(async (coords?: { lat: number; lng: number }) => {
    const updated = await Promise.all(
      mockHospitals.map(async (h) => {
        try {
          const saved = await AsyncStorage.getItem(`hospital_${h.id}`);
          const overrides = saved ? JSON.parse(saved) : {};
          const distance = coords
            ? calcDistance(coords.lat, coords.lng, h.lat, h.lng)
            : h.distance;
          return { ...h, ...overrides, distance };
        } catch {
          return h;
        }
      })
    );
    setHospitals(updated.sort((a, b) => a.distance - b.distance));
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationGranted(true);
        const loc = await Location.getCurrentPositionAsync({});
        const coords = { lat: loc.coords.latitude, lng: loc.coords.longitude };
        setUserCoords(coords);
        await loadHospitals(coords);
      } else {
        await loadHospitals();
      }
      setLoading(false);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!loading) loadHospitals(userCoords ?? undefined);
    }, [loading, userCoords])
  );

  const filtered = hospitals.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.specialties.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchSearch && (filter === 'all' || h.occupancy === filter);
  });

  const stats = {
    low: hospitals.filter(h => h.occupancy === 'low').length,
    medium: hospitals.filter(h => h.occupancy === 'medium').length,
    high: hospitals.filter(h => h.occupancy === 'high').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />

      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appName}>intSaúde</Text>
            <Text style={styles.appSub}>
              {locationGranted ? '📍 Localização ativa' : '📍 Brasília, DF'}
            </Text>
          </View>
          <View style={styles.headerBtns}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Perfil')}>
  <Text style={styles.iconBtnText}>👤</Text>
</TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Map')}>
              <Text style={styles.iconBtnText}>🗺️</Text>
            </TouchableOpacity>
            {user?.isAdmin && (
              <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('AdminLogin')}>
                <Text style={styles.iconBtnText}>⚙️</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.iconBtn} onPress={signOut}>
              <Text style={styles.iconBtnText}>🚪</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { key: 'low' as OccupancyLevel,    label: 'Baixa', bg: '#ecfdf5', color: '#059669', icon: '🟢' },
            { key: 'medium' as OccupancyLevel, label: 'Média', bg: '#fffbeb', color: '#d97706', icon: '🟡' },
            { key: 'high' as OccupancyLevel,   label: 'Alta',  bg: '#fef2f2', color: '#dc2626', icon: '🔴' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.statCard, { backgroundColor: item.bg }, filter === item.key && styles.statCardActive]}
              onPress={() => setFilter(filter === item.key ? 'all' : item.key)}
            >
              <Text style={styles.statIcon}>{item.icon}</Text>
              <Text style={[styles.statNum, { color: item.color }]}>{stats[item.key]}</Text>
              <Text style={[styles.statLabel, { color: item.color }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIconText}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar hospital ou especialidade..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {(['all', 'low', 'medium', 'high'] as const).map((f) => {
          const labels = { all: 'Todos', low: 'Baixa', medium: 'Média', high: 'Alta' };
          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
                {labels[f]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#1e3a5f" />
          <Text style={styles.loadingText}>Obtendo sua localização...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HospitalCard
              hospital={item}
              onPress={() => navigation.navigate('HospitalDetail', { hospital: item })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🔎</Text>
              <Text style={styles.emptyTitle}>Nenhum resultado</Text>
              <Text style={styles.emptyText}>Tente outro nome ou especialidade</Text>
            </View>
          }
          ListFooterComponent={
            <TouchableOpacity style={styles.anamneseBtn} onPress={() => navigation.navigate('Anamnese')}>
              <Text style={styles.anamneseBtnIcon}>🩺</Text>
              <Text style={styles.anamneseBtnText}>Tenho sintomas — sugerir exames</Text>
            </TouchableOpacity>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 18 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  appName: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.8 },
  appSub: { fontSize: 12, color: '#93c5fd', marginTop: 2 },
  headerBtns: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  iconBtnText: { fontSize: 17 },
  statsRow: { flexDirection: 'row', gap: 8 },
  statCard: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center', gap: 2 },
  statCardActive: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  statIcon: { fontSize: 14 },
  statNum: { fontSize: 20, fontWeight: '800', lineHeight: 24 },
  statLabel: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  searchWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: '#e2e8f0', elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  searchIconText: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  clearBtn: { fontSize: 14, color: '#94a3b8', padding: 4 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  filterBtnActive: { backgroundColor: '#1e3a5f', borderColor: '#1e3a5f' },
  filterBtnText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  filterBtnTextActive: { color: '#fff', fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9', flexDirection: 'row', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  cardAccent: { width: 5 },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#0f172a', flex: 1, marginRight: 8 },
  occPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, gap: 4 },
  occDot: { width: 6, height: 6, borderRadius: 3 },
  occPillText: { fontSize: 11, fontWeight: '700' },
  cardAddr: { fontSize: 12, color: '#64748b', marginBottom: 10 },
  cardStats: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  statChip: { flex: 1, alignItems: 'center' },
  statChipVal: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  statChipLabel: { fontSize: 10, color: '#94a3b8', marginTop: 1 },
  statDivider: { width: 1, height: 28, backgroundColor: '#f1f5f9' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tag: { backgroundColor: '#eff6ff', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11, color: '#2563eb', fontWeight: '500' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: '#64748b' },
  emptyWrap: { alignItems: 'center', paddingVertical: 48, gap: 8 },
  emptyIcon: { fontSize: 44 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  emptyText: { fontSize: 14, color: '#94a3b8' },
  anamneseBtn: { backgroundColor: '#1e3a5f', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 4, marginBottom: 8 },
  anamneseBtnIcon: { fontSize: 20 },
  anamneseBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});