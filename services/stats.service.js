import http from "../http-common";

class StatsDataService {
    // Unsure of a better way to name this, but it finds of the videos they voted on, which were chosen in folloups 
    // "15% of your votes were successfully chosen!"
    findProportionVotedCorrectly(userId) {
      return http.get(`/stats/correctlyVoted/${userId}`);
    }
  
    // Say something like "you are the 5th most active user on TellMe!"
    findUserRanking(userId) {
      return http.get(`/stats/userRanking/${userId}`);
    }

    // Number of polls the user has voted on
    // "You have voted on X number of videos!"
    findTimesVoted(userId) {
      return http.get(`/stats/timesVoted/${userId}`);
    }

    // Say something like "Your videos have recieved X votes!"
    findNumVotesOnVideos(userId) {
      return http.get(`/stats/numVotedOnUserPolls/${userId}`);
    }
  
    // "X is the most popular topic on TellMe"
    findMostPopularTopicOnTellMe() {
      return http.get(`/stats/topTopic`);
    }
  
    // "X is your most voted on (or favorite) topic!"
    // May return null. If so, just say N/A or don't show at all. 
    findFavTopic(userId) {
      return http.get(`/stats/topTopicByUser/${userId}`);
    }
  
  }
  
  export default new StatsDataService();