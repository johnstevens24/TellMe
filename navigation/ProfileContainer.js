import * as React from "react";
import  { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import ProfileScreen from "./screens/ProfileScreen";
import DisplayPostScreen from "./screens/ProfileDisplayPostScreen";
import ProfileSettingsScreen from "./screens/ProfileSettingsScreen";
import FollowupRecordScreen from "./screens/FollowupCreation/FollowupRecordScreen";
import FollowupPlaybackScreen from "./screens/FollowupCreation/FollowupPlaybackScreen";
import FollowupChoiceScreen from "./screens/FollowupCreation/FollowupChoiceScreen";
import ViewFollowupScreen from "./screens/ViewFollowupScreen";
import ChangeFieldScreen from "./screens/ProfileChangeField";
import UserStatsScreen from "./screens/UserStats";

// screen names
const profileName = "Profile Main";
const displayPostName = "Display Post";
const settingsScreenName = "Settings";
const followupRecordName = "Followup Record";
const followupPlaybackName = "Followup Playback";
const followupChoiceName = "Followup Choice";
const viewFollowupName = "View Followup";
const changeFieldName = "Change Field";
const userStatsName = "User Stats";

const Stack = createStackNavigator();

export default function CreateContainer({ navigation }){
	return (
		// <NavigationContainer independent={true} firstroute={profileName}>
            <Stack.Navigator initialRouteName={profileName} screenOptions={{ headerShown: false }}>
				<Stack.Screen name={profileName} component={ProfileScreen} />
                <Stack.Screen name={displayPostName} component={DisplayPostScreen} />
				<Stack.Screen name={settingsScreenName} component={ProfileSettingsScreen} />
				<Stack.Screen name={followupChoiceName} component={FollowupChoiceScreen} />
				<Stack.Screen name={followupRecordName} component={FollowupRecordScreen} />
				<Stack.Screen name={followupPlaybackName} component={FollowupPlaybackScreen} options={{gestureEnabled: false, }}/>
				<Stack.Screen name={viewFollowupName} component={ViewFollowupScreen} />
				<Stack.Screen name={changeFieldName} component={ChangeFieldScreen} />
				<Stack.Screen name={userStatsName} component={UserStatsScreen} />
			</Stack.Navigator>
		// </NavigationContainer>
	);
}