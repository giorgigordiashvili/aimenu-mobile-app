import { useState } from "react";
import {
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { borderRadius, colors, spacing, typography } from "../../theme";
import type { ReferralSummary } from "../../types/referral";

interface Props {
  summary: ReferralSummary | null | undefined;
}

type CopiedKind = "code" | "link" | null;

export function ShareCard({ summary }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<CopiedKind>(null);

  const code = summary?.referral_code ?? "";
  const link = summary?.referral_url ?? "";

  const copy = async (value: string, kind: Exclude<CopiedKind, null>) => {
    if (!value) return;
    try {
      await Clipboard.setStringAsync(value);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  const onShare = async () => {
    if (!link) return;
    try {
      await Share.share({
        title: t("referral.shareTitle"),
        message: t("referral.shareText", { code }),
        url: link,
      });
    } catch {
      // user cancelled — silent
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>{t("referral.referralCodeLabel")}</Text>
          <Text style={styles.code} selectable>
            {code || "—"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copy(code, "code")}
          activeOpacity={0.8}
        >
          <Text style={styles.copyText}>
            {copied === "code" ? t("referral.copied") : t("referral.copyCode")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.field}>
          <Text style={styles.label}>{t("referral.referralLinkLabel")}</Text>
          <Text style={styles.link} numberOfLines={1} selectable>
            {link || "—"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copy(link, "link")}
          activeOpacity={0.8}
        >
          <Text style={styles.copyText}>
            {copied === "link" ? t("referral.copied") : t("referral.copyLink")}
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        title={t("referral.share")}
        onPress={onShare}
        variant="primary"
        size="md"
        disabled={!link}
        style={styles.shareButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    padding: spacing.md,
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  field: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    ...typography.textXs,
    color: colors.gray500,
  },
  code: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "700",
    letterSpacing: 2,
  },
  link: {
    ...typography.textSm,
    color: colors.dark,
  },
  copyButton: {
    paddingHorizontal: spacing.xmd,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },
  copyText: {
    ...typography.buttonSm,
    color: colors.primary,
  },
  shareButton: {
    borderRadius: borderRadius.full,
    minHeight: 48,
  },
});
