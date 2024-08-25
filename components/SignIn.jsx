import React, { PureComponent, useContext, useEffect, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MarketProvider from "./MarketProvider";

export default function SignIn() {
  const {isSignIn, setIsSignIn, loadingAnimation, isLoading, setIsLoading} = useContext(MarketProvider)
  const [user, setUser] = useState();
  const [password, setPassword] = useState();


  const handleLogin = () => {
    
    if (user.toLowerCase() === 'gmail.com' && password.toLowerCase() === 'password') {
      setIsSignIn(true);
    } else {
      Alert.alert('Invalid Login', 'Incorrect username and password.');
    }
  }

  
  return (
          <View style={styles.container}>
              <Image
                source={require("../assets/pokemon-removebg-preview.png")}
                style={{ width: 200, height: 300, alignSelf: 'center' }}
              />
              <View style={styles.inputContainer}>
                <Text style={styles.label}> Email: </Text>
                <TextInput 
                  value={user} 
                  onChangeText={setUser} 
                  placeholder="Enter your email" 
                  style={styles.inputBox} 
                  cursorColor='#000' 
                  autoCapitalize='none' 
                  autoCorrect={false} 
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}> Password: </Text>
                <TextInput 
                  value={password} 
                  onChangeText={setPassword} 
                  placeholder="Enter your password" 
                  style={styles.inputBox} 
                  cursorColor='#000' 
                  secureTextEntry={true} 
                />
              </View>
              <Pressable style={styles.signBtn} onPress={handleLogin}>
                <Text style={styles.signBtnText}> Sign In </Text>
              </Pressable>
            </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 40,
    rowGap: 20
  },
  inputContainer: {
    alignItems: 'flex-start',
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  inputBox: {
    borderWidth: 2,
    borderColor: "#28fc03",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10
  },
  signBtnText: {
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 15,
    color: '#fff',
  },
  signBtn: {
    alignItems: 'center',
    fontSize: 17,
    backgroundColor: '#28fc03',
    width: 200,
    marginHorizontal: 'auto',
    borderRadius: 10,
  },
});
