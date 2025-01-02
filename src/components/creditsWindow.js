import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Sound from 'react-native-sound';

import { setOpenWindow } from '../redux/openWindowSlice';

import Background from './background';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });

export default function CreditsWindow(props) {
    const openWindow = useSelector(state => state.openWindow.openWindow);
    const dispatch = useDispatch();

    return openWindow == "CreditsWindow" ? (
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
                <Text style={styles.windowText}>Coding:</Text>
                <Text style={styles.subtext}>aryllic</Text>
                <Text style={styles.windowText}>UI:</Text>
                <Text style={styles.subtext}>aryllic</Text>
                <Text style={styles.windowText}>Testers:</Text>
                <Text style={styles.subtext}>Julian Ulrich, Dean Opara</Text>
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
    windowText: {
        alignSelf: "flex-start",
        fontSize: 25,
        textDecorationLine: "underline",
        textAlign: "left",
        color: "#ffffff"
    },
    subtext: {
        alignSelf: "flex-start",
        marginLeft: 15,
        marginTop: 5,
        marginBottom: 5,
        fontSize: 20,
        textAlign: "left",
        color: "#ffffff"
    }
});