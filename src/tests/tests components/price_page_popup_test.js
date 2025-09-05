import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import PricePagePopUp from './PricePagePopUp';

describe('PricePagePopUp', () => {
  const mockSetIsFree = vi.fn();

  beforeEach(() => {
    mockSetIsFree.mockClear();
  });

  test('renders when isFree is true', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('does not render when isFree is false', () => {
    render(<PricePagePopUp isFree={false} setIsFree={mockSetIsFree} text="Test message" />);
    
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  test('displays the correct text prop', () => {
    const testText = "Your subscription is now active!";
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text={testText} />);
    
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  test('displays different text when prop changes', () => {
    const { rerender } = render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="First message" />);
    expect(screen.getByText('First message')).toBeInTheDocument();
    
    rerender(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Second message" />);
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });

  test('displays close button with X icon', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    expect(closeButton).toBeInTheDocument();
  });

  test('close button has correct aria-label', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const closeButton = screen.getByLabelText('Cancel');
    expect(closeButton).toBeInTheDocument();
  });

  test('calls setIsFree with false when close button is clicked', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(closeButton);
    
    expect(mockSetIsFree).toHaveBeenCalledWith(false);
    expect(mockSetIsFree).toHaveBeenCalledTimes(1);
  });

  test('applies correct overlay styling', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const overlay = screen.getByText('Test message').closest('div').parentElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black/50', 'rounded-md');
  });

  test('applies correct modal styling', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const modal = screen.getByText('Test message').closest('div');
    expect(modal).toHaveClass('relative', 'bg-white', 'p-6', 'rounded', 'shadow-lg', 'text-center', 'w-80');
  });

  test('close button has correct styling', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    expect(closeButton).toHaveClass('absolute', 'top-2', 'right-2', 'cursor-pointer', 'text-gray-500', 'hover:text-gray-700', 'text-2xl');
  });

  test('text has correct styling', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const text = screen.getByText('Test message');
    expect(text).toHaveClass('mb-4', 'text-lg', 'font-semibold');
  });

  test('renders X icon from react-icons', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    // React icons render as SVGs
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('handles empty text prop', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="" />);
    
    const textElement = screen.getByText('');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass('mb-4', 'text-lg', 'font-semibold');
  });

  test('handles undefined text prop gracefully', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} />);
    
    // Should still render the modal structure
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    expect(closeButton).toBeInTheDocument();
  });

  test('close button is focusable and clickable', () => {
    render(<PricePagePopUp isFree={true} setIsFree={mockSetIsFree} text="Test message" />);
    
    const closeButton = screen.getByRole('button', { name: /cancel/i });
    expect(closeButton).not.toBeDisabled();
    closeButton.focus();
    expect(closeButton).toHaveFocus();
  });
});