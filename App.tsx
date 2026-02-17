import { Text, StyleSheet, View } from "react-native";
import { colors } from "./src/theme/colors";
import { typography } from "./src/theme/typography";
import { Button } from "./src/components/Button/Button";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Text
        style={[typography.h1, { color: colors.primary, textAlign: "center" }]}
      >
        Hello, world!
      </Text>
      <Button title="Primary" size="sm" onPress={() => {}} />
      <Button title="Primary" size="md" onPress={() => {}} />
      <Button title="Primary" size="lg" onPress={() => {}} />

      <Button
        title="Secondary"
        size="sm"
        variant="secondary"
        onPress={() => {}}
      />
      <Button title="Outline" size="sm" variant="outline" onPress={() => {}} />
      <Button title="Ghost" size="sm" variant="ghost" onPress={() => {}} />
      <Button title="Danger" size="sm" variant="danger" onPress={() => {}} />
      <Button
        title="Danger Soft"
        size="sm"
        variant="dangerSoft"
        onPress={() => {}}
      />
      <Button title="Success" size="sm" variant="success" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
