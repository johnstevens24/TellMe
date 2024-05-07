import * as React from "react";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import Styles from "../../../styles/PlaybackStyle";
import { Video, ResizeMode } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function PlaybackScreen({ route, navigation }) {
  const video = React.useRef(null);
  const videoUri = route.params?.videoUri;
  const [status, setStatus] = React.useState({});

  // Function to reset the stack and navigate to the previous (Record) screen
  // This resets the timer
  const handleGoBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Record" }],
    });
  };

  return (
    <SafeAreaView style={Styles.appContainer}>
      <Video
        ref={video}
        style={Styles.fixedRatio}
        source={{
          uri: videoUri,
        }}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        shouldPlay={true}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        onError={(error) => console.error("Error:", error)}
      ></Video>

      <View style={Styles.buttonContainer}>
        <TouchableOpacity
          style={Styles.navButton}
          onPress={handleGoBack}
          underlayColor="#fff"
        >
          <Ionicons style={Styles.buttonIcon} name={"backspace-outline"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.navButton}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
          underlayColor="#fff"
        >
          <Ionicons
            style={Styles.buttonIcon}
            name={status.isPlaying ? "pause-outline" : "play"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={Platform.OS === "android" ? 0 : 0.2}
          style={Styles.navButton}
          onPress={() => {
            video.current.pauseAsync();
            navigation.navigate("Select Poll", { videoUri });
          }}
          underlayColor="#fff"
        >
          <Ionicons style={Styles.buttonIcon} name={"checkmark-outline"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
