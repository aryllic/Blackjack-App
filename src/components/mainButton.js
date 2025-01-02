import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Sound from 'react-native-sound';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });

export default function MainButton(props) {
    return !props.hidden ? (
        <TouchableOpacity
            style={[styles.button, props.style]}
            onPress={() => {
                clickSound.stop(() => {
                    clickSound.play();
                });
                
                props.onPress();
            }}
        >
            <Text style={styles.buttonText}>{props.text}</Text>
        </TouchableOpacity>
    ) : [];
};

const styles = StyleSheet.create({
    button: {
        marginTop: 5,
        marginBottom: 5,
        padding: 15,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    buttonText: {
        textAlign: "center",
        fontSize: 25,
        color: "#ffffff"
    }
});