import { Minus, Plus, X } from "lucide-react-native";
import React, { PureComponent, useEffect, useRef, useState } from "react";
import { Alert, FlatList, Image, LayoutAnimation, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Cart({ setShowCart, selectedData, setSelectedData, handelClearOneCart }) {
  const [modalVisible, setModalVisible] = useState(true);
  
  useEffect(() => {
    const initializedData = selectedData.map(item => {
      if (item.count == null) {
        return { ...item, count: 1 };
      }
      return item;
    });
    setSelectedData(initializedData);
  }, []);

  const handleCloseCart = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowCart(false);
  };

  const handleIncreatment = (item) => {
    const currentCount = item.count ?? 1; // Set default count to 1 if null or undefined

    if (currentCount >= item.set.total) {
      Alert.alert('Pokemon', 'Out of stock!');
      return;
    }

    const updatedData = selectedData.map((i) =>
      i.id === item.id ? { ...i, count: currentCount + 1 } : i
    );

    setSelectedData(updatedData);
  };

  const handleDecreatement = (item) => {
    if (item.count <= 1) {
      handelClearOneCart(item);
    } else {
      const updatedData = selectedData.map((i) => 
        i.id === item.id ? { ...i, count: i.count - 1 } : i
      );
      setSelectedData(updatedData);
    }
  };

  const handleCartClearAll = () => {
    setSelectedData([]);
  };

  const handleCartAdd = () => {
    if (selectedData.length === 0) {
      Alert.alert('Pokemon', 'Please select one!');
    } else {
      setSelectedData([]);
      Alert.alert('Pokemon', 'Have a great day!');
    }
  };

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(!modalVisible);
    }}
    >

      <View style={styles.cartContainer}>
        <View style={styles.cart}>
          
          <Pressable onPress={handleCloseCart} style={styles.cartClostBtn}>
            <X color="#000" size={40}/>
          </Pressable>

          {(selectedData.length === 0) && (
            <Text style={{color: 'red', top: 200, left: 65}}>There is no cart in here!</Text>
          )}

          <FlatList 
            data={selectedData}
            renderItem={({ item }) => {
              return (
                <View style={styles.cartBody}>
                  <View style={styles.cartImg}>
                    <Image source={{ uri: `${item.images.large}` }} style={{ width: 100, height: 150 }} />
                  </View>
                  <View style={{ rowGap: 50 }}>
                    <View style={{alignItems: 'center'}}>
                      <Text style={{fontSize: 17, width: 70, textAlign: 'center', fontWeight: '600'}}>{item.name}</Text>
                      <Text style={{fontSize: 12}}>${item.cardmarket.prices.averageSellPrice} <Text style={{ fontSize: 10 }}>per card</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{ color: '#28fc03', fontWeight: 'bold' }}>{item.set.total - item.count} </Text>
                        <Text style={{ fontSize: 9 }}>cards left</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ rowGap: 50, marginStart: 'auto', alignItems: 'center', justifyContent: 'space-between'}}>
                    
                    <View style={{ position: 'relative' }}>
                      <Pressable onPress={() => handleIncreatment(item)}>
                        <Plus color='#000' size={20} />
                      </Pressable>
                      {item.count > 1 ? (
                        <Pressable onPress={() => handleDecreatement(item)}>
                          <Minus color='#000' size={20} />
                        </Pressable>
                      ) : (
                        <Pressable onPress={() => handelClearOneCart(item)}>
                          <X color='#000' size={20}/>  
                        </Pressable>
                      )}
                      <Text style={{ color: '#28fc03', position: 'absolute', right: 25, bottom: 20, fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                        {item.count}
                      </Text>
                    </View>
                    <View style={{alignItems: 'center'}}>
                      <Text>Price</Text>
                      <Text style={{ color: '#28fc03', fontWeight: 'bold' }}>$ {(item.cardmarket.prices.averageSellPrice * item.count).toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginVertical: 20,}}>
            <Pressable onPress={handleCartAdd} style={{...styles.addBtn}}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Pay Now</Text>
            </Pressable>
            <Pressable onPress={handleCartClearAll} style={styles.cartDeleteBtn}>
              <Text style={{ color: '#fc030b' }}>Clear All</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cartContainer: {
    backgroundColor: "rgba(204, 204, 204, .8)",
    position: "absolute",
    zIndex: 2,
    width: "100%",
    height: "100%",
  },
  cart: {
    backgroundColor: "#fff",
    width: 300,
    height: 500,
    marginTop: 150,
    marginHorizontal: "auto",
    borderRadius: 10,
  },
  cartClostBtn: {
    position: "absolute",
    top: -25,
    left: 125,
    backgroundColor: "#28fc03",
    borderRadius: 10,
    zIndex: 3,
  },
  cartBody: {
    flexDirection: 'row',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    paddingHorizontal: 10
  },
  cartImg: {
    width: 120, 
    height: 150
  },
  addBtn: {
    backgroundColor: "#28fc03",
    borderRadius: 10,
    width: 100,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: 'auto',
    // marginBottom: 20,
    // elevation: 10,
    // 
    // zIndex: 4,
  },
  
});
