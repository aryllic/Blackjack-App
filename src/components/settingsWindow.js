import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Sound from 'react-native-sound';

import { setOpenWindow } from '../redux/openWindowSlice';
import { setSettings } from '../redux/settingsSlice';

import Background from './background';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });

function boolText(bool) {
    if (bool == true) {
        return "ON";
    };

    return "OFF";
};

export default function SettingsWindow(props) {
    const openWindow = useSelector(state => state.openWindow.openWindow);
    const settings = useSelector(state => state.settings.settings);
    const dispatch = useDispatch();

    /*if (enableMusic) {
        backGroundMusic.setVolume(1);
    } else {
        backGroundMusic.setVolume(0);
    };*/

    return openWindow == "SettingsWindow" ? (
        <View style={styles.background}>
            <View style={styles.window}>
                <TouchableOpacity
                    style={[styles.closeButton, { backgroundColor: "#ff000050" }]}
                    onPress={() => {
                        clickSound.stop(() => {
                            clickSound.play();
                        });

                        dispatch(setOpenWindow(false));
                    }}
                >
                    <Background source={require("../img/x.png")} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.windowButton}
                    onPress={() => {
                        clickSound.stop(() => {
                            clickSound.play();
                        });

                        dispatch(setSettings({ enableMusic: !settings.enableMusic }));
                    }}
                >
                    <Text style={styles.buttonText}>Music: {boolText(settings.enableMusic)}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.windowButton}
                    onPress={() => {
                        clickSound.stop(() => {
                            clickSound.play();
                        });

                        dispatch(setOpenWindow("CreditsWindow"));
                    }}
                >
                    <Text style={styles.buttonText}>Credits</Text>
                </TouchableOpacity>
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
        maxWidth: "85%",
        padding: 15,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
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
    },
    windowButton: {
        margin: 5,
        padding: 5,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#4040ff50"
    },
    buttonText: {
        fontSize: 25,
        textAlign: "center",
        color: "#ffffff"
    }
});