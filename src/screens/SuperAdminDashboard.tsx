import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, TextInput, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { mockHospitals } from '../data/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'SuperAdminDashboard'> };

type CrudSection = 'hospitais' | 'usuarios' | 'comentarios' | 'tags' | null;

export default function SuperAdminDashboard({ navigation }: Props) {
  const [activeSection, setActiveSection] = useState<CrudSection>(null);
  const [newHospitalName, setNewHospitalName] = useState('');
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(['Emergencia', 'Pediatria', 'Cardiologia', 'Ortopedia', 'UTI']);

  const stats = [
    { label: 'Hospitais', value: mockHospitals.length, color: '#1e3a5f', bg: '#dbeafe' },
    { label: 'Usuarios', value: 3, color: '#166534', bg: '#dcfce7' },
    { label: 'Tags', value: tags.length, color: '#92400e', bg: '#fef3c7' },
    { label: 'Comentarios', value: 12, color: '#991b1b', bg: '#fee2e2' },
  ];

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setTags(prev => [...prev, newTag.trim()]);
    setNewTag('');
    Alert.alert('Tag adicionada!', `"${newTag}" foi criada.`);
  };

  const handleDeleteTag = (tag: string) => {
    Alert.alert('Remover tag', `Deseja remover "${tag}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => setTags(prev => prev.filter(t => t !== tag)) },
    ]);
  };

  const handleResetHospital = async (id: string) => {
    await AsyncStorage.removeItem(`hospital_${id}`);
    Alert.alert('Resetado!', 'Dados do hospital voltaram ao padrao.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Super Admin</Text>
        <Text style={styles.headerSub}>Dashboard do sistema intSaude</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.statsGrid}>
          {stats.map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <Text style={[styles.statNum, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: s.color }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CRUD — Gerenciamento</Text>
          <Text style={styles.sectionSub}>Toque para expandir cada secao</Text>

          {[
            { key: 'hospitais', label: 'Hospitais', desc: 'Gerenciar unidades de saude' },
            { key: 'tags', label: 'Tags / Especialidades', desc: 'Gerenciar categorias' },
            { key: 'usuarios', label: 'Usuarios', desc: 'Gerenciar contas cadastradas' },
            { key: 'comentarios', label: 'Comentarios', desc: 'Moderar comentarios dos pacientes' },
          ].map(item => (
            <View key={item.key}>
              <TouchableOpacity
                style={[styles.crudBtn, activeSection === item.key && styles.crudBtnActive]}
                onPress={() => setActiveSection(activeSection === item.key ? null : item.key as CrudSection)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.crudBtnTitle, activeSection === item.key && styles.crudBtnTitleActive]}>
                    {item.label}
                  </Text>
                  <Text style={styles.crudBtnDesc}>{item.desc}</Text>
                </View>
                <Text style={[styles.crudArrow, activeSection === item.key && { color: '#1e3a5f' }]}>
                  {activeSection === item.key ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>

              {activeSection === 'hospitais' && item.key === 'hospitais' && (
                <View style={styles.crudContent}>
                  {mockHospitals.map(h => (
                    <View key={h.id} style={styles.crudItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.crudItemName} numberOfLines={1}>{h.name}</Text>
                        <Text style={styles.crudItemSub} numberOfLines={1}>{h.address}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.resetBtn}
                        onPress={() => handleResetHospital(h.id)}
                      >
                        <Text style={styles.resetBtnText}>Reset</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}

              {activeSection === 'tags' && item.key === 'tags' && (
                <View style={styles.crudContent}>
                  <View style={styles.addRow}>
                    <TextInput
                      style={styles.addInput}
                      value={newTag}
                      onChangeText={setNewTag}
                      placeholder="Nova tag..."
                      placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={handleAddTag}>
                      <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tagsWrap}>
                    {tags.map((tag, i) => (
                      <TouchableOpacity key={i} style={styles.tagChip} onPress={() => handleDeleteTag(tag)}>
                        <Text style={styles.tagChipText}>{tag}</Text>
                        <Text style={styles.tagChipX}>×</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {activeSection === 'usuarios' && item.key === 'usuarios' && (
                <View style={styles.crudContent}>
                  {[
                    { name: 'Admin Demo', email: 'admin@sus.gov.br', role: 'Administrador' },
                    { name: 'Gestor Demo', email: 'gestor@sus.gov.br', role: 'Gestor' },
                    { name: 'Paciente Demo', email: 'paciente@demo.com', role: 'Paciente' },
                  ].map((u, i) => (
                    <View key={i} style={styles.crudItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.crudItemName}>{u.name}</Text>
                        <Text style={styles.crudItemSub}>{u.email} • {u.role}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeSection === 'comentarios' && item.key === 'comentarios' && (
                <View style={styles.crudContent}>
                  {[
                    { autor: 'Maria S.', texto: 'Atendimento rapido e eficiente!', hospital: 'UPA Ceilandia' },
                    { autor: 'Joao P.', texto: 'Fila grande mas equipe atenciosa.', hospital: 'HRAN' },
                    { autor: 'Ana L.', texto: 'Otimo atendimento pediatrico.', hospital: 'HRT' },
                  ].map((c, i) => (
                    <View key={i} style={styles.comentarioItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.crudItemName}>{c.autor} — {c.hospital}</Text>
                        <Text style={styles.crudItemSub}>{c.texto}</Text>
                      </View>
                      <TouchableOpacity style={styles.deleteBtn} onPress={() => Alert.alert('Removido', 'Comentario removido.')}>
                        <Text style={styles.deleteBtnText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#fff', marginBottom: 2 },
  headerSub: { fontSize: 13, color: '#bfdbfe' },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', borderRadius: 14, padding: 14, alignItems: 'center' },
  statNum: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#f1f5f9' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 2 },
  sectionSub: { fontSize: 12, color: '#94a3b8', marginBottom: 12 },
  crudBtn: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#e2e8f0', marginBottom: 8, backgroundColor: '#f8fafc' },
  crudBtnActive: { borderColor: '#1e3a5f', backgroundColor: '#eff6ff' },
  crudBtnTitle: { fontSize: 13, fontWeight: '700', color: '#475569' },
  crudBtnTitleActive: { color: '#1e3a5f' },
  crudBtnDesc: { fontSize: 11, color: '#94a3b8', marginTop: 1 },
  crudArrow: { fontSize: 12, color: '#94a3b8', marginLeft: 8 },
  crudContent: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  crudItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  crudItemName: { fontSize: 12, fontWeight: '700', color: '#1e293b' },
  crudItemSub: { fontSize: 11, color: '#94a3b8', marginTop: 1 },
  resetBtn: { backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginLeft: 8 },
  resetBtnText: { fontSize: 11, color: '#1e3a5f', fontWeight: '700' },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  addInput: { flex: 1, borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, height: 40, fontSize: 13, color: '#0f172a', backgroundColor: '#fff' },
  addBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#1e3a5f', alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#eff6ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  tagChipText: { fontSize: 12, color: '#2563eb', fontWeight: '600' },
  tagChipX: { fontSize: 14, color: '#dc2626', fontWeight: '800' },
  comentarioItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  deleteBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  deleteBtnText: { color: '#dc2626', fontSize: 16, fontWeight: '800' },
});