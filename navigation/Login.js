import React, { useState } from "react";
import {
	View,
	Image,
	Text,
	SafeAreaView,
	TextInput,
	Alert,
	StatusBar,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from "react-native";
import Styles from "../styles/LoginStyle";
import UserDataService from "../services/user.service.js";


export default function LoginScreen({ navigation }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;

	const handleLogin = async () => {

		try {
			// Make a request to the server for user authentication
			const response = await UserDataService.login(username, password);

			//get the userID from response
			const userID = response.data.user.id;
			
			//update the userID in the global context
			globalThis.userID = userID;

			navigation.navigate("MainContainer"); // Navigate to the MainContainer after successful login
		} catch (error) {
			// Handle authentication errors
			Alert.alert("Login failed", error.response.data.message);
		}
	};

	const handleNewUser = async () => {
		navigation.navigate("CreateUserScreen");
	};

	return (
		<SafeAreaView style={Styles.appContainer}>
			{Platform.OS === "android" ? (
				<View>
					{/* Screen Container */}
					<StatusBar
						// backgroundColor="blue"
						barStyle="light-content"
					/>
				</View>
			) : (
				<View />
			)}

			<View style={Styles.container}>
				<Image source={require("../assets/clearTellMe.png")} />
			</View>
			<KeyboardAvoidingView
				style={Styles.appContainer}
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				keyboardVerticalOffset={keyboardVerticalOffset}
				enabled
			>
				<View style={Styles.loginContainer}>

		
					<TextInput
						style={Styles.loginTextFields}
						placeholder="Username"
						value={username}
						onChangeText={(text) => setUsername(text)}
					/>
					<TextInput
						style={Styles.loginTextFields}
						placeholder="Password"
						secureTextEntry={true}
						value={password}
						onChangeText={(text) => setPassword(text)}
					/>
					<TouchableOpacity
						style={Styles.navButton}
						onPress={handleLogin}
						underlayColor="#fff"
					>
						<Text style={Styles.navText}>LOGIN</Text>
					</TouchableOpacity>

					<TouchableOpacity style={{paddingTop:"3%"}} onPress={handleNewUser}>
						<Text>CREATE NEW USER</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
