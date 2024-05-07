import * as React from "react";
import { useState, useEffect } from "react";
import { Text, View, Image, Pressable, SafeAreaView, ScrollView, Alert } from "react-native";
import Styles from "../../styles/PostTileStyle.js";
import moment from "moment";

// postTile class 
export default class PostTile{

	//default image
	image = require("../../assets/adaptive-icon.png");

	constructor(data, navigation, followupArr) {
		this.data = data;
		if(data != null && data.thumbnail != null)
		{
			this.image = {uri: "https://d1vhss43jk7wen.cloudfront.net/" + data.thumbnail};			
		}
		this.navigation = navigation;
		// Ensures followups screen PostTiles are not rendered with followup notification
		if (data.user_id !== globalThis.userID) {
			this.needsFollowup = false;
		}
		// Ensures profile screen PostTiles are not rendered with followup notification if they already have a followup video
		else if (followupArr.includes(data.id)) {
			this.needsFollowup = false;
		}
		// Needs Followup notification determined by date
		else {
			this.needsFollowup = this.setNeedsFollowup(data.end_date);
		}
	}

	// Determines if post needs followup video. Used in displaying notification circle.
	setNeedsFollowup (end_date) {
		const todayDate = moment().format("YYYY-MM-DD");
		const endDate =  moment(end_date).format("YYYY-MM-DD");
		if (todayDate > endDate) {
			return true;
		}
		return false;
	}

	render(){
		return (
			<Pressable style = {{width:"30%", aspectRatio: 1, flexDirection:"row", alignItems: "flex-start", alignContent:"center"}} onPress={() => this.onPress()}>
				<Image source={this.image} style={{width: "100%", aspectRatio: 1, borderRadius:5, alignItems: "center", alignContent:"center"}}></Image>
				<View style= {this.needsFollowup ? Styles.circle : null }/>
			</Pressable>
		);	
	}

	static ghostTile(){
		return (
			<Pressable style = {{width:"30%", aspectRatio: 1, flexDirection:"row", alignItems: "center", alignContent:"center"}}>
				<Image source={require("../../assets/sampleUser1.png")} style={{width: "100%", aspectRatio: 1, borderRadius:5, alignItems: "center", alignContent:"center", opacity:0}}></Image>
			</Pressable>
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
				return <View style={{flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", width: "100%"}}><Text>User has no posts</Text></View>;

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
