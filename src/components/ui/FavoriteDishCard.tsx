import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

export default function FavoriteDishCard({ dish, onToggleFavorite, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      {/* Image */}
      <Image source={{ uri: dish.image }} style={{ width: 100, height: 100 }} />

      {/* Info */}
      <View style={{ flex: 1, padding: 10 }}>
        <Text style={{ fontWeight: "600", fontSize: 14 }}>{dish.name}</Text>

        <Text style={{ color: "#777", marginTop: 4 }}>
          {dish.restaurant_name}
        </Text>

        <Text style={{ marginTop: 6, fontWeight: "600" }}>{dish.price} ₾</Text>
      </View>

      {/* Heart */}
      <TouchableOpacity onPress={onToggleFavorite} style={{ padding: 10 }}>
        <Text style={{ fontSize: 18 }}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
