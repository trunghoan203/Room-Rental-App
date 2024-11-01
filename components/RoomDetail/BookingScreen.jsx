// components/RoomDetail/BookingScreen.jsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { collection, getDocs, doc, deleteDoc, where, query } from "firebase/firestore";

export default function BookingScreen() {
    const [bookings, setBookings] = useState([]);
    const user = auth.currentUser;

    const fetchBookings = async () => {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userBookings = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBookings(userBookings);
    };

    const cancelBooking = async (bookingId) => {
        await deleteDoc(doc(db, "bookings", bookingId));
        Alert.alert("Booking cancelled successfully.");
        fetchBookings();
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const renderBooking = ({ item }) => (
        <View style={styles.bookingItem}>
            <Text>{item.roomName}</Text>
            <Text>{item.date}</Text>
            <TouchableOpacity onPress={() => cancelBooking(item.id)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                renderItem={renderBooking}
                ListEmptyComponent={<Text>No bookings found</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    bookingItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
    },
    cancelButtonText: {
        color: "white",
        textAlign: "center",
    },
});
