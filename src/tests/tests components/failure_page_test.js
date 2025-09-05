import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import FailurePage from './FailurePage';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('FailurePage', () => {
  test('renders without crashing', () => {
    renderWithRouter(<FailurePage />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<FailurePage />);
    const heading = screen.getByRole('heading', { name: /payment failed/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays the failure message', () => {
    renderWithRouter(<FailurePage />);
    const message = screen.getByText(/unfortunately, your payment could not be processed/i);
    expect(message).toBeInTheDocument();
  });

  test('displays additional instruction message', () => {
    renderWithRouter(<FailurePage />);
    const additionalMessage = screen.getByText(/please try again or use a different payment method/i);
    expect(additionalMessage).toBeInTheDocument();
  });

  test('has a link back to pricing page', () => {
    renderWithRouter(<FailurePage />);
    const pricingLink = screen.getByRole('link', { name: /retry payment/i });
    expect(pricingLink).toBeInTheDocument();
    expect(pricingLink).toHaveAttribute('href', '/pricing');
  });

  test('displays the XCircle icon from lucide-react', () => {
    renderWithRouter(<FailurePage />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('applies correct container styling classes', () => {
    renderWithRouter(<FailurePage />);
    const heading = screen.getByRole('heading');
    const container = heading.closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'bg-red-50', 'px-4');
  });

  test('heading has correct styling classes', () => {
    renderWithRouter(<FailurePage />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-red-700', 'mb-2');
  });

  test('paragraph has correct styling classes', () => {
    renderWithRouter(<FailurePage />);
    const paragraph = screen.getByText(/unfortunately, your payment could not be processed/i);
    expect(paragraph).toHaveClass('text-center', 'max-w-md', 'mb-6', 'text-red-800');
  });

  test('retry payment link has correct styling', () => {
    renderWithRouter(<FailurePage />);
    const link = screen.getByRole('link', { name: /retry payment/i });
    expect(link).toHaveClass('px-6', 'py-3', 'bg-red-600', 'text-white', 'rounded-full', 'shadow', 'hover:bg-red-700', 'transition');
  });

  test('XCircle icon has correct styling', () => {
    renderWithRouter(<FailurePage />);
    const iconContainer = document.querySelector('svg').parentElement;
    expect(iconContainer).toHaveClass('text-red-600', 'mb-4');
  });

  test('displays consistent red color theme', () => {
    renderWithRouter(<FailurePage />);
    
    // Check that all elements use red color variants
    const container = screen.getByRole('heading').closest('div');
    const heading = screen.getByRole('heading');
    const paragraph = screen.getByText(/unfortunately, your payment could not be processed/i);
    const link = screen.getByRole('link', { name: /retry payment/i });
    
    expect(container).toHaveClass('bg-red-50');
    expect(heading).toHaveClass('text-red-700');
    expect(paragraph).toHaveClass('text-red-800');
    expect(link).toHaveClass('bg-red-600', 'hover:bg-red-700');
  });

  test('link text content is correct', () => {
    renderWithRouter(<FailurePage />);
    const link = screen.getByRole('link', { name: /retry payment/i });
    expect(link).toHaveTextContent('Retry Payment');
  });
});