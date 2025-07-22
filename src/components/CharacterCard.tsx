import Image from 'next/image';
import { Character } from "@/types";

type CharacterCardProps = {
  character: Character;
  onSelect: (char: Character) => void;
  selected: boolean;
  disabled: boolean;
};

const CharacterCard = ({ character, onSelect, selected, disabled = false }: CharacterCardProps) => (
  <button 
    onClick={() => onSelect(character)} 
        className={`border p-2 flex cursor-pointer
      ${selected ? 'border-blue-500' : 'border-gray-300'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    disabled={disabled}
  >
    <Image
      src={character.image}
      alt={character.name}
      width={60}
      height={60}
      className="rounded"
    />
    <div className="ml-2">
      <p>{character.name}</p>
      <p className="text-sm text-gray-500">{character.status} - {character.species}</p>
    </div>
  </button>
);

export default CharacterCard;