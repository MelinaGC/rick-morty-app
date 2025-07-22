import { useState, useEffect } from 'react';

import EpisodeColumn from '@/components/EpisodeColumn';
import CharacterList from '@/components/CharacterList';

import { Character, Episode } from '@/types';
import { fetchEpisodeDifferences } from '@/utils/episodes';

type HomeProps = {
  initialCharacters: Character[];
  totalPages: number;
};

export default function Home({ initialCharacters, totalPages }: HomeProps) {
  const [char1, setChar1] = useState<Character | null>(null);
  const [char2, setChar2] = useState<Character | null>(null);

  const [only1, setOnly1] = useState<Episode[]>([]);
  const [shared, setShared] = useState<Episode[]>([]);
  const [only2, setOnly2] = useState<Episode[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (char1 && char2) {
      const fetchEpisodes = async () => {
        setLoading(true);
        setError(null);
        try {
          const { shared, only1, only2 } = await fetchEpisodeDifferences(char1, char2);
          setShared(shared);
          setOnly1(only1);
          setOnly2(only2);
        } catch (err) {
          console.error(err);
          setError("Failed to load episode data");
          setShared([]);
          setOnly1([]);
          setOnly2([]);
        } finally {
          setLoading(false);
        }
      };

      fetchEpisodes();
    }
  }, [char1, char2]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Rick and Morty Character Episodes</h1>

      <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
        <div className="text-center font-bold">Character #1</div>
        <div className="text-center font-bold text-4xl">+</div>
        <div className="text-center font-bold">Character #2</div>

        <CharacterList onSelect={setChar1} selectedCharacter={char1} disabledCharacters={char2 ? [char2.id] : []} initialCharacters={initialCharacters}
          totalPages={totalPages} />
        <div />
        <CharacterList onSelect={setChar2} selectedCharacter={char2} disabledCharacters={char1 ? [char1.id] : []} initialCharacters={initialCharacters}
          totalPages={totalPages} />
      </div>

      {loading && <p className="mt-8">Loading episodes...</p>}
      {error && <p className="mt-8 text-red-500 font-semibold">{error}</p>}

      {!loading && !error && char1 && char2 && (
        <div className="grid grid-cols-3 gap-4 mt-8">
          <EpisodeColumn title="Character #1 - Only Episodes" episodes={only1} />
          <EpisodeColumn title="Characters #1 & #2 - Shared Episodes" episodes={shared} />
          <EpisodeColumn title="Character #2 - Only Episodes" episodes={only2} />
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('https://rickandmortyapi.com/api/character?page=1');
  const data = await res.json();

  return {
    props: {
      initialCharacters: data.results,
      totalPages: data.info.pages,
    },
    revalidate: 3600,
  };
}