import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, ExamSuggestion } from '../types';
import { symptomsData, examSuggestions } from '../data/mockData';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Anamnese'> };

const urgConfig = {
  low:    { color: '#059669', bg: '#ecfdf5', label: 'Baixa urgência',    icon: '🟢' },
  medium: { color: '#d97706', bg: '#fffbeb', label: 'Urgência moderada', icon: '🟡' },
  high:   { color: '#dc2626', bg: '#fef2f2', label: 'Alta urgência',     icon: '🔴' },
};

export default function AnamneseScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
    setShowResults(false);
  };

  const getExams = (): ExamSuggestion[] => {
    const seen = new Set<string>();
    const all: ExamSuggestion[] = [];
    selected.forEach((id) => {
      (examSuggestions[id] || []).forEach((e) => {
        if (!seen.has(e.exam)) { seen.add(e.exam); all.push(e); }
      });
    });
    return all.sort((a, b) => ({ high: 0, medium: 1, low: 2 }[a.urgency] - { high: 0, medium: 1, low: 2 }[b.urgency]));
  };

  const exams = getExams();
  const hasHigh = exams.some((e) => e.urgency === 'high');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sugestão de Exames</Text>
        <Text style={styles.headerSub}>Selecione os sintomas que está sentindo</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.warningCard}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Esta ferramenta é apenas informativa e não substitui consulta médica presencial.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Sintomas</Text>
        <Text style={styles.sectionSub}>Toque nos sintomas que você está sentindo agora</Text>
        <View style={styles.symptomsGrid}>
          {symptomsData.map((s) => {
            const active = selected.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.symptomBtn, active && styles.symptomBtnActive]}
                onPress={() => toggle(s.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.symptomIcon}>{s.icon}</Text>
                <Text style={[styles.symptomLabel, active && styles.symptomLabelActive]}>{s.label}</Text>
                {active && <View style={styles.symptomCheck}><Text style={styles.symptomCheckText}>✓</Text></View>}
              </TouchableOpacity>
            );
          })}
        </View>

        {selected.length > 0 && !showResults && (
          <TouchableOpacity style={styles.consultBtn} onPress={() => setShowResults(true)}>
            <Text style={styles.consultBtnText}>
              Ver sugestão de exames  •  {selected.length} sintoma{selected.length > 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        )}

        {showResults && (
          <View style={styles.resultsWrap}>
            {hasHigh && (
              <View style={styles.alertCard}>
                <Text style={styles.alertIcon}>🚨</Text>
                <Text style={styles.alertText}>
                  Seus sintomas podem indicar urgência. Procure atendimento médico imediatamente.
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>Exames sugeridos</Text>

            {exams.map((exam, i) => {
              const urg = urgConfig[exam.urgency];
              return (
                <View key={i} style={styles.examCard}>
                  <View style={styles.examHeader}>
                    <Text style={styles.examIcon}>{urg.icon}</Text>
                    <View style={styles.examInfo}>
                      <Text style={styles.examName}>{exam.exam}</Text>
                      <View style={[styles.urgBadge, { backgroundColor: urg.bg }]}>
                        <Text style={[styles.urgText, { color: urg.color }]}>{urg.label}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.examReason}>{exam.reason}</Text>
                </View>
              );
            })}

            <TouchableOpacity style={styles.findBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.findBtnText}>🏥  Ver hospitais disponíveis</Text>
            </TouchableOpacity>
          </View>
        )}

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
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#fff', marginBottom: 4 },
  headerSub: { fontSize: 13, color: '#bfdbfe' },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  warningCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#fefce8', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#fde047' },
  warningIcon: { fontSize: 18 },
  warningText: { flex: 1, fontSize: 13, color: '#713f12', lineHeight: 19 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  sectionSub: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  symptomBtn: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22, backgroundColor: '#fff', borderWidth: 1.5, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 3, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  symptomBtnActive: { backgroundColor: '#1e3a5f', borderColor: '#1e3a5f' },
  symptomIcon: { fontSize: 16 },
  symptomLabel: { fontSize: 13, fontWeight: '600', color: '#475569' },
  symptomLabelActive: { color: '#fff' },
  symptomCheck: { width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  symptomCheckText: { fontSize: 10, color: '#fff', fontWeight: '800' },
  consultBtn: { backgroundColor: '#1e3a5f', borderRadius: 14, padding: 16, alignItems: 'center', shadowColor: '#1e3a5f', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  consultBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  resultsWrap: { gap: 12 },
  alertCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#fef2f2', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#fca5a5' },
  alertIcon: { fontSize: 20 },
  alertText: { flex: 1, fontSize: 13, color: '#991b1b', fontWeight: '600', lineHeight: 19 },
  examCard: { backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  examHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  examIcon: { fontSize: 20, marginTop: 2 },
  examInfo: { flex: 1, gap: 5 },
  examName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  urgBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  urgText: { fontSize: 11, fontWeight: '700' },
  examReason: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  findBtn: { backgroundColor: '#1e3a5f', borderRadius: 14, padding: 16, alignItems: 'center' },
  findBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});