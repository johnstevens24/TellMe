import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Styles from "../../styles/PollAnalyticsStyle.js";
import VoteDataService from "../../services/vote.service.js";
import ReportDataService from "../../services/reports.service.js";
import ReportMenu from "../../components/ReportMenu.js";
import ReportedBox from "../../components/ReportedBox.js";

export default function PollScreen({ route, navigation }) {
  const videoId = route.params?.videoId;
  const optionsArr = route.params?.optionsArr;
  const pollType = route.params?.pollType;
  const question = route.params?.question;

  const [voteArr, setVoteArr] = useState([]);
  const { height, width, scale, fontScale } = useWindowDimensions();
  proportionBarMaxLength = width - 50; // 50 = 25 pixel margin on each side
  const [loading, setLoading] = useState(true);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [reportsArr, setReportsArr] = useState([]); // options the user chooses to report
  const [reportedIdsArr, setReportedIdsArr] = useState([]); // options the user has already reported
  const [hiddenIdsArr, setHiddenIdsArr] = useState({}); // options that exceed the report threshold

  // Refreshes page with up-to-date vote options for current video
  // and replaces the last video's data.
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          // This makes it so the page will be set on the loading screen until ALL
          // of these async functions return
          await Promise.all([
            fetchReportData(),
            fetchVoteData(),
            fetchHiddenReportsData(),
          ]);
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

  // Blur Event: to be fired when the PollAnalyticsScreen loses focus.
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      // Every time the screen loses focus, loading is set to true so
      // that on next time the Poll Analytics page is navigated to,
      // it shows loading screen rather than previous vote data while
      // it makes database calls to refresh data.
      setLoading(true);
      setActiveMenuId(null);
    });

    return unsubscribe;
  }, [navigation]);

  // Gets the vote data
  fetchVoteData = async () => {
    try {
      const voteResults = await VoteDataService.getVoteResults(videoId);
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
    } catch (error) {
      console.error("Error fetching voting data:", error); // Log any errors that occur
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
                  {voteArr.map((vote) => (
                    <View key={vote.optionId}>
                      {/* Hides options that exceed the report count threshold */}
                      {/* Otherwise displays option */}
                      {hiddenIdsArr.hasOwnProperty(vote.optionId) ? (
                        /* Hide the option */
                        <TouchableOpacity
                          onLongPress={() => viewHiddenOption(vote.optionId)}
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
                              style={Styles.optionTextContainerNoMarginEnd}
                              onLongPress={() => handleLongPress(vote.optionId)}
                            >
                              <Text
                                style={Styles.optionTextContainerNoMarginEnd}
                              >
                                {vote.optionText}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              disabled={true}
                              style={Styles.answerButton}
                              underlayColor="#fff"
                            >
                              <Text style={Styles.answerTextNoPaddingTop}>
                                {vote.optionText}
                              </Text>
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity
                            disabled={true}
                            style={[
                              Styles.proportionBar,
                              {
                                width: proportionBarMaxLength * vote.proportion,
                              },
                            ]}
                            underlayColor="#fff"
                          >
                            <Text
                              style={[
                                Styles.analyticsText,
                                {
                                  width:
                                    proportionBarMaxLength * vote.proportion,
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

            <View style={Styles.navContainer}>
              <TouchableOpacity
                style={Styles.navButton}
                onPress={() => {
                  navigation.goBack(), setLoading(true);
                }}
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

class VoteResult {
  constructor(optionId, optionText, proportion, numVotes) {
    this.optionId = optionId;
    this.optionText = optionText;
    this.proportion = proportion;
    this.numVotes = numVotes;
  }
}
