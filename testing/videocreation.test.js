import VideoDataService from '../services/video.service.js';
import http from '../http-common';

jest.mock('../http-common');

describe('VideoDataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('create - calls http.post with correct data', async () => {
    const mockVideoData = {
      datePosted: '2024-02-27',
      userId: 123,
      videoData: '...',
      pollType: 'multipleChoice',
      pollQuestion: 'Which option do you prefer?',
      endDate: '2024-03-27',
      thumbnail: '...',
      topic: 'React Testing',
    };

    // Mock http.post
    http.post.mockResolvedValue({ data: mockVideoData });

    // Call create function
    const createdVideo = await VideoDataService.create(mockVideoData);

    // Check if http.post was called with the correct arguments
    expect(http.post).toHaveBeenCalledWith('/videos', mockVideoData);

    // Check if the returned data matches the expected data
    expect(createdVideo.data).toEqual(mockVideoData);
  });

  test('getTopicVids - calls http.get with correct URL', async () => {
    const mockTopic = 'React Testing';
    const mockVideoData = [/* Mocked array of video data */];

    // Mock http.get
    http.get.mockResolvedValue({ data: mockVideoData });

    // Call getTopicVids function
    await VideoDataService.getTopicVids(mockTopic);

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith(`/videos/topics/${mockTopic}`);
  });

  test('getVideo - calls http.get with correct URL', async () => {
    const mockId = 123;
    const mockVideoData = { /* Mocked video data */ };

    // Mock http.get
    http.get.mockResolvedValue({ data: mockVideoData });

    // Call getVideo function
    await VideoDataService.getVideo(mockId);

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith(`/videos/${mockId}`);
  });
});