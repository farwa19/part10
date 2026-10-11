import { render, screen, within } from '@testing-library/react-native';
import RepositoryList from '../RepositoryList';

jest.mock('../useRepositories', () => jest.fn());

import useRepositories from '../useRepositories';

describe('RepositoryList', () => {
  describe('RepositoryList', () => {
    it('renders repository information correctly', async () => {
      const repositories = [
        {
          id: 'jaredpalmer.formik',
          fullName: 'jaredpalmer/formik',
          description: 'Build forms in React, without the tears',
          language: 'TypeScript',
          forksCount: 1619,
          stargazersCount: 21856,
          ratingAverage: 88,
          reviewCount: 3,
          ownerAvatarUrl:
            'https://avatars2.githubusercontent.com/u/4060187?v=4',
        },
        {
          id: 'async-library.react-async',
          fullName: 'async-library/react-async',
          description: 'Flexible promise-based React data loader',
          language: 'JavaScript',
          forksCount: 69,
          stargazersCount: 1760,
          ratingAverage: 72,
          reviewCount: 3,
          ownerAvatarUrl:
            'https://avatars1.githubusercontent.com/u/54310907?v=4',
        },
      ];

      useRepositories.mockReturnValue({
        repositories,
        loading: false,
        error: null,
        refetch: jest.fn(),
      });

      await render(<RepositoryList />);

      const repositoryItems = screen.getAllByTestId('repositoryItem');

      const [firstRepositoryItem] = repositoryItems;

      expect(screen.getByText('jaredpalmer/formik')).toBeTruthy();
      expect(
        screen.getByText('Build forms in React, without the tears')
      ).toBeTruthy();
      expect(screen.getByText('TypeScript')).toBeTruthy();
      expect(within(firstRepositoryItem).getByText('1.6k')).toBeTruthy();
      expect(within(firstRepositoryItem).getByText('21.9k')).toBeTruthy();
      expect(within(firstRepositoryItem).getByText('3')).toBeTruthy();
      expect(within(firstRepositoryItem).getByText('88')).toBeTruthy();
    });
  });
});