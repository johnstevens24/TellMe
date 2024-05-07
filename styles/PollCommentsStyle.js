import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FFF2DE",
    justifyContent: "center",
  },  

  headerText: {
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 30,
    marginTop: 15,
    marginBottom: 10,
  },
  
  questionText: {
    flexDirection: "column",
    alignSelf: "flex-start",
    fontSize: 26,
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
    color: "black",
    textAlignVertical: "top",
    fontSize: 18,
    paddingTop: 10,
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
    zIndex: 999,
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
    zIndex: 999,
  },

  likesContainer: {
    flex: 1,
    marginTop: -12,
    marginEnd: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },

  likeButton: {
    zIndex: 999,
    alignContent: "center",
    alignContents: "center",
    textAlignVertical: "center",
    alignSelf: 'flex-end',
  },  

  dislikeButton: {
    zIndex: 999,
    alignContent: "center",
    alignContents: "center",
    textAlignVertical: "center",
    alignSelf: 'flex-end',
  },  

  likesIcon: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    padding: 4,
  },

  numVotesText: {
    color: "black",
    textAlignVertical: "top",
    fontSize: 12,
    marginEnd: 10,
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

  detailText: {
    flexDirection: "column",
    alignSelf: "center",
    fontSize: 26,
    marginStart: 25,
    marginEnd: 25,
    marginTop: 10,
  },

});
