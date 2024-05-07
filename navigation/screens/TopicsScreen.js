import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import Styles from "../../styles/TopicsStyle";
import Ionicons from "react-native-vector-icons/Ionicons";

class Topic {
  constructor(id, name, icon, color) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.color = color;
  }
}

export default function TopicsScreen({ navigation }) {
  const topic1 = new Topic(1, "clothing", "shirt-outline", "#fffacc");
  const topic2 = new Topic(2, "health", "fitness-outline", "#ffd4d4");
  const topic3 = new Topic(3, "relationship", "people-outline", "#d6fff5");
  const topic4 = new Topic(4, "travel", "airplane-outline", "#e3e2ff");
  const topic5 = new Topic(5, "pets", "paw-outline", "#dcffba");
  const topic6 = new Topic(6, "education", "school-outline", "#fee1ff");
  const topic7 = new Topic(7, "business", "briefcase-outline", "#ffd4d4");
  const topic8 = new Topic(8, "music", "headset-outline", "#f0ffb4");
  const topic9 = new Topic(9, "gaming", "game-controller-outline", "#ffe9d6");
  const topic10 = new Topic(10, "crafts", "cut-outline", "#ccffda");
  const topic11 = new Topic(11, "red flags", "flag-outline", "#e3e2ff");
  const topic12 = new Topic(12, "exercise", "barbell-outline", "#ddf7ff");
  const topic13 = new Topic(13, "beauty", "rose-outline", "#fee1ff");
  const topic14 = new Topic(14, "nature", "leaf-outline", "#fffacc");
  const topic15 = new Topic(15, "food", "fast-food-outline", "#ffd4d4");

  const topics = [
    topic1, topic2, topic3, topic4, topic5, 
    topic6, topic7, topic8, topic9, topic10,
    topic11, topic12, topic13, topic14, topic15
  ];

  return (
    <SafeAreaView style={Styles.appContainer}>
      <Text style={Styles.headerText}>Select from Popular Topics</Text>
      <ScrollView>
        <View style={Styles.topicContainer}>
          {topics.map((topic) => (
            <TouchableOpacity
              style={[Styles.topicButton, { backgroundColor: topic.color }]}
              key={topic.id}
              underlayColor="#fff"
              onPress={() => navigation.navigate("Topic Feed", {topic: topic.name})}
            >
              <Ionicons style={Styles.topicIcon} name={topic.icon} />
              <Text style={Styles.topicText}>{topic.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
