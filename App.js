import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainContainer from "./navigation/MainContainer";
import Login from "./navigation/Login";
import CreateUserScreen from "./navigation/CreateUserScreen";
import CreateContainer from "./navigation/CreateContainer";

const Stack = createStackNavigator();

function App() {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, gestureEnabled: false  }}>
				<Stack.Screen name="Login" component={Login} />
				<Stack.Screen name="CreateUserScreen" component={CreateUserScreen} />
				<Stack.Screen name="MainContainer" component={MainContainer} />
				<Stack.Screen name="CreateContainer" component={CreateContainer} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;