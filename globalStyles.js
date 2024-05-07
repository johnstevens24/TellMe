import { StyleSheet } from "react-native";

export default StyleSheet.create({
	container: {
		flexDirection: "column",
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		top: 10,
		bottom: 10,
		left: 10,
		right:10,
	},

	appContainer: {
		flex: 1,
		backgroundColor: "#fff",
	},
	
	loginContainer:{
		flexDirection: "column",
		flex: 1.25,
		alignItems: "center",
		padding: 100,
	},

	loginTextFields:{
		height: 40,
		width: 200,
		fontSize: 18,
		textAlign: "center",
		marginBottom: 50,
		backgroundColor: "#F1F1F1",
		borderRadius: 5,
	},

	// HomeScreen Style
	homeContainer: {
		flex: 1,
		justifyContent: "center",
	},
	homeVideo: {
		flexDirection: "column",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},

	// RecordScreen Style
	createContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	  },
  
	  fixedRatio: {
		flex: 1,
		aspectRatio: 0.55,
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	  },
  
	  cameraAndVideoButtons: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		zIndex: 999,
	  },

	  hideVideo: {
		width: 0,
		height: 0,
	  },

	  // PlaybackScreen Style
	  playbackVideo: {
		flexDirection: "column",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		aspectRatio: 0.55,
	  },
  
  
	titleText: {
		fontSize: 25,
		fontWeight: "bold",
	},
  
	fillerSpace: {
		flexDirection: "column",
		flex: 3,
		justifyContent: "center",
	},
  
  
	//Everything below here is being used to try and get the nav perfect on the profile screen
	screenContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
	},
  
	userInfo:{
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
		paddingTop: "8%",
		paddingBottom: "8%",
		backgroundColor: "#fff",
	},
	profPic: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
	userName: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		paddingTop: "3%",
		paddingBottom: "3%",
	},
	profileStats: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
	},
	postLikes:{
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
  
	profileMainContent: {
		flexDirection: "column",
		justifyContent: "align-start",
		alignItems: "center",
		flexGrow: 1,
		width: "100%",
	},
	profileContentNav: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
		width: "100%",
		borderTopColor: "#ddd",
		borderTopWidth: 2,
		borderBottomColor: "#ddd",
		borderBottomWidth: 2,
		backgroundColor: "#fff",
	},
	profileVideos: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		flexGrow: 1,
		width: "100%",
		backgroundColor: "#fff",
	},
  
	navBar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#eee",
		width: "100%",
		borderTopColor: "#ddd",
		borderTopWidth: 2,
		padding: 0,
	},
    
});
