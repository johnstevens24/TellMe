import * as React from "react";
import { Component } from "react";
import { base64 } from "base-64";
import { useState, useEffect } from "react";
import { Text, View, Image, Button, Pressable, SafeAreaView, ResizeMode, TextInput, TouchableOpacity, Alert} from "react-native";
import  Styles  from "../../globalStyles";
import UserDataService from "../../services/user.service.js";


export default function ProfileChangeField({navigation, route}){
	const field = route.params.field;
	const [fieldValue, setFieldValue] = useState("loading...");
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");

	updateField = async () => {
		try {
			let uniqueness = true;

			if(field == "username"){
				try{ 
					await UserDataService.updateUsername(globalThis.userID, fieldValue);

					//notify user
					Alert.alert("Your " + field + " has been successfully updated");
					globalThis.userFieldUpdate = true;
                        
				}
				catch(error){
					if(error.response.status == 400){
						Alert.alert(error.response.data.message);
					}
					else{
						console.error("Failed trying to update username: " + error);
					}
					
				}

			}

			if(field == "email"){
				//check if username is unique
				try{ 
				
					await UserDataService.updateEmail(globalThis.userID, fieldValue);

					//notify user
					Alert.alert("Your " + field + " has been successfully updated");
					globalThis.userFieldUpdate = true;
					
                        
				}
				catch(error){
					if(error.response.status == 400){
						Alert.alert(error.response.data.message);
					}
					else{
						console.error("Failed trying to update email: " + error);
					}
				}

			}

		} catch (error) {
			Alert.alert("There was an issue updating your " + field);
			console.error("Error fetching user data:", error); // Log any errors that occur
		}
    
	};

	updatePassword = async () => {
		try {
			await UserDataService.updatePassword(globalThis.userID, oldPassword, newPassword);
			setOldPassword("");
			setNewPassword("");
			Alert.alert("Your password was successfully updated");


		} catch (error) {
			if(error.response.status == 401)
				Alert.alert("Incorrect old password entered");
			else
				Alert.alert("There was an issue updating your password, try again");
			setOldPassword("");
			setNewPassword("");
		}
    
	};

	loadField = async () => {
		try {
			//get user data
			const userData = await UserDataService.get(globalThis.userID);    

			if(field == "username")
				setFieldValue(userData.data.username);

			if(field == "email")
				setFieldValue(userData.data.email);

			if(field == "password")
				setFieldValue(userData.data.password);
               
		} catch (error) {
			console.error("Error fetching user data:", error); // Log any errors that occur
		}
    
	};

	useEffect(() => {
		loadField();
	}, []);
        
	if(field == "password")
	{
		return (
			<SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF2DE"}}>

				{/* Back and Logout Buttons */}
				<View style={{flexDirection:"row", height:"7%", paddingLeft:"3%", paddingRight:"3%"}}>
					<TouchableOpacity style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end", width:"100%"}} onPress={() => navigation.goBack()} underlayColor="#fff">
						<Text style={{fontSize:16}}>Back</Text>
					</TouchableOpacity>
				</View>
                    
				<View style={{flexDirection:"column", width:"100%", height:"93%", justifyContent:"flex-start", alignItems:"center", paddingTop:"5%"}}>
					<View style={{backgroundColor:"#fde085", width:"55%", height:"10%", flexDirection:"row", justifyContent:"center", alignItems: "center",marginBottom:"4%", borderRadius:7,}}>
						<TextInput
							style={{fontSize:18}}
							placeholder={"enter old password"}
							value={oldPassword}
							secureTextEntry={true}
							onChangeText={(text) => setOldPassword(text)}
						/>
					</View>
					<View style={{backgroundColor:"#fde085", width:"55%", height:"10%", flexDirection:"row", justifyContent:"center", alignItems: "center",marginBottom:"4%", borderRadius:7,}}>
						<TextInput
							style={{fontSize:18}}
							placeholder={"enter new password"}
							value={newPassword}
							secureTextEntry={true}
							onChangeText={(text) => setNewPassword(text)}
						/>
					</View>
					<TouchableOpacity style={{backgroundColor:"#fcb42c", width:"25%", height:"10%", flexDirection:"row", justifyContent:"center", alignItems: "center", marginBottom:"4%", borderRadius:7}} onPress={() => updatePassword()} underlayColor="#fff">
						<Text style={{fontSize:16, color:"#fff"}}>SUBMIT</Text>
					</TouchableOpacity>
				</View>

			</SafeAreaView>
		);
	}
	else
	{
		return(
			<SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF2DE"}}>

				{/* Back and Logout Buttons */}
				<View style={{flexDirection:"row", height:"7%", paddingLeft:"3%", paddingRight:"3%"}}>
					<TouchableOpacity style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end", width:"100%"}} onPress={() => navigation.goBack()} underlayColor="#fff">
						<Text style={{fontSize:16}}>Back</Text>
					</TouchableOpacity>
				</View>
                
				<View style={{flexDirection:"column", width:"100%", height:"93%", justifyContent:"flex-start", alignItems:"center", paddingTop:"5%"}}>
					<View style={{backgroundColor:"#fde085", width:"55%", height:"10%", flexDirection:"row", justifyContent:"center", alignItems: "center",marginBottom:"4%", borderRadius:7,}}>
						<TextInput
							style={{fontSize:18}}
							placeholder={"enter new " + field}
							value={fieldValue}
							onChangeText={(text) => setFieldValue(text)}
						/>
					</View>
					<TouchableOpacity style={{backgroundColor:"#fcb42c", width:"25%", height:"10%", flexDirection:"row", justifyContent:"center", alignItems: "center", marginBottom:"4%", borderRadius:7}} onPress={() => updateField()} underlayColor="#fff">
						<Text style={{fontSize:16, color:"#fff"}}>SUBMIT</Text>
					</TouchableOpacity>
				</View>

			</SafeAreaView>  
		); 
	}
                
            
}