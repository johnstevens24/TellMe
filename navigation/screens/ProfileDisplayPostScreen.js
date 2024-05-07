import * as React from "react";
import { Component } from "react";
import { base64 } from "base-64";
import { useState, useEffect, useCallback } from "react";
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
  TouchableWithoutFeedback,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import Styles from "../../styles/PollAnalyticsStyle.js";
import Styles2 from "../../styles/PollCommentsStyle.js";
import VoteDataService from "../../services/vote.service.js";
import { LogBox } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import OptionDataService from "../../services/option.service.js";
import FollowupDataService from "../../services/followup.service.js";
import ReportDataService from "../../services/reports.service.js";
import Ionicons from "react-native-vector-icons/FontAwesome";
import ReportMenu from "../../components/ReportMenu.js";
import ReportedBox from "../../components/ReportedBox.js";

// This suppresses the warning when you swipe left to return to the profile screen.
// It has been tested extensively and functions as intented.
LogBox.ignoreLogs([
  "Sending `onAnimatedValueUpdate` with no listeners registered.",
]);

export default function ProfileScreen({ navigation, route }) {
  const { data } = route.params;
  const [status, setStatus] = React.useState({}); //don't delete this
  const [hasFollowup, setHasFollowup] = useState(false);
  const [followupsData, setFollowupsData] = useState([]);
  const [loading, setLoading] = useState(true);

  //Focus Event: to be fired when the HomeScreen is focused.
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("Focus");
      //Every time the screen is focused the Video starts playing
      if (this.video) {
        this.video.playAsync();
      }
    });

    return unsubscribe;
  }, [navigation]);

  //Blur Event: to be fired when the Screen loses focus.
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      console.log("Blur");
      //Every time the screen loses focus the Video is paused
      if (this.video) {
        this.video.pauseAsync();
      }
      setLoading(true);
      setActiveMenuId(null);
    });

    return unsubscribe;
  }, [navigation]);

  const handleSwipe = ({ nativeEvent }) => {
    //handle if user swipes left
    if (nativeEvent.velocityX > 500) {
      //for some reason was throwing a development-only error when using navigation.goBack()
      navigation.navigate("Profile Main");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // This makes it so the page will be set on the loading screen until ALL
          // of these async functions return
          await Promise.all([
            fetchVoteData(),
            fetchFollowupsData(),
            data.poll_type === "Free Response" ? fetchOptionsData() : null,
            fetchReportData(),
            fetchHiddenReportsData(),
          ]);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle errors here
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const videoId = data.id;
  const question = data.poll_question;
  const pollType = data.poll_type;
  const [voteArr, setVoteArr] = useState([]);
  const [optionsArr, setOptionsArr] = useState([]);
  const { height, width, scale, fontScale } = useWindowDimensions();
  proportionBarMaxLength = width - 50; // 50 = 25 pixel margin on each side

  fetchVoteData = async () => {
    try {
      const voteResults = await VoteDataService.getVoteResults(data.id);
      let voteArray = [];
      let optionsArray = [];
      for (let i = 0; i < voteResults.data.results.length; i++) {
        let tempVoteResult = new VoteResult(
          voteResults.data.results[i].id,
          voteResults.data.results[i].option,
          voteResults.data.results[i].proportion,
          voteResults.data.results[i].votes
        );
        voteArray.push(tempVoteResult);
        let tempOption = new Option(
          voteResults.data.results[i].id,
          voteResults.data.results[i].option,
          voteResults.data.results[i].likes,
          voteResults.data.results[i].dislikes
        );
        optionsArray.push(tempOption);
      }
      voteArray.sort((a, b) => b.proportion - a.proportion);
      setVoteArr(voteArray);
      if (data.poll_type !== "Free Response") {
        setOptionsArr(optionsArray);
      }
    } catch (error) {
      console.error("Error fetching voting data:", error); // Log any errors that occur
    }
  };

  // Gets the polling options
  fetchOptionsData = async () => {
    try {
      const optionData = await OptionDataService.getByVidId(videoId);
      numOptions = optionData.data.length;
      let optionsArray = [];
      for (let i = 0; i < numOptions; i++) {
        let tempOption = new Option(
          optionData.data[i].id,
          optionData.data[i].option,
          optionData.data[i].likes,
          optionData.data[i].dislikes
        );
        optionsArray.push(tempOption);
      }
      setOptionsArr(optionsArray);
    } catch (error) {
      console.error("Error fetching polling options data:", error); // Log any errors that occur
    }
  };

  // Fetch wheter video has followup.
  fetchFollowupsData = async () => {
    try {
      const followupsData = await FollowupDataService.getByVideoId(videoId);
      if (followupsData.data !== null && followupsData.data.length !== 0) {
        setHasFollowup(true);
        setFollowupsData(followupsData.data);
      } else {
        setHasFollowup(false);
      }
    } catch (error) {
      console.error("Error fetching followups data:", error); // Log any errors that occur
    }
  };

  // ---------- Reporting related ----------
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [reportsArr, setReportsArr] = useState([]); // options the user chooses to report
  const [reportedIdsArr, setReportedIdsArr] = useState([]); // options the user has already reported
  const [hiddenIdsArr, setHiddenIdsArr] = useState({}); // options that exceed the report threshold

  useEffect(() => {
    if (reportsArr.length > 0) {
      handleCreateReportRequest();
      setReportsArr([]);
    }
  }, [reportsArr]);

  const handleLongPress = (id) => {
    setActiveMenuId(id);
  };

  const handleCloseMenu = () => {
    setActiveMenuId(null);
  };

  const closeMenuOnOutsidePress = () => {
    setActiveMenuId(null);
  };

  const handleReport = (elementId, reason) => {
    setReportsArr((prevReportsArr) => {
      // Check if the current elementId and reason pair exists in the reportsArr already
      const exists = prevReportsArr.some(
        ([existingElementId, existingReason]) =>
          //existingElementId === elementId && existingReason === reason
          existingElementId === elementId
      );

      if (!exists) {
        return [...prevReportsArr, [elementId, reason]];
      } else {
        return prevReportsArr;
      }
    });
  };

  const handleCreateReportRequest = async () => {
    try {
      for (let i = 0; i < reportsArr.length; i++) {
        // Assuming you have the necessary data in your component state or props
        const requestData = {
          video_id: videoId,
          option_id: reportsArr[i][0],
          user_id: globalThis.userID,
          reasoning: reportsArr[i][1],
        };
        // Make the create request using the helper function
        const responseData = await ReportDataService.create(requestData);
      }
      // Updates reportedIds so users cannot report an option twice
      fetchReportData();
      handleCloseMenu();
    } catch (error) {
      console.error("Error handling create report request:", error);
      // Handle errors here
    }
  };

  // Gets the options that the current user has already reported
  fetchReportData = async () => {
    try {
      const reportResults =
        await ReportDataService.getOptionsReportedByUserForVideo(
          globalThis.userID,
          videoId
        );
      setReportedIdsArr(reportResults.data);
    } catch (error) {
      console.error("Error fetching options reported data:", error); // Log any errors that occur
    }
  };

  // Gets the options that exceed the report threshold and must be hidden
  fetchHiddenReportsData = async () => {
    try {
      const hiddenOptionIds =
        await ReportDataService.getOptionsWithReportCountGreaterThan(videoId);

      // Pairs optionIds and their report reason
      let tempHiddenIdsArr = [];
      for (let i = 0; i < hiddenOptionIds.data.length; i++) {
        let reason = await ReportDataService.findMostReportedReasonByOptionId(
          hiddenOptionIds.data[i]
        );
        tempHiddenIdsArr.push([
          hiddenOptionIds.data[i],
          reason.data[0].reasoning,
        ]);
      }

      setHiddenIdsArr((prevState) => {
        const updatedState = { ...prevState };
        tempHiddenIdsArr.forEach(([optionId, reason]) => {
          updatedState[optionId] = reason;
        });
        return updatedState;
      });
    } catch (error) {
      console.error("Error fetching options to be hidden data:", error); // Log any errors that occur
    }
  };

  // Removes the option from the hiddenIdsArr so option is no longer hidden.
  const viewHiddenOption = (optionId) => {
    const updatedHiddenIdsArr = { ...hiddenIdsArr };
    delete updatedHiddenIdsArr[optionId];
    setHiddenIdsArr(updatedHiddenIdsArr);
  };

  // ---------- End Reporting related --------------------

  //There is some repeat code for the video in this if statement. It needs to be like that for the gesture handler to work properly
  if (data.poll_type == "Free Response") {
    const [optionsArr, setOptionsArr] = useState([]);
    const [likesArr, setLikesArr] = useState([]); // holds all optionIds that were liked
    const [dislikesArr, setDislikesArr] = useState([]); // holds all optionIds that were disliked

    let tempOptionsArr = optionsArr;
    // Excessively commenting this method because all the weird syntax confuses me.
    // This method updates the likesArr when a comment is liked and then the view re-renders.
    const handleLikeOption = (optionId) => {
      // Updater function takes "pending state and calculates next state from it"
      // ex) setCount(prevC => prevC + 1). pending state: prevC. next state: prevC + 1.
      setLikesArr((prevLikesArr) => {
        if (prevLikesArr.includes(optionId)) {
          undoUpvote_OptionsArr(tempOptionsArr, optionId);
          OptionDataService.undoUpvote(optionId);
          // filter method accepts as parameter a callback provided function.
          // takes each element of prevLikesArr (an optionId) and compares with current optionId.
          // Only ids that do not match the optionId will passs the filter and remain.
          return prevLikesArr.filter((id) => id !== optionId);
        } else {
          upvote_OptionsArr(tempOptionsArr, optionId);
          OptionDataService.upvote(optionId);
          // ... is called spread syntax. Basically expands an array into its elements.
          return [...prevLikesArr, optionId];
        }
      });
      // If option is already disliked, remove option from dislikes since user may only like OR dislike an option.
      if (dislikesArr.includes(optionId)) {
        //undoDownvote_OptionsArr(optionId);
        handleDislikeOption(optionId);
      }
    };
  
    const handleDislikeOption = (optionId) => {
      setDislikesArr((prevDislikesArr) => {
        if (prevDislikesArr.includes(optionId)) {
          undoDownvote_OptionsArr(tempOptionsArr, optionId);
          OptionDataService.undoDownvote(optionId);
          return prevDislikesArr.filter((id) => id !== optionId);
        } else {
          downvote_OptionsArr(tempOptionsArr, optionId);
          OptionDataService.downvote(optionId);
          return [...prevDislikesArr, optionId];
        }
      });
      if (likesArr.includes(optionId)) {
        //undoUpvote_OptionsArr(optionId);
        handleLikeOption(optionId);
      }
    };
  
    // This is to update the OptionsArr with optionId == id with +1 likes so view changes
    const upvote_OptionsArr = (optionsArray, id) => {
      // Find the index of the Option object with the specified id
      const index = optionsArray.findIndex((option) => option.id === id);
      if (index !== -1) {
        const updatedOptionsArr = [...optionsArray];
        updatedOptionsArr[index] = {
          ...updatedOptionsArr[index],
          likes: updatedOptionsArr[index].likes + 1,
        };
        tempOptionsArr = updatedOptionsArr;
        setOptionsArr(updatedOptionsArr);
      }
    };
  
    // This is to update the OptionsArr with optionId == id with -1 likes so view changes
    const undoUpvote_OptionsArr = (optionsArray, id) => {
      // Find the index of the Option object with the specified id
      const index = optionsArray.findIndex((option) => option.id === id);
      if (index !== -1) {
        const updatedOptionsArr = [...optionsArray];
        updatedOptionsArr[index] = {
          ...updatedOptionsArr[index],
          likes: updatedOptionsArr[index].likes - 1,
        };
        tempOptionsArr = updatedOptionsArr;
        setOptionsArr(updatedOptionsArr);
      }
    };
  
    // This is to update the OptionsArr with optionId == id with +1 dislikes so view changes
    const downvote_OptionsArr = (optionsArray, id) => {
      // Find the index of the Option object with the specified id
      const index = optionsArray.findIndex((option) => option.id === id);
      if (index !== -1) {
        const updatedOptionsArr = [...optionsArray];
        updatedOptionsArr[index] = {
          ...updatedOptionsArr[index],
          dislikes: updatedOptionsArr[index].dislikes + 1,
        };
        tempOptionsArr = updatedOptionsArr;
        setOptionsArr(updatedOptionsArr);
      }
    };
  
    // This is to update the OptionsArr with optionId == id with -1 dislikes so view changes
    const undoDownvote_OptionsArr = (optionsArray, id) => {
      // Find the index of the Option object with the specified id
      const index = optionsArray.findIndex((option) => option.id === id);
      if (index !== -1) {
        const updatedOptionsArr = [...optionsArray];
        updatedOptionsArr[index] = {
          ...updatedOptionsArr[index],
          dislikes: updatedOptionsArr[index].dislikes - 1,
        };
        tempOptionsArr = updatedOptionsArr;
        setOptionsArr(updatedOptionsArr);
      }
    };
  

    // //functions to call when the page is first loaded
    // useFocusEffect(
    //   useCallback(() => {
    //     fetchOptionsData();
    //   }, [])
    // );

    // Gets the polling options
    fetchOptionsData = async () => {
      try {
        const optionData = await OptionDataService.getByVidId(data.id);
        numOptions = optionData.data.length;
        let optionsArray = [];
        for (let i = 0; i < numOptions; i++) {
          let tempObject = new Option(
            optionData.data[i].id,
            optionData.data[i].option,
            optionData.data[i].likes,
            optionData.data[i].dislikes
          );
          optionsArray.push(tempObject);
        }
        optionsArray = optionsArray.sort((a, b) => b.likes - a.likes);
        tempOptionsArr = optionsArray;
        setOptionsArr(optionsArray);
      } catch (error) {
        console.error("Error fetching polling options data:", error); // Log any errors that occur
      }
    };

    return (
      <TouchableWithoutFeedback onPress={closeMenuOnOutsidePress}>
        <SafeAreaView style={Styles2.appContainer}>
          {loading ? (
            <View style={Styles.loadingContainer}>
              <Text style={Styles.navText}>Loading...</Text>
            </View>
          ) : (
            <>
              {/* Video Container */}
              <View
                style={{
                  width: "100%",
                  height: "55%",
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
                  onGestureEvent={handleSwipe}
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
                      ref={(ref) => {
                        this.video = ref;
                      }}
                      style={{
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        aspectRatio: ".5625",
                        borderRadius: 25,
                      }}
                      source={{ uri: "https://d1vhss43jk7wen.cloudfront.net/" + data.video_data }}
                      fullscreen={false}
                      useNativeControls={true}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={true}
                      isLooping={true}
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                      onError={(error) => console.error("Error:", error)}
                    />
                    <View
                      style={{
                        position: "absolute",
                        bottom: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 20 }}>
                        Tell Me, {data.poll_question}
                      </Text>
                    </View>
                  </View>
                </PanGestureHandler>
              </View>
              {/* Poll Results Container */}
              <View style={{ height: "35%" }}>
                {optionsArr.length > 0 ? (
                  <ScrollView>
                    <View style={Styles2.answerContainer}>
                      {optionsArr.map((option) => (
                        <View key={option.id}>
                          {/* Hides options that exceed the report count threshold */}
                          {/* Otherwise displays option */}
                          {hiddenIdsArr.hasOwnProperty(option.id) ? (
                            /* Hide the option */
                            <TouchableOpacity
                              onLongPress={() => viewHiddenOption(option.id)}
                              style={[
                                Styles2.answerButton,
                                { backgroundColor: "lightgray" },
                              ]}
                            >
                              <Text style={Styles2.answerText}>
                                {"Hidden for: " +
                                  hiddenIdsArr[option.id] +
                                  "\nHold to view"}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            /* Display the option */
                            <View>
                              <TouchableOpacity
                                disabled={false}
                                onLongPress={() => handleLongPress(option.id)}
                                style={Styles2.answerButton}
                                underlayColor="#fff"
                              >
                                <Text style={Styles2.answerText}>
                                  {option.option}
                                </Text>
                              </TouchableOpacity>

                              <View style={Styles2.likesContainer}>
                                <TouchableOpacity
                                  style={Styles2.likeButton}
                                  underlayColor="#fff"
                                  onPress={() => handleLikeOption(option.id)}
                                >
                                  <Ionicons
                                    style={[
                                      Styles2.likesIcon,
                                      {
                                        color: likesArr.includes(option.id)
                                          ? "#fcb42c"
                                          : "black",
                                      },
                                    ]}
                                    name={
                                      likesArr.includes(option.id)
                                        ? "thumbs-up"
                                        : "thumbs-o-up"
                                    }
                                  />
                                </TouchableOpacity>

                                <Text style={Styles2.numVotesText}>
                                  {option.likes}
                                </Text>

                                <TouchableOpacity
                                  style={Styles2.dislikeButton}
                                  underlayColor="#fff"
                                  onPress={() => handleDislikeOption(option.id)}
                                >
                                  <Ionicons
                                    style={[
                                      Styles2.likesIcon,
                                      {
                                        color: dislikesArr.includes(option.id)
                                          ? "#fcb42c"
                                          : "black",
                                      },
                                    ]}
                                    name={
                                      dislikesArr.includes(option.id)
                                        ? "thumbs-down"
                                        : "thumbs-o-down"
                                    }
                                  />
                                </TouchableOpacity>

                                <Text style={Styles2.numVotesText}>
                                  {option.dislikes}
                                </Text>
                              </View>

                              {/* Only allows the current option that was long pressed to display a menu. */}
                              {activeMenuId === option.id ? (
                                /* Option has already been reported: Show Reported Thank you box. */
                                reportedIdsArr.includes(option.id) ? (
                                  <ReportedBox onClose={handleCloseMenu} />
                                ) : (
                                  /* Option has not been reported: Show Report Menu. */
                                  <ReportMenu
                                    onClose={handleCloseMenu}
                                    onReport={handleReport}
                                    elementId={option.id}
                                  />
                                )
                              ) : (
                                /* Do nothing when no option was long pressed. */
                                <></>
                              )}
                            </View>
                          )}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                ) : (
                  <Text style={Styles2.detailText}>No responses yet...</Text>
                )}
              </View>
              {/* Navigation Container */}
              <View
                style={{
                  height: "10%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  zIndex: 999,
                }}
              >
                <TouchableOpacity
                  style={Styles.navButton}
                  onPress={() => navigation.goBack()}
                  underlayColor="#fff"
                >
                  <Text style={Styles.navText}>Back</Text>
                </TouchableOpacity>

                {hasFollowup ? (
                  <TouchableOpacity
                    style={Styles.navButton}
                    onPress={() =>
                      navigation.navigate("View Followup", {
                        videoId,
                        followupsData,
                      })
                    }
                    underlayColor="#fff"
                  >
                    <Text style={Styles.navText}>View Followup</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={Styles.navButton}
                    onPress={() =>
                      navigation.navigate("Followup Choice", {
                        videoId,
                        optionsArr,
                        pollType,
                        question,
                      })
                    }
                    underlayColor="#fff"
                  >
                    <Text style={Styles.navText}>Create Followup</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  } else {
    const question = data.question;
    const [voteArr, setVoteArr] = useState([]);
    const { height, width, scale, fontScale } = useWindowDimensions();
    proportionBarMaxLength = width - 50; // 50 = 25 pixel margin on each side

    //functions to call when the page is first loaded
    useFocusEffect(
      useCallback(() => {
        fetchVoteData();
        fetchFollowupsData();
        if (data.poll_type === "Free Response") {
          fetchOptionsData();
        }
      }, [])
    );

    // Gets the vote data
    fetchVoteData = async () => {
      try {
        const voteResults = await VoteDataService.getVoteResults(data.id);
        let voteArray = [];
        let optionsArray = [];
        for (let i = 0; i < voteResults.data.results.length; i++) {
          let tempVoteResult = new VoteResult(
            voteResults.data.results[i].id,
            voteResults.data.results[i].option,
            voteResults.data.results[i].proportion,
            voteResults.data.results[i].votes
          );
          voteArray.push(tempVoteResult);
          let tempOption = new Option(
            voteResults.data.results[i].id,
            voteResults.data.results[i].option
          );
          optionsArray.push(tempOption);
        }
        voteArray.sort((a, b) => b.proportion - a.proportion);
        setVoteArr(voteArray);
        if (data.poll_type !== "Free Response") {
          setOptionsArr(optionsArray);
        }
      } catch (error) {
        console.error("Error fetching voting data:", error); // Log any errors that occur
      }
    };

    // Gets the polling options
    fetchOptionsData = async () => {
      try {
        const optionData = await OptionDataService.getByVidId(videoId);
        numOptions = optionData.data.length;
        let optionsArray = [];
        for (let i = 0; i < numOptions; i++) {
          let tempOption = new Option(
            optionData.data[i].id,
            optionData.data[i].option
          );
          optionsArray.push(tempOption);
        }
        setOptionsArr(optionsArray);
      } catch (error) {
        console.error("Error fetching polling options data:", error); // Log any errors that occur
      }
    };

    // Fetch wheter video has followup.
    fetchFollowupsData = async () => {
      try {
        const followupsData = await FollowupDataService.getByVideoId(videoId);
        if (followupsData.data !== null && followupsData.data.length !== 0) {
          setHasFollowup(true);
          setFollowupsData(followupsData.data);
        } else {
          setHasFollowup(false);
        }
      } catch (error) {
        console.error("Error fetching followups data:", error); // Log any errors that occur
      }
    };

    return (
      <TouchableWithoutFeedback onPress={closeMenuOnOutsidePress}>
        <SafeAreaView style={Styles.appContainer}>
          {loading ? (
            <View style={Styles.loadingContainer}>
              <Text style={Styles.navText}>Loading...</Text>
            </View>
          ) : (
            <>
              {/* Video Container */}
              <View
                style={{
                  width: "100%",
                  height: "55%",
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
                  onGestureEvent={handleSwipe}
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
                      ref={(ref) => {
                        this.video = ref;
                      }}
                      style={{
                        flexDirection: "column",
                        height: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                        aspectRatio: ".5625",
                        borderRadius: 25,
                      }}
                      source={{ uri: "https://d1vhss43jk7wen.cloudfront.net/" + data.video_data }}
                      fullscreen={false}
                      useNativeControls={true}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay={true}
                      isLooping={true}
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                      onError={(error) => console.error("Error:", error)}
                    />
                    <View
                      style={{
                        position: "absolute",
                        bottom: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        borderRadius: 20,
                      }}
                    >
                      <Text style={{ color: "white", fontSize: 20 }}>
                        Tell Me, {data.poll_question}
                      </Text>
                    </View>
                  </View>
                </PanGestureHandler>
              </View>
              {/* Poll Results Container */}

              {loading ? (
                <View style={{ height: "35%" }}>
                  <Text>Loading...</Text>
                </View>
              ) : (
                <>
                  {voteArr.length === 0 ? (
                    <View style={{ height: "35%" }}>
                      <Text style={Styles2.detailText}>
                        No responses yet...
                      </Text>
                    </View>
                  ) : (
                    <View style={{ height: "35%" }}>
                      <ScrollView>
                        <View style={Styles.answerContainer}>
                          {voteArr.map((vote) => (
                            <View key={vote.optionId}>
                              {/* Hides options that exceed the report count threshold */}
                              {/* Otherwise displays option */}
                              {hiddenIdsArr.hasOwnProperty(vote.optionId) ? (
                                /* Hide the option */
                                <TouchableOpacity
                                  onLongPress={() =>
                                    viewHiddenOption(vote.optionId)
                                  }
                                  style={[
                                    Styles.answerButtonHidden,
                                    { backgroundColor: "lightgray" },
                                  ]}
                                >
                                  <Text style={Styles.answerTextHidden}>
                                    {"Hidden for: " +
                                      hiddenIdsArr[vote.optionId] +
                                      "\nHold to view"}
                                  </Text>
                                </TouchableOpacity>
                              ) : (
                                /* Display the option */
                                <View>
                                  <View style={Styles.answerButton}>
                                    <TouchableOpacity
                                      style={
                                        Styles.optionTextContainerNoMarginEnd
                                      }
                                      onLongPress={() =>
                                        handleLongPress(vote.optionId)
                                      }
                                    >
                                      <Text
                                        style={
                                          Styles.optionTextContainerNoMarginEnd
                                        }
                                      >
                                        {vote.optionText}
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      disabled={true}
                                      style={Styles.answerButton}
                                      underlayColor="#fff"
                                    >
                                      <Text
                                        style={Styles.answerTextNoPaddingTop}
                                      >
                                        {vote.optionText}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>

                                  <TouchableOpacity
                                    disabled={true}
                                    style={[
                                      Styles.proportionBar,
                                      {
                                        width:
                                          proportionBarMaxLength *
                                          vote.proportion,
                                      },
                                    ]}
                                    underlayColor="#fff"
                                  >
                                    <Text
                                      style={[
                                        Styles.analyticsText,
                                        {
                                          width:
                                            proportionBarMaxLength *
                                            vote.proportion,
                                        },
                                      ]}
                                    >
                                      l
                                    </Text>
                                  </TouchableOpacity>

                                  <Text style={Styles.analyticsTextContainer}>
                                    {Math.floor(vote.proportion * 100)}% with{" "}
                                    {vote.numVotes}{" "}
                                    {vote.numVotes === 1 ? "vote" : "votes"}
                                  </Text>

                                  {/* Only allows the current option that was long pressed to display a menu. */}
                                  {activeMenuId === vote.optionId ? (
                                    /* Option has already been reported: Show Reported Thank you box. */
                                    reportedIdsArr.includes(vote.optionId) ? (
                                      <ReportedBox onClose={handleCloseMenu} />
                                    ) : (
                                      /* Option has not been reported: Show Report Menu. */
                                      <ReportMenu
                                        onClose={handleCloseMenu}
                                        onReport={handleReport}
                                        elementId={vote.optionId}
                                      />
                                    )
                                  ) : (
                                    /* Do nothing when no option was long pressed. */
                                    <></>
                                  )}
                                </View>
                              )}
                            </View>
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                  )}
                </>
              )}

              {/* Navigation Container */}
              <View
                style={{
                  height: "10%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  zIndex: 999,
                }}
              >
                <TouchableOpacity
                  style={Styles.navButton}
                  onPress={() => navigation.goBack()}
                  underlayColor="#fff"
                >
                  <Text style={Styles.navText}>Back</Text>
                </TouchableOpacity>

                {hasFollowup ? (
                  <TouchableOpacity
                    style={Styles.navButton}
                    onPress={() =>
                      navigation.navigate("View Followup", {
                        videoId,
                        followupsData,
                      })
                    }
                    underlayColor="#fff"
                  >
                    <Text style={Styles.navText}>View Followup</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={Styles.navButton}
                    onPress={() =>
                      navigation.navigate("Followup Choice", {
                        videoId,
                        optionsArr,
                        pollType,
                        question,
                      })
                    }
                    underlayColor="#fff"
                  >
                    <Text style={Styles.navText}>Create Followup</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
  constructor(id, option, likes, dislikes) {
    this.id = id;
    this.option = option;
    this.likes = likes;
    this.dislikes = dislikes;
  }
}