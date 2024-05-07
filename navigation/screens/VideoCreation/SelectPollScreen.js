import * as React from "react";
import {
  Text,
  View,
  Image,
  Button,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import Styles from "../../../styles/SelectPollStyle";

export default function SelectPollScreen({ route, navigation }) {
  const videoUri = route.params?.videoUri;
  return (
    <SafeAreaView style={Styles.appContainer}>

      <Text style={Styles.headerText}>
        How would you like others to respond?
      </Text>

      <TouchableOpacity
        style={Styles.pollTypeButton}
        onPress={() => navigation.navigate("Add Multiple Choice", { videoUri, pollType: "Multiple Choice" })}
        underlayColor="#fff"
      >
        <Text style={Styles.pollTypeText}>Multiple Choice</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Styles.pollTypeButton}
        onPress={() => navigation.navigate("Add Multiple Choice", { videoUri, pollType: "Free Response" })}
        underlayColor="#fff"
      >
        <Text style={Styles.pollTypeText}>Free Response</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={Styles.pollTypeButton}
        onPress={() => navigation.navigate("Add Multiple Choice", { videoUri, pollType: "Yes or No" })}
        underlayColor="#fff"
      >
        <Text style={Styles.pollTypeText}>Yes or No</Text>
      </TouchableOpacity>

      <View style={Styles.navButtons}>
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
