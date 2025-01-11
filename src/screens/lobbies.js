import { StatusBar, StyleSheet, Text, SafeAreaView, ScrollView, ActivityIndicator, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setOpenWindow } from '../redux/openWindowSlice';
import { setErrorWindowMsg } from '../redux/errorWindowMsgSlice';

import Background from '../components/background';
import Topbar from '../components/topBar';
import CloseWindow from '../components/closeWindow';
import SettingsWindow from '../components/settingsWindow';
import CreditsWindow from '../components/creditsWindow';
import ErrorWindow from '../components/errorWindow';
import LobbyButton from '../components/lobbyButton';
import MainButton from '../components/mainButton';

import fetch from 'node-fetch';

let requesting = false;
let joinUsername = "";

async function updateLobbies(navigation, setLobbyButtons, setloadingIndicatorHidden, dispatch) {
    setloadingIndicatorHidden(false);
    setLobbyButtons([]);

    try {
        const response = await fetch("https://potential-fishstick-xp4p5v4q6xwf64gp-3000.app.github.dev/api/lobbies");
        const data = await response.json();

        const lobbies = [];

        if (data) {
            data.forEach((lobby) => {
                if (!lobby.started) {
                    lobbies.push(
                        <LobbyButton key={lobby.id} hostName={lobby.hostName} players={lobby.players} maxPlayers={lobby.maxPlayers}
                            onPress={() => {
                                joinLobby(navigation, lobby, dispatch, () => {
                                    updateLobbies(navigation, setLobbyButtons, setloadingIndicatorHidden, dispatch)
                                });
                            }}
                        />
                    );
                };
            });
        };

        setLobbyButtons(lobbies);
        setloadingIndicatorHidden(true);
    } catch (error) {
        dispatch(setErrorWindowMsg("There was an error while loading the lobbies!"));
        dispatch(setOpenWindow("ErrorWindow"));
    };
};

async function joinLobby(navigation, lobby, dispatch, updateFunction) {
    if (!requesting) {
        if (!joinUsername || joinUsername.length < 3) {
            dispatch(setErrorWindowMsg("Username must be at least 3 characters long."));
            dispatch(setOpenWindow("ErrorWindow"));
            return;

        } else if (joinUsername.length > 10) {
            dispatch(setErrorWindowMsg("Username can't be longer than 10 characters."));
            dispatch(setOpenWindow("ErrorWindow"));
            return;
        };

        requesting = true;

        try {
            const response = await fetch(`https://potential-fishstick-xp4p5v4q6xwf64gp-3000.app.github.dev/api/lobby/${lobby.id}`);
            const data = await response.json();

            if (!data) {
                dispatch(setErrorWindowMsg("Lobby doesn't exist anymore!"));
                dispatch(setOpenWindow("ErrorWindow"));
                updateFunction();
                requesting = false;
                return;
            } else if (data.started) {
                dispatch(setErrorWindowMsg("Game started already!"));
                dispatch(setOpenWindow("ErrorWindow"));
                updateFunction();
                requesting = false;
                return;
            } else if (data.players.length >= data.maxPlayers) {
                dispatch(setErrorWindowMsg("Lobby is full!"));
                dispatch(setOpenWindow("ErrorWindow"));
                updateFunction();
                requesting = false;
                return;
            };

            navigation.navigate("Lobby", { lobby: data, isHost: false, username: joinUsername });
        } catch (error) {
            dispatch(setErrorWindowMsg("There was an error while joining the lobby!"));
            dispatch(setOpenWindow("ErrorWindow"));
            updateFunction();
        };

        requesting = false;
    };
};

export default function LobbiesScreen({ route, navigation }) {
    const [loadingIndicatorHidden, setloadingIndicatorHidden] = useState(true);
    const [lobbyButtons, setLobbyButtons] = useState([]);
    const [username, usernameChange] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        updateLobbies(navigation, setLobbyButtons, setloadingIndicatorHidden, dispatch);
    }, []);

    useEffect(() => {
        joinUsername = username;
    }, [username]);

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
            <Text style={styles.title}>Lobbies</Text>
            <ScrollView style={styles.lobbyContainer}>
                {lobbyButtons}
            </ScrollView>
            <ActivityIndicator style={styles.loadingIndicator} animating={!loadingIndicatorHidden} size="large" color="#ffffff50" />
            <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={usernameChange} />
            <MainButton
                style={{ marginTop: 25, marginBottom: 25, minWidth: "60%" }}
                text="Create Lobby"
                onPress={() => {
                    navigation.navigate("LobbyCreate", { username: username });
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
    lobbyContainer: {
        flex: 1,
        padding: 15,
        width: "85%",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    loadingIndicator: {
        position: "absolute",
        top: "50%",
        bottom: "50%"
    },
    input: {
        justifyContent: "center",
        marginTop: 5,
        padding: 15,
        maxWidth: "80%",
        textAlign: "center",
        fontSize: 20,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    }
});