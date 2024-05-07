import * as React from "react";
import { useState, useEffect } from "react";
import { Text, View, Image, Pressable, SafeAreaView, ScrollView, Alert, Dimensions, TouchableOpacity } from "react-native";
import  Styles  from "../../globalStyles";
import Styles2 from "../../styles/PostTileStyle.js";
import moment from "moment";
import UserDataService from "../../services/user.service.js";
import VideoDataService from "../../services/video.service.js";
import FollowupDataService from "../../services/followup.service.js";
import VoteDataService from "../../services/vote.service.js";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogBox } from "react-native";
import { Video } from "expo-av";



// This has been tested extensively and functions as intented.
LogBox.ignoreLogs(["Error fetching user data: [AxiosError: Request failed with status code 404]"]);


export default function ProfileScreen({route, navigation}){
	{/* if you use a percentage for the border radius, it will crash on android */}
	const insets = useSafeAreaInsets();
	const tabBarHeight = Math.round(useBottomTabBarHeight());
	const statusBarHeight = Math.round(insets.top);

	const [profilePic, setProfilePic] = useState(require("../../assets/icon.png"));
	const [username, setUsername] = useState("loading...");
	const [userPostCount, setUserPostCount] = useState("loading...");
	const [userVoteCount, setUserVoteCount] = useState("loading...");

	const [content, setContent] = useState(<View><Text>Loading...</Text></View>);
	const [postContent, setPostContent] = useState();
	const [followupContent, setfollowupContent] = useState();
	
	const [postButtonColor, setPostButtonColor] = useState("#fcb42c");
	const [followupButtonColor, setFollowupButtonColor] = useState("#fde085");
	const todayDate = moment().format("YYYY-MM-DD");
	const [followupsArr, setFollowupsArr] = useState([]);

	//functions to call when the page is first loaded
	useEffect(() => {
		loadUserData();
	}, []);

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			if(globalThis.userFieldUpdate && globalThis.userFieldUpdate == true)
			{
				loadUserData();
				globalThis.userFieldUpdate = false;
			}
			//checks the user post count every time the page is loaded. This is a lot less costly than refreshing the posts section every time
		    fetchUserPostCount();
		    //check user vote count
			fetchUserVoteCount();
		});
	
		return unsubscribe;
	}, [navigation]);
	


	useEffect(() => {
		loadUserPosts();
	}, [userPostCount]);

	// Calls this if a new followups video was posted.
	useEffect(() => {
		if (route.params?.hasNewFollowup) {
			loadUserData();
		}
	  }, [route.params?.hasNewFollowup]);
	

	loadUserData = async () => {
		try {
			//set profile pic and username
			const userData = await UserDataService.get(globalThis.userID); 
		  	setUsername("@" + userData.data.username);		
			const img_name = userData.data.profile_pic;
			const profile_pic_url = "https://d1vhss43jk7wen.cloudfront.net/" + img_name;

			setProfilePic({uri: profile_pic_url});
			//set post count
			fetchUserPostCount();
			//set vote count
			fetchUserVoteCount();

		} catch (error) {
			console.error("Error fetching user data:", error); // Log any errors that occur
		}

	};

	loadUserPosts = async () => {
		try {
			const count = await UserDataService.getPostCount(globalThis.userID); 
			setUserPostCount(count.data);
			const userPostData = await UserDataService.getUserVideos(globalThis.userID);
			let followupsIDs = [];
			let followupsArray = [];

			try{
				// Gathers videoIds that have a followup video already.
				const followupsData = await FollowupDataService.getUsersFollowUps(globalThis.userID);

				//create array of posts that already have followups made
				let numOptions = followupsData.data.length;
				for (let i = 0; i < numOptions; i++) {
					followupsIDs.push(followupsData.data[i].video_id);
				}
			}
			catch (error) {
				console.log(error.message);
				//do nothing. This just means there aren't any posts that need followups
			}

			//iterate through all posts and check if any have passed their need feedback by date
			for (let i = 0; i < userPostData.data.length; i++) {
				//if its passed and doesn't have a followup made, add to list
				
				if(userPostData.data[i].end_date < todayDate && followupsIDs.includes(userPostData.data[i].id) == false)
				{
					console.log("post " + userPostData.data[i].id + " has expired");
					followupsArray.push(userPostData.data[i]);
				}
			}

			//set followups content
			if(followupsArray.length != 0)
				setfollowupContent(PostTile.createTileArray(followupsArray, navigation));
			else
				setfollowupContent(
					<View style={{display:"flex", 
						flexDirection:"column", 
						height:"100%", 
						width:"75%", 
						justifyContent:"flex-start", 
						alignItems:"center", 
						marginTop:"5%"}}>
						<Text style={{fontSize:16, textAlign: "center"}}>POSTS THAT NEED FOLLOWUPS WILL APPEAR HERE</Text>
					</View>);

			//set post content
			setPostContent(PostTile.createTileArray(userPostData.data, navigation));

			//set visible content
			setContent(postContent);
			switchToPosts();
		} 
		catch (error) 
		{
			//if response == 404, it just means the user doesn't have any posts yet and therefore can't be found in the posts table
			if(error.response && error.response.status === 404)
				setContent(<Text style={{color: "#a8a8b8", textAlign: "center", textAlignVertical: "center", fontSize: 18, fontWeight: "bold", marginTop:"5%", width:"75%"}}>ANY POSTS THAT YOU MAKE WILL APPEAR HERE</Text>);
			else
				console.error("Error fetching user data:", error); // Log any errors that occur
		}
	};


	const fetchUserPostCount = async () => {
		try{
			const count = await UserDataService.getPostCount(globalThis.userID); 
			if(userPostCount != count.data)
				setUserPostCount(count.data);
			
		} catch (error) {
			console.error("Error fetching user data:", error); // Log any errors that occur
		}
	};

	const fetchUserVoteCount = async () => {
		try{
			const count = await VoteDataService.getVotedVids(globalThis.userID); 
			if(userVoteCount != count.data.length)
				setUserVoteCount(count.data.length);
			
		} catch (error) {
			console.error("Error fetching user data:", error); // Log any errors that occur
		}
	};
	
	switchToPosts = () => {
		setFollowupButtonColor("#fde085");
		setPostButtonColor("#fcb42c");
		setContent(postContent);
		
	};

	switchToFollowups = () => {
		setPostButtonColor("#fde085");
		setFollowupButtonColor("#fcb42c");
		setContent(followupContent);
	};


	return (
		<SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF2DE"}}>
			<View style={{flex: 1, flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width:"100%", height:"100%"}}> 
				
				{/* User info container */}
				<View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width:"100%", height:"40%"}}>

					{/* User settings bar */}
					<View style = {{flexDirection:"row", justifyContent:"flex-end", alignItems:"center", width:"100%", height:"12%", paddingRight:"2%", paddingTop:"1%"}}>
						{/* User settings button */}
						<Pressable style = {{height:"100%", aspectRatio: 1, flexDirection:"row", alignItems: "center", alignContent:"center"}} onPress={() => navigation.navigate("Settings")}>
							<Image source={require("../../assets/userSettingsIcon.png")} style={{width: "90%", aspectRatio: 1, alignItems: "center", alignContent:"center"}}></Image>
						</Pressable>
					</View>

					{/* User profile image */}
					<View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", height:"50%", width:"100%"}}>
						<Image source={profilePic} style={{height:"100%", aspectRatio: 1, borderRadius: 1000}}></Image>
					</View>

					{/* Username */}
					<View style={{flexDirection: "column", justifyContent: "center", alignItems: "center", height:"19%", width: "100%", paddingTop:"2%"}}>
						<Text style={Styles.titleText}>{username}</Text>
					</View>

					{/* User posts/likes */}
					<View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", height: "19%", paddingBottom:"3%"}}>
						<View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
							<Text style={{fontSize: 20, fontWeight: "bold"}}>{userPostCount}</Text>
							<Text style={{fontSize: 15, fontWeight: "bold", color: "#999"}}>{userPostCount === 1 ? "Post" : "Posts"}</Text>
						</View>
						<View>
							{/* This is just here to space out the post and likes counts a bit */}
						</View>
						<View style={{flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
							<Text style={{fontSize: 20, fontWeight: "bold"}}>{userVoteCount}</Text>
							<Text style={{fontSize: 15, fontWeight: "bold", color: "#999"}}>{userVoteCount === 1 ? "Vote" : "Votes"}</Text>
						</View>
					</View>
				</View>
				
				{/* Posts/content container */}
				<View style={{flexDirection: "column", justifyContent: "align-start", alignItems: "center", width: "100%", height:"60%"}}>
					{/* leaving this code in here in case we have time to implement the user likes page */}
					<View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", height:"15%", borderTopColor: "#ddd", borderTopWidth: 2, borderBottomColor: "#ddd", borderBottomWidth: 2}}>
						<TouchableOpacity onPress={() => {switchToPosts();}} style={{width:"38%", height:"80%", flexDirection:"row", justifyContent:"center", alignItems: "center", backgroundColor:postButtonColor, borderRadius:7}}>
							<Text style={{fontSize:15, color:"#fff"}}>USER POSTS</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {switchToFollowups();}} style={{width:"38%", height:"80%", flexDirection:"row", justifyContent:"center", alignItems: "center", backgroundColor:followupButtonColor, borderRadius:7}}>
							<Text style={{fontSize:15, color:"#fff"}}>NEED FOLLOWUPS</Text>
						</TouchableOpacity>
					</View>
					<ScrollView contentContainerStyle={{width:"100%", heigth: Dimensions.get("window").height-tabBarHeight-statusBarHeight, paddingTop:"3%", paddingBottom:"3%"}}>
						{content}
					</ScrollView>
				</View>

			</View>
		</SafeAreaView>
	);
}



// postTile class 
class PostTile{

	//default image
	image = require("../../assets/adaptive-icon.png");

	constructor(data, navigation) {
		this.data = data;
		if(data != null && data.thumbnail != null)
		{
			const img_name = data.thumbnail;
			const thumbnail_url = "https://d1vhss43jk7wen.cloudfront.net/" + img_name;

			

			this.image = {uri: thumbnail_url};			
		}
		this.navigation = navigation;
		
	}

	// Determines if post needs followup video. Used in displaying notification circle.
	// setNeedsFollowup (end_date) {
	// 	const todayDate = moment().format("YYYY-MM-DD");
	// 	const endDate =  moment(end_date).format("YYYY-MM-DD");
	// 	if (todayDate > endDate) {
	// 		return true;
	// 	}
	// 	return false;
	// }

	deleteOptionBox(){
		Alert.alert("Are you sure you want to delete this gem of a post?",
			"",
			[
			  {
					text: "No",
					onPress: () => {},
					style: "cancel",
			  },
			  {
					text: "Yes",
					onPress: () => {
						this.deletePost();
					},
			  },
			],
			{ cancelable: false }
		  );
	}

	deletePost = async () => {
		try
		{
			console.log("deleting post #" + this.data.id);
			await VideoDataService.delete(this.data.id); 
			/* delete from s3 bucket here */
			loadUserPosts();
		} catch (error) {
			console.error("Error fetching deleting post #" + id, error); // Log any errors that occur
		}
	};

	render(){
		return (
			<TouchableOpacity style = {{width:"30%", aspectRatio: 1, flexDirection:"row", alignItems: "flex-start", alignContent:"center"}} onPress={() => this.onPress()} onLongPress={() => this.deleteOptionBox()}>
				<Image source={this.image} style={{width: "100%", aspectRatio: 1, borderRadius:5, alignItems: "center", alignContent:"center"}}></Image>
				<View style= {this.needsFollowup ? Styles.circle : null }/>
			</TouchableOpacity>
		);	
	}

	static ghostTile(){
		return (
			<TouchableOpacity style = {{width:"30%", aspectRatio: 1, flexDirection:"row", alignItems: "center", alignContent:"center"}}>
				<Image source={require("../../assets/sampleUser1.png")} style={{width: "100%", aspectRatio: 1, borderRadius:5, alignItems: "center", alignContent:"center", opacity:0}}></Image>
			</TouchableOpacity>
		);
	}


	onPress(){
		//open new UI window and pass in post data
		this.navigation.navigate("Display Post", {data: this.data});
	}

	static createTileArray(videoData, navigation, followupsArr = []) {
		videoData.reverse();
		let postCount = videoData.length;

		if(postCount < 3)
		{
			let returnValue = [];

			if(postCount === 1){
				returnValue.push(
					<View  key={1} style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%"}}>
						{new PostTile(videoData[0], navigation, followupsArr).render()}
						{PostTile.ghostTile()}
						{PostTile.ghostTile()}
					</View>);
			}
			else
				if(postCount === 2)
				{
					returnValue.push(
						<View  key={2} style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%"}}>
							{new PostTile(videoData[0], navigation, followupsArr).render()}
							{new PostTile(videoData[1], navigation, followupsArr).render()}
							{PostTile.ghostTile()}
						</View>);
				}
				else
					return <View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "75%", marginTop:"5%"}}><Text style={{fontSize:16, textAlign: "center"}}>ANY POSTS THAT YOU MAKE WILL APPEAR HERE</Text></View>;

			return returnValue;
		}


		const rows = Math.floor(postCount / 3);
		const remainder = postCount % 3;
		let returnValue = [];

		// Create full rows
		for(let i = 0; i < rows; i++){

			//the first row shouldn't have top padding
			if(i == 0)
			{
				returnValue.push(
					<View key={i} style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%"}}>
						{new PostTile(videoData[0], navigation, followupsArr).render()}
						{new PostTile(videoData[1], navigation, followupsArr).render()}
						{new PostTile(videoData[2], navigation, followupsArr).render()}
					</View>);
			}
			else
				returnValue.push(
					<View key={i} style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%", paddingTop:"3%"}}>
						{new PostTile(videoData[(0 + i*3)], navigation, followupsArr).render()}
						{new PostTile(videoData[(1 + i*3)], navigation, followupsArr).render()}
						{new PostTile(videoData[(2 + i*3)], navigation, followupsArr).render()}
					</View>);
			
		}

		if(remainder === 1){
			returnValue.push(
				<View key={rows+1} style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%",  paddingTop:10}}>
					{new PostTile(videoData[(0 + rows*3)], navigation, followupsArr).render()}
					{PostTile.ghostTile()}
					{PostTile.ghostTile()}
				</View>);
		}

		if(remainder === 2){
			returnValue.push(
				<View key={rows+1} style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%",  paddingTop:10}}>
					{new PostTile(videoData[(0 + rows*3)], navigation, followupsArr).render()}
					{new PostTile(videoData[(1 + rows*3)], navigation, followupsArr).render()}
					{PostTile.ghostTile()}
				</View>);
		}	
		
		return (
			<View style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "center", width: "100%"}}>{returnValue}</View>
		);
	  }
	
}


	