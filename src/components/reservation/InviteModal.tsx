import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTranslation } from "react-i18next";

import { colors, spacing, borderRadius, typography } from "../../theme";
import { textColors } from "../../theme/colors";
import BackArrowIcon from "../../assets/icons/BackArrowIcon";
import StarIcon from "../../assets/icons/StarIcon";
import BillingIcon from "../../assets/icons/BillingIcon";
import PersonIcon from "../../assets/icons/PersonIcon";
import MailIcon from "../../assets/icons/MailIcon";
import { TextInput } from "../ui/TextInput";
import { PrimaryCTA } from "./PrimaryCTA";
import { Button } from "../Button";

type PaymentOption = "userPay" | "eachPays";

export type InviteModalProps = {
  visible: boolean;
  onClose: () => void;
  reservationCode: string;
  reservationId?: string;
  restaurantName: string;
  date: string;
  time: string;
  cuisineType?: string;
  rating?: string;
  coverImage?: string;
};

export function InviteModal({
  visible,
  onClose,
  restaurantName,
  cuisineType,
  rating,
  coverImage,
}: InviteModalProps) {
  const { t } = useTranslation();

  const [paymentOption, setPaymentOption] = useState<PaymentOption>("userPay");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const parsedRating = rating ? parseFloat(rating) : null;
  const imageUri = coverImage ? decodeURIComponent(coverImage) : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Dim backdrop */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <BackArrowIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t("inviteFriends.title")}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Restaurant info card */}
            <View style={styles.restaurantCard}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.restaurantImage}
                />
              ) : (
                <View
                  style={[
                    styles.restaurantImage,
                    styles.restaurantImagePlaceholder,
                  ]}
                />
              )}
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName} numberOfLines={1}>
                  {restaurantName ?? ""}
                </Text>
                {cuisineType ? (
                  <Text style={styles.restaurantCuisine} numberOfLines={1}>
                    {cuisineType}
                  </Text>
                ) : null}
                {parsedRating !== null ? (
                  <View style={styles.ratingBadge}>
                    <StarIcon />
                    <Text style={styles.ratingText}>
                      {parsedRating.toFixed(1)}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Payment option section */}
            <Text style={styles.sectionLabel}>
              {t("inviteFriends.payment")}
            </Text>

            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentOption === "userPay" && styles.optionCardSelected,
              ]}
              onPress={() => setPaymentOption("userPay")}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconWrap}>
                <BillingIcon />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>
                  {t("inviteFriends.userPay")}
                </Text>
                <Text style={styles.optionSubtitle}>
                  {t("inviteFriends.userPayBio")}
                </Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  paymentOption === "userPay" && styles.radioSelected,
                ]}
              >
                {paymentOption === "userPay" && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionCard,
                paymentOption === "eachPays" && styles.optionCardSelected,
              ]}
              onPress={() => setPaymentOption("eachPays")}
              activeOpacity={0.8}
            >
              <View style={styles.optionIconWrap}>
                <PersonIcon />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>
                  {t("inviteFriends.eachPays")}
                </Text>
                <Text style={styles.optionSubtitle}>
                  {t("inviteFriends.eachPaysBio")}
                </Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  paymentOption === "eachPays" && styles.radioSelected,
                ]}
              >
                {paymentOption === "eachPays" && (
                  <View style={styles.radioDot} />
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.guestCard}>
              {/* Add guest section */}
              <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
                {t("inviteFriends.addFriend")}
              </Text>

              <TextInput
                leftIcon={<PersonIcon />}
                placeholder={t("inviteFriends.namePlaceholder")}
                value={guestName}
                onChangeText={setGuestName}
                inputWrapperStyle={styles.guestInput}
                containerStyle={styles.guestInputContainer}
              />
              <TextInput
                leftIcon={<MailIcon />}
                placeholder={t("inviteFriends.phonePlaceholder")}
                value={guestPhone}
                onChangeText={setGuestPhone}
                keyboardType="email-address"
                autoCapitalize="none"
                inputWrapperStyle={[
                  styles.guestInput,
                  { marginBottom: spacing.sm },
                ]}
                containerStyle={styles.guestInputContainer}
              />

              {/* Add to list button */}
              <Button
                title={t("inviteFriends.addButton")}
                onPress={() => {}}
                variant="outline"
                fullWidth
                leftIcon={
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M19 21v-6m-3 3h6m-10-3H8c-1.864 0-2.796 0-3.53.305a4 4 0 00-2.166 2.164C2 18.204 2 19.136 2 21M15.5 3.29a4.001 4.001 0 010 7.42M13.5 7a4 4 0 11-8 0 4 4 0 018 0z"
                      stroke={colors.dark}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                }
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <PrimaryCTA
              label={t("inviteFriends.inviteButton")}
              onPress={() => {}}
            />
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>{t("inviteFriends.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  sheet: {
    backgroundColor: colors.state50,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: "92%",
    paddingBottom: Platform.OS === "ios" ? spacing.xl : spacing.lg,
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.light,
    alignSelf: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
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
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },

  headerSpacer: {
    width: 44,
    height: 44,
  },

  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  restaurantImage: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light,
  },

  restaurantImagePlaceholder: {
    backgroundColor: colors.grey,
  },

  restaurantInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  restaurantName: {
    ...typography.h3,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginBottom: spacing.xs,
  },

  restaurantCuisine: {
    ...typography.textSm,
    color: textColors.secondary,
    marginBottom: spacing.sm,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.state100,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },

  ratingText: {
    ...typography.buttonSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
  },

  divider: {
    height: 1,
    backgroundColor: colors.light,
    marginBottom: spacing.lg,
  },

  sectionLabel: {
    ...typography.h4,
    color: colors.dark,
    marginBottom: spacing.md,
  },

  sectionLabelSpaced: {
    marginTop: spacing.lg,
  },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colors.light,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },

  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },

  optionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.state100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  optionText: {
    flex: 1,
  },

  optionTitle: {
    ...typography.button,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
    marginBottom: spacing.xs,
  },

  optionSubtitle: {
    ...typography.textXs,
    color: textColors.secondary,
  },

  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },

  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },

  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.white,
  },

  guestCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },

  guestInputContainer: {
    marginBottom: 0,
    paddingVertical: spacing.xs,
  },

  guestInput: {
    borderWidth: 0,
    borderRadius: borderRadius.md,
    backgroundColor: colors.state100,
    paddingHorizontal: spacing.md,
  },

  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },

  cancelText: {
    ...typography.textSm,
    color: textColors.secondary,
  },
});
