import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getOrderDetail } from "../services";

const OrderDetailScreen = () => {
  const { orderNumber } = useLocalSearchParams<{ orderNumber?: string }>();
  const token = "REPLACE_WITH_REAL_TOKEN";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [orderNumber]);

  const loadDetail = async () => {
    if (!orderNumber) {
      setLoading(false);
      return;
    }

    try {
      const data = await getOrderDetail(token, orderNumber);
      setOrder(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!order) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 16 }}>
      <Text>Order #{(order as any).order_number}</Text>
      <Text>Status: {(order as any).status}</Text>
      <Text>Total: {(order as any).total_amount} ₾</Text>
    </View>
  );
};

export default OrderDetailScreen;
