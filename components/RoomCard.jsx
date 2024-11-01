import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../constants/Colors'
import { useRouter } from 'expo-router'

export default function RoomCard({ room }) {
    const router = useRouter();
    return (
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/rooms-detail',
                params: room
            })}
            style={{
                padding: 10,
                marginRight: 15,
                backgroundColor: Colors.WHITE,
                borderRadius: 10
            }}>
            <View style={styles.card}>
                <Image source={{ uri: room.image }} style={styles.image} />
                <Text style={styles.title}>{room.name}</Text>
                <Text style={styles.location}>{room.location}</Text>
                <Text>Price: ${room.price} / night</Text>
                <Text numberOfLines={2} style={styles.description}>{room.description}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
    },
    location: {
        fontSize: 18,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});