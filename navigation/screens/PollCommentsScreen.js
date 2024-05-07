import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Styles from "../../styles/PollCommentsStyle.js";
import Ionicons from "react-native-vector-icons/FontAwesome";
import OptionDataService from "../../services/option.service.js";
import ReportDataService from "../../services/reports.service.js";
import ReportMenu from "../../components/ReportMenu.js";
import ReportedBox from "../../components/ReportedBox.js";

export default function PollScreen({ route, navigation }) {
  const videoId = route.params?.videoId;
  let optionsArray = route.params?.optionsArr;
  const [optionsArr, setOptionsArr] = useState(
    optionsArray.sort((a, b) => b.likes - a.likes)
  );
  const [loading, setLoading] = useState(true);

  const pollType = route.params?.pollType;
  const question = route.params?.question;
  const [likesArr, setLikesArr] = useState([]); // holds all optionIds that were liked
  const [dislikesArr, setDislikesArr] = useState([]); // holds all optionIds that were disliked

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [reportsArr, setReportsArr] = useState([]); // options the user chooses to report
  const [reportedIdsArr, setReportedIdsArr] = useState([]); // options the user has already reported
  const [hiddenIdsArr, setHiddenIdsArr] = useState({}); // options that exceed the report threshold

  // Refreshes page with up-to-date reported options for current video
  useEffect(() => {
    setOptionsArr(optionsArray.sort((a, b) => b.likes - a.likes));
  }, [loading]);

  // Refreshes page with up-to-date reported options for current video
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // This makes it so the page will be set on the loading screen until ALL
          // of these async functions return
          await Promise.all([fetchReportData(), fetchHiddenReportsData()]);
        } catch (error) {
          console.error("Error fetching data:", error);
          // Handle errors here
        } finally {
          setLoading(false); // Set loading to false regardless of success or failure
        }
      };

      fetchData();
    }, [])
  );

  // Blur Event: to be fired when the Screen loses focus.
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setLoading(true);
      setActiveMenuId(null);
    });

    return unsubscribe;
  }, [navigation]);

  // Just shows that likes and dislikes are being updated when pressed
  // useEffect(() => {
  //   console.log("Likes arr: ", likesArr);
  //   console.log("Dislikes arr: ", dislikesArr);
  // }, [likesArr, dislikesArr]);

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

  // ---------- Reporting related --------------------

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

  return (
    <TouchableWithoutFeedback onPress={closeMenuOnOutsidePress}>
      <SafeAreaView style={Styles.appContainer}>
        {loading ? (
          <View style={Styles.loadingContainer}>
            <Text style={Styles.navText}>Loading...</Text>
          </View>
        ) : (
          <>
            <Text style={Styles.questionText}>
              TellMe,{"\n"}
              {question}
            </Text>

            <View style={{ flexShrink: 1 }}>
              <ScrollView>
                <View style={Styles.answerContainer}>
                  {optionsArr.map((option) => (
                    <View key={option.id}>
                      {/* Hides options that exceed the report count threshold */}
                      {/* Otherwise displays option */}
                      {hiddenIdsArr.hasOwnProperty(option.id) ? (
                        /* Hide the option */
                        <TouchableOpacity
                          onLongPress={() => viewHiddenOption(option.id)}
                          style={[
                            Styles.answerButton,
                            { backgroundColor: "lightgray" },
                          ]}
                        >
                          <Text style={Styles.answerText}>
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
                            style={Styles.answerButton}
                            underlayColor="#fff"
                          >
                            <Text style={Styles.answerText}>
                              {option.option}
                            </Text>
                          </TouchableOpacity>

                          <View style={Styles.likesContainer}>
                            <TouchableOpacity
                              style={Styles.likeButton}
                              underlayColor="#fff"
                              onPress={() => handleLikeOption(option.id)}
                            >
                              <Ionicons
                                style={[
                                  Styles.likesIcon,
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

                            <Text style={Styles.numVotesText}>
                              {option.likes}
                            </Text>

                            <TouchableOpacity
                              style={Styles.dislikeButton}
                              underlayColor="#fff"
                              onPress={() => handleDislikeOption(option.id)}
                            >
                              <Ionicons
                                style={[
                                  Styles.likesIcon,
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

                            <Text style={Styles.numVotesText}>
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
            </View>

            <View style={Styles.navContainer}>
              <TouchableOpacity
                style={Styles.navButton}
                onPress={() => navigation.goBack()}
                underlayColor="#fff"
              >
                <Text style={Styles.navText}>Back</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
