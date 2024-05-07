import * as React from "react";
import { Component } from "react";
import { base64 } from "base-64";
import { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  Image,
  Button,
  Pressable,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  GestureResponderHandlers,
  useWindowDimensions,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import Styles from "../../styles/PollCommentsStyle.js";
import VoteDataService from "../../services/vote.service.js";
import OptionDataService from "../../services/option.service.js";
import FollowupDataService from "../../services/followup.service.js";

import { PanGestureHandler, State } from "react-native-gesture-handler";

export default function ViewFollowupScreen({ route, navigation }) {
  const video_id = route.params?.videoId;
  const followupsData = route.params?.followupsData;
  const [optionText, setOptionText] = useState("Watch to find out!");
  const [status, setStatus] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [voteArr, setVoteArr] = useState([]);
  const [optionsArr, setOptionsArr] = useState([]);
  const { height, width, scale, fontScale } = useWindowDimensions();  
  const videoRef = useRef(null);
  const [pollContent, setPollContent] = useState(
    <View>
      <Text>Loading...</Text>
    </View>
  );

  //Focus Event: to be fired when the HomeScreen is focused.
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Playing followup post video");
      //Every time the screen is focused the Video starts playing
      if (videoRef.current) {
        videoRef.current.playAsync();
    }
    });

    return unsubscribe;
  }, [navigation]);

  //Blur Event: to be fired when the HomeScreen loses focus.
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      console.log("Pausing followup post video");
      //Every time the screen loses focus the Video is paused
      if (videoRef.current) {
        videoRef.current.pauseAsync();
    }
    });

    return unsubscribe;
  }, [navigation]);

  // functions to call when the page is first loaded
  useFocusEffect(
    useCallback(() => {
      fetchOptionsData();
    }, [])
  );

  fetchOptionsData = async () => {
    try {
      if (followupsData[0].chosen_id) {
        const optionData = await OptionDataService.get(
          followupsData[0].chosen_id
        );
        setOptionText(optionData.data.option);
      } else {
        setOptionText("Watch to find out!");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching polling options data:", error); // Log any errors that occur
    }
  };

  return (
    <SafeAreaView style={Styles.appContainer}>
      {/* Video Container */}
      <View
        style={{
          width: "100%",
          height: "65%",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PanGestureHandler
          style={{
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {/* FYI you can only have a single view inside the gesture handler */}
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              padding: "2%",
            }}
          >
            <Video
              ref={videoRef}
              style={{
                flexDirection: "column",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                aspectRatio: ".5625",
                borderRadius: 25,
              }}
              source={{ uri: "https://d1vhss43jk7wen.cloudfront.net/" + followupsData[0].followup_data }}
              fullscreen={false}
              useNativeControls={true}
              resizeMode={ResizeMode.COVER}
              shouldPlay={true}
              isLooping={true}
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              onError={(error) => console.error("Error:", error)}
            />
          </View>
        </PanGestureHandler>
      </View>

      <Text style={Styles.detailText}>Here's what I chose</Text>

      {loading ? (
        <View>
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <View style={{ flexShrink: 1 }}>
            <ScrollView>
              <View style={Styles.answerContainer}>
                <View>
                  <TouchableOpacity
                  disabled={true}
                    style={Styles.answerButton}
                    underlayColor="#fff"
                  >
                    <Text style={Styles.answerText}>{optionText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </>
      )}

      {/* Navigation Container */}
      <View style={Styles.navContainer}>
        <TouchableOpacity
          style={Styles.navButton}
          onPress={() => navigation.goBack()}
          underlayColor="#fff"
        >
          <Text style={Styles.navText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
