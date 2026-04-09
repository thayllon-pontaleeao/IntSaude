import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../types';

interface User {
  name: string;
  email: string;
  password: string;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('current_user');
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    const existing = await AsyncStorage.getItem(`user_${email}`);
    if (existing) throw new Error('Este e-mail ja esta cadastrado.');
    const newUser: User = { name, email, password, role: 'paciente' };
    await AsyncStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    await AsyncStorage.setItem('current_user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    if (email === 'admin@sus.gov.br' && password === '1234') {
      const adminUser: User = { name: 'Administrador', email, password, role: 'admin' };
      await AsyncStorage.setItem('current_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return;
    }
    if (email === 'gestor@sus.gov.br' && password === '1234') {
      const gestorUser: User = { name: 'Gestor Hospitalar', email, password, role: 'gestor' };
      await AsyncStorage.setItem('current_user', JSON.stringify(gestorUser));
      setUser(gestorUser);
      return;
    }
    if (email === 'supervisor@sus.gov.br' && password === '1234') {
      const supervisorUser: User = { name: 'Supervisor de Saude', email, password, role: 'supervisor' };
      await AsyncStorage.setItem('current_user', JSON.stringify(supervisorUser));
      setUser(supervisorUser);
      return;
    }
    const stored = await AsyncStorage.getItem(`user_${email}`);
    if (!stored) throw new Error('E-mail nao encontrado.');
    const found: User = JSON.parse(stored);
    if (found.password !== password) throw new Error('Senha incorreta.');
    await AsyncStorage.setItem('current_user', JSON.stringify(found));
    setUser(found);
  };

  const signInAsRole = async (role: UserRole) => {
    const roleUsers: Record<UserRole, User> = {
      paciente: { name: 'Paciente Demo', email: 'paciente@demo.com', password: '', role: 'paciente' },
      gestor: { name: 'Gestor Demo', email: 'gestor@demo.com', password: '', role: 'gestor' },
      supervisor: { name: 'Supervisor Demo', email: 'supervisor@demo.com', password: '', role: 'supervisor' },
      admin: { name: 'Admin Demo', email: 'admin@demo.com', password: '', role: 'admin' },
    };
    const u = roleUsers[role];
    await AsyncStorage.setItem('current_user', JSON.stringify(u));
    setUser(u);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('current_user');
    setUser(null);
  };

  const recoverAccess = async (email: string): Promise<string> => {
    if (email === 'admin@sus.gov.br') return '1234';
    const stored = await AsyncStorage.getItem(`user_${email}`);
    if (!stored) throw new Error('E-mail nao encontrado.');
    const found: User = JSON.parse(stored);
    return found.password;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInAsRole, signOut, recoverAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);