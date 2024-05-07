import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF2DE",
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
  },

  topicButton: {
    marginTop: 8,
    marginBottom: 8,
    justifyContent: "flex-end",
    width: 110,
    height: 110,
    borderRadius: 30,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  topicIcon: {
    color: "#a8a8b8",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 70,
  },

  topicText: {
    color: "#a8a8b8",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 14,
    fontWeight: 'bold',
    paddingBottom: 10,
  },

});
