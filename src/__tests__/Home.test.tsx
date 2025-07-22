import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Character } from '@/types';
import * as episodeUtils from '@/utils/episodes';
import Home from '../pages';

const mockCharacters: Character[] = [
  {
    id: 1,
    name: 'Rick Sanchez',
    image: '/rick.png',
    status: 'Alive',
    species: 'Human',
    episode: ['1', '2'],
  },
  {
    id: 2,
    name: 'Morty Smith',
    image: '/morty.png',
    status: 'Alive',
    species: 'Human',
    episode: ['2', '3'],
  },
];

const mockEpisodes = {
  shared: [
    { id: 2, name: 'Ep2', air_date: '2020', episode: '', characters: [], url: '', created: '' },
  ],
  only1: [
    { id: 1, name: 'Ep1', air_date: '2020', episode: '', characters: [], url: '', created: '' },
  ],
  only2: [
    { id: 3, name: 'Ep3', air_date: '2020', episode: '', characters: [], url: '', created: '' },
  ],
};

jest.mock('@/utils/api', () => ({
  fetchCharacters: jest.fn(),
}));

describe('Home page', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders static title and structure', () => {
    render(<Home initialCharacters={mockCharacters} totalPages={1} />);
    expect(screen.getByText(/Rick and Morty Character Episodes/i)).toBeInTheDocument();
    expect(screen.getAllByText('+')).toHaveLength(1);
    expect(screen.getByText('Character #1')).toBeInTheDocument();
    expect(screen.getByText('Character #2')).toBeInTheDocument();
  });

  it('displays episode columns after selecting both characters', async () => {
    jest.spyOn(episodeUtils, 'fetchEpisodeDifferences').mockResolvedValue(mockEpisodes);

    render(<Home initialCharacters={mockCharacters} totalPages={1} />);

    const rickButtons = screen.getAllByRole('button', { name: /rick sanchez/i });
    const mortyButtons = screen.getAllByRole('button', { name: /morty smith/i });

    fireEvent.click(rickButtons[0]);
    fireEvent.click(mortyButtons[1]);

    // Loading indicator appears first
    expect(screen.getByText(/loading episodes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading episodes/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Character #1 - Only Episodes/i)).toBeInTheDocument();
      expect(screen.getByText(/Characters #1 & #2 - Shared Episodes/i)).toBeInTheDocument();
      expect(screen.getByText(/Character #2 - Only Episodes/i)).toBeInTheDocument();

      expect(screen.getByText('Ep1')).toBeInTheDocument();
      expect(screen.getByText('Ep2')).toBeInTheDocument();
      expect(screen.getByText('Ep3')).toBeInTheDocument();
    });
  });

  it('displays error message when episode fetch fails', async () => {
    jest.spyOn(episodeUtils, 'fetchEpisodeDifferences').mockRejectedValue(new Error('API Error'));

    render(<Home initialCharacters={mockCharacters} totalPages={1} />);

    const rickButtons = screen.getAllByRole('button', { name: /rick sanchez/i });
    const mortyButtons = screen.getAllByRole('button', { name: /morty smith/i });

    fireEvent.click(rickButtons[0]);
    fireEvent.click(mortyButtons[1]);

    // Loading indicator appears first
    expect(screen.getByText(/loading episodes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/loading episodes/i)).not.toBeInTheDocument();
      expect(screen.getByText(/failed to load episode data/i)).toBeInTheDocument();

      // Episode columns should NOT be shown on error
      expect(screen.queryByText(/Character #1 - Only Episodes/i)).not.toBeInTheDocument();
    });
  });

  it('disables opposite character when one is selected', () => {
    render(<Home initialCharacters={mockCharacters} totalPages={1} />);

    const rickButtons = screen.getAllByRole('button', { name: /rick sanchez/i });
    const mortyButtons = screen.getAllByRole('button', { name: /morty smith/i });

    fireEvent.click(rickButtons[0]);
    expect(mortyButtons[1]).not.toBeDisabled();

    fireEvent.click(mortyButtons[1]);
    expect(rickButtons[1]).toBeDisabled();
  });
});