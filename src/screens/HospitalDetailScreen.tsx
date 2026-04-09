import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Linking,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, OccupancyLevel } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'HospitalDetail'>;
  route: RouteProp<RootStackParamList, 'HospitalDetail'>;
};

const occConfig: Record<OccupancyLevel, { color: string; bg: string; label: string; barWidth: string; barColor: string }> = {
  low:    { color: '#059669', bg: '#ecfdf5', label: 'Lotação Baixa',  barWidth: '28%', barColor: '#34d399' },
  medium: { color: '#d97706', bg: '#fffbeb', label: 'Lotação Média',  barWidth: '62%', barColor: '#fbbf24' },
  high:   { color: '#dc2626', bg: '#fef2f2', label: 'Lotação Alta',   barWidth: '91%', barColor: '#f87171' },
};

export default function HospitalDetailScreen({ navigation, route }: Props) {
  const { hospital } = route.params;
  const occ = occConfig[hospital.occupancy];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>{hospital.name}</Text>
        <Text style={styles.headerAddr}>📍 {hospital.address}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={[styles.occCard, { backgroundColor: occ.bg }]}>
          <View style={styles.occRow}>
            <View>
              <Text style={[styles.occLabel, { color: occ.color }]}>{occ.label}</Text>
              <Text style={[styles.occSub, { color: occ.color }]}>Atualizado agora</Text>
            </View>
            <View style={[styles.occTimeBadge, { backgroundColor: occ.color }]}>
              <Text style={styles.occTimeText}>⏱ ~{hospital.waitTime} min</Text>
            </View>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: occ.barWidth as any, backgroundColor: occ.barColor }]} />
          </View>
          <Text style={[styles.barHint, { color: occ.color }]}>Nível de ocupação atual</Text>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>📍</Text>
            <Text style={styles.metricVal}>{hospital.distance} km</Text>
            <Text style={styles.metricLabel}>Distância</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>⏱</Text>
            <Text style={styles.metricVal}>{hospital.waitTime} min</Text>
            <Text style={styles.metricLabel}>Espera</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricIcon}>⚕️</Text>
            <Text style={styles.metricVal}>{hospital.specialties.length}</Text>
            <Text style={styles.metricLabel}>Especialidades</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades disponíveis</Text>
          <View style={styles.specGrid}>
            {hospital.specialties.map((spec) => (
              <View key={spec} style={styles.specCard}>
                <Text style={styles.specCardText}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato e localização</Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => Linking.openURL(`tel:${hospital.phone}`)}
          >
            <View style={styles.actionIconWrap}>
              <Text style={styles.actionIconText}>📞</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Ligar para o hospital</Text>
              <Text style={styles.actionSub}>{hospital.phone}</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { marginBottom: 0 }]}
            onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${hospital.lat},${hospital.lng}`)}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: '#eff6ff' }]}>
              <Text style={styles.actionIconText}>🗺️</Text>
            </View>
            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>Como chegar</Text>
              <Text style={styles.actionSub}>Abrir no Google Maps</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 22 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backArrow: { color: '#93c5fd', fontSize: 20, lineHeight: 22 },
  backText: { color: '#93c5fd', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#fff', marginBottom: 6, lineHeight: 27 },
  headerAddr: { fontSize: 13, color: '#bfdbfe' },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  occCard: { borderRadius: 16, padding: 16 },
  occRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  occLabel: { fontSize: 17, fontWeight: '800' },
  occSub: { fontSize: 12, marginTop: 2, opacity: 0.8 },
  occTimeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  occTimeText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  barTrack: { height: 10, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 5, overflow: 'hidden', marginBottom: 8 },
  barFill: { height: 10, borderRadius: 5 },
  barHint: { fontSize: 11, opacity: 0.7 },
  metricsRow: { flexDirection: 'row', gap: 10 },
  metricCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  metricIcon: { fontSize: 22, marginBottom: 6 },
  metricVal: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  metricLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  specCard: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 },
  specCardText: { fontSize: 13, color: '#2563eb', fontWeight: '600' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc', marginBottom: 4 },
  actionIconWrap: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center' },
  actionIconText: { fontSize: 20 },
  actionInfo: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  actionSub: { fontSize: 12, color: '#64748b', marginTop: 1 },
  actionArrow: { fontSize: 18, color: '#cbd5e1' },
});