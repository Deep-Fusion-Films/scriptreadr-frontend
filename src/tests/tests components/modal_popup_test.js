import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ModalPopUp from './ModalPopUp';

describe('ModalPopUp', () => {
  test('renders when isLoading is true', () => {
    render(<ModalPopUp isLoading={true} text="Loading..." />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('does not render when isLoading is false', () => {
    render(<ModalPopUp isLoading={false} text="Loading..." />);
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('displays the correct text prop', () => {
    const testText = "Processing your request...";
    render(<ModalPopUp isLoading={true} text={testText} />);
    
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  test('displays different text when prop changes', () => {
    const { rerender } = render(<ModalPopUp isLoading={true} text="First message" />);
    expect(screen.getByText('First message')).toBeInTheDocument();
    
    rerender(<ModalPopUp isLoading={true} text="Second message" />);
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });

  test('displays loading spinner when isLoading is true', () => {
    render(<ModalPopUp isLoading={true} text="Loading..." />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  test('applies correct overlay styling', () => {
    render(<ModalPopUp isLoading={true} text="Loading..." />);
    
    const overlay = screen.getByText('Loading...').closest('div').parentElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black/50', 'rounded-md');
  });

  test('applies correct modal styling', () => {
    render(<ModalPopUp isLoading={true} text="Loading..." />);
    
    const modal = screen.getByText('Loading...').closest('div');
    expect(modal).toHaveClass('relative', 'bg-white', 'p-6', 'rounded-2xl', 'shadow-lg', 'text-center', 'w-80');
  });

  test('text has correct styling', () => {
    render(<ModalPopUp isLoading={true} text="Loading..." />);
    
    const text = screen.getByText('Loading...');
    expect(text).toHaveClass('mb-4', 'text-lg', 'font-semibold');
  });

  test('spinner has correct styling', () => {
    render(<ModalPopUp isLoading={true} text="Loading..." />);
    
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-12', 'w-12', 'mx-auto', 'mb-2', 'border-4', 'border-t-4', 'border-gray-200', 'border-t-blue-500', 'rounded-full', 'animate-spin');
  });

  test('handles empty text prop', () => {
    render(<ModalPopUp isLoading={true} text="" />);
    
    const textElement = screen.getByText('');
    expect(textElement).toBeInTheDocument();
    expect(textElement).toHaveClass('mb-4', 'text-lg', 'font-semibold');
  });

  test('handles undefined text prop gracefully', () => {
    render(<ModalPopUp isLoading={true} />);
    
    // Should still render the modal structure even without text
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});