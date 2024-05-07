import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFF2DE",
  },

  navContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 999,
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

  headerText: {
    flexDirection: "column",
    alignSelf: "center",
    fontSize: 40,
    marginBottom: 40,
    marginStart: 25,
    marginEnd: 25,
    marginTop: 10,
  },

  dateText: {
    flexDirection: "column",
    alignSelf: "center",
    fontSize: 30,
    marginTop: 10,
    marginStart: 25,
    marginEnd: 25,
  },

});
