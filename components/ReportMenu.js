import { StyleSheet, Text, View, Alert, TouchableWithoutFeedback } from "react-native";
import { useState, useEffect, useCallback } from "react";
import React from "react";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "@expo/vector-icons";
import ReportDataService from "../services/reports.service.js";

const ReportMenu = ({ onClose, onReport, elementId }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const handleSelectOption = (reason) => {
    onReport(elementId, reason);
    Alert.alert(
      "Thank you",
      "Report Received: " + reason,
      [{ text: "OK", onPress: () => {setMenuOpen(false); onClose();} }]
    );
    //setMenuOpen(false);
    //onClose();
  };

  const handleCreateRequest = async (
    video_id,
    option_id,
    reasoning
  ) => {
    try {
      // Assuming you have the necessary data in your component state or props
      const requestData = {
        video_id: video_id,
        option_id: option_id,
        user_id: globalThis.userID,
        reasoning: reasoning
      };
      // Make the create request using the helper function
      //const responseData = await VideoDataService.create(requestData);
      const responseData = await ReportDataService.create(requestData);
  
    } catch (error) {
      console.error("Error handling create report request:", error);
      // Handle errors here
    }
  };

  const handleOutsidePress = () => {
    if (menuOpen) {
        setMenuOpen(false);
        onClose();
      }
  };
  /*<MenuTrigger
    customStyles={{
      triggerWrapper: {
        //top: -20,
      },
    }}
  >
    <Entypo name="dots-three-vertical" size={24} color="black" />
  </MenuTrigger>*/
  return (
    <View style={Styles.parentContainer} >
      <MenuProvider style={Styles.menuProvider}>
        <Menu opened={menuOpen} onBackdropPress={handleOutsidePress}>
          {/* Invisible MenuTrigger since it is required*/}
          <MenuTrigger />
          <MenuOptions             customStyles={{
              optionsWrapper: { ...Styles.boxContainer, borderRadius: 10 },
            }}>
            <Text style={Styles.title}> Report for: </Text>
            <MenuOption
              style={Styles.menuOption}
              onSelect={() => handleSelectOption("Harrassment or bullying")}
              text="Harrassment or bullying"
            />
            <MenuOption
              style={Styles.menuOption}
              onSelect={() => handleSelectOption("Inappropriate or Explicit")}
              text="Inappropriate or Explicit"
            />
            <MenuOption
              style={Styles.menuOption}
              onSelect={() => handleSelectOption("Hate speech or symbols")}
              text="Hate speech or symbols"
            />
            <MenuOption
              style={[Styles.menuOption, { borderBottomWidth: 0 }]}
              onSelect={() =>
                handleSelectOption("Violence or threat of violence")
              }
              text="Violence or threat of violence"
            />
          </MenuOptions>
        </Menu>
      </MenuProvider>
    </View>
  );
};

export default ReportMenu;

const Styles = StyleSheet.create({

  boxContainer: {
    height: 30 * 4 + 30,
    width: 200,
    marginEnd: 25,
  },
  
  parentContainer: {
    alignSelf: "flex-end",
    marginEnd: 25,
    padding: 5,
    height: 30 * 4 + 30,
    width: 210,
    backgroundColor: "white",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  container: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    minWidth: 210,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    height: 20,
  },

  menuProvider: {
    marginStart: -50,
  },

  menuOption: {
    justifyContent: "center",
    height: 30,
    borderColor: "lightgray",
    borderBottomWidth: 0.5,
  },
});
