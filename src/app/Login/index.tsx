import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import TitleLogo from 'src/components/TitleLogo';

// Definindo os tipos para navegação
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  // Adicione outras rotas conforme necessário
};

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Interface para o tipo User
interface User {
  name: string;
  email: string;
  password: string;
}

const Login = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('@users');
        if (storedUsers) setUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };
    loadUsers();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      const userExists = users.some(
        user => user.email === email && user.password === password
      );

      if (userExists) {
        await AsyncStorage.setItem('@currentUser', JSON.stringify({ email }));
        navigation.replace('Home');
      } else {
        Alert.alert('Erro', 'Credenciais inválidas');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha no login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setIsLoading(true);

    try {
      const emailExists = users.some(user => user.email === email);
      
      if (emailExists) {
        Alert.alert('Erro', 'Email já cadastrado');
        return;
      }

      const newUser = { name, email, password };
      const updatedUsers = [...users, newUser];
      
      await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      Alert.alert('Sucesso', `Cadastro realizado para ${name}!`);
      setIsRegistering(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha no cadastro');
      console.error(error);
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
          <Text style={styles.title}>{isRegistering ? 'Cadastro' : 'Login'}</Text>
          
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
            autoComplete="email"
            placeholderTextColor="#ccc"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
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