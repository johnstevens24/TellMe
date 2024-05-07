import OptionDataService from '../services/option.service.js';
import http from '../http-common';

jest.mock('../http-common');

describe('OptionDataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll - calls http.get with correct URL', async () => {
    const mockOptions = [/* Mocked array of options */];

    // Mock http.get
    http.get.mockResolvedValue({ data: mockOptions });

    // Call getAll function
    await OptionDataService.getAll();

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith('/options');
  });

  test('get - calls http.get with correct URL', async () => {
    const mockId = 123;
    const mockOptionData = { /* Mocked option data */ };

    // Mock http.get
    http.get.mockResolvedValue({ data: mockOptionData });

    // Call get function
    await OptionDataService.get(mockId);

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith(`/options/${mockId}`);
  });

  test('create - calls http.post with correct data', async () => {
    const mockOptionData = {
      option: 'Option A',
      video_id: 123,
    };

    // Mock http.post
    http.post.mockResolvedValue({ data: mockOptionData });

    // Call create function
    await OptionDataService.create(mockOptionData);

    // Check if http.post was called with the correct arguments
    expect(http.post).toHaveBeenCalledWith('/options', mockOptionData);
  });

  // Add more test cases for other functions if needed
});
