import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
},

  loginContainer: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
  },

  loginTextFields: {
    height: 40,
    width: 200,
    fontSize: 18,
    textAlign: "left",
    paddingStart: 10,
    marginBottom: 20,
    backgroundColor: "#F1F1F1",
    borderRadius: 5,
  },

  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    zIndex: 999,
  },

  navButton: {
    backgroundColor: "#ef9083",
    alignSelf: "center",
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
    color: "white",
    textAlign: "center",
    fontSize: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
});
