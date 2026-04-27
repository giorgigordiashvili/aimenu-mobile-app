import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";
import { Button } from "../Button";
import { borderRadius, colors, spacing, typography } from "../../theme";
import { useRedeemProgram } from "../../hooks/useLoyalty";
import type { LoyaltyCounter, Redemption } from "../../types/loyalty";

interface Props {
  counter: LoyaltyCounter | null;
  visible: boolean;
  onClose: () => void;
}

export function RedeemModal({ counter, visible, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const { mutateAsync, reset } = useRedeemProgram();

  const [redemption, setRedemption] = useState<Redemption | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const programId = counter?.program.id;

  const runRedeem = async (id: string) => {
    setIsLoading(true);
    setErrorCode(null);
    setRedemption(null);
    try {
      const result = await mutateAsync(id);
      setRedemption(result);
    } catch (e: any) {
      const msg = String(e?.message ?? "");
      const match = msg.match(/"error_code"\s*:\s*"([^"]+)"/);
      setErrorCode(match?.[1] ?? "default");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (visible && programId) {
      runRedeem(programId);
    }
    if (!visible) {
      setRedemption(null);
      setErrorCode(null);
      setIsLoading(false);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, programId]);

  const expiresLabel = useMemo(() => {
    if (!redemption?.expires_at) return "";
    try {
      return new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(redemption.expires_at));
    } catch {
      return new Date(redemption.expires_at).toLocaleString();
    }
  }, [redemption?.expires_at, i18n.language]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.title}>{t("loyalty.redeemTitle")}</Text>
          {counter ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {counter.program.name}
            </Text>
          ) : null}

          <View style={styles.body}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : errorCode ? (
              <View style={styles.errorBlock}>
                <Text style={styles.errorText}>
                  {t(`loyalty.errors.${errorCode}`, {
                    defaultValue: t("loyalty.errors.default"),
                  })}
                </Text>
                <Button
                  title={t("loyalty.retry")}
                  onPress={() => programId && runRedeem(programId)}
                  variant="outline"
                  size="md"
                  style={styles.retryButton}
                />
              </View>
            ) : redemption ? (
              <>
                <View style={styles.qrWrap}>
                  <QRCode
                    value={redemption.code}
                    size={220}
                    backgroundColor={colors.white}
                    color={colors.dark}
                  />
                </View>
                <Text style={styles.code} selectable>
                  {redemption.code}
                </Text>
                {expiresLabel ? (
                  <Text style={styles.expires}>
                    {t("loyalty.expiresAt", { date: expiresLabel })}
                  </Text>
                ) : null}
              </>
            ) : null}
          </View>

          <Button
            title={t("loyalty.close")}
            onPress={onClose}
            variant="primary"
            size="md"
            style={styles.closeButton}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.dark,
    textAlign: "center",
    fontWeight: "600",
  },
  subtitle: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 260,
    gap: spacing.md,
  },
  qrWrap: {
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
  },
  code: {
    ...typography.textLg,
    color: colors.dark,
    fontFamily: "Courier",
    letterSpacing: 2,
    textAlign: "center",
  },
  expires: {
    ...typography.textSm,
    color: colors.gray500,
  },
  errorBlock: {
    alignItems: "center",
    gap: spacing.md,
  },
  errorText: {
    ...typography.textBase,
    color: colors.error,
    textAlign: "center",
  },
  retryButton: {
    borderRadius: borderRadius.full,
    minHeight: 44,
    minWidth: 140,
  },
  closeButton: {
    borderRadius: borderRadius.full,
    minHeight: 48,
  },
});
