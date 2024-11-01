import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Colors from '../constants/Colors'; // Ensure you have a Colors constant or adjust as necessary
import { useRouter } from 'expo-router';

export default function Header() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                Alert.alert("Logged Out", "You have been successfully logged out.");
                router.replace('/auth/signin'); // Redirect to sign-in page after logout
            })
            .catch((error) => {
                console.error("Error logging out: ", error);
                Alert.alert("Error", "Failed to log out. Please try again.");
            });
    };

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.welcomeText}>Welcome,</Text>
                <Text style={styles.userName}>{user?.displayName || "User"}</Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    welcomeText: {
        fontSize: 20,
    },
    userName: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    logoutButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colors.PRIMARY, // Adjust the color as needed
        borderRadius: 5,
    },
    logoutButtonText: {
        color: Colors.WHITE, // Adjust text color as needed
        fontSize: 16,
        fontWeight: 'bold',
    },
});
