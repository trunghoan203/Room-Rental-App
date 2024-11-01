// app/rooms-detail/index.jsx
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import RoomInfo from "../../components/RoomDetail/RoomInfo";
import Colors from "../../constants/Colors";
import { db } from "../../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import MapView, { Marker } from 'react-native-maps';

export default function RoomDetail() {
    const room = useLocalSearchParams();
    const roomId = room.id;
    const [loader, setLoader] = useState(false);
    const navigation = useNavigation();
    const router = useRouter();
    const user = getAuth().currentUser;

    const latitude = room.coordinates.latitude || 0; // Default to 0 if latitude is undefined
    const longitude = room.coordinates.longitude || 0; // Default to 0 if longitude is undefined

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [room]);

    const handleBookRoom = async () => {
        try {
            setLoader(true);
            await addDoc(collection(db, 'bookings'), {
                roomId,
                userId: user.uid,
                status: 'Upcoming',
                requestDate: new Date(),
                roomName: room.name,
                location: room.location
            });

            // Show success message and navigate to Orders page
            Alert.alert(
                "Success",
                "Room booked successfully!",
                [{ text: "OK", onPress: () => router.replace("/order") }],
                { cancelable: false }
            );

        } catch (error) {
            console.error("Error booking room:", error);
            Alert.alert("Error", "Failed to book the room. Please try again.");
        } finally {
            setLoader(false); // Hide loader
        }
    };

    if (!room) return <Text>Loading...</Text>;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <RoomInfo room={room} />

                {/* MapView with initial region and Marker */}
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        title={room.name}
                        description={room.location}
                    />
                </MapView>

                <View style={{ height: 70 }} />
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.bookBtn} onPress={handleBookRoom} disabled={loader}>
                    <Text style={styles.bookBtnText}>{loader ? "Booking..." : "Book This Room"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        height: 300,
        width: '100%',
        borderRadius: 10,
        marginVertical: 20,
    },
    bookBtn: {
        padding: 15,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 5,
        marginHorizontal: 20,
    },
    bookBtnText: {
        textAlign: "center",
        fontSize: 20,
        color: Colors.WHITE,
    },
    bottomContainer: {
        position: "absolute",
        width: "100%",
        bottom: 0,
        paddingBottom: 20,
        backgroundColor: Colors.WHITE,
    },
});
