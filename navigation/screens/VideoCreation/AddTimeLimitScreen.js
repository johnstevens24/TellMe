import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import {
	Text,
	Image,
	Button,
	View,
	TouchableOpacity,
	SafeAreaView,
	StyleSheet,
} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import Styles from "../../../styles/AddTimeLimitStyle.js";
import * as VideoThumbnails from "expo-video-thumbnails";
import AWS from "aws-sdk";
import CryptoJS from "react-native-crypto-js";
import VideoDataService from "../../../services/video.service.js";
import OptionDataService from "../../../services/option.service.js";
import config from "../../../config.js";

export default function AddTimeLimitScreen({ route, navigation }) {
	const videoUri = route.params?.videoUri;
	const pollType = route.params?.pollType;
	const question = route.params?.question;
	const options = route.params?.options;
	const topic = route.params?.topicName;
	const choiceObjectArr = Object.values(options);
	// choicesArr has all multiple choice answers as strings.
	// Also filters out any blank "" answers.
	let choicesArr = [];

	function isEmpty(value) {
		return (
			value == null || (typeof value === "string" && value.trim().length === 0)
		);
	}

	// Populate choicesArr
	if (pollType === "Multiple Choice") {
		for (let i = 0; i < choiceObjectArr.length; i++) {
			let answer = Object.values(choiceObjectArr[i])[0].trim();
			if (!isEmpty(answer)) {
				choicesArr.push(answer);
			}
		}
	} else if (pollType === "Yes or No") {
		choicesArr.push("Yes");
		choicesArr.push("No");
	}

	const [thumbnail, setThumbnail] = useState(null);

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

	const [postDisabled, setPostDisabled] = useState(false);
	const [selectedEndDate, setSelectedEndDate] = useState(null);
	const todayDate = moment().format("YYYY-MM-DD");
	const tomorrowDate = moment().add(1, "day").format("YYYY-MM-DD");

	const onDateChange = useCallback(
		(date) => {
			setSelectedEndDate(date);
		},
		[selectedEndDate]
	);

	const handleResetProcess = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: "Record" }],
		});
	};

	const handleUpload = async () => {
		if (endDate === null) {
			alert("Please select a date.");
		} else if (endDate <= todayDate) {
			alert("Please choose a date at least 1 day after today.");
		} else {
			setPostDisabled(true);
			try {
				// Call the uploadFile function here
				const url = await uploadFile(videoUri);
				await generateThumbnailPromise();
				const thumbnail_url = await uploadThumbnail(thumbnail);
				navigation.navigate("Record");
				const video_name = url.split("/").pop();
				const thumbnail_name = thumbnail_url.split("/").pop();
				handleCreateRequest(
					video_name,
					pollType,
					question,
					endDate,
					todayDate,
					thumbnail_name,
					topic,
					options
				); //url, poll_type, poll_question, end_date, vid_thumbnail
				handleResetProcess();
			} catch (error) {
				console.error("Error uploading file:", error);
				setPostDisabled(false);
			}
		}
	};

	const generateThumbnailPromise = () => {
		return new Promise((resolve, reject) => {
			if (thumbnail) {
				resolve(thumbnail);
			} else {
				// If thumbnail is not available, wait and try again
				setTimeout(() => {
					generateThumbnailPromise().then(resolve).catch(reject);
				}, 100);
			}
		});
	};

	const endDate = selectedEndDate ? moment(selectedEndDate).format("YYYY-MM-DD") : null;

	return (
		<SafeAreaView style={Styles.appContainer}>
			<Text style={Styles.headerText}>When do you need to know by?</Text>

			<View>
				<CalendarPicker
					onDateChange={onDateChange}
					selectedDayColor={"#fcb42c"}
				></CalendarPicker>

				<Text style={Styles.dateText}>Selected Date:</Text>
				<Text style={Styles.dateText}>
					{endDate ? moment(endDate).format("MM/DD/YYYY") : ""}
				</Text>
			</View>
			<View style={Styles.navContainer}>
				<TouchableOpacity
					style={Styles.navButton}
					onPress={() => navigation.goBack()}
					underlayColor="#fff"
				>
					<Text style={Styles.navText}>Back</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						Styles.navButton,
						postDisabled && { backgroundColor: "#c2beb4" },
					]}
					onPress={handleUpload}
					disabled={postDisabled}
					underlayColor="#fff"
				>
					<Text style={Styles.navText}>Post</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const uploadFile = async (videoUri) => {
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
	poll_type,
	poll_question,
	end_date,
	today_date,
	vid_thumbnail,
	topic,
	options
) => {
	try {
		// Assuming you have the necessary data in your component state or props
		const requestData = {
			datePosted: today_date,
			userId: globalThis.userID,
			videoData: url,
			pollType: poll_type,
			pollQuestion: poll_question,
			endDate: end_date,
			thumbnail: vid_thumbnail,
			topic: topic,
		};
		// Make the create request using the helper function
		const responseData = await VideoDataService.create(requestData);

		// if multiple choice, insert into the options table.
		if (poll_type == "Multiple Choice") {
			for (const option of options) {
				await OptionDataService.create({
					video_id: responseData.data.id, // Assuming responseData contains the newly created video's ID
					option: option.text,
				});
			}
		}
		// if yes/no, insert into the options table.
		if (poll_type == "Yes or No") {
			await OptionDataService.create({
				video_id: responseData.data.id, // Assuming responseData contains the newly created video's ID
				option: "Yes",
			});
			await OptionDataService.create({
				video_id: responseData.data.id, // Assuming responseData contains the newly created video's ID
				option: "No",
			});
		}
	} catch (error) {
		console.error("Error handling create video request:", error);
		// Handle errors here
	}
};
