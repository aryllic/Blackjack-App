import { StyleSheet, Text, View } from 'react-native';

export default function PlayerView(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.nameText}>{props.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        marginTop: 5,
        marginBottom: 5,
        padding: 15,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "#64646480",
        backgroundColor: "#00000060"
    },
    nameText: {
        fontSize: 20,
        color: "#ffffff"
    }
});