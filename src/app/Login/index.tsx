import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import TitleLogo from 'src/components/TitleLogo';

interface User {
  name: string;
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await AsyncStorage.getItem('@users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    };
    loadUsers();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      // Busca os usuários registrados
      const storedUsers = await AsyncStorage.getItem('@users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Verifica se existe um usuário com o email e senha fornecidos
      const user = users.find(
        (u: User) => u.email === email && u.password === password
      );
      
      if (user) {
        // Salva o usuário atual e navega para a Home
        await AsyncStorage.setItem('@currentUser', JSON.stringify(user));
        router.replace('/Home');
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante o login');
    } finally {
      setIsLoading(false);
    }
  };

const handleRegister = async () => {
  setIsLoading(true);
  try {
    const newUser = { name, email, password };
    const updatedUsers = [...users, newUser];
    
    await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    // Limpa os campos do formulário
    setName('');
    setEmail('');
    setPassword('');
    
    // Volta para a tela de login sem redirecionar
    setIsRegistering(false);
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
  } catch (error) {
    console.error('Erro no registro:', error);
    Alert.alert('Erro', 'Falha ao cadastrar usuário');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <ImageBackground
      source={require('../../../assets/imagem-fundo.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <TitleLogo />
          <Text style={styles.title}>
            {isRegistering ? 'Cadastro' : 'Login'}
          </Text>

          {isRegistering && (
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              placeholderTextColor="#ccc"
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#ccc"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#ccc"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isRegistering ? handleRegister : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isRegistering ? 'Registrar' : 'Entrar'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsRegistering(!isRegistering)}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              {isRegistering ? 'Já tenho uma conta' : 'Criar nova conta'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

// Mantenha os mesmos estilos
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
  },
  button: {
    height: 50,
    backgroundColor: '#FF6B8B',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: '#FF6B8B',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Login;