import { Episode, Character } from '@/types';
import { fetchEpisodesByIds } from './api';

const extractEpisodeIds = (episodes: string[]): number[] =>
  episodes.map(url => Number(url.split('/').pop()));

export async function fetchEpisodeDifferences(
  char1: Character,
  char2: Character
): Promise<{
  shared: Episode[];
  only1: Episode[];
  only2: Episode[];
}> {
  const episodes1 = extractEpisodeIds(char1.episode);
  const episodes2 = extractEpisodeIds(char2.episode);

  const sharedIds = episodes1.filter(id => episodes2.includes(id));
  const only1Ids = episodes1.filter(id => !sharedIds.includes(id));
  const only2Ids = episodes2.filter(id => !sharedIds.includes(id));

  const [sharedEps, only1Eps, only2Eps] = await Promise.all([
    sharedIds.length ? fetchEpisodesByIds(sharedIds) : [],
    only1Ids.length ? fetchEpisodesByIds(only1Ids) : [],
    only2Ids.length ? fetchEpisodesByIds(only2Ids) : [],
  ]);

  return {
    shared: Array.isArray(sharedEps) ? sharedEps : [sharedEps],
    only1: Array.isArray(only1Eps) ? only1Eps : [only1Eps],
    only2: Array.isArray(only2Eps) ? only2Eps : [only2Eps],
  };
}