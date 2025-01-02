import { StatusBar, StyleSheet, Text, TextInput, SafeAreaView, View } from 'react-native';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setOpenWindow } from '../redux/openWindowSlice';
import { setErrorWindowMsg } from '../redux/errorWindowMsgSlice';

import Background from '../components/background';
import Topbar from '../components/topBar';
import CloseWindow from '../components/closeWindow';
import SettingsWindow from '../components/settingsWindow';
import CreditsWindow from '../components/creditsWindow';
import ErrorWindow from '../components/errorWindow';
import MainButton from '../components/mainButton';
import MaxPlayersSelector from '../components/maxPlayersSelector';

let requesting = false;

async function createLobby(navigation, lobbySettings, dispatch) {
    if (!requesting) {
        if (!lobbySettings.hostName || lobbySettings.hostName.length < 3) {
            dispatch(setErrorWindowMsg("Username must be at least 3 characters long."));
            dispatch(setOpenWindow("ErrorWindow"));
            return;

        } else if (lobbySettings.hostName.length > 10) {
            dispatch(setErrorWindowMsg("Username can't be longer than 10 characters."));
            dispatch(setOpenWindow("ErrorWindow"));
            return;
        };

        requesting = true;

        try {
            const response = await fetch("https://1a00c07f-144f-4f30-8b69-65c872c7eb1f-00-2aig3or9abes5.janeway.replit.dev/api/lobby", {
                method: 'POST',
                body: JSON.stringify({ hostName: lobbySettings.hostName, maxPlayers: lobbySettings.maxPlayers }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data && data.success) {
                navigation.navigate("Lobby", { lobby: data.lobby, isHost: true, username: lobbySettings.hostName });
            };
        } catch (error) {
            dispatch(setErrorWindowMsg("An error occured while creating the lobby!"));
            dispatch(setOpenWindow("ErrorWindow"));
        };

        requesting = false;
    };
};

export default function LobbyCreateScreen({ route, navigation }) {
    const [username, usernameChange] = useState(route.params.username || "");
    const [maxPlayers, setMaxPlayers] = useState(5);
    //const [useAIDealer, setUseAIDealer] = useState(true);
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                animated={true}
                showHideTransition={true}
                translucent={true}
                backgroundColor="transparent"
                hidden={true}
            />
            <Background source={require("../img/bg.jpeg")} />
            <Topbar route={route} navigation={navigation} />
            <CloseWindow />
            <SettingsWindow />
            <CreditsWindow />
            <ErrorWindow />
            <Text style={styles.title}>Create Lobby</Text>
            <View style={styles.createContainer}>
                <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={usernameChange} />
                <MaxPlayersSelector maxPlayers={maxPlayers} setMaxPlayers={setMaxPlayers} />
            </View>
            <MainButton
                style={{ marginTop: 25, marginBottom: 25, minWidth: "60%" }}
                text="Create"
                onPress={() => {
                    const lobbySettings = {
                        hostName: username,
                        maxPlayers: maxPlayers
                    };

                    createLobby(navigation, lobbySettings, dispatch);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center'
    },
    title: {
        margin: 25,
        color: "#ffffff",
        textAlign: "center",
        fontSize: 35
    },
    createContainer: {
        flex: 1,
        padding: 15,
        width: "85%",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    input: {
        justifyContent: "center",
        marginBottom: 15,
        padding: 15,
        fontSize: 20,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    }
});