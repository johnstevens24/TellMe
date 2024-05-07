import { StyleSheet } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  fixedRatio: {
    flex: 1,
    flexDirection: "column",
    alignContent: "space-between",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 999,
  },

  smallButton: {
    backgroundColor: "#fc9c04",
    alignSelf: "flex-end",
    justifyContent: "space-between",
    zIndex: 999,
    marginTop: -2000,
    marginBottom: 10,
    marginStart: 10,
    marginEnd: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 15,
  },

  smallIcon: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 40,
    paddingStart: 7,
    paddingEnd: 7,
  },

  recordButton: {
    backgroundColor: "#fc9c04",
    alignSelf: "flex-end",
    zIndex: 999,
    marginTop: -2000,
    marginBottom: 10,
    marginStart: 10,
    marginEnd: 10,
    borderRadius: 100,
  },

  recordIcon: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 90,
    paddingStart: 5,
  },
  
  timerText: {
    marginTop: -150,
    paddingBottom: 110,
    alignSelf: "center",
    color: "#fc9c04",
    fontSize: 18,
    fontWeight: "bold",
    paddingStart: 7,
    paddingEnd: 7,
    borderRadius: 100,
  },

  exitButton: {
    alignSelf: "flex-end",
    alignItems: "center",
    width: 30,
    height: 30,
    position: 'absolute',
    top: 55,
    right: 5,
    zIndex: 1,
  },

  exitText: {
    color: "#fc9c04",
    fontSize: 24,
    fontWeight: "bold",
  },

});
