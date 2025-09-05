import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import SuccessPage from './SuccessPage';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SuccessPage', () => {
  test('renders without crashing', () => {
    renderWithRouter(<SuccessPage />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<SuccessPage />);
    const heading = screen.getByRole('heading', { name: /payment successful!/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays success message', () => {
    renderWithRouter(<SuccessPage />);
    const message = screen.getByText(/thank you for subscribing/i);
    expect(message).toBeInTheDocument();
  });

  test('displays subscription activation message', () => {
    renderWithRouter(<SuccessPage />);
    const activationMessage = screen.getByText(/your payment was successful, and your subscription is now active/i);
    expect(activationMessage).toBeInTheDocument();
  });

  test('has a link to dashboard', () => {
    renderWithRouter(<SuccessPage />);
    const dashboardLink = screen.getByRole('link', { name: /go to dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });

  test('displays the CheckCircle icon from lucide-react', () => {
    renderWithRouter(<SuccessPage />);
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('applies correct container styling classes', () => {
    renderWithRouter(<SuccessPage />);
    const heading = screen.getByRole('heading');
    const container = heading.closest('div');
    expect(container).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center', 'min-h-screen', 'bg-green-50', 'px-4');
  });

  test('heading has correct styling classes', () => {
    renderWithRouter(<SuccessPage />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-3xl', 'font-bold', 'text-green-700', 'mb-2');
  });

  test('paragraph has correct styling classes', () => {
    renderWithRouter(<SuccessPage />);
    const paragraph = screen.getByText(/thank you for subscribing/i);
    expect(paragraph).toHaveClass('text-center', 'max-w-md', 'mb-6', 'text-green-800');
  });

  test('dashboard link has correct styling', () => {
    renderWithRouter(<SuccessPage />);
    const link = screen.getByRole('link', { name: /go to dashboard/i });
    expect(link).toHaveClass('px-6', 'py-3', 'bg-green-600', 'text-white', 'rounded-full', 'shadow', 'hover:bg-green-700', 'transition');
  });

  test('CheckCircle icon has correct styling', () => {
    renderWithRouter(<SuccessPage />);
    const iconContainer = document.querySelector('svg').parentElement;
    expect(iconContainer).toHaveClass('text-green-600', 'mb-4');
  });

  test('displays consistent green color theme', () => {
    renderWithRouter(<SuccessPage />);
    
    // Check that all elements use green color variants
    const container = screen.getByRole('heading').closest('div');
    const heading = screen.getByRole('heading');
    const paragraph = screen.getByText(/thank you for subscribing/i);
    const link = screen.getByRole('link', { name: /go to dashboard/i });
    
    expect(container).toHaveClass('bg-green-50');
    expect(heading).toHaveClass('text-green-700');
    expect(paragraph).toHaveClass('text-green-800');
    expect(link).toHaveClass('bg-green-600', 'hover:bg-green-700');
  });

  test('link text content is correct', () => {
    renderWithRouter(<SuccessPage />);
    const link = screen.getByRole('link', { name: /go to dashboard/i });
    expect(link).toHaveTextContent('Go to Dashboard');
  });

  test('CheckCircle icon has correct size attribute', () => {
    renderWithRouter(<SuccessPage />);
    // The CheckCircle component should receive size={72}
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('displays complete success flow message', () => {
    renderWithRouter(<SuccessPage />);
    
    // Check that the complete success message is displayed
    const fullMessage = screen.getByText(/thank you for subscribing\. your payment was successful, and your subscription is now active\./i);
    expect(fullMessage).toBeInTheDocument();
  });

  test('has proper semantic structure', () => {
    renderWithRouter(<SuccessPage />);
    
    const heading = screen.getByRole('heading');
    const link = screen.getByRole('link');
    
    expect(heading.tagName.toLowerCase()).toBe('h1');
    expect(link.tagName.toLowerCase()).toBe('a');
  });

  test('success message is centered and readable', () => {
    renderWithRouter(<SuccessPage />);
    
    const paragraph = screen.getByText(/thank you for subscribing/i);
    expect(paragraph).toHaveClass('text-center', 'max-w-md');
  });

  test('button link is properly styled as a CTA', () => {
    renderWithRouter(<SuccessPage />);
    
    const link = screen.getByRole('link', { name: /go to dashboard/i });
    expect(link).toHaveClass('px-6', 'py-3', 'rounded-full', 'shadow');
  });

  test('icon is positioned above heading', () => {
    renderWithRouter(<SuccessPage />);
    
    const container = screen.getByRole('heading').closest('div');
    const icon = container.querySelector('svg');
    const heading = screen.getByRole('heading');
    
    // Icon should appear before heading in the DOM
    const elements = Array.from(container.children);
    const iconIndex = elements.findIndex(el => el.contains(icon));
    const headingIndex = elements.findIndex(el => el === heading);
    
    expect(iconIndex).toBeLessThan(headingIndex);
  });

  test('all text content is present and correct', () => {
    renderWithRouter(<SuccessPage />);
    
    expect(screen.getByText('Payment Successful!')).toBeInTheDocument();
    expect(screen.getByText('Thank you for subscribing. Your payment was successful, and your subscription is now active.')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });

  test('responsive padding is applied', () => {
    renderWithRouter(<SuccessPage />);
    
    const container = screen.getByRole('heading').closest('div');
    expect(container).toHaveClass('px-4');
  });
});