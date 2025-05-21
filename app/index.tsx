import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.push("/SplashScreen")}
      >
        <Text style={styles.buttonText}>Go to Splash Screen</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = {
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#55ACEE",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  }
};