import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import CancelPage from './CancelPage';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CancelPage', () => {
  test('renders without crashing', () => {
    renderWithRouter(<CancelPage />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<CancelPage />);
    const heading = screen.getByRole('heading', { name: /payment cancelled/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays the cancellation message', () => {
    renderWithRouter(<CancelPage />);
    const message = screen.getByText(/you cancelled the payment process/i);
    expect(message).toBeInTheDocument();
  });

  test('displays additional message about completing subscription', () => {
    renderWithRouter(<CancelPage />);
    const additionalMessage = screen.getByText(/if this was a mistake, you can return and complete your subscription anytime/i);
    expect(additionalMessage).toBeInTheDocument();
  });

  test('has a link back to pricing page', () => {
    renderWithRouter(<CancelPage />);
    const pricingLink = screen.getByRole('link', { name: /return to pricing/i });
    expect(pricingLink).toBeInTheDocument();
    expect(pricingLink).toHaveAttribute('href', '/pricing');
  });

  test('displays the Ban icon from lucide-react', () => {
    renderWithRouter(<CancelPage />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('applies correct container styling classes', () => {
    renderWithRouter(<CancelPage />);
    const heading = screen.getByRole('heading');
    const container = heading.closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'bg-yellow-50', 'px-4');
  });

  test('heading has correct styling classes', () => {
    renderWithRouter(<CancelPage />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-yellow-700', 'mb-2');
  });

  test('paragraph has correct styling classes', () => {
    renderWithRouter(<CancelPage />);
    const paragraph = screen.getByText(/you cancelled the payment process/i);
    expect(paragraph).toHaveClass('text-center', 'max-w-md', 'mb-6', 'text-yellow-800');
  });

  test('return to pricing link has correct styling', () => {
    renderWithRouter(<CancelPage />);
    const link = screen.getByRole('link', { name: /return to pricing/i });
    expect(link).toHaveClass('px-6', 'py-3', 'bg-yellow-600', 'text-white', 'rounded-full', 'shadow', 'hover:bg-yellow-700', 'transition');
  });
});