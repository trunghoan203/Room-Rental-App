import { Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export default function Header() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>
            <View style={{
                marginTop: 40
            }}>
                <Text style={{
                    fontSize: 20,
                }}>Welcome,</Text>
                <Text style={{
                    fontSize: 25,
                }}>{user?.displayName || "users"}</Text>
            </View>
        </View>
    );
}