import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
	SafeAreaView,
	Dimensions,
	FlatList,
	TouchableOpacity,
	View,
} from "react-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Styles from "../../styles/HomeStyle";
import VideoDataService from "../../services/video.service.js";
import Ionicons from "react-native-vector-icons/FontAwesome5";
import PostSingle from "./homeScreenPost.js";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ReportDataService from "../../services/reports.service.js";
import ReportMenu from "../../components/ReportMenu.js";
import ReportedBox from "../../components/ReportedBox.js";

export default function TopicFeed({ navigation, route }) {
	const {topic} = route.params;
 
	// Gets status and tab bar heights so they can be subtracted off video height
	const insets = useSafeAreaInsets();
	const statusBarHeight = Math.round(insets.top);
	const tabBarHeight = Math.round(useBottomTabBarHeight());
	const height = Dimensions.get("window").height-tabBarHeight-statusBarHeight;

	const [videos, setVideos] = useState([]);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [endOfDatabase, setEndOfDatabase] = useState(false);
	const cellRef = useRef({});
	let currentCell = null;

	// Focus Event: to be fired when the TopicScreen is focused.
	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			//Every time the screen is focused the Video starts playing
			if (currentCell) {
				currentCell.play();
			}
		});
	}, [navigation]);

	// Blur Event: to be fired when the TopicScreen loses focus.
	useEffect(() => {
		const unsubscribe = navigation.addListener("blur", () => {
			//Every time the screen loses focus the Video is paused
			if (currentCell) {
				currentCell.stop();
			}
		});
	}, [navigation]);

	useEffect(() => {
		fetchTopicVideos();
	}, []);


	const fetchTopicVideos = async () => {
		if (isLoading || endOfDatabase) return; // not ready to load more videos

		try{
			const pgSize = 5;

			const res = await VideoDataService.getTopicVids(topic, currentPage, pgSize);

			if(res.data && res.data.length > 0) {
				const selectedVideos = res.data.map((item) => ({
					id: item.id,
					video_data: item.video_data, 
					poll_type: item.poll_type, 
					poll_question: item.poll_question
				}));

				setVideos(prevVideos => [...prevVideos, ...selectedVideos]);
				setCurrentPage(prevPage => prevPage + 1);
			} else {
				setEndOfDatabase(true);
			}
		}
		catch (error){
			console.error("Error fetching topic videos data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const refreshVideos = async () => {
		setIsRefreshing(true);
		try{
			setCurrentPage(1);
			setEndOfDatabase(false);

			const pgSize = 5;
			const res = await VideoDataService.getTopicVids(topic, 1, pgSize);

			if(res.data && res.data.length > 0){
				const selectedVideos = res.data.map((item) => ({
					id: item.id,
					video_data: item.video_data, 
					poll_type: item.poll_type, 
					poll_question: item.poll_question
				}));
				setVideos(selectedVideos);
				setCurrentPage(prevPage => prevPage + 1);
			}
			else{
				setEndOfDatabase(true);
			}
		}
		catch (error){
			console.error("Error refreshing data:", error);
		} finally {
			setIsRefreshing(false);
		}
	};

	const handleEndReached = async() => {
		// Load more videos when the user reaches the end of the list
		if (!isLoading && !isRefreshing) {
			await fetchTopicVideos();
		}
	};

	const handleRefresh = async() => {
		if (!isRefreshing){
			await refreshVideos();
		}
	};

	// every time you scroll to a new post, this fires. It pauses all the other posts and plays the one in view
	const onViewableItemsChanged = useRef(({ changed }) => {
		changed.forEach(element => {
			const cell = cellRef[element.key];
			if (cell) {
				if (element.isViewable) {
					currentCell = cell;
					cell.play();
				} else {
					cell.stop();
				}
			}
		});
	});

	// ---------- Reporting related --------------------

	const [activeMenuId, setActiveMenuId] = useState(null);
	const [reportsArr, setReportsArr] = useState([]);
	const [reportedIdsSet, setReportedIdsSet] = useState(new Set());

	useEffect(() => {
		if (reportsArr.length > 0) {
			handleCreateReportRequest();
			setReportsArr([]);
		}
	}, [reportsArr]);

	useEffect(() => {
		fetchHasReportedVideos();
	}, [videos]);

	const handleLongPress = (vid_id) => {
		setActiveMenuId(vid_id);
	};

	const handleCloseMenu = () => {
		setActiveMenuId(null);
	};

	const closeMenuOnOutsidePress = () => {
		setActiveMenuId(null);
	};

	const handleReport = (elementId, reason) => {
		setReportsArr((prevReportsArr) => {
			// Check if the current elementId and reason pair exists in the reportsArr already
			const exists = prevReportsArr.some(
				([existingElementId, existingReason]) =>
					//existingElementId === elementId && existingReason === reason
					existingElementId === elementId
			);

			if (!exists) {
				return [...prevReportsArr, [elementId, reason]];
			} else {
				return prevReportsArr;
			}
		});
	};

	const handleCreateReportRequest = async () => {
		try {
			for (let i = 0; i < reportsArr.length; i++) {
				// Assuming you have the necessary data in your component state or props
				const requestData = {
					video_id: reportsArr[i][0],
					option_id: null,
					user_id: globalThis.userID,
					reasoning: reportsArr[i][1],
				};
				// Make the create request using the helper function
				const responseData = await ReportDataService.create(
					requestData
				);
			}
			// Updates reportedIds so users cannot report a video twice
			setReportedIdsSet((prevReportsSet) => {
				const updatedSet = new Set(prevReportsSet);
				updatedSet.add(reportsArr[0][0]);
				return updatedSet;
			});
			handleCloseMenu();
		} catch (error) {
			console.error("Error handling create report request:", error);
		}
	};

	// Checks if the user has already reported the video. Adds to reportedIdsSet if true
	fetchHasReportedVideos = async () => {
		try {
			let tempReportedVideoIds = [];
			for (let i = 0; i < videos.length; i++) {
				const reportResults = await ReportDataService.hasReportedVideo(
					globalThis.userID,
					videos[i].id
				);
				if (reportResults.data) {
					tempReportedVideoIds.push(videos[i].id);
				}
			}
			setReportedIdsSet((prevReportsArr) => {
				const updatedSet = new Set(prevReportsArr);
				tempReportedVideoIds.forEach((id) => updatedSet.add(id));
				return updatedSet;
			});
		} catch (error) {
			console.error(
				"Error fetching if user has already reported video:",
				error
			);
		}
	};

	// ---------- End Reporting related --------------------

	const renderItem = ({ item }) => {
		return (
			<SafeAreaView>
				{/* Only allows the current video that was long pressed to display a menu. */}
				{activeMenuId === item.id ? (
				/* Video has already been reported: Show Reported Thank you box. */
					reportedIdsSet.has(item.id) ? (
						<View style={Styles.reportedBoxPosition}>
							<ReportedBox onClose={handleCloseMenu} />
						</View>
					) : (
					/* Video has not been reported: Show Report Menu. */
						<View style={Styles.reportMenuPosition}>
							<ReportMenu
								onClose={handleCloseMenu}
								onReport={handleReport}
								elementId={item.id}
							/>
						</View>
					)
				) : (
				/* Do nothing when no video was long pressed. */
					<></>
				)}
				<View
					style={[
						{ flex: 1, height: height },
						{ backgroundColor: "white" },
					]}
					onTouchStart={closeMenuOnOutsidePress}
				>
					<TouchableOpacity
						onLongPress={() => handleLongPress(item.id)}
						activeOpacity={1}
					>
						<PostSingle
							navigation={navigation}
							item={item}
							ref={PostSingleRef =>
								(cellRef[item.id] = PostSingleRef)
							}
						/>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		);
	};

	return (
		<SafeAreaView style={Styles.appContainer}>
			<FlatList style = {{width:"100%", height: "100%", backgroundColor:"grey"}}
				data={videos}
				maxToRenderPerBatch={10}
				viewabilityConfig={{itemVisiblePercentThreshold: 80}} //this determines how much of the video needs to be in view before it starts playing
				renderItem = {renderItem}
				pagingEnabled //this makes it so that the posts 'snap' instead of just scroll
				keyExtractor={item => item.id}
				decelerationRate={"normal"}
				removeClippedSubviews = {true}
				onViewableItemsChanged={onViewableItemsChanged.current}
				onEndReached={handleEndReached}
				onEndReachedThreshold={0.2} // Trigger load more when 20% from the bottom

				onRefresh={handleRefresh}
				refreshing={isRefreshing}

			/>
		</SafeAreaView>
	);
}
