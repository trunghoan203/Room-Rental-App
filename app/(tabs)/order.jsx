// app/orders/index.jsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../config/firebase";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import Colors from "../../constants/Colors";

export default function Order() {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [doneBookings, setDoneBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const user = auth.currentUser;

    // Fetch user bookings from Firestore and categorize them by status
    const fetchBookings = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const bookings = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

            // Separate bookings into "Upcoming" and "Done"
            const upcoming = bookings.filter((booking) => booking.status === "Upcoming");
            const done = bookings.filter((booking) => booking.status === "Done");

            setUpcomingBookings(upcoming);
            setDoneBookings(done);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
            setRefreshing(false); // End refreshing
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user.uid]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchBookings(); // Reload data
    };

    // Cancel or Delete booking function
    const cancelOrDeleteBooking = async (bookingId) => {
        try {
            await deleteDoc(doc(db, "bookings", bookingId));
            Alert.alert("Success", "Booking deleted successfully.");
            fetchBookings(); // Refresh bookings after deletion
        } catch (error) {
            console.error("Error deleting booking:", error);
            Alert.alert("Error", "Failed to delete the booking.");
        }
    };

    // Render each booking item
    const renderBooking = ({ item, isUpcoming }) => (
        <View style={styles.bookingItem}>
            <Text style={styles.bookingText}>Name: {item.roomName}</Text>
            <Text style={styles.bookingText}>Location: {item.location}</Text>
            <Text style={styles.bookingText}>Status: {item.status}</Text>
            <Text style={styles.bookingText}>
                Request Date: {item.requestDate ? item.requestDate.toDate().toLocaleDateString() : 'N/A'}
            </Text>
            {/* Show "Cancel Booking" button for upcoming bookings and "Delete Booking" for done bookings */}
            {isUpcoming ? (
                <TouchableOpacity onPress={() => cancelOrDeleteBooking(item.id)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={() => cancelOrDeleteBooking(item.id)} style={styles.deleteButton}>
                    <Text style={styles.deleteButtonText}>Delete Booking</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Display user info at the top */}
            <Text style={styles.header}>My Bookings</Text>
            <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoText}>Name: {user.displayName || "N/A"}</Text>
                <Text style={styles.userInfoText}>Email: {user.email}</Text>
            </View>

            {/* Display loading indicator if data is loading */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                </View>
            ) : (
                <>
                    {/* Display Upcoming Bookings */}
                    {upcomingBookings.length > 0 && (
                        <>
                            <Text style={styles.sectionHeader}>Upcoming Bookings</Text>
                            <FlatList
                                data={upcomingBookings}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => renderBooking({ item, isUpcoming: true })}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                            />
                        </>
                    )}

                    {/* Display Done Bookings */}
                    {doneBookings.length > 0 && (
                        <>
                            <Text style={styles.sectionHeader}>Past Bookings</Text>
                            <FlatList
                                data={doneBookings}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => renderBooking({ item, isUpcoming: false })}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                }
                            />
                        </>
                    )}

                    {/* Show a message if no bookings are found */}
                    {upcomingBookings.length === 0 && doneBookings.length === 0 && (
                        <Text style={styles.noOrdersText}>No bookings found!</Text>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.WHITE,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        marginTop: 20
    },
    userInfoContainer: {
        padding: 5,
        backgroundColor: Colors.LIGHT_GRAY,
        borderRadius: 8,
    },
    userInfoText: {
        fontSize: 16,
        color: Colors.BLACK,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.BLACK,
    },
    bookingItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        marginBottom: 10,
    },
    bookingText: {
        fontSize: 16,
        color: Colors.BLACK,
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
    deleteButton: {
        marginTop: 10,
        backgroundColor: Colors.DARK_GRAY,
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: "white",
        textAlign: "center",
    },
    noOrdersText: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.GRAY,
        marginTop: 20,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
