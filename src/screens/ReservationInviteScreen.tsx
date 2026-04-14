import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { colors, spacing, borderRadius, typography } from "../theme";
import { textColors } from "../theme/colors";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import StarIcon from "../assets/icons/StarIcon";
import BillingIcon from "../assets/icons/BillingIcon";
import PersonIcon from "../assets/icons/PersonIcon";
import MailIcon from "../assets/icons/MailIcon";
import { TextInput } from "../components/ui/TextInput";
import { PrimaryCTA } from "../components/reservation/PrimaryCTA";

type PaymentOption = "userPay" | "eachPays";

export default function ReservationInviteScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [paymentOption, setPaymentOption] = useState<PaymentOption>("userPay");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const { name, cuisine_type, rating, cover_image } = useLocalSearchParams<{
    slug: string;
    name: string;
    cuisine_type: string;
    rating: string;
    cover_image: string;
  }>();

  const parsedRating = rating ? parseFloat(rating) : null;
  const imageUri = cover_image ? decodeURIComponent(cover_image) : null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("inviteFriends.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Restaurant info card */}
        <View style={styles.restaurantCard}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.restaurantImage} />
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
              {name ?? ""}
            </Text>
            {cuisine_type ? (
              <Text style={styles.restaurantCuisine} numberOfLines={1}>
                {cuisine_type}
              </Text>
            ) : null}
            {parsedRating !== null ? (
              <View style={styles.ratingBadge}>
                <StarIcon />
                <Text style={styles.ratingText}>{parsedRating.toFixed(1)}</Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment option section */}
        <Text style={styles.sectionLabel}>{t("inviteFriends.payment")}</Text>

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
            <Text style={styles.optionTitle}>{t("inviteFriends.userPay")}</Text>
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
            {paymentOption === "userPay" && <View style={styles.radioDot} />}
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
            {paymentOption === "eachPays" && <View style={styles.radioDot} />}
          </View>
        </TouchableOpacity>

        {/* Add guest section */}
        <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
          {t("inviteFriends.addFriend")}
        </Text>

        <TextInput
          leftIcon={<PersonIcon />}
          placeholder={t("inviteFriends.namePlaceholder")}
          value={guestName}
          onChangeText={setGuestName}
        />
        <TextInput
          leftIcon={<MailIcon />}
          placeholder={t("inviteFriends.phonePlaceholder")}
          value={guestPhone}
          onChangeText={setGuestPhone}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Add to list button */}
        <TouchableOpacity style={styles.addButton} onPress={() => {}}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 21v-6m-3 3h6m-10-3H8c-1.864 0-2.796 0-3.53.305a4 4 0 00-2.166 2.164C2 18.204 2 19.136 2 21M15.5 3.29a4.001 4.001 0 010 7.42M13.5 7a4 4 0 11-8 0 4 4 0 018 0z"
              stroke={colors.dark}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.addButtonText}>
            {t("inviteFriends.addButton")}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <PrimaryCTA
          label={t("inviteFriends.inviteButton")}
          onPress={() => {}}
        />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelText}>{t("inviteFriends.cancel")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

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

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },

  addButtonText: {
    ...typography.button,
    color: colors.dark,
  },

  footer: {
    borderTopWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.state50,
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
