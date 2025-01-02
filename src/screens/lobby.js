import { StatusBar, StyleSheet, Text, SafeAreaView, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setErrorWindowMsg } from '../redux/errorWindowMsgSlice';
import { setOpenWindow } from '../redux/openWindowSlice';

import Background from '../components/background';
import Topbar from '../components/topBar';
import CloseWindow from '../components/closeWindow';
import SettingsWindow from '../components/settingsWindow';
import CreditsWindow from '../components/creditsWindow';
import ErrorWindow from '../components/errorWindow';
import MainButton from '../components/mainButton';
import PlayerView from '../components/playerView';

const { io } = require("socket.io-client");
let socket = null;

function updatePlayers(players, setPlayers) {
    const playerViews = [];

    for (let i = 0; i < players.length; i++) {
        playerViews.push(
            <PlayerView
                key={i}
                name={players[i]}
            />
        );
    };

    setPlayers(playerViews);
};

export default function LobbyScreen({ route, navigation }) {
    const [players, setPlayers] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        socket = io(`https://1a00c07f-144f-4f30-8b69-65c872c7eb1f-00-2aig3or9abes5.janeway.replit.dev/lobbysockets/${route.params.lobby.id}`, {
            reconnection: false,
            extraHeaders: {
                username: route.params.username,
                isHost: route.params.isHost
            }
        });

        socket.on("playersUpdated", (gamePlayers) => {
            updatePlayers(gamePlayers, setPlayers);
        });

        socket.on("gameStarted", (id) => {
            if (socket) {
                socket.disconnect();
            };

            navigation.navigate("Game", { gameId: id, username: route.params.username });
        });

        socket.on("disconnect", (reason) => {
            if (socket) {
                socket.off();
                socket = null;
            };

            if (reason == "transport error" || reason == "transport close" || reason == "ping timeout") {
                dispatch(setErrorWindowMsg("You've been disconnected from the lobby!"));
                dispatch(setOpenWindow("ErrorWindow"));
                navigation.goBack();
            } else if (reason == "io server disconnect") {
                dispatch(setErrorWindowMsg("Lobby closed!"));
                dispatch(setOpenWindow("ErrorWindow"));
                navigation.goBack();
            };
        });

        updatePlayers(route.params.lobby.players, setPlayers);

        return () => {
            if (socket) {
                socket.disconnect();
            };
        };
    }, []);

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
            <Text style={styles.title}>{route.params.lobby.hostName}'s Lobby</Text>
            <ScrollView style={styles.playersContainer}>
                {players}
            </ScrollView>
            <MainButton
                style={{ marginTop: 0, marginBottom: 25, minWidth: "60%" }}
                text="Start Game"
                hidden={!route.params.isHost}
                onPress={() => {
                    if (socket) {
                        socket.emit("startGame");
                    };
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
    playersContainer: {
        flex: 1,
        marginBottom: 25,
        padding: 15,
        width: "85%",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    }
});