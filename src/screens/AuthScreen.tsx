import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../context/AuthContext';

type Mode = 'signin' | 'signup' | 'recover';

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function AuthScreen() {
  const { signIn, signUp, recoverAccess, signInAsRole } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setName(''); setEmail(''); setPassword('');
    setConfirmPassword(''); setShowPassword(false); setShowConfirm(false);
  };

  const handleSignIn = async () => {
    if (!email || !password)
      return Alert.alert('Atenção', 'Preencha e-mail e senha.');
    if (!validateEmail(email.trim()))
      return Alert.alert('E-mail inválido', 'Digite um e-mail válido.\nExemplo: seunome@gmail.com');
    setLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      Alert.alert('Erro ao entrar', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword)
      return Alert.alert('Atenção', 'Preencha todos os campos.');
    if (!validateEmail(email.trim()))
      return Alert.alert('E-mail inválido', 'Digite um e-mail válido.\nExemplo: seunome@gmail.com');
    if (password !== confirmPassword)
      return Alert.alert('Senhas diferentes', 'As senhas não coincidem.');
    if (password.length < 4)
      return Alert.alert('Senha fraca', 'A senha deve ter pelo menos 4 caracteres.');
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
    } catch (e: any) {
      Alert.alert('Erro no cadastro', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async () => {
    if (!email)
      return Alert.alert('Atenção', 'Informe seu e-mail.');
    if (!validateEmail(email.trim()))
      return Alert.alert('E-mail inválido', 'Digite um e-mail válido.\nExemplo: seunome@gmail.com');
    setLoading(true);
    try {
      const pwd = await recoverAccess(email.trim());
      Alert.alert('Senha encontrada', `Sua senha é:\n\n${pwd}\n\nGuarde em local seguro.`);
      setMode('signin');
      reset();
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = password.length >= 8 ? 'forte' : password.length >= 6 ? 'média' : 'fraca';
  const strengthColor = password.length >= 8 ? '#059669' : password.length >= 6 ? '#d97706' : '#dc2626';
  const strengthWidth = password.length >= 8 ? '100%' : password.length >= 6 ? '66%' : '33%';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.hero}>
            <View style={styles.logoCircle}>
              <Svg width={44} height={40} viewBox="0 0 44 40">
                <Path
                  d="M22 38 C22 38 2 24 2 12 C2 6 7 2 12 2 C16 2 20 5 22 8 C24 5 28 2 32 2 C37 2 42 6 42 12 C42 24 22 38 22 38Z"
                  fill="#ffffff"
                />
              </Svg>
            </View>
            <Text style={styles.appName}>intSaúde</Text>
            <Text style={styles.appTagline}>Hospitais do DF na palma da mão</Text>
            <View style={styles.heroBadge}>
              <View style={styles.heroBadgeDot} />
              <Text style={styles.heroBadgeText}>15 unidades disponíveis</Text>
            </View>
          </View>

          {mode !== 'recover' && (
            <View style={styles.tabsWrap}>
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, mode === 'signin' && styles.tabActive]}
                  onPress={() => { setMode('signin'); reset(); }}
                >
                  <Text style={[styles.tabText, mode === 'signin' && styles.tabTextActive]}>
                    Entrar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, mode === 'signup' && styles.tabActive]}
                  onPress={() => { setMode('signup'); reset(); }}
                >
                  <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                    Cadastrar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.card}>

            {mode === 'signin' && (
              <>
                <Text style={styles.cardTitle}>Bem-vindo de volta</Text>
                <Text style={styles.cardSub}>Entre com sua conta para continuar</Text>

                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Text style={styles.eyeBtnText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => { setMode('recover'); reset(); }}
                  style={styles.forgotBtn}
                >
                  <Text style={styles.forgotText}>Esqueci minha senha</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.mainBtn, loading && styles.mainBtnLoading]}
                  onPress={handleSignIn}
                  disabled={loading}
                >
                  <Text style={styles.mainBtnText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>acesso demo</Text>
                  <View style={styles.dividerLine} />
                </View>

                <View style={styles.demoBox}>
                  <View style={styles.demoRow}>
                    <Text style={styles.demoLabel}>E-mail</Text>
                    <Text style={styles.demoValue}>admin@sus.gov.br</Text>
                  </View>
                  <View style={styles.demoDivider} />
                  <View style={styles.demoRow}>
                    <Text style={styles.demoLabel}>Senha</Text>
                    <Text style={styles.demoValue}>1234</Text>
                  </View>
                </View>
              </>
            )}

            {mode === 'signup' && (
              <>
                <Text style={styles.cardTitle}>Criar conta</Text>
                <Text style={styles.cardSub}>Cadastre-se gratuitamente</Text>

                <Text style={styles.label}>Nome completo</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Seu nome completo"
                    placeholderTextColor="#94a3b8"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <Text style={styles.label}>E-mail</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <Text style={styles.label}>Senha</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Mínimo 4 caracteres"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Text style={styles.eyeBtnText}>{showPassword ? 'Ocultar' : 'Ver'}</Text>
                  </TouchableOpacity>
                </View>

                {password.length > 0 && (
                  <View style={styles.strengthWrap}>
                    <View style={styles.strengthTrack}>
                      <View style={[styles.strengthFill, { width: strengthWidth as any, backgroundColor: strengthColor }]} />
                    </View>
                    <Text style={[styles.strengthText, { color: strengthColor }]}>
                      Senha {strengthLevel}
                    </Text>
                  </View>
                )}

                <Text style={styles.label}>Confirmar senha</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Repita a senha"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                    <Text style={styles.eyeBtnText}>{showConfirm ? 'Ocultar' : 'Ver'}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.mainBtn, loading && styles.mainBtnLoading]}
                  onPress={handleSignUp}
                  disabled={loading}
                >
                  <Text style={styles.mainBtnText}>{loading ? 'Cadastrando...' : 'Criar conta'}</Text>
                </TouchableOpacity>
              </>
            )}

            {mode === 'recover' && (
              <>
                <View style={styles.recoverIconWrap}>
                  <Svg width={28} height={28} viewBox="0 0 24 24">
                    <Path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
                      fill="#1e3a5f"
                    />
                  </Svg>
                </View>
                <Text style={styles.cardTitle}>Recuperar acesso</Text>
                <Text style={styles.cardSub}>
                  Informe seu e-mail cadastrado e mostraremos sua senha.
                </Text>

                <Text style={styles.label}>E-mail cadastrado</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="seu@email.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.mainBtn, loading && styles.mainBtnLoading]}
                  onPress={handleRecover}
                  disabled={loading}
                >
                  <Text style={styles.mainBtnText}>{loading ? 'Buscando...' : 'Recuperar senha'}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={() => { setMode('signin'); reset(); }}
                >
                  <Text style={styles.backBtnText}>Voltar ao login</Text>
                </TouchableOpacity>
              </>
            )}

          </View>

          <Text style={styles.footer}>
            intSaude • Brasilia, DF • Dados simulados para fins academicos
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f2744' },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  hero: { alignItems: 'center', paddingTop: 48, paddingBottom: 28 },
  logoCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)', marginBottom: 16 },
  appName: { fontSize: 36, fontWeight: '800', color: '#fff', letterSpacing: -1.2, marginBottom: 4 },
  appTagline: { fontSize: 14, color: '#93c5fd', marginBottom: 14 },
  heroBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.08)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  heroBadgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#34d399' },
  heroBadgeText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  tabsWrap: { paddingHorizontal: 20, marginBottom: 12 },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 4 },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  tabTextActive: { color: '#0f2744' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 28, padding: 24, shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#64748b', marginBottom: 22, lineHeight: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 14, paddingHorizontal: 14, height: 52, backgroundColor: '#f8fafc', marginBottom: 14 },
  input: { flex: 1, fontSize: 15, color: '#0f172a' },
  eyeBtn: { paddingLeft: 8 },
  eyeBtnText: { fontSize: 12, color: '#3b82f6', fontWeight: '700' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -6, marginBottom: 18 },
  forgotText: { fontSize: 13, color: '#3b82f6', fontWeight: '600' },
  mainBtn: { backgroundColor: '#1e3a5f', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4, shadowColor: '#1e3a5f', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  mainBtnLoading: { opacity: 0.7 },
  mainBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { fontSize: 11, color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  demoBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  demoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  demoLabel: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  demoValue: { fontSize: 13, color: '#1e3a5f', fontWeight: '700' },
  demoDivider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 4 },
  strengthWrap: { marginBottom: 14, gap: 6 },
  strengthTrack: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, overflow: 'hidden' },
  strengthFill: { height: 4, borderRadius: 2 },
  strengthText: { fontSize: 12, fontWeight: '700' },
  recoverIconWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  backBtn: { marginTop: 16, alignItems: 'center', padding: 8 },
  backBtnText: { fontSize: 14, color: '#3b82f6', fontWeight: '700' },
  footer: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 24, paddingHorizontal: 24, lineHeight: 16 },
  roleRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
roleBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' },
roleBtnText: { fontSize: 12, fontWeight: '700' },
});