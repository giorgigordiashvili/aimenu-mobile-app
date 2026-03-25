import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

type TabButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

export const TabButton: React.FC<TabButtonProps> = ({
  title,
  active,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 20 }}>
      <Text
        style={{
          ...typography.textBase,
          fontWeight: active ? "600" : "400",
          color: active ? colors.dark : colors.gray500,
        }}
      >
        {title}
      </Text>

      {active && (
        <View
          style={{
            height: 2,
            backgroundColor: colors.primary,
            marginTop: 6,
            borderRadius: 2,
          }}
        />
      )}
    </TouchableOpacity>
  );
};
