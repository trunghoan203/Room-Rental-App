import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import { useRouter } from 'expo-router';

export default function Welcome() {

    const router = useRouter();

    // Data array with a single item to enable FlatList functionality
    const data = [{ key: '1' }];

    const renderItem = () => (
        <View>
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to Room Rental App</Text>
                <Text style={styles.subtitle}>Find your perfect room anytime, anywhere.</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.replace('auth/signin')}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.key}
            contentContainerStyle={{ flexGrow: 1 }}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.WHITE,
        marginTop: -20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: '100%',
        padding: 25,
        paddingBottom: 50,
    },
    button: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 99,
        marginTop: '20%',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        marginTop: 100,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        marginTop: 20
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: "center"
    },
});
