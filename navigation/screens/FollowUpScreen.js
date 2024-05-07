import * as React from "react";
import { useState, useEffect } from "react";
import {
    Text,
    View,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    Alert,
    Dimensions,
} from "react-native";
import FollowUpDataService from "../../services/followup.service.js";
import VideoDataService from "../../services/video.service.js";
import PostTile from "../helperClasses/PostTile.js";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Styles from "../../styles/TopicsStyle";
import ReportDataService from "../../services/reports.service.js";

export default function FollowUpScreen({ navigation }) {
    const [content, setContent] = useState(
        <View>
            <Text>Loading...</Text>
        </View>
    );
    const insets = useSafeAreaInsets();
    const tabBarHeight = Math.round(useBottomTabBarHeight());
    const statusBarHeight = Math.round(insets.top);
    let videoIdArr = [];
    let videoDataArr = [];

    // //functions to call when the page is first loaded
    // useEffect(() => {
    //     loadFollowUpPosts();
    // }, []);

    //reloads every time you come back to the page
    useEffect(() => {
        loadFollowUpPosts(); 
    }, [navigation]);

    loadFollowUpPosts = async () => {
        try {
            //currently fetching user posts. Will change to fetch liked posts once that is available
            const posts = await FollowUpDataService.getVotedFollowups(
                globalThis.userID
            );
            if (posts.data.length !== 0) {
                for (let i = 0; i < posts.data.length; i++) {
                    // Currently checking every video individually
                    // Would like to replace with a backend method that takes in a list so it only talks to the database once instead.
                    const reportResults =
                        await ReportDataService.hasReportsCountGreaterThan(
                            posts.data[i].video_id
                        );
                    if (!reportResults.data.hasGreaterThanThreshold) {
                        videoIdArr.push(posts.data[i].video_id);
                    }
                }
                if (videoIdArr.length > 0) {
                    fetchVideoPosts(videoIdArr);
                } else {
                    setContent(
                        <Text style={Styles.headerText}>
                            No Followup Posts Yet
                        </Text>
                    );
                }
            } else
                setContent(
                    <Text style={Styles.headerText}>No Followup Posts Yet</Text>
                );
        } catch (error) {
            console.error("Error fetching user data:", error); // Log any errors that occur
        }
    };

    fetchVideoPosts = async (videoIdArr) => {
        try {
            let tempVideoDataArr = [];
            for (let i = 0; i < videoIdArr.length; i++) {
                let videoData = await VideoDataService.getVideo(videoIdArr[i]);
                tempVideoDataArr.push(videoData.data);
            }
            setContent(PostTile.createTileArray(tempVideoDataArr, navigation));
        } catch (error) {
            console.error("Error fetching user data:", error); // Log any errors that occur
        }
    };

    return (
        <SafeAreaView style={Styles.appContainer}>
            <Text style={Styles.headerText}>Followup Videos</Text>
            <ScrollView
                contentContainerStyle={{
                    width: "100%",
                    height:
                        Dimensions.get("window").height -
                        tabBarHeight -
                        statusBarHeight,
                    paddingTop: "3%",
                    paddingBottom: "3%",
                }}
            >
                {content}
            </ScrollView>
        </SafeAreaView>
    );
}
