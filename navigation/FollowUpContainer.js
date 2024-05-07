import * as React from "react";
import  { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import FollowUpScreen from "./screens/FollowUpScreen";
// screen that displays intial post
import OriginalPostScreen from "./screens/ProfileDisplayPostScreen"
//import FollowUpDisplayInitalPostScreen from "./screens/FollowUpDisplayPostScreen";
// screen that displays followup to that post
import FollowUpDisplayFollowUpPostScreen from "./screens/FollowUpDisplayFollowUpPostScreen";
import ViewFollowupScreen from "./screens/ViewFollowupScreen";

// screen names
const followUpScreen = "FollowUpScreen";
const displayInitialPost = "Display Post";
const displayFollowUpPost = "FollowUp Post";
const viewFollowupName = "View Followup";
const Stack = createStackNavigator();

export default function CreateContainer({ navigation }){
	return (
		// <NavigationContainer independent={true} firstroute={followUpScreen}>
            <Stack.Navigator initialRouteName={followUpScreen} screenOptions={{ headerShown: false }}>
				<Stack.Screen name={followUpScreen} component={FollowUpScreen} />
                <Stack.Screen name={displayInitialPost} component={OriginalPostScreen} />
				{/* <Stack.Screen name={displayFollowUpPost} component={FollowUpDisplayFollowUpPostScreen} /> */}
				<Stack.Screen name={viewFollowupName} component={FollowUpDisplayFollowUpPostScreen} />
			</Stack.Navigator>
		// </NavigationContainer>
	);
}