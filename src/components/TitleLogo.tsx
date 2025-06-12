import React from 'react';
import { Text, StyleSheet } from 'react-native';

const TitleLogo = () => {
  return (
    <Text style={styles.title}>MakeUp Studio</Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default TitleLogo;