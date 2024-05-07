import { StyleSheet } from "react-native";

export default StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },

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

    pollButton: {
        marginTop: -60,
        marginBottom: 8,
        marginEnd: 10,
        justifyContent: "center",
        width: 50,
        height: 50,
        borderRadius: 30,
        alignSelf: "flex-end",
    },

    pollIcon: {
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 40,
    },

    reportMenuPosition: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
            { translateX: -100 }, // Half of the reportMenu width
            { translateY: -60 }, // Half of the reportMenu height
        ],
        zIndex: 999,
    },

    reportedBoxPosition: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
            { translateX: -100 }, // Half of the reportedBox width
            { translateY: -35 }, // Half of the reportedBox height
        ],
        zIndex: 999,
    },
    
});
