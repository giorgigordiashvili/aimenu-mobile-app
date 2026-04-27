import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors, textColors } from "../theme/colors";
import { typography } from "../theme/typography";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import { borderRadius, spacing } from "../theme";
import { useAuth } from "../context/AuthContext";
import { accountApi } from "../services/account";

export const AccountSettingsScreen = () => {
  const { t } = useTranslation();
  const { user, updateUser, logout } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.first_name ?? "");
    setLastName(user.last_name ?? "");
    setPhone(user.phone ?? "");
  }, [user]);

  const wantsPasswordChange =
    newPassword.length > 0 ||
    oldPassword.length > 0 ||
    confirmPassword.length > 0;

  const validatePassword = (): string | null => {
    if (!wantsPasswordChange) return null;
    if (newPassword.length < 8) return t("accountSettings.errors.passwordMin");
    if (newPassword !== confirmPassword)
      return t("accountSettings.errors.passwordMismatch");
    if (!oldPassword) return t("accountSettings.errors.oldPasswordRequired");
    return null;
  };

  const onSave = async () => {
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }
    setError(null);
    setSaving(true);

    try {
      const profileChanged =
        firstName !== (user?.first_name ?? "") ||
        lastName !== (user?.last_name ?? "") ||
        phone !== (user?.phone ?? "");

      if (profileChanged) {
        await accountApi.updateProfile({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone_number: phone.trim() || undefined,
        });
        await updateUser({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim() || undefined,
        });
      }

      if (wantsPasswordChange) {
        await accountApi.changePassword({
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirm: confirmPassword,
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      Alert.alert(t("accountSettings.saveSuccess"));
    } catch (e: any) {
      const msg = String(e?.message ?? "");
      if (/old_password/.test(msg)) {
        setError(t("accountSettings.errors.oldPasswordWrong"));
      } else {
        setError(t("accountSettings.errors.saveFailed"));
      }
    } finally {
      setSaving(false);
    }
  };

  const onConfirmDelete = async () => {
    setDeleting(true);
    try {
      await accountApi.deleteAccount();
      setShowDeleteModal(false);
      await logout();
      router.replace("/login");
    } catch (e: any) {
      setError(t("accountSettings.errors.deleteFailed"));
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("accountSettings.firstName")}</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t("accountSettings.firstNamePlaceholder")}
            placeholderTextColor={textColors.placeholder}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("accountSettings.lastName")}</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder={t("accountSettings.lastNamePlaceholder")}
            placeholderTextColor={textColors.placeholder}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("accountSettings.phone")}</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder={t("accountSettings.phonePlaceholder")}
            placeholderTextColor={textColors.placeholder}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t("accountSettings.email")}</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={user?.email ?? ""}
            editable={false}
          />
          <Text style={styles.hint}>{t("accountSettings.emailReadonly")}</Text>
        </View>

        <Text style={styles.sectionHeading}>
          {t("accountSettings.changePasswordTitle")}
        </Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            {t("accountSettings.oldPassword")}
          </Text>
          <TextInput
            style={styles.input}
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholder={t("accountSettings.oldPasswordPlaceholder")}
            placeholderTextColor={textColors.placeholder}
            secureTextEntry
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            {t("accountSettings.newPassword")}
          </Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder={t("accountSettings.newPasswordPlaceholder")}
            placeholderTextColor={textColors.placeholder}
            secureTextEntry
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            {t("accountSettings.confirmPassword")}
          </Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t("accountSettings.confirmPasswordPlaceholder")}
            placeholderTextColor={textColors.placeholder}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={onSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveText}>
              {t("accountSettings.saveButton")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
          <Text style={styles.deleteText}>
            {t("accountSettings.deleteButton")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showDeleteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>
              {t("accountSettings.deleteConfirmTitle")}
            </Text>

            <Text style={styles.modalText}>
              {t("accountSettings.deleteConfirmText")}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelText}>
                  {t("accountSettings.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.deleteButtonText}>
                    {t("accountSettings.delete")}
                  </Text>
                )}
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
    paddingTop: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
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
  headerSpacer: {
    width: 44,
    height: 44,
  },
  title: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: textColors.primary,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxxl,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.xmd,
    ...typography.textSm,
    color: textColors.primary,
  },
  inputDisabled: {
    backgroundColor: colors.state100,
    color: colors.gray500,
  },
  hint: {
    ...typography.textXs,
    color: colors.gray500,
    marginTop: spacing.xs,
  },
  sectionHeading: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: {
    ...typography.textSm,
    color: colors.error,
    marginBottom: spacing.sm,
  },
  saveButton: {
    backgroundColor: colors.greenButtonBackground,
    height: 48,
    borderRadius: borderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
    marginTop: spacing.md,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    ...typography.button,
    fontWeight: typography.h1.fontWeight,
    color: colors.white,
  },
  deleteText: {
    textAlign: "center",
    color: colors.error2,
    ...typography.button,
    fontWeight: typography.h1.fontWeight,
    paddingVertical: spacing.sm,
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
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light,
    alignSelf: "center",
    marginBottom: spacing.md,
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
    marginBottom: spacing.lg,
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
