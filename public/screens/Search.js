import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  Linking,
  ActivityIndicator
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { auth, db } from '../firebase'
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'

export default function Search() {
  const [ searchInput, setSearchInput ] = useState("")
  const [inCollection, setInCollection] = useState(null)
  const [collectionStatus, setCollectionStatus] = useState(null)
  const [ resultData, setResultData ] = useState(null)
  const [ numResults, setNumResults ] = useState(null)
  const [ listResults, setListResults ] = useState(null)
  const [ newPage, setNewPage ] = useState(null)
  const [ pageData, setPageData ] = useState(null)
  const [ loading, setLoading ] = useState(false)
  const navigation = useNavigation();
  const uid = auth.currentUser.uid

  useEffect(() => {
    if (resultData != null) {
      setNumResults(resultData["$"]["total"])
    }
  }, [resultData])

  useEffect(() => {
    if (numResults != null ) {
      if (numResults != 0) {
        setListResults(resultData["item"])
      } else {
        setListResults('none')
      }
    }
  }, [numResults])

  useEffect(() => {
    if (listResults != null) {
      if (listResults != 'none') {
        try {
          setNewPage(listResults.splice(0, 5))
        } catch (err) {
          setNewPage(listResults.splice(0, numResults))
        }
      } 
    }
  }, [listResults])


  useEffect(() => {
    const getPageData = async (newPage) => {

      const checkIfExists = async (id) => {
        const ref = await getDoc(doc(db, uid, id))
        const exists = ref.exists()
        return exists
      }
      
      const existsDict = {}
      const data = []
      try {
        for await (const metaData of newPage) {
          const id = metaData["$"]["id"]
          const name = metaData["name"][0]["$"]["value"]
          const statsResponse = await fetch(` %here% /general-stats/${id}`)
          
          const stats = await statsResponse.json()
          const boardgame = stats["items"]["item"][0]
          const image = boardgame["image"][0];
          const link = "https://boardgamegeek.com/boardgame/" + id + "/" + name;
  
          const exists = await checkIfExists(id)
          existsDict[id] = exists
  
          const boardgameDict = {
            image : image,
            name : name,
            id : id,
            link : link,
          }
          data.push(boardgameDict)
        }
        setInCollection(existsDict)
        setCollectionStatus(existsDict)
        setPageData(data)
      } catch (err) {
        setNumResults(-1)
        setPageData(true)
      }
    }

    if (newPage != null) {
      getPageData(newPage)
    }

  }, [newPage]);

  useEffect(() => {
    setLoading(false)
  }, [pageData])

  const updateDb = async () => {
    setLoading(true)
    for await (const boardgame of pageData) {
      
      if (inCollection[boardgame["id"]]) {
        if (inCollection[boardgame["id"]] != collectionStatus[boardgame["id"]]) {
          await deleteDoc(doc(db, uid, boardgame["id"]));
          // setInCollection({...inCollection, [boardgame["id"]] : false})
          // setCollectionStatus({...collectionStatus, [boardgame["id"]] : inCollection[boardgame["id"]]})
          console.log(`Deleted "${boardgame["name"]}" from "${uid}" Collection`)
        }
      } else {
        if (inCollection[boardgame["id"]] != collectionStatus[boardgame["id"]]) {
          await setDoc(doc(db, uid, boardgame["id"]), {
            name : boardgame["name"],
            image : boardgame["image"],
            link : boardgame["link"],
          })

          // setInCollection({...inCollection, [boardgame["id"]] : true})
          // setCollectionStatus({...collectionStatus, [boardgame["id"]] : inCollection[boardgame["id"]]})
          console.log(`Added "${boardgame["name"]}" to "${uid}" Collection`)
        }
      }
    }
    navigation.replace("Search")
    setLoading(false)
  }

  const searchBGG = async (searchQuery) => {
    setLoading(true)
    const query = searchQuery.trim()
    if (query == '' || searchQuery == '') {
      setNumResults(0)
      setPageData(true)
      setLoading(false)
    } else {
      const searchResults = await fetch(
        ` %here% /general-search/${query}`
      );
  
      const results = await searchResults.json()
      const resultDict = results["items"]
      setResultData(resultDict)
    }
  
  }
  const renderItem = (object) => {
    const index = object["index"];
    const boardgame = object["item"]

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
        <View style={{flexDirection: 'row'}}>
          {inCollection[boardgame["id"]] && (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}></View>
                <View style={{flex: 3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}><Text style={{fontSize: 25, fontStyle: 'italic', color: "white", textAlign: 'center'}}>Remove from BitBox</Text></View>
                <View style={{flex: 1, padding: 8}}>
                  <TouchableOpacity onPress={() => setCollectionStatus({...collectionStatus, [boardgame["id"]] : !collectionStatus[boardgame["id"]]})}>
                    {collectionStatus[boardgame["id"]] == inCollection[boardgame["id"]] && (
                      <View style={{flex: 1}}>
                        <Ionicons name="close-circle-outline" size={75} color="white" />
                      </View>
                    )}
                    {collectionStatus[boardgame["id"]] != inCollection[boardgame["id"]] && (
                      <View style={{flex: 1}}>
                        <Ionicons name="close-circle" size={75} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
            </View>
          )}
          {!inCollection[boardgame["id"]] && (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 1}}></View>
                <View style={{flex: 3, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}><Text style={{fontSize: 25, fontStyle: 'italic', color: "white"}}>Add to BitBox</Text></View>
                <View style={{flex: 1, padding: 8}}>
                  <TouchableOpacity onPress={() => setCollectionStatus({...collectionStatus, [boardgame["id"]] : !collectionStatus[boardgame["id"]]})}>
                    {collectionStatus[boardgame["id"]] == inCollection[boardgame["id"]] && (
                      <View style={{flex: 1}}>
                        <Ionicons name="checkmark-circle-outline" size={75} color="white" />
                      </View>
                    )}
                    {collectionStatus[boardgame["id"]] != inCollection[boardgame["id"]] && (
                      <View style={{flex: 1}}>
                        <Ionicons name="checkmark-circle" size={75} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "column", flex: 2}}>
          <Text style={styles.title}>Boardgame {index + 1}:</Text>
          <Text style={styles.title}>{boardgame["name"]}</Text>
        </View>
        <Image
          source={{ uri: boardgame["image"] }}
          style={{ width: "100%", height: 500, resizeMode: "stretch", marginTop: 10 }}
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
          {pageData == null && (
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Search</Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              BoardGameGeek.com
            </Text>
          </View> 
          )}
          <View style={{paddingHorizontal: 25}}>
            <TextInput
              placeholder="Search"
              value={searchInput}
              onChangeText={(text) => setSearchInput(text)}
              returnKeyType="search"
              onSubmitEditing={() => {
                searchBGG(searchInput)
              }}
              style={styles.input}
            />
          </View>
          <View style={{ flex: 5 }}>
            {pageData != null && (
              <View style={{flex: 1}}>
              {numResults == 0 && (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{alignSelf: 'center', fontSize: 30}}>No Boardgames Found</Text>
                </View>
              )}
              {numResults == -1 && (
                <View style={{flex: 1, justifyContent: 'center'}}>
                  <Text style={{alignSelf: 'center', fontSize: 30, textAlign: 'center', fontStyle: 'italic'}}>Oops! We encountered an error. Please try a new search.</Text>
                </View>
              )}
              {numResults > 0 && (
                <View style={{flex: 1}}>
                  <View style={styles.button}>
                    <TouchableOpacity onPress={()=>updateDb()}>
                      <Text style={styles.buttonText}>Update Collection</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    style={{ flex: 1 }}
                    data={pageData}
                    renderItem={renderItem}
                  />
                </View>
              )}
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
            <TouchableOpacity onPress={() => {
                navigation.replace("Home");
              }}>
              <Ionicons name="book" size={40} color="#FEFEFE" />
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
            <TouchableOpacity>
              <Ionicons name="search" size={40} color="rgba(00,00,00,.5)" />
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
                backgroundColor: 'rgba(82,106,135,.8)',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <ActivityIndicator color="#fff" animating size="large"/>
          </View>
        )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontSize: 50,
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
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "50%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    alignSelf:'center',
    marginVertical: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
  }
});
