import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setupDatabase, findUserByEmail } from '../lib/database';
import { UserRole } from '../types';
import api from '../services/api';

interface User {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInAsRole: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  recoverAccess: (email: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const DEMO_USERS: Record<string, { name: string; password: string; role: UserRole }> = {
  'admin@sus.gov.br':      { name: 'Administrador',       password: '1234', role: 'admin' },
  'gestor@sus.gov.br':     { name: 'Gestor Hospitalar',   password: '1234', role: 'gestor' },
  'supervisor@sus.gov.br': { name: 'Supervisor de Saude', password: '1234', role: 'supervisor' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupDatabase();
    AsyncStorage.getItem('current_user').then(stored => {
      if (stored) setUser(JSON.parse(stored));
      setLoading(false);
    });
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
  try {
    const response = await api.post('/auth/cadastro', {
      nome: name,
      email,
      senha: password,
    });
    const { token, usuario } = response.data;
    await AsyncStorage.setItem('api_token', token);
    const u = { name: usuario.nome, email: usuario.email, role: 'paciente' as UserRole };
    await AsyncStorage.setItem('current_user', JSON.stringify(u));
    setUser(u);
  } catch (error: any) {
    console.log('Erro cadastro:', JSON.stringify(error?.response?.data));
    const msg = error?.response?.data?.error;
    throw new Error(msg || 'Erro ao cadastrar.');
  }
};

  const signIn = async (email: string, password: string) => {
    const demo = DEMO_USERS[email];
    if (demo) {
      if (demo.password !== password) throw new Error('Senha incorreta.');
      const u = { name: demo.name, email, role: demo.role };
      await AsyncStorage.setItem('current_user', JSON.stringify(u));
      setUser(u);
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, senha: password });
      const { token, usuario } = response.data;
      await AsyncStorage.setItem('api_token', token);
      const u = { name: usuario.nome, email: usuario.email, role: 'paciente' as UserRole };
      await AsyncStorage.setItem('current_user', JSON.stringify(u));
      setUser(u);
      return;
    } catch (backendError: any) {
      const msg = backendError?.response?.data?.error;
      if (msg) throw new Error(msg);
    }

    const found = findUserByEmail(email);
    if (!found) throw new Error('E-mail não encontrado.');
    if (found.password !== password) throw new Error('Senha incorreta.');
    const u = { name: found.name, email, role: found.role as UserRole };
    await AsyncStorage.setItem('current_user', JSON.stringify(u));
    setUser(u);
  };

  const signInAsRole = async (role: UserRole) => {
    const roleUsers: Record<UserRole, User> = {
      paciente:   { name: 'Paciente Demo',   email: 'paciente@demo.com',   role: 'paciente' },
      gestor:     { name: 'Gestor Demo',     email: 'gestor@demo.com',     role: 'gestor' },
      supervisor: { name: 'Supervisor Demo', email: 'supervisor@demo.com', role: 'supervisor' },
      admin:      { name: 'Admin Demo',      email: 'admin@demo.com',      role: 'admin' },
    };
    await AsyncStorage.setItem('current_user', JSON.stringify(roleUsers[role]));
    setUser(roleUsers[role]);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('current_user');
    await AsyncStorage.removeItem('api_token');
    setUser(null);
  };

  const recoverAccess = async (email: string): Promise<string> => {
    const demo = DEMO_USERS[email];
    if (demo) return demo.password;
    const found = findUserByEmail(email);
    if (!found) throw new Error('E-mail não encontrado.');
    return found.password;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInAsRole, signOut, recoverAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);