import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Sound from 'react-native-sound';

import Background from './background';

const clickSound = new Sound("click.wav", Sound.MAIN_BUNDLE, () => { });

function ControlButton(props) {
    return !props.disabled ? (
        <TouchableOpacity
            style={[styles.button, props.style]}
            onPress={() => {
                if (props.disabled) return;

                clickSound.stop(() => {
                    clickSound.play();
                });

                props.onPress();
            }}
        >
            <Text style={styles.buttonText}>{props.text}</Text>
        </TouchableOpacity>
    ) : (
        <View style={[styles.button, props.style]}>
            <Text style={[styles.buttonText, styles.disabledText]}>{props.text}</Text>
        </View>
    );
}

function ChipButton(props) {
    return !props.disabled ? (
        <TouchableOpacity
            style={styles.chipButton}
            onPress={() => {
                clickSound.stop(() => {
                    clickSound.play();
                });

                props.onPress();
            }}
        >
            <Background source={props.source} />
            <Text style={styles.chipText}>{props.text}</Text>
        </TouchableOpacity>
    ) : (
        <View style={styles.chipButton}>
            <Background source={props.source} />
            <Text style={[styles.chipText, styles.disabledText]}>{props.text}</Text>
        </View>
    );
}

export default function GameControls(props) {
    const screenWidth = Dimensions.get("window").width;
    EStyleSheet.build({ $rem: screenWidth / 410 });

    return props.state == "betting" ? (
        <View style={[styles.container, {height: "25%"}]}>
            <View style={[styles.buttonContainer, { height: "50%" }]}>
                <ChipButton text="10K" source={require("../img/chips/Blue_TopDown.png")} onPress={() => {
                    props.bet(10000);
                }} />
                <ChipButton text="50K" source={require("../img/chips/Yellow_TopDown.png")} onPress={() => {
                    props.bet(50000);
                }} />
                <ChipButton text="100K" source={require("../img/chips/Red_TopDown.png")} onPress={() => {
                    props.bet(100000);
                }} />
                <ChipButton text="500K" source={require("../img/chips/Green_TopDown.png")} onPress={() => {
                    props.bet(500000);
                }} />
                <ChipButton text="1M" source={require("../img/chips/Black_TopDown.png")} onPress={() => {
                    props.bet(1000000);
                }} />
            </View>
            <View style={[styles.buttonContainer, { marginTop: "auto", height: "50%" }]}>
                <ControlButton style={{ flex: 1, backgroundColor: "#ff000050" }} text="Rebet" onPress={props.rebet} />
                <ControlButton style={{ flex: 1, backgroundColor: "#00ff0050" }} text="Deal" onPress={props.placeBet} />
            </View>
        </View>
    ) : props.state == "waiting" ? (
        <View style={[styles.container, {height: "15%"}]}>
            <View style={styles.buttonContainer}>
                <ControlButton style={{ backgroundColor: "#ff000050" }} text="Double" disabled={true} />
                <ControlButton style={{ backgroundColor: "#4040ff50" }} text="Split" disabled={true} />
                <ControlButton style={{ backgroundColor: "#4040ff50" }} text="Stand" disabled={true} />
                <ControlButton style={{ backgroundColor: "#00ff0050" }} text="Hit" disabled={true} />
            </View>
        </View>
    ) : props.state == "turn" ? (
        <View style={[styles.container, {height: "15%"}]}>
            <View style={styles.buttonContainer}>
                <ControlButton style={{ backgroundColor: "#ff000050" }} text="Double" onPress={props.double} />
                <ControlButton style={{ backgroundColor: "#4040ff50" }} text="Split" onPress={props.split} />
                <ControlButton style={{ backgroundColor: "#4040ff50" }} text="Stand" onPress={props.stand} />
                <ControlButton style={{ backgroundColor: "#00ff0050" }} text="Hit" onPress={props.hit} />
            </View>
        </View>
    ) : [];
};

const styles = EStyleSheet.create({
    container: {
        //position: "absolute",
        flexDirection: "column",
        marginTop: "auto",
        //bottom: 0,
        padding: 15,
        width: "100%",
        columnGap: 10,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        columnGap: 10,
        height: "100%"
    },
    button: {
        padding: 15,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    buttonText: {
        textAlign: "center",
        fontSize: "20rem",
        color: "#ffffff"
    },
    disabledText: {
        color: "#aaaaaa"
    },
    chipButton: {
        alignItems: "center",
        justifyContent: "center",
        height: "65rem",
        opacity: 0.8,
        borderWidth: 2,
        borderRadius: 9999,
        borderColor: "#64646480",
        aspectRatio: 1 / 1
    },
    chipText: {
        textAlign: "center",
        fontSize: "15rem",
        color: "#ffffff"
    }
});