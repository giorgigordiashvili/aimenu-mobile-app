import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";

import { colors, spacing, borderRadius, typography } from "../theme";
import { textColors } from "../theme/colors";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import PlusIcon from "../assets/icons/PlusIcon";
import TrashIcon from "../assets/icons/TrashIcon";
import { useAuth } from "../context/AuthContext";

interface Card {
  id: number;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default?: boolean;
  brand?: string;
}

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = useAuth();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCards = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://admin.aimenu.ge/api/v1/payments/methods/",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCards(data.results || []);
    } catch {
      Alert.alert(t("paymentMethods.title"), t("paymentMethods.fetchError"));
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, [fetchCards]),
  );

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `https://admin.aimenu.ge/api/v1/payments/methods/${deleteTarget.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok && res.status !== 204) throw new Error();
      setCards((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      Alert.alert(t("paymentMethods.title"), t("paymentMethods.deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  const renderCard = ({ item }: { item: Card }) => (
    <TouchableOpacity
      style={styles.cardRow}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/card-detail",
          params: {
            id: String(item.id),
            lastFour: item.last_four,
            brand: item.brand ?? "",
            expiryMonth: String(item.expiry_month ?? ""),
            expiryYear: String(item.expiry_year ?? ""),
            isDefault: item.is_default ? "true" : "false",
          },
        })
      }
    >
      <View style={styles.brandBadge}>
        <Text style={styles.brandBadgeText}>
          {(item.brand || "CARD").slice(0, 2).toUpperCase()}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardMasked}>****{item.last_four}</Text>
        {item.brand ? (
          <Text style={styles.cardBrand}>{item.brand}</Text>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={() => setDeleteTarget(item)}
        style={styles.trashButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <TrashIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const addButton = (
    <TouchableOpacity
      style={styles.addCardButton}
      onPress={() => router.push("/add-card")}
    >
      <PlusIcon />
      <Text style={styles.addCardText}>{t("paymentMethods.addButton")}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("paymentMethods.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : cards.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <View style={styles.emptyIllustrationCircle}>
            <View style={styles.illustrationCardBack} />
            <View style={styles.illustrationCardFront}>
              <View style={styles.illustrationStripe} />
              <View style={styles.illustrationChip} />
            </View>
          </View>
          <Text style={styles.emptyText}>{t("paymentMethods.empty")}</Text>
          <View style={styles.emptyCta}>{addButton}</View>
        </View>
      ) : (
        <FlatList
          data={cards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={<View style={styles.listFooter}>{addButton}</View>}
        />
      )}

      <Modal
        visible={deleteTarget !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>
              {t("paymentMethods.deleteTitle")}
            </Text>
            <Text style={styles.modalText}>
              {t("paymentMethods.deleteText")}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                <Text style={styles.cancelText}>
                  {t("paymentMethods.cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.deleteButtonText}>
                    {t("paymentMethods.delete")}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },

  listFooter: {
    marginTop: spacing.sm,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.state50,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  brandBadgeText: {
    ...typography.textXs,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
  },

  cardInfo: {
    flex: 1,
  },

  cardMasked: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
  },

  cardBrand: {
    ...typography.textXs,
    color: textColors.tertiary,
    marginTop: 2,
  },

  trashButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },

  addCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light,
    paddingVertical: spacing.md,
  },

  addCardText: {
    ...typography.textSm,
    fontWeight: typography.h1.fontWeight,
    color: colors.dark,
  },

  emptyWrapper: {
    flex: 1,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIllustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
    opacity: 0.6,
  },

  illustrationCardBack: {
    position: "absolute",
    width: 90,
    height: 58,
    borderRadius: borderRadius.md,
    backgroundColor: colors.state100,
    transform: [{ rotate: "-10deg" }, { translateX: -10 }, { translateY: -4 }],
  },

  illustrationCardFront: {
    width: 90,
    height: 58,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    padding: 8,
    transform: [{ rotate: "6deg" }, { translateX: 8 }, { translateY: 4 }],
  },

  illustrationStripe: {
    width: "100%",
    height: 8,
    borderRadius: 2,
    backgroundColor: colors.state100,
    marginBottom: 6,
  },

  illustrationChip: {
    width: 16,
    height: 12,
    borderRadius: 2,
    backgroundColor: colors.state100,
  },

  emptyText: {
    ...typography.textSm,
    color: textColors.tertiary,
    textAlign: "center",
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },

  emptyCta: {
    width: "100%",
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
