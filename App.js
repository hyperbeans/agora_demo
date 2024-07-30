import 'react-native-gesture-handler';

import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Videocall from "./src/Screens/videocall";
import Livestream from "./src/Screens/livestream";
import Rtc from './src/Screens/rtc';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Videocall" component={Videocall} />
        <Stack.Screen name="Livestream" component={Livestream} />
        <Stack.Screen name="Rtc" component={Rtc} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
