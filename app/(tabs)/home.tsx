import { View, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Header from "./../../components/Header"
import RoomList from "./../../components/RoomList"

export default function Home() {

  return (
    <View style={styles.container}>
      {<Header/>}
      {<RoomList/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
});
