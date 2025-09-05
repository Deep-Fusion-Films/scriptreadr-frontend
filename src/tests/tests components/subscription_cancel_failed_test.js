import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import SubscriptionCancelFailed from './SubscriptionCancelFailed';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SubscriptionCancelFailed', () => {
  test('renders without crashing', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const heading = screen.getByRole('heading', { name: /cancellation failed/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays main error message', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const message = screen.getByText(/we were unable to cancel your subscription/i);
    expect(message).toBeInTheDocument();
  });

  test('displays reason for failure message', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const reasonMessage = screen.getByText(/this may be due to a network issue or a problem with your account/i);
    expect(reasonMessage).toBeInTheDocument();
  });

  test('displays instruction message with support link', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const instructionMessage = screen.getByText(/please try again or contact/i);
    expect(instructionMessage).toBeInTheDocument();
    
    const supportLink = screen.getByRole('link', { name: /support/i });
    expect(supportLink).toBeInTheDocument();
  });

  test('support link has correct href', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const supportLink = screen.getByRole('link', { name: /support/i });
    expect(supportLink).toHaveAttribute('href', '/contact');
  });

  test('has try again button linking to dashboard', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const tryAgainLink = screen.getByRole('link', { name: /try again/i });
    expect(tryAgainLink).toBeInTheDocument();
    expect(tryAgainLink).toHaveAttribute('href', '/dashboard');
  });

  test('has back to home button', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('applies correct container styling', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const container = screen.getByRole('heading').closest('div').parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50', 'p-4');
  });

  test('applies correct card styling', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const card = screen.getByRole('heading').closest('div');
    expect(card).toHaveClass('max-w-md', 'w-full', 'bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'space-y-6');
  });

  test('heading has correct styling', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-center', 'text-red-600');
  });

  test('error messages have correct styling', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const messages = screen.getAllByText(/text-center text-gray-600/);
    
    const mainMessage = screen.getByText(/we were unable to cancel your subscription/i);
    const reasonMessage = screen.getByText(/this may be due to a network issue/i);
    
    expect(mainMessage).toHaveClass('text-center', 'text-gray-600');
    expect(reasonMessage).toHaveClass('text-center', 'text-gray-600');
  });

  test('support link has correct styling', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const supportLink = screen.getByRole('link', { name: /support/i });
    expect(supportLink.querySelector('span')).toHaveClass('text-[#2E3A87]', 'underline');
  });

  test('try again button has correct styling', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const tryAgainButton = screen.getByRole('link', { name: /try again/i });
    expect(tryAgainButton).toHaveClass('block', 'w-full', 'bg-[#2E3A87]', 'text-white', 'py-2', 'rounded-md', 'text-center', 'hover:bg-blue-700', 'transition');
  });

  test('back to home button has correct styling', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    const homeButton = screen.getByRole('link', { name: /back to home/i });
    expect(homeButton).toHaveClass('block', 'w-full', 'bg-gray-300', 'text-gray-800', 'py-2', 'rounded-md', 'text-center', 'hover:bg-gray-400', 'transition');
  });

  test('displays all expected text content', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    
    expect(screen.getByText('Cancellation Failed')).toBeInTheDocument();
    expect(screen.getByText('We were unable to cancel your subscription.')).toBeInTheDocument();
    expect(screen.getByText('This may be due to a network issue or a problem with your account.')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  test('support link is inline within instruction text', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    
    const instructionParagraph = screen.getByText(/please try again or contact/i);
    const supportLink = screen.getByRole('link', { name: /support/i });
    
    // The support link should be within the instruction paragraph
    expect(instructionParagraph).toContainElement(supportLink);
  });

  test('uses semantic HTML structure', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    
    const heading = screen.getByRole('heading');
    const links = screen.getAllByRole('link');
    
    expect(heading.tagName.toLowerCase()).toBe('h1');
    expect(links).toHaveLength(3); // support, try again, back to home
  });

  test('maintains consistent error color theme', () => {
    renderWithRouter(<SubscriptionCancelFailed />);
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-red-600');
    
    // Other text should be neutral gray, not red
    const mainMessage = screen.getByText(/we were unable to cancel/i);
    expect(mainMessage).toHaveClass('text-gray-600');
  });
});