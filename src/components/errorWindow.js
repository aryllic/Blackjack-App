import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sound from 'react-native-sound';

import { setOpenWindow } from '../redux/openWindowSlice';

import Background from './background';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });
const errorSound = new Sound("error.wav", Sound.MAIN_BUNDLE, () => { });

export default function ErrorWindow(props) {
    const openWindow = useSelector(state => state.openWindow.openWindow);
    const errorWindowMsg = useSelector(state => state.errorWindowMsg.errorWindowMsg);
    const dispatch = useDispatch();

    useEffect(() => {
        if (openWindow == "ErrorWindow") {
            errorSound.stop(() => {
                errorSound.play();
            });
        };
    }, [openWindow]);

    return openWindow == "ErrorWindow" ? (
        <View style={styles.background}>
            <View style={styles.window}>
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: "#ff000050" }]}
                    onPress={() => {
                        clickSound.stop(() => {
                            clickSound.play();
                        });

                        dispatch(setOpenWindow(false))
                    }}
                >
                    <Background source={require("../img/x.png")} />
                </TouchableOpacity>
                <Text style={styles.windowText}>{errorWindowMsg}</Text>
            </View>
        </View>
    ) : [];
};

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#00000060",
        zIndex: 100
    },
    window: {
        alignItems: "center",
        maxWidth: "65%",
        padding: 15,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    windowText: {
        fontSize: 25,
        textAlign: "center",
        color: "#ffffff"
    },
    closeButton: {
        position: "absolute",
        top: -25,
        right: -25,
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "#64646480",
    }
});