import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import {
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Styles from "../../../styles/AddMultipleChoiceStyle";

export default function AddMultipleChoiceScreen({ route, navigation }) {
  const video = route.params?.video;
  const videoUri = route.params?.videoUri;
  const pollType = route.params?.pollType;
  const [text, setText] = useState("");
  const [question, setQuestion] = useState("");
  const keyboardVerticalOffset = Platform.OS === "ios" ? 40 : 0;
  const [components, setComponents] = useState([{ text: "" }]);

  const onAdd = () => {
    let cloneArry = [...components];
    cloneArry.push({ text: "" });
    setComponents(cloneArry);
  };

  const onDelete = useCallback(
    (index) => {
      let cloneArry = [...components];
      let filterArry = cloneArry.filter((val, i) => {
        if (i !== index) {
          return val;
        }
      });
      setComponents(filterArry);
    },
    [components]
  );

  const onChangeText = useCallback(
    (text, index) => {
      let cloneArry = [...components];
      cloneArry[index] = { text: text };
      setComponents(cloneArry);
    },
    [components]
  );

  const handleNext = () => {
    if (question.trim() == "") {
      alert("Please enter a question.");
    } 
    else if (pollType === "Multiple Choice") {
      if (components.length < 2) {
        alert("Please enter at least two choices.");
      } 
      else {
        let numInvalid = 0;
        for (let i = 0; i < components.length; i++) {
          if (components[i].text.trim() === "") {
            alert(
              "Empty choices are not allowed. Please delete or type in a response for the empty choice."
            );
            numInvalid++;
            break;
          }
        }
        if (numInvalid === 0) {
          // Only navigates to Select Topics Screen if num choices > 2 and if there are no blank options.
          navigation.navigate("Select Topics", {
            video,
            videoUri,
            pollType,
            question,
            components,
          });
        }
      }
    } else {
      // Valid question and choices if applicable (multiple choice).
      navigation.navigate("Select Topics", {
        video,
        videoUri,
        pollType,
        question,
        components,
      });
    }
  };

  return (
    <SafeAreaView style={Styles.appContainer}>
      <Text style={Styles.headerText}>TellMe,</Text>

      <KeyboardAvoidingView
        style={Styles.appContainer}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardVerticalOffset}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <TextInput
            style={Styles.questionInput}
            placeholder="Enter question here"
            multiline={true}
            blurOnSubmit={true}
            onChangeText={(newText) => setQuestion(newText)}
          />

          {pollType === "Multiple Choice" ? (
            <View>
              {components.map((val, i) => {
                return (
                  <View style={Styles.answerContainer} key={i}>
                    <TextInput
                      style={Styles.answerInput}
                      value={val.text}
                      placeholder="Enter choice here"
                      multiline={true}
                      blurOnSubmit={true}
                      onChangeText={(text) => onChangeText(text, i)}
                    />

                    <TouchableOpacity
                      style={Styles.deleteButton}
                      onPress={() => onDelete(i)}
                      underlayColor="#fff"
                    >
                      <Text style={Styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
              <TouchableOpacity
                style={Styles.addButton}
                onPress={onAdd}
                underlayColor="#fff"
              >
                <Text style={Styles.addText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </KeyboardAvoidingView>

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
          onPress={handleNext}
          underlayColor="#fff"
        >
          <Text style={Styles.navText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
