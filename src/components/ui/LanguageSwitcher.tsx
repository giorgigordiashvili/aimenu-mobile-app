import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../i18n";
import { colors } from "../../theme/colors";
import ChevronIcon from "../../assets/icons/ChevronIcon";
import { borderRadius, spacing, typography } from "../../theme";

type LangCode = "ka" | "en" | "ru";

const LANGUAGES: { code: LangCode; label: string }[] = [
  { code: "ka", label: "GEO" },
  { code: "en", label: "ENG" },
  { code: "ru", label: "RUS" },
];

const labelFor = (code: string) =>
  LANGUAGES.find((l) => l.code === code)?.label ?? "ENG";

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

interface LanguageSwitcherProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const LanguageSwitcher = ({
  isOpen,
  onOpenChange,
}: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const [internalOpen, setInternalOpen] = useState(false);

  const dropdownOpen = isOpen ?? internalOpen;

  const setDropdownOpen = (nextOpen: boolean) => {
    if (isOpen === undefined) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  };

  const handleSelect = (lang: LangCode) => {
    setLanguage(lang);
    setDropdownOpen(false);
  };

  return (
    <View style={{ position: "relative", width: 68 }}>
      <TouchableOpacity
        style={[styles.container, dropdownOpen && styles.containerOpen]}
        onPress={() => setDropdownOpen(!dropdownOpen)}
        activeOpacity={1}
      >
        <View style={styles.content}>
          <Text style={styles.text}>{labelFor(currentLang)}</Text>
          <ChevronIcon />
        </View>
      </TouchableOpacity>
      {dropdownOpen && (
        <View style={styles.dropdown}>
          {LANGUAGES.map(({ code, label }) => (
            <Pressable
              key={code}
              style={[
                styles.dropdownOption,
                currentLang === code && styles.selectedOption,
              ]}
              onPress={() => handleSelect(code)}
            >
              <Text style={styles.dropdownText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
