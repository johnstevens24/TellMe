import React, { useState } from "react";
import { Text, View, Image, Pressable, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Alert} from "react-native";
import Styles from "../styles/LoginStyle";
import * as ImagePicker from "expo-image-picker";
import UserDataService from "../services/user.service.js";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";
import config from "../config.js";

const AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: config.S3_ACCESS_KEY,
	secretAccessKey: config.S3_SECRET_KEY,
	region: config.S3_REGION,
});

const s3 = new AWS.S3();


const uploadImageToS3 = (fileName, file) => {
	return s3.upload(
		{
			Bucket: config.S3_BUCKET,
			Key: fileName,
			Body: Buffer.from(file, "base64"),
			ContentType: "image/jpeg",
			ContentEncoding: "base64",
		}
	).promise();
};

const deleteFileFromS3 = (fileName) => {
	const params = {
		Bucket: config.S3_BUCKET,
		Key: fileName,
	};

	return s3.deleteObject(params).promise();
};





export default function CreateUserScreen({ navigation }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [Email, setEmail] = useState("");
	const [FirstName, setFirstName] = useState("");
	const [LastName, setLastName] = useState("");
	const [profilePic, setProfilePic] = useState(require("../assets/profileIcon.png"));
	const [getPicPrompt, setGetPicPrompt] = useState(<Text>Tap To Select A Profile Picture</Text>);

  
	const handleCreateUser = async () => {
		if(username == "" || password == "" || Email == "" || FirstName == "" || LastName == "")
			Alert.alert("Please fill out remaining fields");
		else
			if(profilePic == require("../assets/profileIcon.png"))
				Alert.alert("Click on the person outline to select a profile picture");
			else{

				let img = null;
				try{
					const imgPath = profilePic.uri.replace("file://", "");
					const pathArr = imgPath.split("/");
					const imgName = pathArr[pathArr.length - 1];

					const fileContent = await FileSystem.readAsStringAsync(profilePic.uri, { encoding: FileSystem.EncodingType.Base64 });

					const s3_upload_res = await uploadImageToS3(imgName, fileContent);
					img = s3_upload_res.Location.split("/").pop();	
					let data = {
						"createdAt": null,
						"date_joined":null,
						"username": username, 
						"password": password, 
						"email": Email, 
						"first_name": FirstName, 
						"last_name": LastName,
						"profile_pic": img,
						"updatedAt":null
					};

					const response = await UserDataService.create(data);

					const loginResponse = await UserDataService.login(username, password);
					globalThis.userID = loginResponse.data.user.id;
					navigation.navigate("MainContainer");	
				


				}
				catch(error){
					if(error.response.status == 400){
						if(img){
							await deleteFileFromS3(img)
								.catch((err) => {
									console.error("Error deleting file:", err);
								});
						}

						Alert.alert(error.response.data.message);
					}
					else{
						console.error("Failed trying to create a new user: ", error.response.data.message);
					}
				}
				
			}
	};



	const handleGetPicture = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: .3,
		});
		if (!result.canceled) {
			//gets rid of the prompt to choose a profile picture
			setGetPicPrompt();
			//sets the profile picture
			setProfilePic(result.assets[0]);
		}
	};

	//return to the login page
	const handleBack = () => {
		navigation.navigate("Login");
	};

	return (
		<SafeAreaView style={Styles.appContainer}>
			<View style={{flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%"}}>

				{/* Back button */}
				<TouchableOpacity style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end", width:"100%", paddingTop:"2%", paddingRight:"3%"}} onPress={handleBack} underlayColor="#fff">
					<Text>CANCEL</Text>
				</TouchableOpacity>

				{/* Input fields container */}
				<View style={{flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%"}}>

					{/* User profile image */}
					<View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", height:"25%", marginBottom:"6%"}}>
						<Pressable onPress={handleGetPicture}>
							<Image source={profilePic} style={{height:"100%", aspectRatio: 1, borderRadius: 1000}}></Image>
						</Pressable>
						{getPicPrompt}
					</View>

					<ScrollView automaticallyAdjustKeyboardInsets={true}>
						{/* UserName */}
						<TextInput
							style={Styles.loginTextFields}
							placeholder="Username"
							value={username}
							onChangeText={(text) => setUsername(text)}
						/>
						{/* Password */}
						<TextInput
							style={Styles.loginTextFields}
							placeholder="Password"
							secureTextEntry={true}
							value={password}
							onChangeText={(text) => setPassword(text)}
						/>
						{/* Email */}
						<TextInput
							style={Styles.loginTextFields}
							placeholder="Email"
							value={Email}
							onChangeText={(text) => setEmail(text)}
						/>
						{/* First Name */}
						<TextInput
							style={Styles.loginTextFields}
							placeholder="First Name"
							value={FirstName}
							onChangeText={(text) => setFirstName(text)}
						/>
						{/* Last Name */}
						<TextInput
							style={Styles.loginTextFields}
							placeholder="Last Name"
							value={LastName}
							onChangeText={(text) => setLastName(text)}
						/>
					</ScrollView>
		
				</View>


				{/* Create button */}
				<TouchableOpacity style={Styles.navButton} onPress={handleCreateUser} underlayColor="#fff">
					<Text style={Styles.navText}>CREATE</Text>
				</TouchableOpacity>


			</View>

    

      
		</SafeAreaView>
    
	);
}
