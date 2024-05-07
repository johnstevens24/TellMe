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
    marginStart: 25,
    marginEnd: 25,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    alignContent: "center",
    alignContents: "center",
    textAlignVertical: "center",
  },  

  answerButtonHidden: {
    backgroundColor: "#fde085",
    marginTop: 8, 
    marginBottom: 10,
    marginStart: 25,
    marginEnd: 25,
    borderRadius: 20,
    alignContent: "center",
    alignContents: "center",
    textAlignVertical: "center"
  },  
  
  answerText: {
    color: "transparent",
    textAlignVertical: "top",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 20,
  },

  answerTextHidden: {
    color: "black",
    textAlignVertical: "top",
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 20,
  },

  answerTextNoPaddingTop: {
    color: "transparent",
    textAlignVertical: "top",
    fontSize: 20,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 20,
  },

  optionTextContainer: {
    color: "black",
    textAlignVertical: "top",
    fontSize: 20,
    marginEnd: 25,
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 10,
    position: 'absolute',
    start: 25,
    end: 0,
    top: 0,
    bottom: 0,
    zIndex: 990,
  },

  optionTextContainerNoMarginEnd: {
    color: "black",
    textAlignVertical: "top",
    fontSize: 20,
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 10,
    position: 'absolute',
    start: 0,
    end: 0,
    top: 0,
    bottom: 0,
    zIndex: 990,
  },

  optionContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    backgroundColor: "#fde085",
    marginTop: 8, 
    marginStart: 25,
    marginEnd: 25,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    alignContent: "center",
    alignContents: "center",
    textAlignVertical: "center",
  },

  analyticsTextContainer: {
    color: "black",
    alignSelf: "flex-start",
    textAlignVertical: "top",
    fontSize: 20,
    marginTop: -57,
    marginStart: 25,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 10,
    zIndex: 990,
  },

  analyticsText: {
    color: "transparent",
    textAlignVertical: "top",
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 10,
    borderRadius: 20,
  },

  proportionBar: {
    backgroundColor: "#fcb42c",
    marginTop: -1,
    marginBottom: 10,
    marginStart: 25,
    marginEnd: 25,
    minWidth: 3,
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    alignContent: "center",
    alignContents: "center",
    textAlignVertical: "center",
    alignSelf: 'flex-start'
  }, 
  
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 990,
  },

  navButton: {
    backgroundColor: "#fc9c04",
    alignSelf: "flex-end",
    zIndex: 990,
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
  
  headerText: {
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 36,
  },

});
