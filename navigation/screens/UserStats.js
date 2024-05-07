import * as React from "react";
import { Component } from 'react';
import { base64 } from 'base-64';
import { useState, useEffect } from "react";
import { Text, View, Image, Button, Pressable, SafeAreaView, ResizeMode, TextInput, TouchableOpacity, Alert} from "react-native";
import  Styles  from "../../globalStyles";
import StatsDataService from "../../services/stats.service.js";


export default function UserStats({navigation}){
        const [activeRanking, setActiveRanking] = useState("loading...")
        const [favTopic, setFavTopic] = useState("loading...")
        const [mostPopular, setMostPopular] = useState("loading...")
        const [votesChosen, setVotesChosen] = useState("loading...")
        const [voteCount, setVoteCount] = useState("loading...")
        const [votesRecieved, setVotesRecieved] = useState("loading...")


        useEffect(() => {
            loadStats()
        }, [])

        loadStats = async () => {
            //these all need independent try/catches because depending on the state of the database, some may work and some may not. 

            try {
                const ranking = (await StatsDataService.findUserRanking(globalThis.userID)).data.ranking; 
                if(ranking > 3)
                    setActiveRanking(ranking + "th")
                else
                {
                    if(ranking == 1)
                    setActiveRanking("1st")
                if(ranking == 2)
                    setActiveRanking("2nd")
                if(ranking == 3)
                    setActiveRanking("3rd")
                }
            } catch(error) {
                console.log("error fetching user ranking")
                setActiveRanking("N/A")
            }
            
            try{
                setVotesRecieved((await StatsDataService.findNumVotesOnVideos(globalThis.userID)).data.voteCount)
            } catch(error) {
                console.log("error fetching votes recieved")
                setVotesRecieved("N/A")
            }

            try{
                const val = await StatsDataService.findMostPopularTopicOnTellMe()
                if(val && val.data.topic)
                    setMostPopular(val.data.topic)
            } catch(error) {
                console.log("error fetching most popular topic")
                setMostPopular("N/A")
            }
            
            try{
                const response = await StatsDataService.findProportionVotedCorrectly(globalThis.userID)
                var percent = response.data.proportion
                percent = parseInt(percent*100)
                setVotesChosen(percent + "%")
            } catch(error) {
                console.log("error fetching votes chosen")
                setVotesChosen("N/A")
            }

            try{
                setVoteCount((await StatsDataService.findTimesVoted(globalThis.userID)).data.voteCount)
            } catch(error) {
                console.log("error fetching vote count")
                setVoteCount("N/A")
            }

            try{
                const userFavTopic = await StatsDataService.findFavTopic(globalThis.userID)
                if(userFavTopic && userFavTopic.data.chosen_topic)
                    setFavTopic(userFavTopic.data.chosen_topic)               
                else   
                    setFavTopic("N/A")
            } catch(error) {
                console.log("error fetching favorite topic")
                setFavTopic("N/A")
            }
            
            
            
            
            
                
                // setVotesChosen((await StatsDataService.findProportionVotedCorrectly(globalThis.userID)).data.proportion + "%")
                // setVoteCount((await StatsDataService.findTimesVoted(globalThis.userID)).data.voteCount)
            
                // const userFavTopic = await StatsDataService.findFavTopic(globalThis.userID)
                // if(userFavTopic.data.chosen_topic)
                //     setFavTopic(userFavTopic.data.chosen_topic)                 
                // else   
                //     console.log("N/A")

                
            
    
        };

        return(
            <SafeAreaView style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF2DE"}}>

            {/* Back and Logout Buttons */}
            <View style={{flexDirection:"row", height:"7%", paddingLeft:"3%", paddingRight:"3%"}}>
                <TouchableOpacity style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end", width:"100%"}} onPress={() => navigation.goBack()} underlayColor="#fff">
                    <Text style={{fontSize:16}}>Back</Text>
                </TouchableOpacity>
            </View>
            
            {/* User stats container */}
            <View style={{flexDirection:"Column", height:"93%", justifyContent:"flex-start", alignItems:"center", width:"100%"}}>

                <View style={{flexDirection:"row", width:"100%", height:"33%"}}>
                        <View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
                            <Text style={{fontSize:30, fontWeight:"bold", color:"#fcb42c"}}>{activeRanking}</Text>
                            <Text style={{textAlign: "center"}}>MOST ACTIVE USER</Text>
                        </View>
                        <View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
                            <Text style={{fontSize:30, fontWeight:"bold", color:"#fcb42c"}}>{votesChosen}</Text>
                            <Text style={{textAlign: "center"}}>OF YOUR VOTES WERE SUCCESSFULLY CHOSEN</Text>
                        </View>
                </View> 

                <View style={{flexDirection:"row", width:"100%", height:"33%"}}>
                        <View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
                            <Text style={{textAlign: "center"}}>YOUR VIDEOS RECIEVED</Text>
                            <Text style={{fontSize:30, fontWeight:"bold", color:"#fcb42c"}}>{votesRecieved}</Text>
                            <Text style={{textAlign: "center"}}>VOTES</Text>
                        </View>
                        <View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
                            <Text style={{textAlign: "center"}}>YOU HAVE VOTED ON</Text>
                            <Text style={{fontSize:30, fontWeight:"bold", color:"#fcb42c"}}>{voteCount}</Text>
                            <Text style={{textAlign: "center"}}>VIDEOS</Text>
                        </View>
                </View> 

                <View style={{flexDirection:"row", width:"100%", height:"33%"}}>
                        <View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
                            <Text style={{fontSize:30, fontWeight:"bold", color:"#fcb42c"}}>{mostPopular}</Text>
                            <Text style={{textAlign: "center"}}>IS THE MOST POPULAR TOPIC RIGHT NOW</Text>
                        </View>
                        <View style={{flexDirection:"column", alignItems:"center", justifyContent: "flex-start", width:"50%", height:"100%", paddingTop:"5%"}}>
                            <Text style={{fontSize:30, fontWeight:"bold", color:"#fcb42c"}}>{favTopic}</Text>
                            <Text style={{textAlign: "center"}}>IS YOUR FAVORITE TOPIC</Text>
                        </View>
                </View> 
            </View>

        </SafeAreaView>  
        ) 
        
                
            
}