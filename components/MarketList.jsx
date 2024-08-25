import { useQuery } from "@tanstack/react-query";
import React, { PureComponent, useContext, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getRequest } from "../api/AxiosApi";
import {
  ChevronDown,
  ChevronUp,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react-native";
import { BlurView } from "expo-blur";
import SelectDropdown from "react-native-select-dropdown";
import MarketProvider from "./MarketProvider";
import LottieView from "lottie-react-native";
import MenuDropdown from "./MenuDropdown";
import Cart from "./Cart";

export default function MarketList() {
  const [pokeList, setPokeList] = useState([]);
  const [sortType, setSortType] = useState([]);
  const [sortRairty, setSortRairty] = useState([]);
  const [sortSet, setSortSet] = useState([]);
  const [search, setSearch] = useState();
  const [showMenu, setShowMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const pageRef = useRef(2);
  const pageSizeRef = useRef(20);

  const { loadingAnimation, isLoading} = useContext(MarketProvider);
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const fetchMarketList = useQuery({
    queryKey: ["marketList"],
    queryFn: async () => {
      const response = await getRequest("cards?page=1&pageSize=20");
      const apiData = response.data.data;
      setPokeList(apiData);
      return apiData;
    },
    staleTime: 2000,
  });

  const fetchTypeList = useQuery({
    queryKey: ["type"],
    queryFn: async () => {
      const response = await getRequest("types");
      const apiData = response.data.data;
      setSortType(apiData);
      return apiData;
    },
  });

  const fetchRairtyList = useQuery({
    queryKey: ["rairty"],
    queryFn: async () => {
      const response = await getRequest("rarities");
      const apiData = response.data.data;
      setSortRairty(apiData);
      return apiData;
    },
  });

  const fetchSetList = useQuery({
    queryKey: ["set"],
    queryFn: async () => {
      const response = await getRequest("sets");
      const apiData = response.data.data;
      // console.log("Set Data: ", apiData)
      setSortSet(apiData);
      return apiData;
    },
  });

  const handleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMenu(true);
  };

  const handleSearch = async (text) => {
    setSearch(text);
  
    if (text === "") {
      // Restore the original list immediately
      setTimeout(() => {

        setPokeList(fetchMarketList.data);
      }, 300)
    } else {
      try {
        // Make an API request based on the search text
        const response = await getRequest(`cards?q=name:${text}&page=1&pageSize=3`);
        const searchData = response.data.data;
  
        // Update the list with the search results
        setPokeList(searchData);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  // Debounce function to improve performance
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// This call user's input search fun
  debounce(handleSearch, 300);


const handlePagination = async () => {
  try {
    // Double the page size for the next request
    pageSizeRef.current = pageSizeRef.current * 2;

    // Fetch the next page of data
    const response = await getRequest(
      `cards?page=${pageRef.current}&pageSize=${pageSizeRef.current}`
    );

    const apiData = response.data.data;

    if (apiData.length === 0) {
      // No more data to load, possibly stop pagination
      Alert.alert('Pokemon',"No more data to load");
      return;
    }

    // Update the PokeList with new data
    setPokeList((prevPokeList) => [...prevPokeList, ...apiData]);

    // Update the page reference for the next request
    pageRef.current += 1;
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

  const handleIsSelect = (item) => {
    
    const selectedItem = pokeList.find(poke => {
      
      if(poke.id===item.id){
        
        return item;
      }
    });

    if(selectedItem){
      // setIsSelect(true);
      
      setSelectedData([...selectedData, selectedItem]);
      // console.log('Selected Data: ', selectedData)
    }
  }
  
  const handelClearOneCart = (item) => {
    setSelectedData(selectedData.filter((i) => i.id !== item.id));
  }

  
  
  // console.log("Poke List", pokeList);
  // console.log("Sort Data", sortType);
  // console.log("Cart Item: ", selectedData)


  return (
    <View style={styles.container}>
      <View style={styles.titleBar}>
        <View style={styles.brandContainer}>
          <Image
            source={require("../assets/pokemon-removebg-preview.png")}
            style={{ width: 100, height: 100, borderRadius: 100 }}
          />
          {/* <Text style={{fontSize: 8, fontWeight: 'bold'}}>Tcg Marketplace</Text> */}
        </View>
        <View style={{ position: "relative" }}>
          <Pressable onPress={handleMenu}>
            <Menu color="#000" size={40} />
            {/* <Text style={{color: 'red', fontWeight: 'bold', position: 'absolute', bottom: 25, right: 0,fontSize: 18}}>{selectedData.length < 1 ? '':selectedData.length}</Text> */}
          </Pressable>
          
          {showMenu ? <MenuDropdown setShowMenu={setShowMenu} setShowCart={setShowCart} selectedData={selectedData}/> : ""}
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Search color="#000" />
        <TextInput
          value={search}
          onChangeText={handleSearch}
          style={{ flex: 1 }}
          cursorColor="#000"
        />
      </View>
    
      {showCart?<Cart setShowCart={setShowCart} selectedData={selectedData} setSelectedData={setSelectedData} handelClearOneCart={handelClearOneCart}/>:''}

        <View style={styles.softContainer}>
        <SelectDropdown
            data={sortType}
            onSelect={(item, index) => {
              const data = pokeList.filter((type) => type.types == item);
              setTimeout(() => {
                setPokeList(data);
              }, 1000)
              console.log('Selected Item: ', data);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={{...styles.dropdownButton, }}>
                  <Text style={{ fontSize: 12 }}>
                    {(selectedItem && selectedItem) || "Type"}
                  </Text>
                  {isOpened ? (
                    <ChevronUp color="#000" size={20} />
                  ) : (
                    <ChevronDown color="#000" size={20} />
                  )}
                </View>
              );
            }}
            renderItem={(item, isSelected) => {
              return (
                <View style={{...styles.dropDownItem, }}>
                  <Text style={{...styles.dropdownItemTxtStyle,}}>{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <SelectDropdown
            data={sortRairty}
            onSelect={(item, index) => {
              const data = pokeList.filter((type) => type.rarity === item);
              setTimeout(() => {

                setPokeList(data);
                console.log("Rarity Item: ", data);
              }, 1000)
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButton}>
                  <Text style={{ fontSize: 12, textAlign: 'center'}}>
                    {(selectedItem && selectedItem) || "Rairty"}
                  </Text>
                  {isOpened ? (
                    <ChevronUp color="#000" size={20} />
                  ) : (
                    <ChevronDown color="#000" size={20} />
                  )}
                </View>
              );
            }}
            renderItem={(item, isSelected) => {
              return (
                <View style={styles.dropDownItem}>
                  <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
          <SelectDropdown
            data={sortSet}
            onSelect={(item, index) => {
              const data = pokeList.filter((type) => type.set.id == item);
              setTimeout(() => {
                setSortSet(data);
              })
              // console.log('Selected Item: ', data);
            }}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownButton}>
                  <Text style={{ fontSize: 12 }}>
                    {(selectedItem && selectedItem.id) || "Set"}
                  </Text>
                  {isOpened ? (
                    <ChevronUp color="#000" size={20} />
                  ) : (
                    <ChevronDown color="#000" size={20} />
                  )}
                </View>
              );
            }}
            renderItem={(item, isSelected) => {
              return (
                <View style={styles.dropDownItem}>
                  <Text style={styles.dropdownItemTxtStyle}>{item.id}</Text>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
            dropdownStyle={styles.dropdownMenuStyle}
          />
        </View>
      {(fetchMarketList.isLoading&&fetchTypeList.isLoading&&fetchRairtyList.isLoading&&fetchSetList.isLoading)||isLoading ? loadingAnimation() 
        :

        <View style={styles.cardContainer}>
          
            <FlatList
              showsVerticalScrollIndicator={false}
              data={pokeList}
              renderItem={({item, index})=> {
                return (
                  <Animated.View key={index} style={styles.cardBody}>
                    <Image
                      source={{ uri: `${item.images.large}` }}
                      style={{
                        width: "100%",
                        height: "100%",
                        bottom: 120,
                        resizeMode: "contain",
                      }}
                    />
                    <View style={{ bottom: 110, alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "300",
                          letterSpacing: 2,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "300",
                          letterSpacing: 2,
                        }}
                      >
                        {item.rarity}
                      </Text>
                      <View style={{flexDirection: 'row', alignItems: 'center', columnGap: 50, bottom: -5}}>
                        <Text style={{fontSize: 12, fontWeight: '500'}}>$ {item.cardmarket.prices.averageSellPrice? item.cardmarket.prices.averageSellPrice : '0'}</Text>
                        <Text style={{fontSize: 12, fontWeight: '500'}}>{selectedData.find(i => i.id == item.id)? item.set.total-1:item.set.total} left</Text>
                      </View>
                    </View>
                    
                      <Pressable disabled={selectedData.find(i => i.id == item.id)? true:!true} onPress={() => handleIsSelect(item)} style={{...styles.selectBtn, backgroundColor: selectedData.find(i => i.id == item.id)?'#3b9c17':'#28fc03'}}>
                        <Text style={{color: '#fff', fontWeight: '500', textTransform: 'uppercase'}}>{selectedData.find(i => i.id == item.id)? 'selected': 'Select'}</Text>
                      </Pressable>
                      {/* <Pressable onPress={() => handleIsSelect(item)} style={styles.selectBtn}>
                        <Text>Select</Text>
                      </Pressable> */}
                  </Animated.View>
                );
              }}
              keyExtractor={item => item.id}
              onEndReached={handlePagination}
            />
        </View>
      }

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#fff",
    position: "relative",
  },
  titleBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderBottomWidth: 5,
    borderBlockColor: "#ccc",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  brandContainer: {
    // backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "flex-start",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    borderWidth: 2,
    borderColor: "#28fc03",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 30,
    marginHorizontal: 20,
    zIndex: 0,
  },
  softContainer: {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 20,
    marginTop: 20,
    paddingBottom: 10,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#28fc03",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 7,
    width: 95,
  },
  dropDownItem: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderColor: "#000",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff'
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#151E26",
    textAlign: "center",
  },
  cardContainer: {
    marginHorizontal: 20,
    // backgroundColor: '#ccc',
  },
  cardBody: {
    alignItems: "center",
    backgroundColor: "rgb(204, 204, 204)",
    height: 200,
    marginTop: 150,
    position: "relative",
    borderTopRightRadius: 80,
    borderBottomLeftRadius: 80,
    elevation: 5,
  },
  selectBtn: {
    position: "absolute",
    bottom: -18,
    paddingHorizontal: 50,
    paddingVertical: 15,
    backgroundColor: "#28fc03",
    borderRadius: 10,
    borderWidth: 2,
  },
  selectedBg: {
    backgroundColor: '#3b9c17'
  }
});
