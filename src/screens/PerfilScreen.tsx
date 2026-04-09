import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Perfil'> };

const roleConfig = {
  paciente:   { label: 'Paciente',           color: '#166534', bg: '#dcfce7', icon: 'P' },
  gestor:     { label: 'Gestor Hospitalar',   color: '#1e40af', bg: '#dbeafe', icon: 'G' },
  supervisor: { label: 'Supervisor de Saude', color: '#92400e', bg: '#fef3c7', icon: 'S' },
  admin:      { label: 'Administrador',       color: '#991b1b', bg: '#fee2e2', icon: 'A' },
};

export default function PerfilScreen({ navigation }: Props) {
  const { user, signOut } = useAuth();
  if (!user) return null;

  const role = roleConfig[user.role] ?? roleConfig.paciente;

  const menuItems: { label: string; screen: keyof RootStackParamList; roles: string[] }[] = [
    { label: 'Hospitais proximos', screen: 'Home', roles: ['paciente', 'gestor', 'supervisor', 'admin'] },
    { label: 'Mapa interativo', screen: 'Map', roles: ['paciente', 'gestor', 'supervisor', 'admin'] },
    { label: 'Sugestao de exames', screen: 'Anamnese', roles: ['paciente'] },
    { label: 'Gerenciar hospitais', screen: 'AdminPanel', roles: ['gestor', 'admin'] },
    { label: 'Painel administrativo', screen: 'SuperAdminDashboard', roles: ['admin'] },
    { label: 'Painel do gestor', screen: 'GestorPanel', roles: ['gestor'] },
  ];

  const available = menuItems.filter(m => m.roles.includes(user.role));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a5f" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarCard}>
          <View style={[styles.avatar, { backgroundColor: role.bg }]}>
            <Text style={[styles.avatarText, { color: role.color }]}>{role.icon}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: role.bg }]}>
            <Text style={[styles.roleText, { color: role.color }]}>{role.label}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso rapido</Text>
          {available.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.menuItem}
              onPress={() => {
                if (item.screen === 'AdminPanel') {
                  navigation.navigate('AdminPanel', { hospitalId: '1' });
                } else {
                  navigation.navigate(item.screen as any);
                }
              }}
            >
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
          <Text style={styles.logoutBtnText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1e3a5f', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  backArrow: { color: '#93c5fd', fontSize: 20, lineHeight: 22 },
  backText: { color: '#93c5fd', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 21, fontWeight: '800', color: '#fff' },
  content: { padding: 16, paddingBottom: 40, gap: 14 },
  avatarCard: { backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  avatar: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '800' },
  userName: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#64748b', marginBottom: 10 },
  roleBadge: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  roleText: { fontSize: 12, fontWeight: '700' },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#f1f5f9' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a', marginBottom: 10 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  menuItemText: { fontSize: 14, color: '#1e293b', fontWeight: '500' },
  menuArrow: { fontSize: 16, color: '#cbd5e1' },
  logoutBtn: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#fca5a5' },
  logoutBtnText: { color: '#dc2626', fontSize: 14, fontWeight: '700' },
});