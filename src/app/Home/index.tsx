import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Header from 'src/components/Header';

interface Product {
  id?: number; // Tornando opcional pois a API não envia
  nome: string; // Alterando para corresponder à API
  preco: number; // Alterando para número
  imagem: string;
  description?: string; // Tornando opcional pois a API não envia
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      
      <ScrollView contentContainerStyle={styles.productsContainer}>
        {products.map((product, index) => (
          <View key={index} style={styles.productCard}>
            <Image 
              source={{ uri: product.imagem.trim() }} 
              style={styles.productImage}
              onError={() => console.log('Erro ao carregar imagem')}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.nome}</Text>
              <Text style={styles.productPrice}>R$ {product.preco.toFixed(2).replace('.', ',')}</Text>
              {product.description && (
                <Text style={styles.productDescription}>{product.description}</Text>
              )}
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Comprar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Contato:</Text>
        <Text style={styles.contactText}>- WhatsApp: (99) 9999-9999</Text>
        <Text style={styles.contactText}>- Instagram: @llais.amorim</Text>
      </View>
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
  productsContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B8B',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  buyButton: {
    backgroundColor: '#FF6B8B',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
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