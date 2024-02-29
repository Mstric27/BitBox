import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebase";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const Results = ({ route }) => {
  const [hasResults, setHasResults] = useState(true);
  const [resultData, setResultData] = useState(null);
  const [inCollection, setInCollection] = useState(null);
  const [collectionStatus, setCollectionStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const uid = auth.currentUser.uid;

  const { resultList } = route.params;

  useEffect(() => {
    const getResultData = async (resultList) => {
      const checkIfExists = async (id) => {
        const ref = await getDoc(doc(db, uid, id));
        const exists = ref.exists();
        return exists;
      };

      const existsDict = {};
      const data = [];
      for await (const boardgame of resultList) {
        const image = boardgame["image"][0];
        let name = boardgame["name"][0]["$"]["value"];
        const id = boardgame["$"]["id"];
        const link = "https://boardgamegeek.com/boardgame/" + id + "/" + name;

        name = name.split("%20");
        name = name.join();

        const exists = await checkIfExists(id);
        existsDict[id] = exists;

        const boardgameDict = {
          image: image,
          name: name,
          id: id,
          link: link,
        };
        data.push(boardgameDict);
      }
      if (resultList.length == 0) {
        setHasResults(false);
      } else {
        setInCollection(existsDict);
        setCollectionStatus(existsDict);
        setResultData(data);
        setHasResults(true);
      }
    };

    getResultData(resultList);
  }, [resultList]);

  const updateDbAndExit = async () => {
    setLoading(true);
    for await (const boardgame of resultData) {
      if (inCollection[boardgame["id"]]) {
        if (
          inCollection[boardgame["id"]] != collectionStatus[boardgame["id"]]
        ) {
          await deleteDoc(doc(db, uid, boardgame["id"]));
          console.log(
            `Deleted "${boardgame["name"]}" from "${uid}" Collection`
          );
        }
      } else {
        if (
          inCollection[boardgame["id"]] != collectionStatus[boardgame["id"]]
        ) {
          await setDoc(doc(db, uid, boardgame["id"]), {
            name: boardgame["name"],
            image: boardgame["image"],
            link: boardgame["link"],
          });
          console.log(`Added "${boardgame["name"]}" to "${uid}" Collection`);
        }
      }
    }
    navigation.navigate("ImageCapture");
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
        <View style={{ flexDirection: "row" }}>
          {inCollection[boardgame["id"]] && (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}></View>
              <View
                style={{
                  flex: 3,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 25,
                    fontStyle: "italic",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Remove from BitBox
                </Text>
              </View>
              <View style={{ flex: 1, padding: 8 }}>
                <TouchableOpacity
                  onPress={() =>
                    setCollectionStatus({
                      ...collectionStatus,
                      [boardgame["id"]]: !collectionStatus[boardgame["id"]],
                    })
                  }
                >
                  {collectionStatus[boardgame["id"]] ==
                    inCollection[boardgame["id"]] && (
                    <View style={{ flex: 1 }}>
                      <Ionicons
                        name="close-circle-outline"
                        size={75}
                        color="white"
                      />
                    </View>
                  )}
                  {collectionStatus[boardgame["id"]] !=
                    inCollection[boardgame["id"]] && (
                    <View style={{ flex: 1 }}>
                      <Ionicons name="close-circle" size={75} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          {!inCollection[boardgame["id"]] && (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View style={{ flex: 1 }}></View>
              <View
                style={{
                  flex: 3,
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 25, fontStyle: "italic", color: "white" }}
                >
                  Add to BitBox
                </Text>
              </View>
              <View style={{ flex: 1, padding: 8 }}>
                <TouchableOpacity
                  onPress={() =>
                    setCollectionStatus({
                      ...collectionStatus,
                      [boardgame["id"]]: !collectionStatus[boardgame["id"]],
                    })
                  }
                >
                  {collectionStatus[boardgame["id"]] ==
                    inCollection[boardgame["id"]] && (
                    <View style={{ flex: 1 }}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={75}
                        color="white"
                      />
                    </View>
                  )}
                  {collectionStatus[boardgame["id"]] !=
                    inCollection[boardgame["id"]] && (
                    <View style={{ flex: 1 }}>
                      <Ionicons
                        name="checkmark-circle"
                        size={75}
                        color="white"
                      />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "column", flex: 2 }}>
          <Text style={styles.title}>Boardgame {index + 1}:</Text>
          <Text style={styles.title}>{boardgame["name"]}</Text>
        </View>
        <Image
          source={{ uri: boardgame["image"] }}
          style={{
            width: "100%",
            height: 500,
            resizeMode: "stretch",
            marginTop: 10,
          }}
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
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 16 }}>
          {hasResults && (
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, alignContent: "center" }}>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 35,
                    fontWeight: "bold",
                  }}
                >
                  Identified Boardgames
                </Text>
              </View>
              <View style={{ flex: 15 }}>
                <FlatList
                  style={{ flex: 1 }}
                  data={resultData}
                  renderItem={renderItem}
                />
              </View>
            </View>
          )}
          {!hasResults && (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 35,
                    fontWeight: "bold",
                  }}
                >
                  No Boardgames Identified
                </Text>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontStyle: "italic",
                  }}
                >
                  Make sure you have followed all of the provided guidelines
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              flex: 1,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{ flex: 1, alignContent: "center" }}
              onPress={() => {
                updateDbAndExit();
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 35,
                  fontWeight: "bold",
                }}
              >
                Update and Exit
              </Text>
            </TouchableOpacity>
          </View>
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
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Results;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
  },
  title: {
    flex: 1,
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flexWrap: "wrap",
  },
});
