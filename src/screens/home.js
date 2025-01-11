import { StatusBar, StyleSheet, Text, SafeAreaView, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { setOpenWindow } from '../redux/openWindowSlice';

import Background from '../components/background';
import Topbar from '../components/topBar';
import CloseWindow from '../components/closeWindow';
import SettingsWindow from '../components/settingsWindow';
import CreditsWindow from '../components/creditsWindow';
import ErrorWindow from '../components/errorWindow';
import MainButton from '../components/mainButton';

export default function HomeScreen({ route, navigation }) {
    const dispatch = useDispatch();

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
            <Text style={styles.title}>Aryllic's Blackjack</Text>
            <View style={styles.buttonContainer}>
                <MainButton style={{ minWidth: "60%" }} text="Play" onPress={() => {
                    navigation.navigate("Lobbies");
                }} />
                <MainButton style={{ minWidth: "60%" }} text="Settings" onPress={() => {
                    dispatch(setOpenWindow("SettingsWindow"));
                }} />
            </View>
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
        flex: 1,
        marginTop: 150,
        color: "#ffffff",
        textAlign: "center",
        fontSize: 35
    },
    buttonContainer: {
        flex: 1,
        alignItems: "center"
    }
});