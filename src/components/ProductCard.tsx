import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ProductCardProps {
  product: {
    nome: string;
    preco: number;
    imagem?: string;
    description?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { nome, preco, imagem, description } = product;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <View style={styles.productCard}>
      {imagem && !imageError ? (
        <Image
          source={{ uri: imagem }}
          style={styles.productImage}
          resizeMode="cover"
          onError={handleImageError}
        />
      ) : (
        <View style={[styles.productImage, styles.imagePlaceholder]}>
          <MaterialIcons name="broken-image" size={50} color="#aaa" />
          <Text style={styles.imagePlaceholderText}>Imagem não disponível</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{nome}</Text>
        <Text style={styles.productPrice}>
          R$ {typeof preco === 'number' ? preco.toFixed(2).replace('.', ',') : '0,00'}
        </Text>
        {description && (
          <Text style={styles.productDescription}>{description}</Text>
        )}
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
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
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  imagePlaceholderText: {
    color: '#aaa',
    fontSize: 14,
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
});
