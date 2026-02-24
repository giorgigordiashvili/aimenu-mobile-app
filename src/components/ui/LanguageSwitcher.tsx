import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Modal,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../i18n";
import { colors, textColors } from "../../theme/colors";
import ChevronIcon from "../../assets/icons/ChevronIcon";
import { borderRadius, spacing, typography } from "../../theme";

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    width: 68,
    borderRadius: 235.29,
    backgroundColor: colors.black + "66",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "transparent",
  },
  containerOpen: {
    borderColor: colors.black,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontSize: typography.buttonSm.fontSize,
    fontWeight: typography.buttonSm.fontWeight,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    left: 0,
    width: 68,
    backgroundColor: colors.white,
    padding: spacing.xs,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light,
    zIndex: 10,
  },
  dropdownOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.lg,
  },
  dropdownText: {
    color: colors.black,
    fontSize: typography.buttonSm.fontSize,
    fontWeight: typography.buttonSm.fontWeight,
  },
  selectedOption: {
    backgroundColor: colors.light,
  },
});

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isGeorgian = i18n.language === "ka";
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (lang: "ka" | "en") => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <View style={{ position: "relative", width: 68 }}>
      <TouchableOpacity
        style={[styles.container, dropdownOpen && styles.containerOpen]}
        onPress={() => setDropdownOpen(!dropdownOpen)}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <Text style={styles.text}>{isGeorgian ? "GEO" : "ENG"}</Text>
          <ChevronIcon />
        </View>
      </TouchableOpacity>
      {dropdownOpen && (
        <View style={styles.dropdown}>
          <Pressable
            style={[styles.dropdownOption, isGeorgian && styles.selectedOption]}
            onPress={() => handleSelect("ka")}
          >
            <Text style={[styles.dropdownText]}>GEO</Text>
          </Pressable>
          <Pressable
            style={[
              styles.dropdownOption,
              !isGeorgian && styles.selectedOption,
            ]}
            onPress={() => handleSelect("en")}
          >
            <Text style={[styles.dropdownText]}>ENG</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};
