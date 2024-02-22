import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// This is a test

import ImageCapture from "./public/screens/ImageCapture";
import CameraView from "./public/camera/Camera";
import LoadingScreen from "./public/screens/LoadingScreen";
import Results from "./public/screens/Results";
import SignIn from "./public/screens/SignIn";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="SignIn"
          component={SignIn}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="ImageCapture"
          component={ImageCapture}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="CameraView"
          component={CameraView}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoadingScreen"
          component={LoadingScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Results"
          component={Results}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
