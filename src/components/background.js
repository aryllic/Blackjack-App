import { StyleSheet, Image } from 'react-native';

export default function Background(props) {
  return (
    <Image
      style={styles.bg}
      source={props.source}
    />
  );
};

const styles = StyleSheet.create({
  bg: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    zIndex: -1
  }
});