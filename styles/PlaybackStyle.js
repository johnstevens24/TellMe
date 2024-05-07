import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  fixedRatio: {
    flex: 1,
    aspectRatio: 0.55,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  playbackVideo: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 0.55,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 999,
  },

  navButton: {
    backgroundColor: "#fc9c04",
    alignSelf: "flex-end",
    zIndex: 999,
    marginTop: -2000,
    marginBottom: 10,
    marginStart: 10,
    marginEnd: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15,
  },

  navText: {
    color: "black",
    textAlign: "center",
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },

  buttonIcon: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 40,
    paddingStart: 7,
    paddingEnd: 7,
  },

  postButtonText: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 24,
    padding: 7,
  },

});
