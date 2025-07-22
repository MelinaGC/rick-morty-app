import { fetchCharacters, fetchEpisodesByIds } from '../api';

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchCharacters', () => {
    beforeEach(() => mockFetch.mockReset())

    it('fetches characters from the correct URL and returns JSON', async () => {
        const mockResponse = {
            info: { pages: 1 },
            results: [{ id: 1, name: 'Rick Sanchez' }],
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as Response);

        const result = await fetchCharacters(1);
        expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/character?page=1');
        expect(result).toEqual(mockResponse);
    });

    it('throws an error if response is not ok', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
        } as Response);

        await expect(fetchCharacters(1)).rejects.toThrow('Failed to fetch characters');
    });
});

describe('fetchEpisodesByIds', () => {
    beforeEach(() => mockFetch.mockReset())
 it('fetches episodes by IDs and returns JSON', async () => {
    const mockEpisodes = [{ id: 1, name: 'Episode 1' }, { id: 2, name: 'Episode 2' }];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockEpisodes,
    } as Response);

    const result = await fetchEpisodesByIds([1, 2]);
    expect(mockFetch).toHaveBeenCalledWith('https://rickandmortyapi.com/api/episode/1,2');
    expect(result).toEqual(mockEpisodes);
  });

  it('throws an error if response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    await expect(fetchEpisodesByIds([1, 2])).rejects.toThrow('Failed to fetch episodes');
  });
});