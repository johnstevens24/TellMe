import { Video, ResizeMode } from "expo-av";
import Ionicons from "react-native-vector-icons/FontAwesome5";
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from "react";
import {
	View,
	TouchableOpacity,
} from "react-native";
import Styles from "../../styles/HomeStyle";

export const PostSingle = forwardRef(({item, navigation}, parentRef) => {
	const ref = useRef(null);
  
	useImperativeHandle(parentRef, () => ({
		play,
		unload,
		stop
	}));

	useEffect(() => {
		return () => {
			unload();
		};
	}, []);


	const play = async () => {
		if(ref.current == null){
			return;
		}
		const status = await ref.current.getStatusAsync();
		if(status?.isPlaying){
			return;
		}
		else {
			try{
				await ref.current.playAsync();
			} catch (e) {
				console.log(e);
			}
		}
	};

	const stop = async () => {
		if(ref.current == null){
			return;
		}
		const status = await ref.current.getStatusAsync();
		if(!status?.isPlaying){
			return;
		}
		else {
			try{
				await ref.current.stopAsync();
			} catch (e) {
				console.log(e);
			}
		}
	};

	const unload = async () => {
		if(ref.current == null){
			return;
		}
		try{
			await ref.current.unloadAsync();
		} catch (e) {
			console.log(e);
		}
        
	};

  
	return (
		<View style={{ height: "100%" }}>
			<View style={Styles.homeContainer}>
				<Video
					ref={ref}
					style={Styles.homeVideo}
					source={{ uri: "https://d1vhss43jk7wen.cloudfront.net/" + item.video_data }}
					fullscreen={false}
					resizeMode={ResizeMode.COVER}
					useNativeControls={true}
					shouldPlay={false}
					isLooping={true}
				/>
			</View>
			<TouchableOpacity
				style={Styles.pollButton}
				onPress={() => navigation.navigate("Poll", { videoId: item.id, pollType: item.poll_type, question: item.poll_question })}
				underlayColor="#fff"
			>
				<Ionicons style={Styles.pollIcon} name={"vote-yea"} />
			</TouchableOpacity>
		</View>
	);
});

export default React.memo(PostSingle);