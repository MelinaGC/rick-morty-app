import { Episode } from "@/types";

type EpisodeColumnProps = {
  title: string;
  episodes: Episode[];
};

const EpisodeColumn = ({ title, episodes }: EpisodeColumnProps) => (
  <div>
    <h3 className="font-bold mb-2">{title}</h3>
    <ul>
      {episodes.map(ep => (
        <li key={ep.id}>
          <span className="font-semibold">{ep.name}</span> - <i>{ep.air_date}</i>
        </li>
      ))}
    </ul>
  </div>
);

export default EpisodeColumn;