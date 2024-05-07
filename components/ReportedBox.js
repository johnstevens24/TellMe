import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import React from "react";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

const ReportedBox = ({ onClose }) => {
  const [menuOpen, setMenuOpen] = useState(true);
  const handleOutsidePress = () => {
    if (menuOpen) {
      setMenuOpen(false);
      onClose();
    }
  };

  return (
    <View style={Styles.parentContainer}>
      <MenuProvider style={Styles.menuProvider}>
        <Menu opened={menuOpen} onBackdropPress={handleOutsidePress}>
          {/* Invisible MenuTrigger since it is required*/}
          <MenuTrigger />
          <MenuOptions
            customStyles={{
              optionsWrapper: { ...Styles.boxContainer, borderRadius: 10 },
            }}
          >
            <Text style={Styles.text}>Report already received,</Text>
            <Text style={Styles.text}>Thank you!</Text>
          </MenuOptions>
        </Menu>
      </MenuProvider>
    </View>
  );
};

export default ReportedBox;

const Styles = StyleSheet.create({
  parentContainer: {
    alignSelf: "flex-end",
    marginEnd: 25,
    height: 70,
    width: 200,
    backgroundColor: "#FFF2DE",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  menuProvider: {
    marginStart: -50,
  },

  boxContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 70,
    width: 200,
    marginEnd: 25,
  },

  text: {
    fontSize: 16,
  },
});
