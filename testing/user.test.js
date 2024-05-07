import UserDataService from '../services/user.service.js';
import http from '../http-common';

jest.mock('../http-common');

describe('UserDataService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getAll - calls http.get with correct URL', async () => {
    const mockUsers = [/* Mocked array of users */];

    // Mock http.get
    http.get.mockResolvedValue({ data: mockUsers });

    // Call getAll function
    await UserDataService.getAll();

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith('/users');
  });

  test('get - calls http.get with correct URL', async () => {
    const mockId = 123;
    const mockUserData = { /* Mocked user data */ };

    // Mock http.get
    http.get.mockResolvedValue({ data: mockUserData });

    // Call get function
    await UserDataService.get(mockId);

    // Check if http.get was called with the correct URL
    expect(http.get).toHaveBeenCalledWith(`/users/${mockId}`);
  });

  test('create - calls http.post with correct data', async () => {
    const mockUserData = {
      username: 'testUser',
      password: 'testPassword',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      profile_pic: '...',
    };

    // Mock http.post
    http.post.mockResolvedValue({ data: { message: 'User created successfully' } });

    // Call create function
    await UserDataService.create(mockUserData);

    // Check if http.post was called with the correct arguments
    expect(http.post).toHaveBeenCalledWith('/users', mockUserData);
  });

  // Add more test cases for other functions if needed
});
