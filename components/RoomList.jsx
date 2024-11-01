import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from './../config/firebase';
import RoomCard from './RoomCard';
import { collection, getDocs, query } from 'firebase/firestore';

export default function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        GetRoomList();
    }, []);

    const GetRoomList = async () => {
        setLoader(true);
        setRooms([]);
        const q = query(collection(db, 'rooms'));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
            setRooms(rooms => [...rooms, { id: doc.id, ...doc.data() }]);
        });
        setLoader(false);
    };

    return (
        <View style={styles.container}>
            {loader ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <FlatList
                    data={rooms}
                    style={styles.list}
                    refreshing={loader}
                    onRefresh={() => GetRoomList()}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RoomCard room={item} />
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    list: {
        marginTop: 10,
    },
});
