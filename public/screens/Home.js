import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [boardgameCollection, setBoardgameCollection] = useState(null);
  const [toggleButton, setToggleButton] = useState(null);
  const [loading, setLoading] = useState(false);
  const uid = auth.currentUser.uid;
  const navigation = useNavigation();

  useEffect(() => {
    const getData = async () => {
      const collectionSnapshot = await getDocs(collection(db, uid));
      const rawCollectionArray = collectionSnapshot.docs;

      const fullData = [];
      const toggleButtonDict = {};
      rawCollectionArray.forEach((rawData) => {
        const data = rawData.data();
        const id = rawData.id;
        data["id"] = id;
        toggleButtonDict[id] = false;
        fullData.push(data);
      });
      setToggleButton(toggleButtonDict);
      setBoardgameCollection(fullData);
    };
    getData();
  }, []);

  const updateDb = async () => {
    setLoading(true);
    const idList = Object.keys(toggleButton);
    for await (const id of idList) {
      if (toggleButton[id] == true) {
        await deleteDoc(doc(db, uid, id));
        console.log(`Deleted "${id}" from "${uid}" Collection`);
      }
    }
    navigation.replace("Home");
    setLoading(false);
  };

  const renderItem = (object) => {
    const index = object["index"];
    const boardgame = object["item"];

    return (
      <View
        style={[
          {
            flex: 1,
            flexDirection: "column",
            margin: 5,
            alignItems: "center",
            gap: 10,
            borderWidth: 5,
            borderColor: "#000000",
            backgroundColor: "#e5383b",
          },
        ]}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View style={{ flex: 1 }}></View>
          <View style={{ flex: 3 }}></View>
          <View style={{ flex: 1, padding: 8 }}>
            <View style={{ flex: 1 }}>
              {!toggleButton[boardgame["id"]] && (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      setToggleButton({
                        ...toggleButton,
                        [boardgame["id"]]: !toggleButton[boardgame["id"]],
                      })
                    }
                  >
                    <Ionicons name="trash-outline" size={75} color="white" />
                  </TouchableOpacity>
                </View>
              )}
              {toggleButton[boardgame["id"]] && (
                <View style={{ flex: 1 }}>
                  <TouchableOpacity
                    onPress={() =>
                      setToggleButton({
                        ...toggleButton,
                        [boardgame["id"]]: !toggleButton[boardgame["id"]],
                      })
                    }
                  >
                    <Ionicons name="trash" size={75} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={styles.gameTitle}>Boardgame {index + 1}:</Text>
          <Text style={styles.gameTitle}>{boardgame["name"]}</Text>
        </View>
        <Image
          source={{ uri: boardgame["image"] }}
          style={{ width: "100%", height: 500, resizeMode: "stretch" }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontStyle: "italic",
            marginBottom: 10,
          }}
          onPress={() => Linking.openURL(boardgame["link"])}
        >
          This is the BGG link
        </Text>
      </View>
    );
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
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 13 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "500",
                fontStyle: "italic",
              }}
            >
              here is your
            </Text>
            <Text style={styles.title}>BitBox</Text>
          </View>
          <View
            style={{
              flex: 5,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            {boardgameCollection == null && <View style={{ flex: 1 }}></View>}
            {boardgameCollection == 0 && (
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 25,
                  fontStyle: "italic",
                }}
              >
                No Boardgames In Collection
              </Text>
            )}
            {boardgameCollection != 0 && (
              <View style={{ flex: 1 }}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => updateDb()}>
                    <Text style={styles.buttonText}>Update Collection</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  style={{ flex: 1 }}
                  data={boardgameCollection}
                  renderItem={renderItem}
                />
              </View>
            )}
          </View>
        </SafeAreaView>
        <SafeAreaView
          style={{
            flex: 1.2,
            backgroundColor: "#b8c3ed",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              alignItems: "center",
              borderRightWidth: 2,
              borderColor: "#000",
            }}
          >
            <TouchableOpacity>
              <Ionicons name="book" size={40} color="rgba(00,00,00,.5)" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              alignItems: "center",
              borderRightWidth: 2,
              borderColor: "#000",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ImageCapture");
              }}
            >
              <Ionicons name="aperture" size={40} color="#FEFEFE" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              alignSelf: "center",
              alignItems: "center",
              borderRightWidth: 2,
              borderColor: "#000",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.replace("Search");
              }}
            >
              <Ionicons name="search" size={40} color="#FEFEFE" />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignSelf: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                navigation.replace("SignIn");
              }}
            >
              <Ionicons
                name="exit-outline"
                style={{
                  transform: [{ rotateY: "180deg" }, { rotateX: "180deg" }],
                }}
                size={40}
                color="#FEFEFE"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      {loading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(82,106,135,.8)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 75,
    fontWeight: "bold",
  },
  gameTitle: {
    flex: 1,
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 5,
    color: "white",
    textAlign: "center",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#0782F9",
    width: "50%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
  },
});
