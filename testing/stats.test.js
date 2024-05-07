import http from '../http-common.js';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import StatsDataService from '../services/stats.service.js'

describe('stats', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should return "food"', async () => {
    const expectedResponse = {"topic": "food", "topic_count": 6};

    // Mock the HTTP GET request for the '/stats/topTopic' endpoint
    mock.onGet('/stats/topTopic').reply(200, expectedResponse);

    // Make the HTTP GET request
    const response = await http.get('/stats/topTopic');

    // Extract the "topic" value from the response data
    const topic = response.data.topic;

    // Check if the topic value equals "food"
    expect(topic).toEqual("food");
  });

  it('should return the correct proportion of votes', async () => {
    const userId = 1;
    const expectedProportion = 0.16666666666666666;
    const mockResponse = { data: { proportion: expectedProportion } };
  
    // Mock the HTTP GET request for the '/stats/correctlyVoted/user123' endpoint
    mock.onGet(`/stats/correctlyVoted/${userId}`).reply(200, mockResponse);
  
    // Call the service method
    const response = await StatsDataService.findProportionVotedCorrectly(userId);
  
    // Extract the proportion value from the response
    const proportion = response.data.proportion;
  
    // Verify the result
    expect(proportion).toEqual(expectedProportion);
  });

  it('should return the user ranking', async () => {
    const userId = 1;
    const expectedRanking = 1;

    mock.onGet(`/stats/userRanking/${userId}`).reply(200, expectedRanking);

    const ranking = await StatsDataService.findUserRanking(userId);

    expect(ranking.data.ranking).toEqual(expectedRanking);
  });

  it('should return the number of times the user voted', async () => {
    const userId = 1;
    const expectedTimesVoted = 24;

    mock.onGet(`/stats/timesVoted/${userId}`).reply(200, expectedTimesVoted);

    const timesVoted = await StatsDataService.findTimesVoted(userId);

    expect(timesVoted.data.voteCount).toEqual(expectedTimesVoted);
  });

  it('should return the number of votes received on user polls', async () => {
    const userId = 1;
    const expectedNumVotes = 31;

    mock.onGet(`/stats/numVotedOnUserPolls/${userId}`).reply(200, expectedNumVotes);

    const numVotes = await StatsDataService.findNumVotesOnVideos(userId);

    expect(numVotes.data.voteCount).toEqual(expectedNumVotes);
  });

  it('should return the most popular topic on TellMe', async () => {
    const expectedTopic = 'food';

    mock.onGet('/stats/topTopic').reply(200, { topic: expectedTopic });

    const topic = await StatsDataService.findMostPopularTopicOnTellMe();

    expect(topic.data.topic).toEqual(expectedTopic);
  });

  it('should return the favorite topic of the user', async () => {
    const userId = 1;
    const expectedTopic = 'pets';

    mock.onGet(`/stats/topTopicByUser/${userId}`).reply(200, { topic: expectedTopic });

    const topic = await StatsDataService.findFavTopic(userId);

    expect(topic.data.chosen_topic).toEqual(expectedTopic);
  });

  // Add more test cases for other methods
});
