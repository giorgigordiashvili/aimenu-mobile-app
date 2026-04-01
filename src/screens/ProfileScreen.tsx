import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { colors } from "../theme/colors";
import { LanguageSwitcher } from "../components/ui/LanguageSwitcher";
import CardArrow from "../assets/icons/CardArrow";
import SettingsIcon from "../assets/icons/SettingsIcon";
import BillingIcon from "../assets/icons/BillingIcon";
import OrdersIcon from "../assets/icons/OrdersIcon";
import FavoritesIcon from "../assets/icons/FavoritesIcon";
import LanguageIcon from "../assets/icons/LanguageIcon";
import LogoutIcon from "../assets/icons/LogoutIcon";
import CurrencyIcon from "../assets/icons/CurrencyIcon";
import CameraIcon from "../assets/icons/CameraIcon";
import { borderRadius, spacing, typography } from "../theme";
import { useAuth } from "../context/AuthContext";

// Temporary user (replace with auth later)
const user = {
  name: "გაგი მურჯიკნელი",
  phone: "+995 577 48 88 96",
  avatar: "", // if empty → fallback to initials
};

// Reusable Menu Item
interface MenuItemProps {
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  danger?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  hideBottomBorder?: boolean;
}

const ProfileMenuItem = ({
  label,
  onPress,
  rightElement,
  leftElement,
  danger,
  containerStyle,
  hideBottomBorder,
}: MenuItemProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.menuItem,
        hideBottomBorder && styles.menuItemNoBorder,
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={1}
    >
      <View style={styles.leftContent}>
        {leftElement ? (
          <View style={styles.leftIconContainer}>{leftElement}</View>
        ) : null}
        <Text style={[styles.menuLabel, danger && styles.dangerText]}>
          {label}
        </Text>
      </View>

      {rightElement ? rightElement : <CardArrow color={colors.gray500} />}
    </TouchableOpacity>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const profileName = user.name || t("profile.name");
  const { logout } = useAuth();
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{t("profile.title")}</Text>

      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{getInitials(profileName)}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.editAvatar}
            onPress={() => Alert.alert("Edit avatar")}
          >
            <CameraIcon />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={styles.userName}>{profileName}</Text>
          <Text style={styles.userPhone}>{user.phone}</Text>
        </View>
      </View>

      {/* Section 1 */}
      <View style={styles.section}>
        <ProfileMenuItem
          label={t("profile.settings")}
          leftElement={<SettingsIcon />}
          onPress={() => router.push("/settings")}
        />
        <ProfileMenuItem
          label={t("profile.payment")}
          leftElement={<BillingIcon />}
          onPress={() => router.push("/payments")}
        />
        <ProfileMenuItem
          label={t("profile.orders")}
          leftElement={<OrdersIcon />}
          onPress={() => router.push("/order-history")}
        />
        <ProfileMenuItem
          label={t("profile.favorites")}
          leftElement={<FavoritesIcon />}
          hideBottomBorder
          onPress={() => router.push("/favorites")}
        />
      </View>

      {/* Section 2 */}
      <View style={[styles.section, styles.sectionOverflowVisible]}>
        <ProfileMenuItem
          label={t("profile.language")}
          leftElement={<LanguageIcon />}
          onPress={() => setIsLanguageDropdownOpen((prev) => !prev)}
          containerStyle={styles.languageMenuItem}
          rightElement={
            <LanguageSwitcher
              isOpen={isLanguageDropdownOpen}
              onOpenChange={setIsLanguageDropdownOpen}
            />
          }
        />
        <ProfileMenuItem
          label={t("profile.currency")}
          leftElement={<CurrencyIcon />}
          hideBottomBorder
          rightElement={
            <View style={styles.currencyBox}>
              <Text style={styles.currencyText}>GEL</Text>
            </View>
          }
        />
      </View>

      {/* Section 3 */}
      <View style={styles.section}>
        <ProfileMenuItem
          label={t("profile.logout")}
          leftElement={<LogoutIcon />}
          hideBottomBorder
          danger
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.md,
  },

  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    marginBottom: spacing.lg,
  },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xmd,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    marginBottom: spacing.sm,
  },

  avatarContainer: {
    position: "relative",
    marginRight: spacing.md,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: borderRadius.full,
  },

  avatarFallback: {
    width: 55,
    height: 55,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: colors.white,
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h1.fontWeight,
  },

  editAvatar: {
    position: "absolute",
    bottom: -2,
    right: 2,
    backgroundColor: colors.white,
    borderRadius: borderRadius.full,
    width: 19,
    height: 21,
    borderWidth: 1,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xs,
  },

  userName: {
    fontSize: typography.paragraph.fontSize,
    fontWeight: typography.buttonLg.fontWeight,
    color: colors.gray900,
  },

  userPhone: {
    fontSize: typography.textXs.fontSize,
    color: colors.gray500,
    marginTop: spacing.xs,
  },

  section: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },

  sectionOverflowVisible: {
    overflow: "visible",
    zIndex: 30,
    backgroundColor: colors.white,
  },

  menuItem: {
    height: 56,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xmd,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.light,
    cursor: "pointer",
  },

  menuItemNoBorder: {
    borderBottomWidth: 0,
  },

  languageMenuItem: {
    zIndex: 40,
    shadowColor: "transparent",
    borderRadius: borderRadius.lg,
  },

  menuLabel: {
    ...typography.textXs,
    color: colors.dark,
  },

  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xmd,
  },

  leftIconContainer: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.full,
    backgroundColor: colors.grey,
    alignItems: "center",
    justifyContent: "center",
  },

  dangerText: {
    color: colors.error,
  },

  currencyBox: {
    backgroundColor: colors.grey,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },

  currencyText: {
    ...typography.textXs,
  },
});
