import { Tabs } from "expo-router";
import { colors } from "../../src/theme";
import HomeIcon from "../../src/assets/icons/HomeIcon";
import SearchIcon from "../../src/assets/icons/SearchIcon";
import ScanIcon from "../../src/assets/icons/ScanIcon";
import ProfileIcon from "../../src/assets/icons/ProfileIcon";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.greenButtonBackground,
        tabBarInactiveTintColor: colors.gray500,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
        tabBarStyle: {
          height: 90,
          paddingBottom: 12,
          paddingTop: 2,
          borderTopWidth: 1,
          borderTopColor: colors.grey,
          backgroundColor: colors.white,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.home"),
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: t("tabs.search"),
          tabBarIcon: ({ color, size }) => (
            <SearchIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: t("tabs.scan"),
          tabBarIcon: ({ color, size }) => (
            <ScanIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t("tabs.profile"),
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="restaurants"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="restaurant-detail"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="restaurant/[slug]/category/[categoryId]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="restaurant/[slug]/item/[itemId]"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="order-review"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="payment/index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="payment/success"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
