import { render, screen, fireEvent } from '@testing-library/react';
import CharacterCard from '../CharacterCard';
import { Character } from '@/types';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [],
};

describe('CharacterCard', () => {
  test('renders character name, status and species', () => {
    render(<CharacterCard character={mockCharacter} onSelect={() => {}} selected={false} disabled={false} />);
    
    expect(screen.getByText(mockCharacter.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockCharacter.status} - ${mockCharacter.species}`)).toBeInTheDocument();
  });

  test('applies selected border style when selected', () => {
    const { container } = render(<CharacterCard character={mockCharacter} onSelect={() => {}} selected={true} disabled={false} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('border-blue-500');
  });

  test('applies disabled style and disables button when disabled', () => {
    const { container } = render(<CharacterCard character={mockCharacter} onSelect={() => {}} selected={false} disabled={true} />);
    const button = container.querySelector('button');
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
    expect(button).toBeDisabled();
  });

  test('calls onSelect when clicked and not disabled', () => {
    const onSelect = jest.fn();
    render(<CharacterCard character={mockCharacter} onSelect={onSelect} selected={false} disabled={false} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(mockCharacter);
  });

  test('does not call onSelect when clicked and disabled', () => {
    const onSelect = jest.fn();
    render(<CharacterCard character={mockCharacter} onSelect={onSelect} selected={false} disabled={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onSelect).not.toHaveBeenCalled();
  });
});