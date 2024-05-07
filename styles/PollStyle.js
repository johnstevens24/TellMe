import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFF2DE",
    justifyContent: "center",
  },  
  
  questionText: {
    flexDirection: "column",
    alignSelf: "flex-start",
    fontSize: 30,
    marginBottom: 20,
    marginStart: 25,
    marginEnd: 25,
    marginTop: 10,
  },

  answerContainer: {
    flex: 1,
    flexDirection: "column",
    alignContents: "center",
  },

  answerButton: {
    backgroundColor: "#fde085",
    marginTop: 8, 
    marginBottom: 10,
    marginStart: 25,
    marginEnd: 25,
    borderRadius: 30,
    alignContent: "center",
    alignContents: "center",
    textAlignVertical: "center"
  },  
  
  answerText: {
    flex: 1,
    color: "black",
    textAlignVertical: "top",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 20,
  },

  answerInput: {
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
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 20,
  },

  answerTail: {
    marginEnd: 25,
    marginTop: -11,
    left: -15,
    height: 20,
    borderBottomWidth: 20,
    borderBottomColor: 'transparent',
    borderRightWidth: 20,
    borderRightColor: '#ef9083',
  },

  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 999,
  },

  navButton: {
    backgroundColor: "#fc9c04",
    alignSelf: "flex-end",
    zIndex: 999,
    marginStart: 25,
    marginEnd: 25,
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

  loadingContainer: {
    alignItems: "center",
  },

});
