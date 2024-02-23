import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Text,
} from "react-native";
import Dice from "./util/dice.png";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../firebase";

export default function LoadingScreen({ route }) {
  const navigation = useNavigation();

  const { uri } = route.params;

  useEffect(() => {
    const uploadImage = async () => {
      const uid = auth.currentUser.uid
      const file = await FileSystem.uploadAsync(
        ` %here% /image-upload/${uid}`,
        uri,
        {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          fieldName: "file",
        }
      );
      const filename = file.body;

      const indentitfiedGameData = await fetch(
        ` %here% /get-game-data/${filename}`
      );

      const boardgameData = await indentitfiedGameData.json();

      navigation.navigate("Results", {
        resultList: boardgameData,
      });
    };

    uploadImage();
  }, [uri]);

  const spinValue = new Animated.Value(0);
  const spin = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin());
  };
  spin();
  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#a2d2ff", "#cdb4db"]}
        start={{
          x: 0,
          y: 1,
        }}
        end={{
          x: 1,
          y: 0,
        }}
        style={styles.miniContainer}
      >
        <View style={styles.diceContainer}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <Image
              style={{ resizeMode: "contain", width: 200, height: 200 }}
              source={Dice}
            />
          </Animated.View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.loadingText}>
            Identifying the board games within the image. This may take a
            moment...
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: "#fff",
  },
  miniContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  diceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 30,
    textAlign: "center",
    color: "#fff",
    fontStyle: "italic",
    fontWeight: "normal",
  },
});
