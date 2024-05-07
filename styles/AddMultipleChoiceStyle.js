import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFF2DE",
  },

  answerContainer: {
    flex: 1,
    flexDirection: "row",
    alignContents: "center",
  },

  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 999,
  },

  headerText: {
    flexDirection: "column",
    alignSelf: "flex-start",
    fontSize: 40,
    marginBottom: 20,
    marginStart: 25,
    marginEnd: 25,
    marginTop: 10,
  },

  questionInput: {
    flex: 1,
    backgroundColor: "#fde085",
    color: "black",
    textAlignVertical: "top",
    fontSize: 20,
    marginBottom: 10,
    marginStart: 25,
    marginEnd: 25,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  },

  answerInput: {
    flex: 1,
    backgroundColor: "#fcb42c",
    color: "black",
    textAlignVertical: "top",
    fontSize: 20,
    marginBottom: 10,
    marginStart: 25,
    marginEnd: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 20,
  },

  deleteButton: {
    backgroundColor: "#fcb42c",
    alignSelf: "flex-end",
    zIndex: 999,
    marginEnd: 25,
    marginTop: 0,
    marginBottom: 10,
    borderRadius: 15,
  },

  deleteText: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
  },

  addButton: {
    backgroundColor: "#fcb42c",
    alignSelf: "flex-end",
    zIndex: 999,
    marginStart: 25,
    marginEnd: 25,
    marginTop: 0,
    marginBottom: 10,
    borderRadius: 50,
  },

  addText: {
    color: "black",
    textAlign: "center",
    fontSize: 30,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
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
