import React from "react";
import { View, StyleSheet } from "react-native";

export default function Grid() {
  const gridSize = 20; // Adjust the size of the grid
  const grid = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid.push(
        <View key={`${i}-${j}`} style={styles.gridSquare}>
          {/* Empty center */}
          <View style={styles.emptyCenter} />
        </View>
      );
    }
  }

  return <View style={styles.gridContainer}>{grid}</View>;
}

const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
    flexWrap: "wrap",
    justifyContent: "center",
    flexDirection: "row",
  },
  gridSquare: {
    width: "5%", // Adjust the width of each square
    height: "5%", // Adjust the height of each square
    borderColor: "black",
    borderWidth: 0.5, // Adjust the thickness of the edges
    alignItems: "center",
    justifyContent: "center",
  },
  emptyCenter: {
    width: "95%", // Adjust the width of the empty center
    height: "95%", // Adjust the height of the empty center
    // Adjust the background color of the empty center
  },
});
