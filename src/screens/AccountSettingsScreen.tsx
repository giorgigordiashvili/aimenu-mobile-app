import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from "react-native";
import { colors, textColors } from "../theme/colors";
import { typography } from "../theme/typography";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import { borderRadius, spacing } from "../theme";
import { router } from "expo-router";

export const AccountSettingsScreen = () => {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSave = () => {
    console.log("Saved");
  };

  const onDelete = () => {
    console.log("Delete account");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.title}>{t("accountSettings.title")}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("accountSettings.name")}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t("accountSettings.firstNamePlaceholder")}
            placeholderTextColor={textColors.placeholder}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("accountSettings.email")}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder={t("auth.emailPlaceholder")}
            placeholderTextColor={textColors.placeholder}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("accountSettings.password")}</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t("auth.passwordPlaceholder")}
            placeholderTextColor={textColors.placeholder}
            secureTextEntry
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>{t("accountSettings.saveButton")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
          <Text style={styles.deleteText}>
            {t("accountSettings.deleteButton")}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showDeleteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Drag indicator */}
            <View style={styles.modalHandle} />

            {/* Title */}
            <Text style={styles.modalTitle}>
              {t("accountSettings.deleteConfirmTitle")}
            </Text>

            {/* Description */}
            <Text style={styles.modalText}>
              {t("accountSettings.deleteConfirmText")}
            </Text>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelText}>
                  {t("accountSettings.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setShowDeleteModal(false);
                  console.log("CONFIRMED DELETE");
                }}
              >
                <Text style={styles.deleteButtonText}>
                  {t("accountSettings.delete")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxxl,
  },

  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  title: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: textColors.primary,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },

  form: {
    flex: 1,
  },

  inputWrapper: {
    marginBottom: spacing.md,
  },

  label: {
    ...typography.textSm,
    color: colors.darkGrey,
    marginBottom: spacing.sm,
    fontWeight: typography.h2.fontWeight,
  },

  input: {
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.xmd,
    ...typography.textSm,
  },

  footer: {},

  saveButton: {
    backgroundColor: colors.greenButtonBackground,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  saveText: {
    ...typography.button,
    fontWeight: typography.h1.fontWeight,
    color: colors.white,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteText: {
    textAlign: "center",
    color: colors.error2,
    ...typography.button,
    fontWeight: typography.h1.fontWeight,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    position: "relative",
  },

  modalHandle: {
    width: 60,
    height: 5,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light,
    alignSelf: "center",
    marginBottom: spacing.lg,
    position: "absolute",
    left: "50%",
    top: spacing.sm,
    right: 0,
  },

  modalTitle: {
    textAlign: "center",
    marginBottom: spacing.sm,
    ...typography.textLg,
    fontWeight: typography.h1.fontWeight,
    color: textColors.primary,
  },

  modalText: {
    textAlign: "center",
    color: textColors.secondary,
    marginBottom: spacing.xxxl,
    ...typography.textSm,
  },

  modalButtons: {
    flexDirection: "row",
    gap: spacing.md,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    ...typography.button,
    color: textColors.primary,
  },
  deleteButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    ...typography.button,
    color: colors.white,
    fontWeight: typography.h1.fontWeight,
  },
});
