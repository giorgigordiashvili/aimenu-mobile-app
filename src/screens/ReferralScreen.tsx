import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  useReferralSummary,
  useReferredUsers,
  useWalletHistory,
} from "../hooks/useReferral";
import { ReferralStatsCards } from "../components/referral/ReferralStatsCards";
import { ShareCard } from "../components/referral/ShareCard";
import { HowItWorks } from "../components/referral/HowItWorks";
import { ActivityList } from "../components/referral/ActivityList";
import { ReferredUsersList } from "../components/referral/ReferredUsersList";
import { borderRadius, colors, spacing, typography } from "../theme";
import BackArrowIcon from "../assets/icons/BackArrowIcon";

export default function ReferralScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const summaryQuery = useReferralSummary();
  const referredQuery = useReferredUsers();
  const historyQuery = useWalletHistory(1);

  const isLoading =
    summaryQuery.isLoading ||
    referredQuery.isLoading ||
    historyQuery.isLoading;

  const isRefetching =
    summaryQuery.isRefetching ||
    referredQuery.isRefetching ||
    historyQuery.isRefetching;

  const refreshAll = () => {
    summaryQuery.refetch();
    referredQuery.refetch();
    historyQuery.refetch();
  };

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
        <Text style={styles.title}>{t("referral.pageTitle")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refreshAll}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lead}>{t("referral.pageLead")}</Text>

        {isLoading && !summaryQuery.data ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            <ReferralStatsCards summary={summaryQuery.data} />
            <ShareCard summary={summaryQuery.data} />
            <HowItWorks />
            <ActivityList
              items={historyQuery.data?.results ?? []}
              isLoading={historyQuery.isLoading}
              language={i18n.language}
            />
            <ReferredUsersList
              users={referredQuery.data ?? []}
              isLoading={referredQuery.isLoading}
              language={i18n.language}
            />
          </>
        )}
      </ScrollView>
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
  content: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  lead: {
    ...typography.textSm,
    color: colors.gray500,
  },
  loading: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
});
