import { render, screen } from '@testing-library/react';
import EpisodeColumn from '../EpisodeColumn';
import { Episode } from '@/types';

const mockEpisodes: Episode[] = [
  {
    id: 1,
    name: 'Pilot',
    air_date: 'December 2, 2013',
  },
  {
    id: 2,
    name: 'Lawnmower Dog',
    air_date: 'December 9, 2013',
  },
];

describe('EpisodeColumn', () => {
  it('renders the given title', () => {
    render(<EpisodeColumn title="Shared Episodes" episodes={mockEpisodes} />);
    expect(screen.getByText('Shared Episodes')).toBeInTheDocument();
  });

  it('renders each episode with name and air date', () => {
    render(<EpisodeColumn title="Episodes" episodes={mockEpisodes} />);

    mockEpisodes.forEach(ep => {
      expect(screen.getByText(ep.name)).toBeInTheDocument();
      expect(screen.getByText(ep.air_date)).toBeInTheDocument();
    });
  });

  it('renders nothing if episodes array is empty', () => {
    render(<EpisodeColumn title="Empty" episodes={[]} />);

    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
