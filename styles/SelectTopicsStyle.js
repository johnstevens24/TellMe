import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFF2DE",
  },

  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 999,
  },

  navButton: {
    backgroundColor: "#fc9c04",
    alignSelf: "flex-end",
    alignContent: "space-between",
    zIndex: 999,
    margin: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15,
  },

  navText: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },

  headerText: {
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 30,
    marginTop: 15,
    marginBottom: 10,
  },

  topicContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "space-evenly",
    marginStart: 8,
    marginEnd: 8,
  },

  topicButton: {
    marginTop: 8,
    marginBottom: 8,
    marginStart: 8,
    marginEnd: 8,
    justifyContent: "flex-end",
    width: 98,
    height: 98,
    borderRadius: 30,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  topicIcon: {
    color: "#a8a8b8",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 62,
  },

  topicText: {
    color: "#a8a8b8",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 13,
    fontWeight: 'bold',
    paddingBottom: 10,
  },

});
