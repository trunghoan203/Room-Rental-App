import React from 'react';
import { View, Text, Image } from 'react-native';
import Colors from '../../constants/Colors'

export default function RoomInfo({ room }) {
    return (
        <View>
            <Image source={{ uri: room.image }}
                style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    marginTop: 10
                }}
            />
            <View style={{
                padding: 20,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View>
                    <Text style={{
                        fontSize: 27,
                    }}>{room?.location}</Text>

                    <Text style={{
                        fontSize: 16,
                        color: Colors.GRAY,
                    }}>Price: ${room.price} / night</Text>

                    <Text style={{
                        fontSize: 16,
                        color: Colors.GRAY,
                    }}>Description: {room?.description}</Text>
                    <Text style={{
                        fontSize: 16,
                        color: Colors.GRAY,
                    }}>Amenities: {room?.amenities}</Text>
                </View>
            </View>
        </View>
    )
}
