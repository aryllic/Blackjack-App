import { StyleSheet, View, TouchableOpacity, Text, BackHandler } from 'react-native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sound from 'react-native-sound';

import { setOpenWindow } from '../redux/openWindowSlice';

import Background from './background';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });

export default function TopBar(props) {
    const openWindow = useSelector(state => state.openWindow.openWindow);
    const money = useSelector(state => state.money.money);
    const dispatch = useDispatch();

    useEffect(() => {
        function handleBackButtonClick() {
            if (openWindow) {
                dispatch(setOpenWindow(false));
            } else {
                if (props.route.name == "Home") {
                    if (openWindow != "CloseWindow") {
                        dispatch(setOpenWindow("CloseWindow"));
                    };
                } else {
                    if (props.route.name == "Lobby" || props.route.name == "Game") {
                        return true;
                    };

                    props.navigation.goBack();
                };
            };

            return true;
        };

        const backListener = BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);

        return () => {
            backListener.remove();
        };
    }, [openWindow]);

    return (
        <View style={styles.bar}>
            <TouchableOpacity
                style={[styles.barButton, { backgroundColor: "#ff000050" }]}
                onPress={async () => {
                    clickSound.stop(() => {
                        clickSound.play();
                    });

                    if (props.route.name == "Home") {
                        if (openWindow != "CloseWindow") {
                            dispatch(setOpenWindow("CloseWindow"));
                        };
                    } else if (props.route.name == "Game") {
                        dispatch(setOpenWindow("LeaveWindow"));
                    } else {
                        props.navigation.goBack();
                    };
                }}
            >
                <Background source={require("../img/backArrow.png")} />
            </TouchableOpacity>
            <View style={styles.moneyDisplay}>
                <Text style={styles.moneyText}>${money.toLocaleString("de-DE", { style: "decimal", maximumFractionDigits: 0, minimumFractionDigits: 0, useGrouping: true })}</Text>
            </View>
            <TouchableOpacity
                style={[styles.barButton, { backgroundColor: "#4040ff50" }]}
                onPress={() => {
                    clickSound.stop(() => {
                        clickSound.play();
                    });

                    dispatch(setOpenWindow("SettingsWindow"));
                }}
            >
                <Background source={require("../img/settings.png")} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 25,
        paddingRight: 25,
        height: 75,
        width: "100%",
        backgroundColor: "#00000060"
    },
    barButton: {
        height: 50,
        width: 50,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "#64646480",
        overflow: "hidden"
    },
    moneyDisplay: {
        marginLeft: "auto",
        marginRight: 25,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
        //width: 210,
        //minWidth: 150,
        maxWidth: 210,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    moneyText: {
        fontSize: 20,
        textAlign: "right",
        color: "#ffffff"
    }
});