import * as React from "react";
import { Platform } from "react-native";
import { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import Styles from "../../styles/PollStyle";
import VoteDataService from "../../services/vote.service.js";
import OptionDataService from "../../services/option.service.js";

export default function PollScreen({ route, navigation }) {
  const videoId = route.params?.videoId;
  const pollType = route.params?.pollType;
  const question = route.params?.question;
  const [optionsArr, setOptionsArr] = useState([]);
  let numOptions = 0;
  const [text, setText] = useState("");

  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
  const [currOptionId, setCurrOptionId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Skips to Poll Analytics Screen if user has already voted
  // Fetches Options data everytime this screen is focused.
  // Not using useEffect with [videoId] since fetchHasVoted needs to
  // be guaranteed to be called after Options data has been updated.
  useFocusEffect(
    useCallback(() => {
      fetchOptionsData();
    }, [])
  );

  // Only unselects the option choice if video is changed.
  useEffect(() => {
    setText("");
    setCurrOptionId(null);
  }, [videoId]);

  // Blur Event: to be fired when the PollScreen loses focus.
  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      // Every time the screen loses focus, loading is set to true so
      // that on next time the Poll screen is navigated to,
      // it shows loading screen rather than previous vote data while
      // it makes database calls to refresh data.
      setLoading(true);
    });

    return unsubscribe;
  }, [navigation]);

  // Gets the polling options
  fetchHasVoted = async () => {
    try {
      const hasVoted = (
        await VoteDataService.getHasVoted(videoId, globalThis.userID)
      ).data.hasVoted;
      if (
        hasVoted &&
        (pollType === "Multiple Choice" || pollType === "Yes or No")
      ) {
        setLoading(true);
        navigation.navigate("Poll Analytics", {
          videoId,
          optionsArr,
          pollType,
          question,
        });
      } else if (hasVoted && pollType === "Free Response") {
        setLoading(true);
        navigation.navigate("Poll Comments", {
          videoId,
          optionsArr,
          pollType,
          question,
        });
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching hasVoted data:", error); // Log any errors that occur
    }
  };

  // Gets the polling options
  fetchOptionsData = async () => {
    try {
      const optionData = await OptionDataService.getByVidId(videoId);
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
      setOptionsArr(optionsArray);
      fetchHasVoted();
    } catch (error) {
      console.error("Error fetching polling options data:", error); // Log any errors that occur
    }
  };

  // Acts like a radio button. Updates view with selected option.
  const handleSelectOption = (option) => {
    if (option.id != currOptionId) {
      setCurrOptionId(option.id);
    }
  };

  // Function to submit the vote to the database
  const submitVote = async () => {
    try {
      let response = null;
      if (pollType === "Multiple Choice" || pollType === "Yes or No") {
        response = await VoteDataService.create({
          user_id: globalThis.userID, // Replace with actual user ID
          video_id: videoId,
          option_id: currOptionId, // Assuming currOptionId holds the selected option ID
          vote_date: new Date().toISOString(),
        });
      } else {
        // Free Response
        // Adds free response answer to options table
        const optionResponse = await OptionDataService.create({
          video_id: videoId,
          option: text,
        });
        setCurrOptionId(optionResponse.data.id);
        response = await VoteDataService.create({
          user_id: globalThis.userID, // Replace with actual user ID
          video_id: videoId,
          option_id: optionResponse.data.id,
          vote_date: new Date().toISOString(),
        });
        optionsArr.push(new Option(optionResponse.data.id, text.trim(), 0, 0));
      }

      if (
        response.status == 201 &&
        (pollType === "Multiple Choice" || pollType === "Yes or No")
      ) {
        // Vote successfully submitted
        navigation.navigate("Poll Analytics", {
          videoId,
          optionsArr,
          pollType,
          question,
        }); // Navigate to Poll Analytics screen
      } else if (response.status == 201 && pollType === "Free Response") {
        // Vote successfully submitted
        navigation.navigate("Poll Comments", {
          videoId,
          optionsArr,
          pollType,
          question,
        }); // Navigate to Poll Analytics screen
      } else {
        console.error("Failed to submit vote");
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
    }
  };

  const handleSubmit = async () => {
    if (currOptionId !== null || text.trim() !== "") {
      setLoading(true);
      await submitVote(); // Submit the vote if an option is selected or text is entered
    } else if (
      (pollType === "Multiple Choice" || pollType === "Yes or No") &&
      currOptionId === null
    ) {
      // Show an alert or message indicating that the user needs to select an option or enter text
      alert("Please select an option.");
      console.log("Please select an option.");
    } else {
      // Free Response and text empty
      // Show an alert or message indicating that the user needs to select an option or enter text
      alert("Please enter a response.");
      console.log("Please enter a response.");
    }
  };

  return (
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

          {pollType === "Multiple Choice" || pollType === "Yes or No" ? (
            <View style={{ flexShrink: 1 }}>
              <ScrollView>
                <View style={Styles.answerContainer}>
                  {optionsArr.map((option) => (
                    <TouchableOpacity
                      style={[
                        Styles.answerButton,
                        {
                          backgroundColor:
                            option.id === currOptionId ? "#fcb42c" : "#fde085",
                        },
                      ]}
                      key={option.id}
                      onPress={() => handleSelectOption(option)}
                      underlayColor="#fff"
                    >
                      <Text style={Styles.answerText}>{option.option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          ) : (
            <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : "height"}
              keyboardVerticalOffset={keyboardVerticalOffset}
              enabled
              style={{ flexShrink: 1 }}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                <TextInput
                  style={Styles.answerInput}
                  value={text}
                  placeholder="Enter opinion here"
                  multiline={true}
                  blurOnSubmit={true}
                  onChangeText={setText}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          )}

          <View style={Styles.navContainer}>
            <TouchableOpacity
              style={Styles.navButton}
              onPress={() => navigation.goBack()}
              underlayColor="#fff"
            >
              <Text style={Styles.navText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={Styles.navButton}
              onPress={handleSubmit}
              underlayColor="#fff"
            >
              <Text style={Styles.navText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

class Option {
  constructor(id, option, likes, dislikes) {
    this.id = id;
    this.option = option;
    this.likes = likes;
    this.dislikes = dislikes;
  }
}
