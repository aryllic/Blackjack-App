import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sound from 'react-native-sound';

import { setOpenWindow } from '../redux/openWindowSlice';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });
const errorSound = new Sound("error.wav", Sound.MAIN_BUNDLE, () => { });

export default function LeaveWindow(props) {
    const openWindow = useSelector(state => state.openWindow.openWindow);
    const dispatch = useDispatch();

    useEffect(() => {
        if (openWindow == "LeaveWindow") {
            errorSound.stop(() => {
                errorSound.play();
            });
        };
    }, [openWindow]);

    return openWindow == "LeaveWindow" ? (
        <View style={styles.background}>
            <View style={styles.window}>
                <Text style={styles.windowText}>Do you really want to leave the game?</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.windowButton, { backgroundColor: "#ff000050" }]}
                        onPress={() => {
                            clickSound.stop(() => {
                                clickSound.play();
                            });

                            dispatch(setOpenWindow(false));

                            props.navigation.reset({
                                index: 0,
                                routes: [{ name: "Home" }]
                            });
                        }}
                    >
                        <Text style={styles.buttonText}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.windowButton, { backgroundColor: "#00ff0050" }]}
                        onPress={() => {
                            clickSound.stop(() => {
                                clickSound.play();
                            });

                            dispatch(setOpenWindow(false));
                        }}
                    >
                        <Text style={styles.buttonText}>No</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 15,
        maxWidth: "85%",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    windowText: {
        marginBottom: 15,
        fontSize: 25,
        textAlign: "center",
        color: "#ffffff"
    },
    buttonContainer: {
        flexDirection: "row"
    },
    windowButton: {
        marginLeft: 15,
        marginRight: 15,
        padding: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        textAlign: "center"
    },
    buttonText: {
        fontSize: 25,
        textAlign: "center",
        color: "#ffffff"
    }
});