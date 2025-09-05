import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import AccountDeleteFailed from './AccountDeleteFailed';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AccountDeleteFailed', () => {
  test('renders without crashing', () => {
    renderWithRouter(<AccountDeleteFailed />);
  });

  test('displays the main heading', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const heading = screen.getByRole('heading', { name: /account deletion failed/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays the main error message', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const message = screen.getByText(/we encountered an issue while trying to delete your account/i);
    expect(message).toBeInTheDocument();
  });

  test('displays instruction message', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const instruction = screen.getByText(/please try again later or contact support if the issue persists/i);
    expect(instruction).toBeInTheDocument();
  });

  test('has try again link pointing to account delete confirm', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const tryAgainLink = screen.getByRole('link', { name: /try again/i });
    expect(tryAgainLink).toBeInTheDocument();
    expect(tryAgainLink).toHaveAttribute('href', '/accountdeleteconfirm');
  });

  test('has back to home link', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('applies correct container styling', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const container = screen.getByRole('heading').closest('div').parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50', 'p-4');
  });

  test('applies correct card styling', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const card = screen.getByRole('heading').closest('div');
    expect(card).toHaveClass('max-w-md', 'w-full', 'bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'space-y-6', 'text-center');
  });

  test('heading has correct styling', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-red-600');
  });

  test('error messages have correct styling', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const errorMessage = screen.getByText(/we encountered an issue while trying to delete your account/i);
    const instructionMessage = screen.getByText(/please try again later or contact support/i);
    
    expect(errorMessage).toHaveClass('text-gray-700');
    expect(instructionMessage).toHaveClass('text-gray-700');
  });

  test('try again link has correct styling', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const tryAgainLink = screen.getByRole('link', { name: /try again/i });
    expect(tryAgainLink).toHaveClass('block', 'w-full', 'bg-blue-600', 'text-white', 'py-2', 'rounded-md', 'text-center', 'hover:bg-blue-700', 'transition');
  });

  test('back to home link has correct styling', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toHaveClass('block', 'w-full', 'bg-gray-300', 'text-gray-800', 'py-2', 'rounded-md', 'text-center', 'hover:bg-gray-400', 'transition');
  });

  test('uses semantic HTML structure', () => {
    renderWithRouter(<AccountDeleteFailed />);
    
    const heading = screen.getByRole('heading');
    const links = screen.getAllByRole('link');
    
    expect(heading.tagName.toLowerCase()).toBe('h1');
    expect(links).toHaveLength(2); // try again and back to home
  });

  test('displays all expected text content', () => {
    renderWithRouter(<AccountDeleteFailed />);
    
    expect(screen.getByText('Account Deletion Failed')).toBeInTheDocument();
    expect(screen.getByText('We encountered an issue while trying to delete your account.')).toBeInTheDocument();
    expect(screen.getByText('Please try again later or contact support if the issue persists.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  test('content is centered as specified in styling', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const card = screen.getByRole('heading').closest('div');
    expect(card).toHaveClass('text-center');
  });

  test('maintains consistent error color theme', () => {
    renderWithRouter(<AccountDeleteFailed />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-red-600');
    
    // Other text should be neutral gray, not red
    const errorMessage = screen.getByText(/we encountered an issue/i);
    expect(errorMessage).toHaveClass('text-gray-700');
  });

  test('has proper link accessibility', () => {
    renderWithRouter(<AccountDeleteFailed />);
    
    const tryAgainLink = screen.getByRole('link', { name: /try again/i });
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    
    expect(tryAgainLink).toHaveAccessibleName();
    expect(homeLink).toHaveAccessibleName();
  });

  test('card has proper spacing structure', () => {
    renderWithRouter(<AccountDeleteFailed />);
    const card = screen.getByRole('heading').closest('div');
    expect(card).toHaveClass('space-y-6');
  });

  test('links are full width as designed', () => {
    renderWithRouter(<AccountDeleteFailed />);
    
    const tryAgainLink = screen.getByRole('link', { name: /try again/i });
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    
    expect(tryAgainLink).toHaveClass('w-full', 'block');
    expect(homeLink).toHaveClass('w-full', 'block');
  });

  test('error message structure is logical', () => {
    renderWithRouter(<AccountDeleteFailed />);
    
    // Check that heading comes first, then messages, then action buttons
    const card = screen.getByRole('heading').closest('div');
    const elements = Array.from(card.children);
    
    expect(elements[0]).toContainElement(screen.getByRole('heading'));
    expect(elements[elements.length - 2]).toContainElement(screen.getByRole('link', { name: /try again/i }));
    expect(elements[elements.length - 1]).toContainElement(screen.getByRole('link', { name: /back to home/i }));
  });
});