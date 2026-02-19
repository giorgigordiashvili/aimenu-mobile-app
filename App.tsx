import { StyleSheet, View } from "react-native";
import { colors } from "./src/theme/colors";
import React from "react";
import { Checkbox } from "./src/components/ui/Checkbox";
import { Radio } from "./src/components/ui/Radio";
import { Switch } from "./src/components/ui/Switch";

export default function MyComponent() {
  const [checkboxValue, setCheckboxValue] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState<string | null>(null);
  const [switchValue, setSwitchValue] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Checkbox
          checked={checkboxValue}
          onChange={setCheckboxValue}
          label="Accept Terms"
        />

        <Checkbox
          checked
          onChange={() => {}}
          label="Disabled Checked"
          disabled
        />
      </View>

      <View style={styles.section}>
        <Radio
          selected={radioValue === "option1"}
          onSelect={() => setRadioValue("option1")}
          label="Option 1"
        />

        <Radio
          selected={radioValue === "option2"}
          onSelect={() => setRadioValue("option2")}
          label="Option 2"
        />

        <Radio selected={false} onSelect={() => {}} label="Disabled" disabled />
      </View>

      <View style={styles.section}>
        <Switch value={switchValue} onValueChange={setSwitchValue} />

        <Switch value onValueChange={() => {}} disabled />
      </View>
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
  section: {
    marginBottom: 24,
    alignItems: "flex-start",
    gap: 12,
  },
});
