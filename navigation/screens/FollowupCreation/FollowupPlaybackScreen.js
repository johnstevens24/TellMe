import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import Styles from "../../../styles/PlaybackStyle";
import { Video, ResizeMode } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import * as VideoThumbnails from "expo-video-thumbnails";
import AWS from "aws-sdk";
import CryptoJS from "react-native-crypto-js";
import FollowupDataService from "../../../services/followup.service.js";
import config from "../../../config.js";

export default function FollowupPlaybackScreen({ route, navigation }) {
	const video = React.useRef(null);
	const videoId = route.params?.videoId;
	const videoUri = route.params?.videoUri;
	const chosenOption = route.params?.chosenOption;
	const [status, setStatus] = React.useState({});
	const [thumbnail, setThumbnail] = useState(null);
	const [postDisabled, setPostDisabled] = useState(false);
	const todayDate = moment().format("YYYY-MM-DD");

	// Goes back twice to the FollowupChoiceScreen rather than FollowupRecordScreen
	// because no matter what I do, I can't get the timer to reset on the FollowupRecordScreen
	// AND have the correct navigation.goBack().
	const handleGoBack = () => {
		navigation.goBack();
		navigation.goBack();
	};

	const handleExitStack = () => {
		navigation.popToTop();
		navigation.reset({
			index: 0,
			routes: [{ name: "Profile", params: { hasNewFollowup: true } }],
		});
	};

	useEffect(() => {
		// This code will be executed when the component mounts
		const generateThumbnail = async () => {
			try {
				const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
					time: 200, // Create thumbnail at time in ms.
				});
				setThumbnail(uri);
			} catch (e) {
				console.warn(e);
			}
		};

		// Call the generateThumbnail function when the component mounts
		generateThumbnail();
	}, [videoUri]); // Run the effect when videoUri changes

	const generateThumbnailPromise = () => {
		return new Promise((resolve, reject) => {
			if (thumbnail) {
				console.log("Thumbnail URI:", thumbnail);
				resolve(thumbnail);
			} else {
				// If thumbnail is not available, wait and try again
				setTimeout(() => {
					generateThumbnailPromise().then(resolve).catch(reject);
				}, 100);
			}
		});
	};

	const handleUpload = async () => {
		setPostDisabled(true);
		try {
			// Call the uploadFile function here
			const url = await uploadFile(videoUri);
			await generateThumbnailPromise();
			const thumbnail_url = await uploadThumbnail(thumbnail);
			//navigation.navigate("Record");
			let chosenOptionId = null;
			if (chosenOption) {
				chosenOptionId = chosenOption.id;
			}

			const video_name = url.split("/").pop();
			const thumbnail_name = thumbnail_url.split("/").pop();
			handleCreateRequest(
				video_name,
				todayDate,
				thumbnail_name,
				videoId,
				chosenOptionId
			); //url, poll_type, poll_question, end_date, vid_thumbnail
			handleExitStack();
		} catch (error) {
			console.error("Error uploading file:", error);
			setPostDisabled(false);
		}
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
					style={[
						Styles.navButton,
						postDisabled && { backgroundColor: "#c2beb4" },
					]}
					onPress={() => {
						video.current.pauseAsync();
						handleUpload();
					}}
					disabled={postDisabled}
					underlayColor="#fff"
				>
					<Text style={Styles.postButtonText}>Post</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const uploadFile = async (videoUri) => {
	const S3_BUCKET = "tellme-vids";
	const REGION = "us-west-1";

	AWS.config.update({
		accessKeyId: config.S3_ACCESS_KEY,
		secretAccessKey: config.S3_SECRET_KEY,
	});

	const s3 = new AWS.S3({
		params: { Bucket: S3_BUCKET },
		region: REGION,
	});

	const name = createURLName();

	try {
		const blob = await convertVideoToBlob(videoUri);

		const params = {
			Bucket: S3_BUCKET,
			Key: name,
			Body: blob,
		};

		await s3.putObject(params).promise();

		alert("Video uploaded successfully.");

		const videoUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${name}`;
		return videoUrl;
	} catch (error) {
		console.error("Error:", error);
		throw error; // Re-throw the error if needed
	}
};

const uploadThumbnail = async (thumb) => {
	const S3_BUCKET = config.S3_BUCKET;
	const REGION = config.S3_REGION;

	AWS.config.update({
		accessKeyId: config.S3_ACCESS_KEY,
		secretAccessKey: config.S3_SECRET_KEY,
	});

	const s3 = new AWS.S3({
		params: { Bucket: S3_BUCKET },
		region: REGION,
	});

	const name = createURLNameThumb();

	try {
		const blob = await convertVideoToBlob(thumb);

		const params = {
			Bucket: S3_BUCKET,
			Key: name,
			Body: blob,
		};

		await s3.putObject(params).promise();

		const picUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${name}`;
		return picUrl;
	} catch (error) {
		console.error("Error:", error);
		throw error; // Re-throw the error if needed
	}
};

function createURLName() {
	const randomBytes = CryptoJS.lib.WordArray.random(8);
	const name = CryptoJS.enc.Hex.stringify(randomBytes);
	return name + ".mov";
}

function createURLNameThumb() {
	const randomBytes = CryptoJS.lib.WordArray.random(8);
	const name = CryptoJS.enc.Hex.stringify(randomBytes);
	return name + ".jpeg";
}

async function convertVideoToBlob(videoUri) {
	try {
		const response = await fetch(videoUri);
		const blob = await response.blob();
		return blob;
	} catch (error) {
		console.error("Error converting video to Blob:", error);
		throw error;
	}
}

const handleCreateRequest = async (
	url,
	today_date,
	vid_thumbnail,
	video_id,
	chosen_id
) => {
	try {
		// Assuming you have the necessary data in your component state or props
		const requestData = {
			datePosted: today_date,
			userId: globalThis.userID,
			videoId: video_id, 
			followupData: url, 
			thumbnail: vid_thumbnail,
			chosenId: chosen_id
		};
		// Make the create request using the helper function
		//const responseData = await VideoDataService.create(requestData);
		const responseData = await FollowupDataService.create(requestData);

	} catch (error) {
		console.error("Error handling create followup video request:", error);
		// Handle errors here
	}
};
