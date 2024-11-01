import { View, Text } from "react-native";
import { auth } from "../config/firebase";
import { Redirect } from "expo-router";
import Welcome from "../components/Welcome";

export default function Index() {

    const user = auth.currentUser;

    return (
        <View style={{
            flex: 1,
        }}>
            {user ? <Redirect href={'/home'} /> :
                <Welcome />
            }
        </View>
    );
}
