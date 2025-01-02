import { StatusBar, StyleSheet, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setMoney } from '../redux/moneySlice';
import { setErrorWindowMsg } from '../redux/errorWindowMsgSlice';
import { setOpenWindow } from '../redux/openWindowSlice';

import Background from '../components/background';
import Topbar from '../components/topBar';
import CloseWindow from '../components/closeWindow';
import SettingsWindow from '../components/settingsWindow';
import CreditsWindow from '../components/creditsWindow';
import ErrorWindow from '../components/errorWindow';
import LeaveWindow from '../components/leaveWindow';
import GameControls from '../components/gameControls';
import GameView from '../components/gameView';

const { io } = require("socket.io-client");
let socket = null;
let playerId = null;
let player = null;
let dynamicMoney = 0;

function updateMoney(dispatch) {
    if (dynamicMoney < 10000) {
        dispatch(setErrorWindowMsg("You are out of money!"));
        dispatch(setOpenWindow("ErrorWindow"));
        dispatch(setMoney(100000));
    };
};

function combineDeckBet(bet) {
    let totalBet = 0;

    bet.forEach((stack) => {
        stack.forEach((amount) => {
            totalBet += amount;
        });
    });

    return totalBet;
};

cardValue = function (rank) {
    let number = Number(rank);
  
    if (!number) {
      if (rank == "Ace") {
        number = 11;
      } else {
        number = 10;
      };
    };
  
    return number;
  };

export default function GameScreen({ route, navigation }) {
    const [players, setPlayers] = useState([]);
    const [dealerCards, setDealerCards] = useState([]);
    const [gameSate, setGameState] = useState("waiting");
    const money = useSelector(state => state.money.money);
    const dispatch = useDispatch();

    useEffect(() => {
        socket = io(`https://1a00c07f-144f-4f30-8b69-65c872c7eb1f-00-2aig3or9abes5.janeway.replit.dev/gamesockets/${route.params.gameId}`, {
            reconnection: false,
            extraHeaders: {
                username: route.params.username
            }
        });

        socket.emit("getPlayer", (gamePlayer) => {
            player = gamePlayer;
            playerId = gamePlayer.id;
        });

        socket.on("gameStateChanged", (state) => {
            setGameState(state);
        });

        socket.on("playersUpdated", (gamePlayers) => {
            player = gamePlayers.find(player => player.id == playerId);
            setPlayers(gamePlayers);
        });

        socket.on("dealerCardsUpdated", (cards) => {
            setDealerCards(cards);
        });

        socket.on("deckWon", (deckBet) => {
            const winAmount = combineDeckBet(deckBet) * 2;

            dispatch(setMoney(dynamicMoney + winAmount));
        });

        socket.on("returnDeck", (deckBet) => {
            const returnAmount = combineDeckBet(deckBet);

            dispatch(setMoney(dynamicMoney + returnAmount));
        });

        socket.on("blackjack", (deckBet) => {
            const winAmount = combineDeckBet(deckBet) * 2.5;

            dispatch(setMoney(dynamicMoney + winAmount));
        });

        socket.on("roundEnded", () => {
            updateMoney(dispatch);
        });

        socket.on("awaitResponse", (callback) => {
            callback({
                success: true
            });
        });

        /*socket.on("playAnimation", (animation) => {

        });*/

        socket.on("disconnect", (reason) => {
            if (socket) {
                socket.off();
                socket = null;
            };

            if (reason == "transport error" || reason == "transport close" || reason == "ping timeout") {
                dispatch(setErrorWindowMsg("You've been disconnected from the game!"));
                dispatch(setOpenWindow("ErrorWindow"));
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }]
                });
            } else if (reason == "io server disconnect") {
                dispatch(setErrorWindowMsg("Game ended!"));
                dispatch(setOpenWindow("ErrorWindow"));
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }]
                });
            };
        });

        return () => {
            if (socket) {
                socket.disconnect();
            };

            for (i = 0; i < player.bets.length; i++) {
                dispatch(setMoney(dynamicMoney + combineDeckBet(player.bets[i])));
            };

            dynamicMoney = money;
            updateMoney(dispatch);
        };
    }, []);

    useEffect(() => {
        dynamicMoney = money;
    }, [money]);
    //UPDATE MONEY WHEN LEAVING SCREEN

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
            <LeaveWindow navigation={navigation} />
            <GameView
                players={players}
                dealerCards={dealerCards}
            />
            <GameControls
                state={gameSate}
                bet={(amount) => {
                    if (socket) {
                        if (dynamicMoney >= amount) {
                            dispatch(setMoney(dynamicMoney - amount));
                            socket.emit("addBet", amount);
                        } else {
                            dispatch(setErrorWindowMsg("Not enough money!"));
                            dispatch(setOpenWindow("ErrorWindow"));
                        };
                    };
                }}
                rebet={() => {
                    if (socket) {
                        const deckBet = combineDeckBet(player.bets[0]);
                        
                        if (deckBet > 0) {
                            dispatch(setMoney(dynamicMoney + deckBet));
                            socket.emit("rebet");
                        };
                    };
                }}
                placeBet={() => {
                    if (socket) {
                        if (player.bets[0][0].length > 0) {
                            setGameState("waiting");
                            socket.emit("placeBet");
                        } else {
                            dispatch(setErrorWindowMsg("You must place a bet!"));
                            dispatch(setOpenWindow("ErrorWindow"));
                        };
                    };
                }}
                double={() => {
                    if (socket) {
                        const deckBet = combineDeckBet(player.bets[player.currentDeck]);

                        if (dynamicMoney >= deckBet) {
                            dispatch(setMoney(dynamicMoney - deckBet));
                            setGameState("waiting");
                            socket.emit("double");
                        } else {
                            dispatch(setErrorWindowMsg("Not enough money!"));
                            dispatch(setOpenWindow("ErrorWindow"));
                        };
                    };
                }}
                split={() => {
                    if (socket) {
                        const deckBet = combineDeckBet(player.bets[player.currentDeck]);

                        if (dynamicMoney >= deckBet) {
                            if (player.decks[player.currentDeck].length == 2 && cardValue(player.decks[player.currentDeck][0].rank) == cardValue(player.decks[player.currentDeck][1].rank) && player.decks.length < 3) {
                                dispatch(setMoney(dynamicMoney - deckBet));
                                setGameState("waiting");
                                socket.emit("split");
                            };
                        } else {
                            dispatch(setErrorWindowMsg("Not enough money!"));
                            dispatch(setOpenWindow("ErrorWindow"));
                        };
                    };
                }}
                stand={() => {
                    if (socket) {
                        setGameState("waiting");
                        socket.emit("stand");
                    };
                }}
                hit={() => {
                    if (socket) {
                        setGameState("waiting");
                        socket.emit("hit");
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