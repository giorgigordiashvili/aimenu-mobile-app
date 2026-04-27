import { useState } from "react";
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { borderRadius, colors, spacing, typography } from "../theme";
import { useLoyaltyCounters } from "../hooks/useLoyalty";
import { LoyaltyCard } from "../components/loyalty/LoyaltyCard";
import { RedeemModal } from "../components/loyalty/RedeemModal";
import type { LoyaltyCounter } from "../types/loyalty";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

export default function LoyaltyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch, error } =
    useLoyaltyCounters();
  const [active, setActive] = useState<LoyaltyCounter | null>(null);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.title}>{t("loyalty.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        renderItem={({ item }) => (
          <LoyaltyCard counter={item} onClaim={() => setActive(item)} />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyTitle}>
                {error ? t("loyalty.errors.default") : t("loyalty.empty")}
              </Text>
            </View>
          ) : null
        }
      />

      <RedeemModal
        counter={active}
        visible={!!active}
        onClose={() => setActive(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.state50,
    paddingTop: spacing.xxxl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
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
  headerSpacer: {
    width: 44,
    height: 44,
  },
  title: {
    ...typography.textSm,
    color: colors.dark,
    fontWeight: typography.h1.fontWeight,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl,
  },
  emptyTitle: {
    ...typography.textBase,
    color: colors.gray500,
    textAlign: "center",
  },
});
