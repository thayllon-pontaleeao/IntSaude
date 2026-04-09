import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, OccupancyLevel } from '../types';
import { mockHospitals } from '../data/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'GestorPanel'> };

const occOptions: { value: OccupancyLevel; label: string; color: string; bg: string }[] = [
  { value: 'low',    label: 'Baixa', color: '#059669', bg: '#ecfdf5' },
  { value: 'medium', label: 'Media', color: '#d97706', bg: '#fffbeb' },
  { value: 'high',   label: 'Alta',  color: '#dc2626', bg: '#fef2f2' },
];

export default function GestorPanelScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = useState(mockHospitals[0].id);
  const [occupancy, setOccupancy] = useState<OccupancyLevel>(mockHospitals[0].occupancy);
  const [waitTime, setWaitTime] = useState(String(mockHospitals[0].waitTime));
  const [specialties, setSpecialties] = useState(mockHospitals[0].specialties.join(', '));
  const [saved, setSaved] = useState(false);

  const selectHospital = async (id: string) => {
    const base = mockHospitals.find(h => h.id === id)!;
    try {
      const stored = await AsyncStorage.getItem(`hospital_${id}`);
      const overrides = stored ? JSON.parse(stored) : {};
      setSelectedId(id);
      setOccupancy(overrides.occupancy ?? base.occupancy);
      setWaitTime(String(overrides.waitTime ?? base.waitTime));
      setSpecialties((overrides.specialties ?? base.specialties).join(', '));
    } catch {
      setSelectedId(id);
      setOccupancy(base.occupancy);
      setWaitTime(String(base.waitTime));
      setSpecialties(base.specialties.join(', '));
    }
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      const updated = {
        occupancy,
        waitTime: Number(waitTime),
        specialties: specialties.split(',').map(s => s.trim()).filter(Boolean),
      };
      await AsyncStorage.setItem(`hospital_${selectedId}`, JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      Alert.alert('Salvo!', 'Dados atualizados com sucesso.');
    } catch {
      Alert.alert('Erro', 'Nao foi possivel salvar.');
    }
  };

  const selected = mockHospitals.find(h => h.id === selectedId)!;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Painel do Gestor</Text>
        <Text style={styles.headerSub}>Gerencie os dados do seu hospital</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selecionar Hospital</Text>
          {mockHospitals.map(h => (
            <TouchableOpacity
              key={h.id}
              style={[styles.hospitalBtn, selectedId === h.id && styles.hospitalBtnActive]}
              onPress={() => selectHospital(h.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.hospitalName, selectedId === h.id && styles.hospitalNameActive]} numberOfLines={1}>
                  {h.name}
                </Text>
                <Text style={styles.hospitalAddr} numberOfLines={1}>{h.address}</Text>
              </View>
              {selectedId === h.id && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Editando: {selected.name}</Text>
          <Text style={styles.sectionSub}>Nivel de lotacao atual</Text>
          <View style={styles.occRow}>
            {occOptions.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.occBtn, { backgroundColor: opt.bg, borderColor: occupancy === opt.value ? opt.color : 'transparent' }]}
                onPress={() => setOccupancy(opt.value)}
              >
                <Text style={[styles.occBtnText, { color: opt.color }]}>{opt.label}</Text>
                {occupancy === opt.value && <Text style={[styles.occCheck, { color: opt.color }]}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tempo de Espera (min)</Text>
          <TextInput
            style={styles.input}
            value={waitTime}
            onChangeText={setWaitTime}
            keyboardType="numeric"
            placeholder="Ex: 45"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <Text style={styles.sectionSub}>Separe por virgula</Text>
          <TextInput
            style={[styles.input, { height: 80, paddingTop: 12, textAlignVertical: 'top' }]}
            value={specialties}
            onChangeText={setSpecialties}
            multiline
            placeholder="Clinica Geral, Pediatria..."
            placeholderTextColor="#94a3b8"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, saved && styles.saveBtnSuccess]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>{saved ? 'Salvo!' : 'Salvar alteracoes'}</Text>
        </TouchableOpacity>
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
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#fff', marginBottom: 2 },
  headerSub: { fontSize: 13, color: '#bfdbfe' },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#f1f5f9' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  sectionSub: { fontSize: 12, color: '#94a3b8', marginBottom: 10 },
  hospitalBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: '#e2e8f0', marginBottom: 6, backgroundColor: '#f8fafc' },
  hospitalBtnActive: { backgroundColor: '#eff6ff', borderColor: '#1e3a5f' },
  hospitalName: { fontSize: 12, fontWeight: '700', color: '#475569' },
  hospitalNameActive: { color: '#1e3a5f' },
  hospitalAddr: { fontSize: 10, color: '#94a3b8', marginTop: 1 },
  check: { color: '#1e3a5f', fontWeight: '800', fontSize: 14, marginLeft: 8 },
  occRow: { flexDirection: 'row', gap: 8 },
  occBtn: { flex: 1, alignItems: 'center', padding: 10, borderRadius: 10, borderWidth: 2, gap: 2 },
  occBtnText: { fontSize: 13, fontWeight: '700' },
  occCheck: { fontSize: 11, fontWeight: '800' },
  input: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 14, color: '#0f172a', backgroundColor: '#f8fafc' },
  saveBtn: { backgroundColor: '#1e3a5f', borderRadius: 14, padding: 16, alignItems: 'center' },
  saveBtnSuccess: { backgroundColor: '#059669' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});