import * as React from "react";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import Styles from "../../../styles/RecordStyle";
import { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/core";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

export default function FollowupRecordScreen({ route, navigation }) {
  const videoId = route.params?.videoId;
  const chosenOption = route.params?.chosenOption;
  const isFocused = useIsFocused();
  // Getting permissions from user using react-hooks
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasCamerarollPermission, setHasCamerarollPermission] = useState(null);
  // Camera recording related
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [videoUri, setVideoUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [flipAllowed, setFlipAllowed] = useState(true);
  // Timer related
  const [timer, setTimer] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  let interval;

  const startTimer = () => {
    // Interval starts every 1000ms (1sec)
    interval = setInterval(() => {
      // prevSeconds gets the previous state value of seconds
      setSeconds((prevSeconds) => {
        let newSeconds = prevSeconds + 1;
        // Adds 1 to minutes and resets seconds to 0 when a minute passes.
        if (newSeconds == 60) {
          // prevMinutes gets the previous state value of minutes
          setMinutes((prevMinutes) => {
            let newMinutes = prevMinutes + 1;
            return newMinutes;
          });
          newSeconds = 0;
        }
        return newSeconds;
      });
    }, 1000);

    // Clearing the interval
    return () => clearInterval(interval);
  };

  // null state of camera and microphone are updated once permissions are agreed to
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const audioStatus = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status === "granted");
    })();
  }, []);

  // Handles getting a video from a user's camera roll.
  // Also asks for permission of access and navigates to the next screen
  // if a video is successfully selected.
  async function handleGetVideo() {
    // Asks for permission to access user's camera roll
    const camerarollStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    setHasCamerarollPermission(camerarollStatus.status === "granted");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      // Navigate to the playback screen after video uri is acquired
      navigation.navigate("Followup Playback", {
        videoId,
        videoUri: result.assets[0].uri,
        chosenOption,
      });
    }
  }

  const takeVideo = async () => {
    if (camera) {
      const data = await camera.recordAsync();
      setVideoUri(data.uri);
      setIsRecording(false);
      navigation.navigate("Followup Playback", {
        videoId,
        videoUri: data.uri,
        chosenOption,
      });
    }
  };

  const stopVideo = async () => {
    camera.stopRecording();
  };

  // Views for denied permissions
  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }

  // Exit from the stack navigator
  const handleExitStack = () => {
    navigation.popToTop();
    navigation.reset({
      index: 0,
      routes: [{ name: "Profile", params: { hasNewFollowup: false } }],
    });
  };

  if (isFocused) {
    return (
      <SafeAreaView style={Styles.appContainer}>
        <TouchableOpacity
          style={Styles.exitButton}
          onPress={handleExitStack}
          underlayColor="#fff"
        >
          <Text style={Styles.exitText}>X</Text>
        </TouchableOpacity>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={Styles.fixedRatio}
          type={type}
          ratio={"16:9"}
        ></Camera>

        <TouchableOpacity onPress={handleExitStack} />

        {/* Displays timer and whether or not it should have any leading zeroes. */}
        {seconds < 10 ? (
          minutes < 10 ? (
            <Text style={Styles.timerText}>
              0{minutes}:0{seconds}
            </Text>
          ) : (
            <Text style={Styles.timerText}>
              {minutes}:0{seconds}
            </Text>
          )
        ) : minutes < 10 ? (
          <Text style={Styles.timerText}>
            0{minutes}:{seconds}
          </Text>
        ) : (
          <Text style={Styles.timerText}>
            {minutes}:{seconds}
          </Text>
        )}

        <View style={Styles.buttonContainer}>
          <TouchableOpacity
            style={[
              Styles.smallButton,
              isRecording ? { backgroundColor: "transparent" } : {},
            ]}
            onPress={handleGetVideo}
            disabled={isRecording}
            underlayColor="#fff"
          >
            <Ionicons
              style={[
                Styles.smallIcon,
                isRecording ? { color: "transparent" } : {},
              ]}
              name={"images-outline"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={Styles.recordButton}
            onPress={() => {
              setIsRecording(!isRecording);
              isRecording ? stopVideo() : takeVideo();
              startTimer();
              setFlipAllowed(false);
            }}
            underlayColor="#fff"
          >
            <Ionicons
              style={[
                Styles.recordIcon,
                { color: isRecording ? "red" : "black" },
              ]}
              name={
                isRecording ? "stop-circle-outline" : "radio-button-on-outline"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              Styles.smallButton,
              isRecording ? { backgroundColor: "transparent" } : {},
            ]}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
            disabled={!flipAllowed}
            underlayColor="#fff"
          >
            <Ionicons
              style={[
                Styles.smallIcon,
                isRecording ? { color: "transparent" } : {},
              ]}
              name={"camera-reverse-outline"}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
