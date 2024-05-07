import FollowUpDataService from '../services/followup.service.js';
import http from '../http-common';

jest.mock('../http-common');

describe('FollowUpDataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll - calls http.get with correct URL', async () => {
    const mockFollowUps = [/* Mocked array of follow ups */];

    // Mock http.get
    http.get.mockResolvedValue({ data: mockFollowUps });

    // Call getAll function
    await FollowUpDataService.getAll();

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith('/followups');
  });

  test('get - calls http.get with correct URL', async () => {
    const mockId = 123;
    const mockFollowUpData = { /* Mocked follow up data */ };

    // Mock http.get
    http.get.mockResolvedValue({ data: mockFollowUpData });

    // Call get function
    await FollowUpDataService.get(mockId);

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith(`/followups/${mockId}`);
  });

  test('create - calls http.post with correct data', async () => {
    const mockFollowUpData = {
      datePosted: '2024-02-27',
      userId: 123,
      videoId: 456,
      followupData: 'Follow up data',
      thumbnail: 'Thumbnail data',
      chosenId: 789,
    };

    // Mock http.post
    http.post.mockResolvedValue({ data: mockFollowUpData });

    // Call create function
    await FollowUpDataService.create(mockFollowUpData);

    // Check if http.post was called with the correct arguments
    expect(http.post).toHaveBeenCalledWith('/followups', mockFollowUpData);
  });

  // Add more test cases for other functions if needed
});
