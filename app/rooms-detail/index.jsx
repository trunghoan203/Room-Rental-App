// app/rooms-detail/index.jsx
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import RoomInfo from "../../components/RoomDetail/RoomInfo";
import RoomLocation from "../../components/RoomDetail/RoomLocation";
import Colors from "../../constants/Colors";
import { db } from "../../config/firebase";
import { doc, getDocs } from "firebase/firestore";

export default function RoomDetail() {
    const room = useLocalSearchParams();
    const navigation = useNavigation();
    // const [room, setRoom] = useState();

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: "",
        });

        // const fetchRoomDetails = async () => {
        //     const docRef = doc(db, "rooms", id);
        //     const docSnap = await getDocs(docRef);
        //     if (docSnap.exists()) {
        //         setRoom(docSnap.data());
        //     }
        // };

        // fetchRoomDetails();
    }, [room]);

    if (!room) return <Text>Loading...</Text>;

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <RoomInfo room={room} />
                <RoomLocation location={room.geoLocation} roomId={room.id} />
                <View style={{ height: 70 }} />
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.bookBtn}>
                    <Text style={styles.bookBtnText}>Book This Room</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
