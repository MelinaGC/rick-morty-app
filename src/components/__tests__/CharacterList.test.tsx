import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CharacterList from '../CharacterList';
import { Character } from '@/types';
import * as api from '@/utils/api';

const mockCharacters: Character[] = [
    {
        id: 1,
        name: 'Rick Sanchez',
        image: '/rick.png',
        status: 'Alive',
        species: 'Human',
        episode: ['https://...'],
    },
    {
        id: 2,
        name: 'Morty Smith',
        image: '/morty.png',
        status: 'Alive',
        species: 'Human',
        episode: ['https://...'],
    },
];

describe('CharacterList', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders initial characters', () => {
    render(
      <CharacterList
        onSelect={jest.fn()}
        selectedCharacter={null}
        initialCharacters={mockCharacters}
      />
    );

    expect(screen.getByText(mockCharacters[0].name)).toBeInTheDocument();
    expect(screen.getByText(mockCharacters[1].name)).toBeInTheDocument();
  });

  it('calls onSelect when a character is clicked', () => {
    const onSelect = jest.fn();

    render(
      <CharacterList
        onSelect={onSelect}
        selectedCharacter={null}
        initialCharacters={mockCharacters}
      />
    );

    fireEvent.click(screen.getByText(mockCharacters[0].name));

    expect(onSelect).toHaveBeenCalledWith(mockCharacters[0]);
  });

  it('disables characters in the disabledCharacters prop', () => {
    render(
      <CharacterList
        onSelect={jest.fn()}
        selectedCharacter={null}
        initialCharacters={mockCharacters}
        disabledCharacters={[1]}
      />
    );

    const disabledButton = screen.getByRole('button', { name: /rick sanchez/i });
    expect(disabledButton).toBeDisabled();
  });

  it('disables "Prev" button on first page', () => {
    render(
      <CharacterList
        onSelect={jest.fn()}
        selectedCharacter={null}
        initialCharacters={mockCharacters}
      />
    );

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('disables "Next" button on last page', () => {
    render(
      <CharacterList
        onSelect={jest.fn()}
        selectedCharacter={null}
        initialCharacters={mockCharacters}
        totalPages={1}
      />
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('fetches new characters when page changes and shows loading', async () => {
    const fetchCharactersMock = jest.spyOn(api, 'fetchCharacters').mockImplementation(() =>
      Promise.resolve({
        results: [
          {
            id: 3,
            name: 'Summer Smith',
            image: '/summer.png',
            status: 'Alive',
            species: 'Human',
            episode: [],
          },
        ],
        info: {
          count: 1,
          pages: 1,
          next: null,
          prev: null,
        },
      })
    );

    render(
      <CharacterList
        onSelect={jest.fn()}
        selectedCharacter={null}
        initialCharacters={mockCharacters}
        totalPages={2}
      />
    );

    // Initially no loading text
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Loading indicator should show
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenCalledWith(2);
      expect(screen.getByText('Summer Smith')).toBeInTheDocument();
    });

    // Loading should disappear after fetch
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('shows error message on fetch failure and hides characters', async () => {
    const fetchCharactersMock = jest.spyOn(api, 'fetchCharacters').mockRejectedValue(new Error('Network error'));

    render(
      <CharacterList
        onSelect={jest.fn()}
        selectedCharacter={null}
        initialCharacters={mockCharacters}
        totalPages={2}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenCalledWith(2);
      expect(screen.getByText(/failed to load characters/i)).toBeInTheDocument();
    });

    // Characters should be hidden when error is present
    mockCharacters.forEach(char => {
      expect(screen.queryByText(char.name)).not.toBeInTheDocument();
    });
  });
});