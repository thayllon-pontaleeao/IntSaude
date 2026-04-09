import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, Alert, ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, OccupancyLevel } from '../types';
import { mockHospitals } from '../data/mockData';

type LoginProps = { navigation: NativeStackNavigationProp<RootStackParamList, 'AdminLogin'> };

export function AdminLoginScreen({ navigation }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === 'admin@sus.gov.br' && password === '1234') {
      navigation.navigate('AdminPanel', { hospitalId: '1' });
    } else {
      Alert.alert('Acesso negado', 'Credenciais inválidas.\n\nUse: admin@sus.gov.br / 1234');
    }
  };

  return (
    <SafeAreaView style={loginStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      <View style={loginStyles.header}>
        <TouchableOpacity style={loginStyles.backRow} onPress={() => navigation.goBack()}>
          <Text style={loginStyles.backArrow}>←</Text>
          <Text style={loginStyles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={loginStyles.headerTitle}>Acesso Administrativo</Text>
        <Text style={loginStyles.headerSub}>Exclusivo para gestores hospitalares</Text>
      </View>
      <View style={loginStyles.content}>
        <View style={loginStyles.card}>
          <View style={loginStyles.cardIcon}>
            <Text style={loginStyles.cardIconText}>⚙️</Text>
          </View>
          <Text style={loginStyles.cardTitle}>Entrar como administrador</Text>
          <Text style={loginStyles.label}>E-mail</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="admin@hospital.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={loginStyles.label}>Senha</Text>
          <TextInput
            style={loginStyles.input}
            placeholder="••••••••"
            placeholderTextColor="#94a3b8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={loginStyles.loginBtn} onPress={handleLogin}>
            <Text style={loginStyles.loginBtnText}>Entrar</Text>
          </TouchableOpacity>
          <View style={loginStyles.demoBox}>
            <Text style={loginStyles.demoLabel}>Credenciais de demonstração</Text>
            <Text style={loginStyles.demoText}>admin@sus.gov.br  •  1234</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const loginStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 28 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backArrow: { color: '#93c5fd', fontSize: 20, lineHeight: 22 },
  backText: { color: '#93c5fd', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 13, color: '#bfdbfe' },
  content: { flex: 1, padding: 16, justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  cardIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardIconText: { fontSize: 26 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 14, color: '#0f172a', marginBottom: 14, backgroundColor: '#f8fafc' },
  loginBtn: { backgroundColor: '#1e3a5f', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 4 },
  loginBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  demoBox: { marginTop: 20, padding: 12, backgroundColor: '#f8fafc', borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  demoLabel: { fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: '600' },
  demoText: { fontSize: 13, color: '#475569', fontWeight: '600' },
});

// ─── Admin Panel ─────────────────────────────────────────────────────────────

type PanelProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminPanel'>;
  route: RouteProp<RootStackParamList, 'AdminPanel'>;
};

const occOptions: { value: OccupancyLevel; label: string; color: string; bg: string; icon: string }[] = [
  { value: 'low',    label: 'Baixa', color: '#059669', bg: '#ecfdf5', icon: '🟢' },
  { value: 'medium', label: 'Média', color: '#d97706', bg: '#fffbeb', icon: '🟡' },
  { value: 'high',   label: 'Alta',  color: '#dc2626', bg: '#fef2f2', icon: '🔴' },
];

export function AdminPanelScreen({ navigation }: PanelProps) {
  const [selectedId, setSelectedId] = useState<string>(mockHospitals[0].id);
  const [occupancy, setOccupancy] = useState<OccupancyLevel>(mockHospitals[0].occupancy);
  const [waitTime, setWaitTime] = useState(String(mockHospitals[0].waitTime));
  const [specialties, setSpecialties] = useState(mockHospitals[0].specialties.join(', '));
  const [saved, setSaved] = useState(false);

  const selectHospital = async (id: string) => {
    const base = mockHospitals.find((h) => h.id === id)!;
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
        specialties: specialties.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await AsyncStorage.setItem(`hospital_${selectedId}`, JSON.stringify(updated));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      Alert.alert('✅ Salvo!', 'Dados atualizados com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
    }
  };

  const selectedHospital = mockHospitals.find((h) => h.id === selectedId)!;

  return (
    <SafeAreaView style={panelStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      <View style={panelStyles.header}>
        <TouchableOpacity style={panelStyles.backRow} onPress={() => navigation.goBack()}>
          <Text style={panelStyles.backArrow}>←</Text>
          <Text style={panelStyles.backText}>Sair</Text>
        </TouchableOpacity>
        <Text style={panelStyles.headerTitle}>Painel Admin</Text>
        <Text style={panelStyles.headerSub}>Selecione e edite um hospital</Text>
      </View>

      <ScrollView contentContainerStyle={panelStyles.content} showsVerticalScrollIndicator={false}>

        <View style={panelStyles.section}>
          <Text style={panelStyles.sectionTitle}>Hospital</Text>
          <Text style={panelStyles.sectionSub}>Toque para selecionar qual hospital editar</Text>
          {mockHospitals.map((h) => (
            <TouchableOpacity
              key={h.id}
              style={[panelStyles.hospitalBtn, selectedId === h.id && panelStyles.hospitalBtnActive]}
              onPress={() => selectHospital(h.id)}
            >
              <View style={panelStyles.hospitalBtnLeft}>
                <Text style={[panelStyles.hospitalBtnName, selectedId === h.id && panelStyles.hospitalBtnNameActive]} numberOfLines={1}>
                  {h.name}
                </Text>
                <Text style={[panelStyles.hospitalBtnAddr, selectedId === h.id && panelStyles.hospitalBtnAddrActive]} numberOfLines={1}>
                  {h.address}
                </Text>
              </View>
              {selectedId === h.id && <Text style={panelStyles.hospitalCheck}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={panelStyles.section}>
          <Text style={panelStyles.sectionTitle}>Editando: {selectedHospital.name}</Text>
          <Text style={panelStyles.sectionSub}>Nível de lotação atual</Text>
          <View style={panelStyles.occRow}>
            {occOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[panelStyles.occBtn, { backgroundColor: opt.bg, borderColor: occupancy === opt.value ? opt.color : 'transparent' }]}
                onPress={() => setOccupancy(opt.value)}
              >
                <Text style={panelStyles.occBtnIcon}>{opt.icon}</Text>
                <Text style={[panelStyles.occBtnText, { color: opt.color }]}>{opt.label}</Text>
                {occupancy === opt.value && <Text style={[panelStyles.occCheck, { color: opt.color }]}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={panelStyles.section}>
          <Text style={panelStyles.sectionTitle}>Tempo de Espera</Text>
          <Text style={panelStyles.sectionSub}>Tempo médio atual em minutos</Text>
          <TextInput
            style={panelStyles.input}
            value={waitTime}
            onChangeText={setWaitTime}
            keyboardType="numeric"
            placeholder="Ex: 45"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={panelStyles.section}>
          <Text style={panelStyles.sectionTitle}>Especialidades Disponíveis</Text>
          <Text style={panelStyles.sectionSub}>Separe cada especialidade por vírgula</Text>
          <TextInput
            style={[panelStyles.input, panelStyles.inputMulti]}
            value={specialties}
            onChangeText={setSpecialties}
            multiline
            numberOfLines={3}
            placeholder="Clínica Geral, Pediatria, Ortopedia..."
            placeholderTextColor="#94a3b8"
          />
        </View>

        <TouchableOpacity
          style={[panelStyles.saveBtn, saved && panelStyles.saveBtnSuccess]}
          onPress={handleSave}
        >
          <Text style={panelStyles.saveBtnText}>
            {saved ? '✅  Salvo com sucesso!' : 'Salvar alterações'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const panelStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 22 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  backArrow: { color: '#93c5fd', fontSize: 20, lineHeight: 22 },
  backText: { color: '#93c5fd', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 13, color: '#bfdbfe' },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  sectionSub: { fontSize: 12, color: '#94a3b8', marginBottom: 12 },
  hospitalBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1.5, borderColor: '#e2e8f0', marginBottom: 8, backgroundColor: '#f8fafc' },
  hospitalBtnActive: { backgroundColor: '#eff6ff', borderColor: '#1e3a5f' },
  hospitalBtnLeft: { flex: 1 },
  hospitalBtnName: { fontSize: 13, fontWeight: '700', color: '#475569' },
  hospitalBtnNameActive: { color: '#1e3a5f' },
  hospitalBtnAddr: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  hospitalBtnAddrActive: { color: '#3b82f6' },
  hospitalCheck: { fontSize: 16, color: '#1e3a5f', fontWeight: '800' },
  occRow: { flexDirection: 'row', gap: 8 },
  occBtn: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 2, gap: 4 },
  occBtnIcon: { fontSize: 20 },
  occBtnText: { fontSize: 13, fontWeight: '700' },
  occCheck: { fontSize: 12, fontWeight: '800' },
  input: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 14, height: 48, fontSize: 14, color: '#0f172a', backgroundColor: '#f8fafc' },
  inputMulti: { height: 90, paddingTop: 13, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#1e3a5f', borderRadius: 14, padding: 16, alignItems: 'center', shadowColor: '#1e3a5f', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  saveBtnSuccess: { backgroundColor: '#059669' },
  saveBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});