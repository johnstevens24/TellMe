// The code in this file is pretty similar to the code in ProfileDisplayPostScreen.js, but it handles swiping and navigation differently.
// If it ever gets refractored, make sure to take that into consideration


import * as React from "react";
import { Component } from "react";
import { base64 } from "base-64";
import { useState, useEffect, useRef, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, Image, Button, Pressable, SafeAreaView, ScrollView, useWindowDimensions, Alert, StatusBar, Dimensions, TouchableOpacity, GestureResponderHandlers } from "react-native";
import { Video, ResizeMode } from "expo-av";
import Styles from "../../styles/PollAnalyticsStyle.js";
import VoteDataService from "../../services/vote.service.js";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Styles2 from "../../styles/PollCommentsStyle.js";
import OptionDataService from "../../services/option.service.js";
import FollowUpDataService from "../../services/followup.service.js";
import { LogBox } from "react-native";




// This suppresses a developmental only error about navigation.
// It has been tested extensively and functions as intented.
LogBox.ignoreLogs(["The action 'GO_BACK' was not handled by any navigator."]);


export default function FollowUpDisplayPostScreen({ navigation, route }) {
        const {data} = route.params;
        const id = data.video_id;
        const [status, setStatus] = React.useState({}); //don't delete this
        const [followupsData, setFollowupsData] = useState(data); //defaults to the original video id
        const videoRef = useRef(null);

      useEffect(() => {
          const unsubscribe = navigation.addListener("focus", () => {
              if (videoRef.current) {
                  videoRef.current.playAsync();
              }
          });
          return unsubscribe;
      }, [navigation]);
  
      useEffect(() => {
          const unsubscribe = navigation.addListener("blur", () => {
              if (videoRef.current) {
                  videoRef.current.pauseAsync();
              }
          });
          return unsubscribe;
      }, [navigation]);
   
        useEffect(() => {
            // getFollowUpID()
            fetchFollowupsData();
        }, []);


        const handleSwipe = e => {
            //handle if user swipes left
            if(e != null && e.nativeEvent.velocityX > 500)
            {
                //for some reason was throwing a development-only error when using navigation.goBack()
                navigation.goBack();
            }
            //handle if user swipes right
            if(e != null && e.nativeEvent.velocityX < -500)
            {
                //for some reason was throwing a development-only error when using navigation.goBack()
                // navigation.navigate("FollowUp Post", {video_data: followUpData})
                navigation.navigate("View Followup", {id, followupsData});
            }
        };

        // Fetch wheter video has followup.
        fetchFollowupsData = async () => {
            try {
                const followupsData = await FollowUpDataService.getByVideoId(data.id);
                if (followupsData.data !== null && followupsData.data.length !== 0) {
                    setFollowupsData(followupsData.data);
                }
            } catch (error) {
              console.error("Error fetching followups data:", error); // Log any errors that occur
            }
        };






//There is some repeat code for the video in this if statement. It needs to be like that for the gesture handler to work properly
if(data.poll_type == "Free Response")
{
   
    // For testing use 44: Multiple Choice, 45: Yes or No, 71: Free Response
    const [optionsArr, setOptionsArr] = useState([]);
    const [likesArr, setLikesArr] = useState([]); // holds all optionIds that were liked
    const [dislikesArr, setDislikesArr] = useState([]); // holds all optionIds that were disliked
 
    // Excessively commenting this method because all the weird syntax confuses me.
    // This method updates the likesArr when a comment is liked and then the view re-renders.
    const handleLikeOption = (optionId) => {
      // Updater function takes "pending state and calculates next state from it"
      // ex) setCount(prevC => prevC + 1). pending state: prevC. next state: prevC + 1.
      setLikesArr((prevLikesArr) => {
        if (prevLikesArr.includes(optionId)) {
          // filter method accepts as parameter a callback provided function.
          // takes each element of prevLikesArr (an optionId) and compares with current optionId.
          // Only ids that do not match the optionId will passs the filter and remain.
          return prevLikesArr.filter((id) => id !== optionId);
        } else {
          // ... is called spread syntax. Basically expands an array into its elements.
          return [...prevLikesArr, optionId];
        }
      });
    };
 
    const handleDislikeOption = (optionId) => {
      setDislikesArr((prevDislikesArr) => {
        if (prevDislikesArr.includes(optionId)) {
          return prevDislikesArr.filter((id) => id !== optionId);
        } else {
          return [...prevDislikesArr, optionId];
        }
      });
    };


    //functions to call when the page is first loaded
    useFocusEffect(
        useCallback(() => {
          fetchOptionsData();
        }, [])
    );
 
    // Gets the polling options
    fetchOptionsData = async () => {
        try {
          const optionData = await OptionDataService.getByVidId(data.id);
          numOptions = optionData.data.length;
          let optionsArray = [];
          for (let i = 0; i < numOptions; i++) {
            let tempObject = new Option(
              optionData.data[i].id,
              optionData.data[i].option
            );
            optionsArray.push(tempObject);
          }
          setOptionsArr(optionsArray);
        } catch (error) {
          console.error("Error fetching polling options data:", error); // Log any errors that occur
        }
      };


    return (
        <SafeAreaView style={Styles2.appContainer}>
            {/* Video Container */}
            <View style={{width:"100%", height:"55%", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                <PanGestureHandler style={{width:"100%", height:"100%", flexDirection:"column", justifyContent:"flex-start"}}onGestureEvent={handleSwipe}>
                {/* FYI you can only have a single view inside the gesture handler */}
                    <View style={{flexDirection:"column", width:"100%", height:"100%", alignItems: "center", justifyContent: "center", padding:"2%"}}>
                        <Video
                        ref={videoRef}
                        style={{flexDirection: "column", height:"100%", alignItems: "center", justifyContent: "center", aspectRatio:".5625", borderRadius:25}}
                        source={{uri: "https://d1vhss43jk7wen.cloudfront.net/" + data.video_data}}
                        fullscreen={false}
                        useNativeControls={true}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={true}
                        isLooping={true}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                        onError={error => console.error("Error:", error)}
                        />
                        <View style={{ position: "absolute", bottom: 20, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 20 }}>
                            <Text style={{ color: "white", fontSize: 20 }}>Tell Me, {data.poll_question}</Text>
                        </View>
                    </View>
                </PanGestureHandler>
            </View>
            {/* Poll Results Container */}
            <View style={{ height: "35%"}}>
                <ScrollView>
                <View style={Styles2.answerContainer}>
                    {optionsArr.map((option) => (
                    <View key={option.id}>
                        <TouchableOpacity
                        disabled={true}
                        style={Styles2.answerButton}
                        underlayColor="#fff"
                        >
                        <Text style={Styles2.answerText}>{option.option}</Text>
                        </TouchableOpacity>
                    </View>
                    ))}
                </View>
                </ScrollView>
            </View>
           {/* Navigation Container */}
				<View style={{
					height:"10%",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "flex-end",
					zIndex: 999,
				}}>
        			<TouchableOpacity
          				style={Styles.navButton}
          				onPress={() => navigation.goBack()}
          				underlayColor="#fff"
        				>
          				<Text style={Styles.navText}>Back</Text>
        			</TouchableOpacity> 
					<TouchableOpacity
          				style={Styles.navButton}
          				onPress={() => navigation.navigate("View Followup", {id, followupsData})}
          				underlayColor="#fff"
        				>
          				<Text style={Styles.navText}>View Followup</Text>
        			</TouchableOpacity>
      			</View>
        </SafeAreaView>
    );
}
else
{
    const question = data.question;
    const [loading, setLoading] = useState(true);
    const [voteArr, setVoteArr] = useState([]);
    const { height, width, scale, fontScale } = useWindowDimensions();
    proportionBarMaxLength = width - 50; // 50 = 25 pixel margin on each side


    //functions to call when the page is first loaded
    useFocusEffect(
        useCallback(() => {
          fetchVoteData();
        }, [])
    );
   
    // Gets the vote data
    fetchVoteData = async () => {
        try {
          const voteResults = await VoteDataService.getVoteResults(data.id);
          let voteArray = [];
          for (let i = 0; i < voteResults.data.results.length; i++) {
            let tempVoteResult = new VoteResult(
              voteResults.data.results[i].id,
              voteResults.data.results[i].option,
              voteResults.data.results[i].proportion,
              voteResults.data.results[i].votes
            );
            voteArray.push(tempVoteResult);
          }
          voteArray.sort((a, b) => b.proportion - a.proportion);
          setVoteArr(voteArray);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching voting data:", error); // Log any errors that occur
        }
      };


    return (
        <SafeAreaView style={Styles.appContainer}>
            {/* Video Container */}
            <View style={{width:"100%", height:"55%", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
                <PanGestureHandler style={{width:"100%", height:"100%", flexDirection:"column", justifyContent:"flex-start"}}onGestureEvent={handleSwipe}>
                {/* FYI you can only have a single view inside the gesture handler */}
                    <View style={{flexDirection:"column", width:"100%", height:"100%", alignItems: "center", justifyContent: "center", padding:"2%"}}>
                        <Video
                        ref={videoRef}
                        style={{flexDirection: "column", height:"100%", alignItems: "center", justifyContent: "center", aspectRatio:".5625", borderRadius:25}}
                        source={{uri: "https://d1vhss43jk7wen.cloudfront.net/" + data.video_data}}
                        fullscreen={false}
                        useNativeControls={true}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={true}
                        isLooping={true}
                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                        onError={error => console.error("Error:", error)}
                        />
                        <View style={{ position: "absolute", bottom: 20, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: 20 }}>
                            <Text style={{ color: "white", fontSize: 20 }}>Tell Me, {data.poll_question}</Text>
                        </View>
                    </View>
                </PanGestureHandler>
            </View>
            {/* Poll Results Container */}


            {loading ? (
                <View style={{ height:"35%"}}>
                    <Text>Loading...</Text>
                </View>
                ) : (
                <>
                    {voteArr.length === 0 ? (
                    <View style={{ height:"35%"}}>
                        <Text style={{flexDirection: "column",alignSelf: "center",justifyContent: "center",fontSize: 30,marginTop: 15,marginBottom: 10}}>No responses yet</Text>
                    </View>
                    ) : (
                        <View style={{ height:"35%"}}>
                        <ScrollView>
                        <View style={Styles.answerContainer}>
                            {voteArr.map((vote) => (
                            <View key={vote.optionId}>
                                <Text style={Styles.optionTextContainer}>
                                {vote.optionText}
                                </Text>


                                <TouchableOpacity
                                disabled={true}
                                style={Styles.answerButton}
                                underlayColor="#fff"
                                >
                                <Text style={Styles.answerText}>{vote.optionText}</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                disabled={true}
                                style={[
                                    Styles.proportionBar,
                                    { width: proportionBarMaxLength * vote.proportion },
                                ]}
                                underlayColor="#fff"
                                >
                                <Text
                                    style={[
                                    Styles.analyticsText,
                                    { width: proportionBarMaxLength * vote.proportion },
                                    ]}
                                >
                                    l
                                </Text>
                                </TouchableOpacity>


                                <Text style={Styles.analyticsTextContainer}>
                                {Math.floor(vote.proportion * 100)}% with {vote.numVotes}{" "}
                                {vote.numVotes === 1 ? "vote" : "votes"}
                                </Text>
                            </View>
                            ))}
                        </View>
                        </ScrollView>
                    </View>
                    )}
                </>
                )}
                {/* Navigation Container */}
				<View style={{
					height:"10%",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "flex-end",
					zIndex: 999,
				}}>
        			<TouchableOpacity
          				style={Styles.navButton}
          				onPress={() => navigation.goBack()}
          				underlayColor="#fff"
        				>
          				<Text style={Styles.navText}>Back</Text>
        			</TouchableOpacity> 
					<TouchableOpacity
          				style={Styles.navButton}
          				onPress={() => navigation.navigate("View Followup", {id, followupsData})}
          				underlayColor="#fff"
        				>
          				<Text style={Styles.navText}>View Followup</Text>
        			</TouchableOpacity>
      			</View>
        </SafeAreaView>
    );
}
}


class VoteResult {
constructor(optionId, optionText, proportion, numVotes) {
  this.optionId = optionId;
  this.optionText = optionText;
  this.proportion = proportion;
  this.numVotes = numVotes;
}
}


class Option {
constructor(id, option) {
this.id = id;
this.option = option;
}
}



