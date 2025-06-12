import React from 'react';
import { View, StyleSheet } from 'react-native';
import TitleLogo from './TitleLogo';

const Header = () => {
    return (
        <View style={styles.header}>
            <View style={styles.logoContainer}>
                <TitleLogo />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#221b0E', // Cor marrom escuro
        width: '100%',
        paddingVertical: 0,
        paddingHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5, // Para Android
        
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Header;