import * as React from "react";
import  { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createStackNavigator } from "@react-navigation/stack";

// import screens
import TopicsScreen from "./screens/TopicsScreen";
import TopicFeedScreen from "./screens/TopicFeed";

// screen names
const topicsName = "Topics Main";
const topicsFeedName = "Topic Feed";
const Stack = createStackNavigator();

export default function CreateContainer({ navigation }){
	return (
		// <NavigationContainer independent={true} firstroute={profileName}>
            <Stack.Navigator initialRouteName={topicsName} screenOptions={{ headerShown: false }}>
				<Stack.Screen name={topicsName} component={TopicsScreen} />
                <Stack.Screen name={topicsFeedName} component={TopicFeedScreen} />
			</Stack.Navigator>
		// </NavigationContainer>
	);
}