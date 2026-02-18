import { StyleSheet, View } from "react-native";
import { colors } from "./src/theme/colors";
import Card from "./src/components/ui/Card";

export default function MyComponent() {
  return (
    <View style={styles.container}>
      <Card
        imageUrl="https://picsum.photos/400/200"
        title="რესტორანი ტესტი"
        subtitle="ქართული, ევროპული"
        rating={4.7}
        reviewCount={128}
        priceRange="₾₾"
        isOpen={true}
        isFavorite={false}
        onPress={() => console.log("pressed")}
        onFavoritePress={() => console.log("fav")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
});
