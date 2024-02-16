import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import Grid from "./Grid";

export default function CameraView() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [toggleGrid, setToggleGrid] = useState(true);

  const navigation = useNavigation();
  const imgDir = FileSystem.documentDirectory + "images/";

  const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(imgDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
    }
  };

  const back = () => {
    navigation.navigate("ImageCapture");
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const data = await cameraRef.takePictureAsync();
      uri = data["uri"];
      await ensureDirExists();
      const filename = new Date().getTime() + ".jpg";
      const dest = imgDir + filename;
      await FileSystem.copyAsync({ from: uri, to: dest });
      navigation.replace("ImageCapture");
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperButtonContainer}>
        <TouchableOpacity
          style={styles.upperButtons}
          onPress={() => setToggleGrid(!toggleGrid)}
        >
          <Text
            style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}
          >
            Grid
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity style={styles.upperButtons} onPress={back}>
          <Text
            style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}
          >
            Exit
          </Text>
        </TouchableOpacity>
      </View>

      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCameraRef(ref)}
      >
        {toggleGrid && <Grid />}
      </Camera>

      <View style={styles.lowerButtonContainer}>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={() => takePhoto()}
        >
          <Text
            style={{ alignSelf: "center", fontSize: 20, fontWeight: "bold" }}
          >
            Take Picture
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a2d2ff",
  },
  camera: {
    flex: 15,
  },
  upperButtonContainer: {
    flex: 1,
    flexDirection: "row",
  },
  lowerButtonContainer: {
    flex: 2,
    flexDirection: "row",
  },
  bottomButton: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: "#cdb4db",
    justifyContent: "center",
    marginTop: 10,
  },
  upperButtons: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: "#cdb4db",
    justifyContent: "center",
    marginBottom: 10,
    marginHorizontal: 10,
  },
});
