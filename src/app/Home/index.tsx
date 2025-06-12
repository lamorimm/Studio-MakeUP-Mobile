import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from 'src/components/Header';
import ProductCard from 'src/components/ProductCard';
import AddProductModal from 'src/components/AddProductModal';

interface Product {
  nome: string;
  preco: number;
  imagem: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://studio-make-up-backend.onrender.com/api/produtos');
        const data = await response.json();
        
        if (response.ok) {
          setProducts(data);
        } else {
          setError('Erro ao carregar produtos');
        }
      } catch (err) {
        setError('Erro de conexão com a API');
        console.error('Erro na requisição:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

const handleAddProduct = (newProduct: Product) => {
  setProducts(prev => [newProduct, ...prev]);
};

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B8B" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.welcomeText}>Bem Vindo Ao Studio Makeup</Text>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.productsContainer}>
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </ScrollView>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Contato:</Text>
        <Text style={styles.contactText}>- WhatsApp: (99) 9999-9999</Text>
        <Text style={styles.contactText}>- Instagram: @llais.amorim</Text>
      </View>

      <AddProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddProduct={handleAddProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#FF6B8B',
  },
  addButtonContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  addButton: {
    backgroundColor: '#FF6B8B',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  productsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  contactSection: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  contactTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  contactText: {
    marginBottom: 5,
    fontSize: 14,
  },
});