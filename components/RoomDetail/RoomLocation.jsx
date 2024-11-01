// components/RoomDetail/RoomLocation.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { db } from "../../config/firebase";
import { collection, getDocs } from "firebase/firestore";

const RoomLocation = ({ location, roomId }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyRooms, setNearbyRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const RADIUS_KM = 10;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const fetchNearbyRooms = async (currentLocation) => {
        try {
            const roomCollection = collection(db, "rooms");
            const roomDocs = await getDocs(roomCollection);
            const rooms = roomDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const filteredRooms = rooms.filter((room) => {
                if (room.id === roomId) return false;
                const distance = calculateDistance(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    parseFloat(room.geoLocation.lat),
                    parseFloat(room.geoLocation.lng)
                );
                return distance <= RADIUS_KM;
            });

            setNearbyRooms(filteredRooms);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            Alert.alert("Error", "Failed to load nearby rooms");
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission denied", "Location permission is required to find nearby rooms");
                return;
            }

            const userLoc = await Location.getCurrentPositionAsync({});
            setUserLocation({
                latitude: userLoc.coords.latitude,
                longitude: userLoc.coords.longitude,
            });

            fetchNearbyRooms(userLoc.coords);
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Room Location</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <MapView
                    style={styles.map}
                    region={{
                        latitude: parseFloat(location.lat),
                        longitude: parseFloat(location.lng),
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: parseFloat(location.lat),
                            longitude: parseFloat(location.lng),
                        }}
                        title="Room Location"
                        description="This is the location of the room."
                        pinColor="blue"
                    />

                    {userLocation && (
                        <Marker
                            coordinate={userLocation}
                            title="Your Location"
                            pinColor="green"
                        />
                    )}

                    {nearbyRooms.map((room) => (
                        <Marker
                            key={room.id}
                            coordinate={{
                                latitude: parseFloat(room.geoLocation.lat),
                                longitude: parseFloat(room.geoLocation.lng),
                            }}
                            title={room.location || "Nearby Room"}
                            description={`Price: $${room.price} / night`}
                            pinColor="red"
                        />
                    ))}
                </MapView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    map: {
        height: 300,
        borderRadius: 10,
    },
});

export default RoomLocation;
