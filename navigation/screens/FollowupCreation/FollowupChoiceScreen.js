import * as React from "react";
import { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Styles from "../../../styles/PollCommentsStyle.js";
import Ionicons from "react-native-vector-icons/FontAwesome";

export default function FollowupChoiceScreen({ route, navigation }) {
  const videoId = route.params?.videoId;
  const optionsArr = route.params?.optionsArr;
  const pollType = route.params?.pollType;
  const question = route.params?.question;
  let chosenOption = null;

  // Just shows that likes and dislikes are being updated when pressed
  /*
  useEffect(() => {
    console.log("Likes arr: ", likesArr);
    console.log("Dislikes arr: ", dislikesArr);
  }, [likesArr, dislikesArr]);
  */

  return (
    <SafeAreaView style={Styles.appContainer}>
      <Text style={Styles.headerText}>Create a Followup Video</Text>
      <Text style={Styles.questionText}>First, which did you choose?</Text>

      <View style={{ flexShrink: 1 }}>
        <ScrollView>
          <View style={Styles.answerContainer}>
            {optionsArr.map((option) => (
              <View key={option.id}>
                <TouchableOpacity
                  style={Styles.answerButton}
                  onPress={() => {chosenOption=option; navigation.navigate("Followup Record", {videoId, chosenOption})}}
                  underlayColor="#fff"
                >
                  <Text style={Styles.answerText}>{option.option}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <Text style={Styles.questionText}>or...</Text>

      <TouchableOpacity
        style={Styles.answerButton}
        onPress={() => {chosenOption=null; navigation.navigate("Followup Record", {videoId, chosenOption})}}
        underlayColor="#fff"
      >
        <Text style={Styles.answerText}>None of these</Text>
      </TouchableOpacity>

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
