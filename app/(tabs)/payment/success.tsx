import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../../../src/theme";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>

      <Text style={styles.title}>გადახდა წარმატებით შესრულდა!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.text}>მთავარ გვერდზე დაბრუნება</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  icon: { fontSize: 80 },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
  },

  button: {
    marginTop: 30,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
  },

  text: { color: "#fff" },
});
