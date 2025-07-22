import { CharactersResponse } from '../types';

const API_BASE = 'https://rickandmortyapi.com/api';

export const fetchCharacters = async (page: number): Promise<CharactersResponse> => {
  const res = await fetch(`${API_BASE}/character?page=${page}`);
  if (!res.ok) throw new Error('Failed to fetch characters');
  return res.json();
};

export const fetchEpisodesByIds = async (ids: number[]) => {
  const res = await fetch(`${API_BASE}/episode/${ids.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch episodes');
  return res.json();
};