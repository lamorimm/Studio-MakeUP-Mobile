import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialIcons } from '@expo/vector-icons';

interface AddProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAddProduct: (product: { nome: string; preco: number; imagem: string }) => void;
}

export default function AddProductModal({ visible, onClose, onAddProduct }: AddProductModalProps) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para adicionar fotos');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8, // Qualidade reduzida para economizar espaço
    });

    if (!result.canceled && result.assets) {
      setImagem(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à sua câmera para tirar fotos');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      setImagem(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!nome || !preco || !imagem) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos e adicione uma imagem');
      return;
    }

    onAddProduct({
      nome,
      preco: parseFloat(preco),
      imagem: imagem,
    });

    // Limpa o formulário
    setNome('');
    setPreco('');
    setImagem(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Novo Produto</Text>
          
          <TextInput
            placeholder="Nome do Produto"
            style={styles.input}
            value={nome}
            onChangeText={setNome}
          />
          
          <TextInput
            placeholder="Preço"
            style={styles.input}
            value={preco}
            onChangeText={setPreco}
            keyboardType="numeric"
          />
          
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <MaterialIcons name="photo-library" size={24} color="white" />
              <Text style={styles.imageButtonText}>Galeria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <MaterialIcons name="photo-camera" size={24} color="white" />
              <Text style={styles.imageButtonText}>Câmera</Text>
            </TouchableOpacity>
          </View>
          
          {imagem && (
            <Image source={{ uri: imagem }} style={styles.previewImage} />
          )}
          
          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.buttonAdd}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  imageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  imageButtonText: {
    color: 'white',
    marginLeft: 5,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCancel: {
    backgroundColor: '#AAA',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  buttonAdd: {
    backgroundColor: '#FF6B8B',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
});