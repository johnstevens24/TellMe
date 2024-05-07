import * as React from "react";
import  { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import RecordScreen from "./screens/VideoCreation/RecordScreen";
import PlaybackScreen from "./screens/VideoCreation/PlaybackScreen";
import SelectPollScreen from "./screens/VideoCreation/SelectPollScreen";
import AddMultipleChoiceScreen from "./screens/VideoCreation/AddMultipleChoiceScreen";
import SelectTopicsScreen from "./screens/VideoCreation/SelectTopicsScreen";
import AddTimeLimitScreen from "./screens/VideoCreation/AddTimeLimitScreen";

// screen names
const recordName = "Record";
const playbackName = "Playback";
const selectPollName = "Select Poll";
const addMultipleChoiceName = "Add Multiple Choice";
const selectTopicsName = "Select Topics";
const addTimeLimitName = "Add Time Limit";
const Stack = createStackNavigator();

export default function CreateContainer({ navigation }){
	// Disabling gestures so users cannot swipe left and go back
	// This prevents timer not being reset when swiping left from Playback to Record screen.
	return (
		<NavigationContainer independent={true} firstroute={recordName}>
            <Stack.Navigator initialRouteName={recordName} screenOptions={{ headerShown: false, gestureEnabled: false }}>
				<Stack.Screen name={recordName} component={RecordScreen} />
                <Stack.Screen name={playbackName} component={PlaybackScreen} />
                <Stack.Screen name={selectPollName} component={SelectPollScreen} />
                <Stack.Screen name={addMultipleChoiceName} component={AddMultipleChoiceScreen} />
                <Stack.Screen name={selectTopicsName} component={SelectTopicsScreen} />
				<Stack.Screen name={addTimeLimitName} component={AddTimeLimitScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}