import { useMemo, useState } from "react";
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
import { borderRadius, colors, spacing, typography } from "../theme";
import BackArrowIcon from "../assets/icons/BackArrowIcon";
import { useMyReservations } from "../hooks/useMyReservations";
import { ReservationHistoryCard } from "../components/reservation/ReservationHistoryCard";
import { ReservationDetailModal } from "../components/reservation/ReservationDetailModal";
import type { Reservation } from "../types/reservation";

const todayIso = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export default function MyReservationsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch, error } = useMyReservations();
  const [active, setActive] = useState<Reservation | null>(null);

  const { upcoming, past } = useMemo(() => {
    const today = todayIso();
    const list = data ?? [];
    const upcoming: Reservation[] = [];
    const past: Reservation[] = [];
    for (const r of list) {
      const isPast =
        r.reservation_date < today ||
        r.status === "completed" ||
        r.status === "no_show" ||
        r.status === "cancelled";
      if (isPast) past.push(r);
      else upcoming.push(r);
    }
    upcoming.sort((a, b) =>
      `${a.reservation_date} ${a.reservation_time}`.localeCompare(
        `${b.reservation_date} ${b.reservation_time}`,
      ),
    );
    past.sort((a, b) =>
      `${b.reservation_date} ${b.reservation_time}`.localeCompare(
        `${a.reservation_date} ${a.reservation_time}`,
      ),
    );
    return { upcoming, past };
  }, [data]);

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
        <Text style={styles.title}>{t("myReservations.title")}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {isLoading && !data ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <Text style={styles.empty}>{t("common.error")}</Text>
        ) : (
          <>
            <Section title={t("myReservations.activeReservations")}>
              {upcoming.length === 0 ? (
                <Text style={styles.empty}>
                  {t("myReservations.noActiveReservations")}
                </Text>
              ) : (
                upcoming.map((r) => (
                  <ReservationHistoryCard
                    key={r.id}
                    reservation={r}
                    onPress={() => setActive(r)}
                    language={i18n.language}
                  />
                ))
              )}
            </Section>

            <Section title={t("myReservations.history")}>
              {past.length === 0 ? (
                <Text style={styles.empty}>
                  {t("myReservations.noHistory")}
                </Text>
              ) : (
                past.map((r) => (
                  <ReservationHistoryCard
                    key={r.id}
                    reservation={r}
                    onPress={() => setActive(r)}
                    language={i18n.language}
                  />
                ))
              )}
            </Section>
          </>
        )}
      </ScrollView>

      <ReservationDetailModal
        reservation={active}
        visible={!!active}
        onClose={() => setActive(null)}
        language={i18n.language}
      />
    </View>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
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
  loading: {
    paddingVertical: spacing.xxxl,
    alignItems: "center",
  },
  empty: {
    ...typography.textSm,
    color: colors.gray500,
    textAlign: "center",
    paddingVertical: spacing.lg,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.dark,
    fontWeight: "600",
  },
  sectionBody: {
    gap: spacing.sm,
  },
});
