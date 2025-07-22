import { fetchEpisodeDifferences } from '@/utils/episodes';
import { fetchEpisodesByIds } from '@/utils/api';
import { Episode, Character } from '@/types';

jest.mock('@/utils/api', () => ({
  fetchEpisodesByIds: jest.fn(),
}));

const mockedFetchEpisodesByIds = fetchEpisodesByIds as jest.MockedFunction<typeof fetchEpisodesByIds>;

describe('fetchEpisodeDifferences', () => {
  const mockEpisodes = (ids: number[]): Episode[] =>
    ids.map(id => ({
      id,
      name: `Episode ${id}`,
      air_date: `2020-01-${id}`,
      episode: `S01E${id}`,
      characters: [],
      url: `https://rickandmortyapi.com/api/episode/${id}`,
      created: '',
    }));

  const char1: Character = {
    id: 1,
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    image: '',
    episode: [
      'https://rickandmortyapi.com/api/episode/1',
      'https://rickandmortyapi.com/api/episode/2',
      'https://rickandmortyapi.com/api/episode/3',
    ],
  };

  const char2: Character = {
    id: 2,
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    image: '',
    episode: [
      'https://rickandmortyapi.com/api/episode/2',
      'https://rickandmortyapi.com/api/episode/3',
      'https://rickandmortyapi.com/api/episode/4',
    ],
  };

  it('returns correct shared and unique episodes', async () => {
    mockedFetchEpisodesByIds.mockImplementation(async (ids: number[]) => mockEpisodes(ids));

    const { shared, only1, only2 } = await fetchEpisodeDifferences(char1, char2);

    expect(mockedFetchEpisodesByIds).toHaveBeenCalledTimes(3);
    expect(shared.map(e => e.id)).toEqual([2, 3]);
    expect(only1.map(e => e.id)).toEqual([1]);
    expect(only2.map(e => e.id)).toEqual([4]);
  });
});