import {
  FlatList,
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const Results = ({ route }) => {
  const [hasResults, setHasResults] = useState(null);
  const navigation = useNavigation();

  const { resultList } = route.params;

  useEffect(() => {
    if (resultList.length == 0) {
      setHasResults(false);
    } else {
      setHasResults(true);
    }
  }, [resultList]);

  const renderItem = (boardgame) => {
    const image = boardgame["item"]["image"][0];
    let name = boardgame["item"]["name"][0]["$"]["value"];
    const id = boardgame["item"]["$"]["id"];
    const link = "https://boardgamegeek.com/boardgame/" + id + "/" + name;
    const index = boardgame["index"];

    name = name.split("%20");
    name = name.join();

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
        <View style={{ flexDirection: "column", flex: 1 }}>
          <Text style={styles.title}>Boardgame {index + 1}:</Text>
          <Text style={styles.title}>{name}</Text>
        </View>
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: 500, resizeMode: "stretch" }}
        />
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontStyle: "italic",
            marginBottom: 10,
          }}
          onPress={() => Linking.openURL(link)}
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
                  data={resultList}
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
                navigation.navigate("ImageCapture");
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 35,
                  fontWeight: "bold",
                }}
              >
                Exit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: 5,
    color: "white",
    textAlign: "center",
    flexWrap: "wrap",
  },
});
