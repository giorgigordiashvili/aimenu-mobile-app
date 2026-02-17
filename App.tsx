import { Text, StyleSheet, View } from "react-native";
import { TextInput } from "./src/components/ui/TextInput";
import { colors } from "./src/theme/colors";
import { typography } from "./src/theme/typography";
import { Button } from "./src/components/Button/Button";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <TextInput
        label="Email"
        placeholder="Enter your email"
        hint="We will never share your email"
      />

      <TextInput
        label="Password"
        placeholder="Enter password"
        error="Password is required"
      />

      <TextInput
        label="Disabled Field"
        placeholder="Can't type here"
        disabled
      />
      <Button title="Primary" size="sm" onPress={() => {}} />

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
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
