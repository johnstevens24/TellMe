import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFF2DE",
  },

  createContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  navButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 999,
  },

  headerText: {
    flexDirection: "column",
    alignSelf: "center",
    fontSize: 50,
    marginBottom: 40,
    marginStart: 25,
    marginEnd: 25,
    marginTop: 10,
  },

  pollTypeButton: {
    backgroundColor: "#fcb42c",
    marginBottom: 25,
    marginStart: 25,
    marginEnd: 25,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 20,
  },

  pollTypeText: {
    color: "black",
    textAlign: "center",
    fontSize: 40,
    paddingLeft: 10,
    paddingRight: 10,
  },

  navButton: {
    backgroundColor: "#fc9c04",
    alignSelf: "flex-end",
    zIndex: 999,
    marginStart: 10,
    marginEnd: 10,
    marginTop: 10,
    marginBottom: 10,
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
});
