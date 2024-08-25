import { LogOut, ShoppingCart, UserRound, X } from 'lucide-react-native'
import React, { PureComponent, useContext, useEffect, useState } from 'react'
import { Alert, LayoutAnimation, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import MarketProvider from './MarketProvider'

export default function Menu ({setShowMenu, setShowCart, selectedData}) {
  const {setIsSignIn, setIsLoading} = useContext(MarketProvider)
  const [modalVisible, setModalVisible] = useState(true);



  const handleMenu = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowMenu(false);
  }

  const handleCart = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setShowMenu(false);
    setShowCart(true);
  }
  
  const handleLogout = () => {
    setIsLoading(true); // Stop loading after 5 seconds
    setShowMenu(false); //Hide menubar after 5 seconds

    const timer = setTimeout(() => {
      setIsSignIn(false); // Perform logout
      setIsLoading(false); // Stop loading animation
    }, 5000);
    return () => clearTimeout(timer);
  }

 

    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(!modalVisible);
      }}>
        
        <View style={styles.menuDropdown}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 30}}>
            <View style={{alignItems: 'center'}}>
              <UserRound color='#fff' size={50}/>
              <Text style={{color: '#fff', fontWeight: '500'}}> User </Text>
            </View>
            <Pressable onPress={handleMenu}>
              <X color='#fff'/>
            </Pressable>
          </View>
          <View style={{position: 'relative'}}>
            <Pressable onPress={handleCart} style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
              <Text style={{color: '#fff'}}>Cart</Text>
              <ShoppingCart fill="#28fc03" size={30}/>
            </Pressable>
            <Text style={{color: '#fff', fontWeight: 'bold', position: 'absolute', bottom: 15, right: 35,fontSize: 14}}>{selectedData.length < 1 ? '':selectedData.length}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
            <Text style={{color: '#fff'}}>Log out</Text>
            <Pressable onPress={handleLogout}>
              <LogOut color='#fa1505'/>
            </Pressable>
          </View>
        </View>
      </Modal>
    )
}

const styles = StyleSheet.create({
  menuDropdown: {
    backgroundColor: '#333',
    position: 'absolute',
    borderTopWidth: 2,
    borderTopColor: '#28fc03',
    borderLeftWidth: 1,
    borderLeftColor: '#28fc03',
    top: 0,
    end: -20,
    width: 250,
    height: '100%',
    borderTopLeftRadius: 50,
    zIndex: 0,
    rowGap: 20,
  },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    
    
  },
})