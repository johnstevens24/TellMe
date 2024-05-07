import * as React from "react";
import { Component } from "react";
import { base64 } from "base-64";
import { useState, useEffect } from "react";
import { Text, View, Image, Button, Pressable, SafeAreaView, ResizeMode, TextInput, TouchableOpacity, Alert} from "react-native";
import  Styles  from "../../globalStyles";
import * as ImagePicker from "expo-image-picker";
import UserDataService from "../../services/user.service.js";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import config from "../../config.js";

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


export default function ProfileSettingsScreen({navigation}){
	const [profilePic, setProfilePic] = useState(require("../../assets/profileIcon.png"));
    
	const handleGetPicture = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: .3,
		});

		if (!result.canceled)
			try{
			//prep file path/image
				const imgPath = result.assets[0].uri.replace("file://", "");
				const pathArr = imgPath.split("/");
				const imgName = pathArr.pop();
				const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });

				//upload to S3
				const s3_upload_res = await uploadImageToS3(imgName, fileContent);
				console.log(s3_upload_res.Location);

				const img_name = s3_upload_res.Location.split("/").pop();

				//update profile to use new S3 link
				const update_res = await UserDataService.updateProfilePicture(globalThis.userID, img_name);
				const  res = JSON.parse(update_res.request._response);

				const old_img_key = res.old_pic_url;
				await deleteFileFromS3(old_img_key)
					.catch((err) => {
						console.error("Error deleting file:", err);
					});
				//confirm change with user
				Alert.alert(res.message);

				//update profile picture on screen
				setProfilePic(result.assets[0]);

				globalThis.userFieldUpdate = true;
			}
			catch(error){
				console.log("Failed trying to create a new user: ", error);
			}
	};


	loadProfilePicture = async () => {
		try {
			//get profile pic and username
			const userData = await UserDataService.get(globalThis.userID);	
			const img_name = userData.data.profile_pic;
			const profile_pic_url = "https://d1vhss43jk7wen.cloudfront.net/" + img_name;

			setProfilePic({uri: profile_pic_url});
		} catch (error) {
			console.error("Error fetching user data:", error); // Log any errors that occur
		}

	};
    
	useEffect(() => {
		loadProfilePicture();
	}, []);

    
	return (
		<SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF2DE"}}>
			<View style={{backgroundColor:"#FFF2DE", width:"100%", height:"100%"}}>
				{/* Back and Logout Buttons */}
				<View style={{flexDirection:"row", height:"7%", paddingLeft:"3%", paddingRight:"3%"}}>
					<TouchableOpacity style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-start", width:"50%"}} onPress={() => navigation.navigate("Login")} underlayColor="#fff">
						<Text style={{fontSize:16}}>Log Out</Text>
					</TouchableOpacity>
					<TouchableOpacity style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end", width:"50%"}} onPress={() => navigation.navigate("Profile Main")} underlayColor="#fff">
						<Text style={{fontSize:16}}>Back</Text>
					</TouchableOpacity>
				</View>
					
				{/* Change fields container */}
				<View style={{flexDirection:"column", alignItems:"center", justifyContent:"flex-start", width:"100%", height:"70%"}}>

					{/* Profile image with overlay */}
					<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", height: "40%", margin: "3%" }}>
						{/* Profile image */}
						<Image source={profilePic} style={{ height: "100%", aspectRatio: 1, borderRadius: 1000 }} />

						{/* Overlay image */}
						<Pressable style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center" }} onPress={()=>handleGetPicture()}>
							{/* <Image source={require("../../assets/camera.png")} style={{ width: '35%', height: '35%' }} /> */}
							<Text style={{fontSize:16, fontWeight: "bold",textShadowColor: "white", textShadowRadius:1.5}}>Tap To{"\n"}Change</Text>
						</Pressable>
					</View>
					{/* Buttons Container */}
					<View style={{ flexDirection:"column", height:"60%", width:"100%", justifyContent:"flex-start", alignItems:"center", margin:"3%"}}>
						{/* UserName */}
						<TouchableOpacity style={{backgroundColor:"#fcb42c", width:"55%", height:"20%", flexDirection:"row", justifyContent:"center", alignItems: "center", marginBottom:"4%", borderRadius:7}} onPress={() => navigation.navigate("Change Field", {field: "username"})} underlayColor="#fff">
							<Text style={{fontSize:16}}>CHANGE USERNAME</Text>
						</TouchableOpacity>
						{/* Password */}
						<TouchableOpacity style={{backgroundColor:"#fcb42c", width:"55%", height:"20%", flexDirection:"row", justifyContent:"center", alignItems: "center", marginBottom:"4%", borderRadius:7}} onPress={() => navigation.navigate("Change Field", {field: "password"})} underlayColor="#fff">
							<Text style={{fontSize:16}}>CHANGE PASSWORD</Text>
						</TouchableOpacity>
						{/* Email */}
						<TouchableOpacity style={{backgroundColor:"#fcb42c", width:"55%", height:"20%", flexDirection:"row", justifyContent:"center", alignItems: "center", marginBottom:"4%", borderRadius:7}} onPress={() => navigation.navigate("Change Field", {field: "email"})} underlayColor="#fff">
							<Text style={{fontSize:16}}>CHANGE EMAIL</Text>
						</TouchableOpacity>
						{/* User stats */}
						<TouchableOpacity style={{backgroundColor:"#fcb42c", width:"55%", height:"20%", flexDirection:"row", justifyContent:"center", alignItems: "center", marginBottom:"4%", borderRadius:7}} onPress={() => navigation.navigate("User Stats")} underlayColor="#fff">
							<Text style={{fontSize:16}}>USER STATS</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* User Stats Container */}
				{/* <View style={{flexDirection:"row", width:"100%", height:"23%"}}>
						<View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
							<Text style={{fontSize:30, fontWeight:"bold", color:"#a3a3a3"}}>#1</Text>
							<Text>User for post count</Text>
						</View>
						<View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
							<Text style={{fontSize:30, fontWeight:"bold", color:"#a3a3a3"}}>#5</Text>
							<Text>User for like count</Text>
						</View>
					</View> */}
			</View>
		</SafeAreaView>
	);
}