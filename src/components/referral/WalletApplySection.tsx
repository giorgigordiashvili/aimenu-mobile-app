import { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useReferralSummary } from "../../hooks/useReferral";
import { borderRadius, colors, spacing, typography } from "../../theme";

interface Props {
  total: number;
  onChange: (amount: number) => void;
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function WalletApplySection({ total, onChange }: Props) {
  const { t } = useTranslation();
  const { data } = useReferralSummary();
  const [raw, setRaw] = useState("");

  const balance = useMemo(() => {
    const n = Number(data?.wallet_balance ?? 0);
    return Number.isFinite(n) ? n : 0;
  }, [data?.wallet_balance]);

  const max = useMemo(
    () => Math.max(0, Math.min(balance, total)),
    [balance, total],
  );

  // Re-clamp when the spendable max shrinks (e.g. cart total changes).
  useEffect(() => {
    const current = Number(raw.replace(",", ".")) || 0;
    if (current > max) {
      const clamped = max.toFixed(2);
      setRaw(clamped);
      onChange(Number(clamped));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [max]);

  if (balance <= 0) return null;

  const handleChange = (text: string) => {
    // Allow only digits and one separator
    const cleaned = text.replace(/[^0-9.,]/g, "").replace(",", ".");
    const parts = cleaned.split(".");
    const safe =
      parts.length > 1 ? `${parts[0]}.${parts[1].slice(0, 2)}` : cleaned;
    setRaw(safe);
    const n = Number(safe);
    if (Number.isFinite(n)) {
      const clamped = clamp(n, 0, max);
      onChange(clamped);
    } else {
      onChange(0);
    }
  };

  const applyAll = () => {
    const value = max.toFixed(2);
    setRaw(value);
    onChange(Number(value));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{t("referral.walletCheckoutTitle")}</Text>
      <Text style={styles.hint}>{t("referral.walletCheckoutHint")}</Text>

      <Text style={styles.available}>
        {t("referral.walletAvailable", { amount: balance.toFixed(2) })}
      </Text>

      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <Text style={styles.currency}>₾</Text>
          <RNTextInput
            value={raw}
            onChangeText={handleChange}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={[styles.applyAll, max <= 0 && styles.applyAllDisabled]}
          onPress={applyAll}
          disabled={max <= 0}
          activeOpacity={0.8}
        >
          <Text style={styles.applyAllText}>
            {t("referral.walletApplyAll")}
          </Text>
        </TouchableOpacity>
      </View>
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
    gap: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
  },
  hint: {
    ...typography.textSm,
    color: colors.gray500,
  },
  available: {
    ...typography.textSm,
    color: colors.primary,
    fontWeight: "600",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.light,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  currency: {
    ...typography.textBase,
    color: colors.dark,
    fontWeight: "600",
  },
  input: {
    flex: 1,
    ...typography.textBase,
    color: colors.dark,
    padding: 0,
  },
  applyAll: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLightest,
  },
  applyAllDisabled: {
    opacity: 0.5,
  },
  applyAllText: {
    ...typography.buttonSm,
    color: colors.primary,
    fontWeight: "600",
  },
});
