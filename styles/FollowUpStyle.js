import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  headerText: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 50,
  },

  image: {
    flex: 1,
    width: "100%", // Set the desired width
    height: "100%", // Set the desired height
    alignSelf: "center",
  },
});
