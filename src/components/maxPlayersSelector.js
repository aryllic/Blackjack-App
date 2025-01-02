import { TouchableOpacity, Text, View, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Sound from 'react-native-sound';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });

function MaxButton(props) {
    return (
        <TouchableOpacity
            style={[styles.maxButton, props.style]}
            onPress={() => {
                clickSound.stop(() => {
                    clickSound.play();
                });

                props.onPress();
            }}>
            <Text style={styles.buttonText}>{props.text}</Text>
        </TouchableOpacity>
    );
};

export default function MaxPlayersSelector(props) {
    const screenWidth = Dimensions.get("window").width;
    EStyleSheet.build({ $rem: screenWidth / 410 });

    return (
        <View style={styles.maxPlayersContainer}>
            <Text style={styles.maxPlayersText}>Max Players</Text>
            <MaxButton
                style={props.maxPlayers == 2 ? styles.markedButton : {}}
                text="2"
                onPress={() => { props.setMaxPlayers(2); }}
            />
            <MaxButton
                style={props.maxPlayers == 3 ? styles.markedButton : {}}
                text="3"
                onPress={() => { props.setMaxPlayers(3); }}
            />
            <MaxButton
                style={props.maxPlayers == 4 ? styles.markedButton : {}}
                text="4"
                onPress={() => { props.setMaxPlayers(4); }}
            />
            <MaxButton
                style={props.maxPlayers == 5 ? styles.markedButton : {}}
                text="5"
                onPress={() => { props.setMaxPlayers(5); }}
            />
        </View>
    );
};

const styles = EStyleSheet.create({
    maxPlayersContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        paddingLeft: 5,
        paddingRight: 5
    },
    maxPlayersText: {
        marginRight: "auto",
        fontSize: "23rem",
        color: "#ffffff"
    },
    maxButton: {
        justifyContent: "center",
        marginLeft: "auto",
        padding: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    buttonText: {
        color: "#ffffff",
        fontSize: "20rem"
    },
    markedButton: {
        backgroundColor: "#00ff0050"
    }
});