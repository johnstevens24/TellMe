import * as React from "react";
import  { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from 'react-native';

// Change status bar color
StatusBar.setBarStyle('dark-content');

// import screens
import HomeScreen from "./screens/HomeScreen";
import PollScreen from "./screens/PollScreen";
import PollAnalyticsScreen from "./screens/PollAnalyticsScreen";
import PollCommentsScreen from "./screens/PollCommentsScreen";

// import containers
import CreateContainer from "./CreateContainer";
import ProfileContainer from "./ProfileContainer";
import FollowUpContainer from "./FollowUpContainer";
import TopicContainer from "./TopicContainer"

// screen names
const homeName = "Home";
const followUpName = "Follow Up";
const createName = "Create";
const topicsName = "Topics";
const profileName = "Profile";
const pollName = "Poll";
const pollAnalyticsName = "Poll Analytics";
const pollCommentsName = "Poll Comments";

const Tab = createBottomTabNavigator();

export default function MainContainer(){
	return (
		// <NavigationContainer independent={true}>
			<Tab.Navigator
				initialRouteName={homeName}
				screenOptions={({route}) => ({
					tabBarIcon: ({focused, color, size}) => {
						let iconName;
						let routeName = route.name;
						if (routeName == homeName){
							iconName = focused ? "home" : "home-outline";
						} else if (routeName == followUpName){
							iconName = focused ? "return-up-forward" : "return-up-forward-outline";
						} else if (routeName == topicsName){
							iconName = focused ? "people" : "people-outline";
						} else if (routeName == profileName){
							iconName = focused ? "person-circle" : "person-circle-outline";
						} else if (routeName == createName){
							iconName = focused ? "add-circle" : "add-circle-outline";
						}
						return <Ionicons name={iconName} size={size} color={color} />;
					},
				})}>

				<Tab.Screen name={homeName} component={HomeScreen} options={{headerShown: false}}/>
				<Tab.Screen name={followUpName} component={FollowUpContainer} options={{headerShown: false}}/>
				<Tab.Screen name={createName} component={CreateContainer} options={{headerShown: false}}/>
				<Tab.Screen name={topicsName} component={TopicContainer} options={{headerShown: false}}/>
				<Tab.Screen name={profileName} component={ProfileContainer} options={{headerShown: false}}/>
				<Tab.Screen name={pollName} component={PollScreen} options={{headerShown: false, tabBarButton: () => null,}}/>
				<Tab.Screen name={pollAnalyticsName} component={PollAnalyticsScreen} options={{headerShown: false, tabBarButton: () => null,}}/>
				<Tab.Screen name={pollCommentsName} component={PollCommentsScreen} options={{headerShown: false, tabBarButton: () => null,}}/>
			</Tab.Navigator>
				
		// </NavigationContainer>
	);
}