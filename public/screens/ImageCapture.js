import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView
} from "react-native";
import * as FileSystem from "expo-file-system";

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
export default function ImageCapture() {
  const [image, setImage] = useState(null);
  const [imageCaptured, setImageCaptured] = useState(false);

  const navigation = useNavigation();
  const imgDir = FileSystem.documentDirectory + "images/";

  const loadImage = async () => {
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length == 1) {
      setImageCaptured(true);
      setImage(imgDir + files[0]);
    } else if (files.length > 1) {
      if (files[1] > files[0]) {
        await deleteImage(imgDir + files[0]);
      } else {
        await deleteImage(imgDir + files[1]);
      }
    } else {
      setImageCaptured(false);
    }
  };

  useEffect(() => {
    loadImage();
  }, []);

  const goToCamera = () => {
    navigation.navigate("CameraView");
  };

  const deleteImage = async (image) => {
    await FileSystem.deleteAsync(image);
    setImage(null);
    await loadImage();
  };

  return (
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
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {!imageCaptured && (
          <ScrollView style={{flex : 1}}>
            <View style={{ paddingVertical: 30 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 25,
                  fontWeight: "500",
                  fontStyle: "italic",
                }}
              >
                find your boardgames with
              </Text>
              <Text style={styles.title}>BitBox</Text>

              <View style={styles.miniContain}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginTop: 10,
                    marginBottom: 3,
                  }}
                >
                  Follow these guidelines for best results:
                </Text>
                <Text style={styles.guidlines}>
                  1.) Make sure your picture is in portrait mode, well lit, and in
                  focus
                </Text>
                <Text style={styles.guidlines}>
                  2.) Line up the edges of each boardgame in the image with the
                  gridlines provided
                </Text>
                <Text style={styles.guidlines}>
                  3.) Make sure only one side of the boardgame is shown to the
                  camera (strictly a top view or a side view)
                </Text>
                <Text style={styles.guidlines}>
                  4.) Make sure you show a side of the boardgame that has the
                  title
                </Text>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>
                  Things to note:
                </Text>
                <Text
                  style={{
                    paddingHorizontal: 20,
                    marginVertical: 5,
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  BitBox identifies the location of each board game and analyzes
                  the text found on each box. If the design of the board game's
                  title is too unique or the image is not in focus, BitBox may not
                  be able to accurately identify the title.
                </Text>
                <Text
                  style={{
                    paddingHorizontal: 20,
                    marginVertical: 2,
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  While in theory BitBox could identify a multitude of boardgames
                  in a single image (assuming all of the guidlines above are met),
                  it is recommended that an image does not have more than five
                  boardgames.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    marginTop: 20,
                  }}
                  onPress={() => goToCamera()}
                >
                  <Text
                    style={{
                      fontSize: 25,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}
                  >
                    Get Started
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderColor: "white",
                    borderWidth: 3,
                    borderRadius: 10,
                    marginTop: 25,
                  }}
                  onPress={() => {
                    navigation.replace("SignIn");
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}
                  >
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}

        {imageCaptured && (
          <View
            style={[
              {
                justifyContent: "center",
                margin: 1,
                gap: 5,
                flex: 1,
                flexDirection: "column",
              },
            ]}
          >
            <View
              style={{ flex: 8, flexDirection: "row", alignItems: "center" }}
            >
              <View style={styles.topButtonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => deleteImage(image)}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="trash-outline" size={25} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}></View>
              <View style={styles.topButtonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => goToCamera()}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="camera-outline" size={25} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 80, borderColor: "#a2d2ff", borderWidth: 10 }}>
              <Image
                source={{ uri: image }}
                style={{ width: "100%", height: "100%", resizeMode: "stretch" }}
              />
            </View>
            <View
              style={{
                flex: 13,
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <View style={{ flex: 1 }}></View>
              <View style={styles.bottomButtonContainer}>
                <TouchableOpacity
                  style={styles.lowerButton}
                  onPress={() => {
                    navigation.navigate("LoadingScreen", {
                      uri: image,
                    });
                  }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={60}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1 }}></View>
            </View>
          </View>
        )} 
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  miniContain: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 85,
    fontWeight: "bold",
  },
  box: {
    width: "100%",
    height: 200,
    flex: 1,
  },
  bottomButtonContainer: {
    flex: 2,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
  },
  topButtonContainer: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
  },
  lowerButton: {
    flex: 1,
    backgroundColor: "#e5383b",
    borderRadius: 10,
    borderWidth: 3,
  },
  button: {
    flex: 1,
    backgroundColor: "#e5383b",
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonContent: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  guidlines: {
    paddingHorizontal: 20,
    marginVertical: 2,
    fontSize: 16,
    alignSelf: "flex-start",
  },
});
