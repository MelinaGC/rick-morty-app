import { useEffect, useState } from "react";

import CharacterCard from "./CharacterCard";

import { Character } from "@/types";
import { fetchCharacters } from "@/utils/api";

type CharacterListProps = {
  onSelect: (char: Character) => void;
  selectedCharacter: Character | null;
  disabledCharacters?: number[];
  initialCharacters?: Character[];
  totalPages?: number;
};

const CharacterList = ({ onSelect, selectedCharacter, disabledCharacters = [], initialCharacters = [],
  totalPages = 1, }: CharacterListProps) => {
  const [characters, setCharacters] = useState<Character[]>(initialCharacters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page === 1) {
      setCharacters(initialCharacters);
      setError(null);
    } else {
      const fetch = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchCharacters(page);
          setCharacters(data.results);
        } catch (err) {
          console.error(err);
          setError("Failed to load characters. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetch();
    }
    ;
  }, [page, initialCharacters]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && (
        <p className="text-red-500 font-medium mb-2">{error}</p>
      )}
      {!loading && !error && <div className="grid grid-cols-2 gap-4">
        {characters.map(char => (
          <CharacterCard
            key={char.id}
            character={char}
            onSelect={onSelect}
            selected={selectedCharacter?.id === char.id}
            disabled={disabledCharacters.includes(char.id)}
          />
        ))}
      </div>}
      <div className="mt-2 flex space-x-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${page === 1
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          Prev
        </button>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${page === totalPages
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CharacterList;