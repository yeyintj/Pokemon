import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import MarketProvider from './components/MarketProvider';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MarketList from './components/MarketList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import { useState, useEffect, useRef } from 'react';
import Sign from './components/SignIn';

export default function App({children}) {
  const [isSignIn, setIsSignIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true); // State to manage splash screen
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;


  const queryClient = new QueryClient();
  const Stack = createNativeStackNavigator();


  const fadeOut = Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 3000,
    useNativeDriver: true,
  });


  useEffect(() => {

    const timer = setTimeout(() => {
      setShowSplash(false); // Hide splash screen after 3 seconds
    }, 3000);

    fadeOut.start();
    setTimeout(() => {
      Animated.parallel([
        // Fade out animation
        Animated.timing(fadeAnim, {
          toValue: 0,  // Fade to invisible
          duration: 3000,
          useNativeDriver: true,
        }),

        // Move up animation
        Animated.timing(translateYAnim, {
          toValue: -100,  // Move up by 100 units
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    }, 3000);

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts
      fadeAnim.stopAnimation();
      translateYAnim.stopAnimation();
    };
  }, [fadeAnim, translateYAnim]);

  const SplashScreen = () => {
    return (
      <Animated.View style={{ transform: [{ translateX: shakeAnim}], flex: 1, alignItems: 'center', justifyContent: 'center', opacity: fadeAnim}}>
      <Image
        source={require('./assets/pokemon-removebg-preview.png')}
        style={{ height: 100, width: 100 }}
      />
    </Animated.View>
    );
  };

  

  const loadingAnimation = () => {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(204, 204, 204, .85)',
        zIndex: 3
      }}>
        <LottieView source={require('./components/Animation.json')} autoPlay loop style={{width: 150, height: 150}} />
      </View>
    );
  };

  

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <MarketProvider.Provider value={{loadingAnimation, isSignIn, setIsSignIn, isLoading, setIsLoading}}>
            {showSplash ? (
              SplashScreen()
            ) : (
              isSignIn ? (
                <Stack.Navigator>
                  <Stack.Screen name='MarketList' component={MarketList} options={{headerShown: false}}/>
                </Stack.Navigator>
              ) : (
                <Stack.Navigator>
                  <Stack.Screen name='SignIn' component={Sign} options={{headerShown: false}}/>
                </Stack.Navigator>
              )
            )}
            {children}
          </MarketProvider.Provider>
          <StatusBar style="auto" />
        </NavigationContainer>
      </QueryClientProvider>
    </>
  );
}