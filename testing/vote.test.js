import VoteDataService from '../services/vote.service.js';
import http from '../http-common';

jest.mock('../http-common');

describe('VoteDataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll - calls http.get with correct URL', async () => {
    const mockVotes = [/* Mocked array of votes */];

    // Mock http.get
    http.get.mockResolvedValue({ data: mockVotes });

    // Call getAll function
    await VoteDataService.getAll();

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith('/votes');
  });

  test('get - calls http.get with correct URL', async () => {
    const mockId = 123;
    const mockVoteData = { /* Mocked vote data */ };

    // Mock http.get
    http.get.mockResolvedValue({ data: mockVoteData });

    // Call get function
    await VoteDataService.get(mockId);

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith(`/votes/${mockId}`);
  });

  test('getByVidId - calls http.get with correct URL', async () => {
    const mockId = 123;
    const mockVoteData = [/* Mocked array of vote data */];

    // Mock http.get
    http.get.mockResolvedValue({ data: mockVoteData });

    // Call getByVidId function
    await VoteDataService.getByVidId(mockId);

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith(`/votes/vid/${mockId}`);
  });

  // Add more test cases for other functions if needed
});
