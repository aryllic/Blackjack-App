import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import Sound from 'react-native-sound';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });

export default function LobbyButton(props) {
    return (
        <TouchableOpacity
            style={[styles.button, props.style]}
            onPress={() => {
                clickSound.stop(() => {
                    clickSound.play();
                });

                props.onPress();
            }}
        >
            <Text style={styles.hostText}>{props.hostName}</Text>
            <View style={styles.playersContainer}>
                <Text style={styles.playersText}>{props.players.length}/{props.maxPlayers}</Text>
                <Image style={styles.playersImage} source={require("../img/players.png")}></Image>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 5,
        padding: 15,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    hostText: {
        fontSize: 20,
        color: "#ffffff"
    },
    playersContainer: {
        flexDirection: "row",
        position: "absolute",
        alignItems: "center",
        right: 0,
        padding: 15
    },
    playersText: {
        textAlign: "right",
        fontSize: 15,
        color: "#ffffff"
    },
    playersImage: {
        resizeMode: "contain",
        marginLeft: 5,
        width: 30,
        aspectRatio: 1 / 1
    }
});