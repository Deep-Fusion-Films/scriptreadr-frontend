import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi } from 'vitest';
import CancelSubscription from './CancelSubscription';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

// Mock console.log
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('CancelSubscription', () => {
  test('renders without crashing', () => {
    renderWithRouter(<CancelSubscription />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<CancelSubscription />);
    const heading = screen.getByRole('heading', { name: /subscription cancelled/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays cancellation confirmation message', () => {
    renderWithRouter(<CancelSubscription />);
    const message = screen.getByText(/your subscription has been successfully cancelled/i);
    expect(message).toBeInTheDocument();
  });

  test('displays access expiry date', () => {
    renderWithRouter(<CancelSubscription />);
    const expiryMessage = screen.getByText(/your access will remain until/i);
    expect(expiryMessage).toBeInTheDocument();
    expect(screen.getByText(/31st July 2025/i)).toBeInTheDocument();
  });

  test('displays feedback form initially', () => {
    renderWithRouter(<CancelSubscription />);
    expect(screen.getByLabelText(/we'd love your feedback/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/let us know why you decided to cancel/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
  });

  test('allows user to type in feedback textarea', () => {
    renderWithRouter(<CancelSubscription />);
    const textarea = screen.getByPlaceholderText(/let us know why you decided to cancel/i);
    
    fireEvent.change(textarea, { target: { value: 'Too expensive' } });
    expect(textarea.value).toBe('Too expensive');
  });

  test('submits feedback and shows thank you message', () => {
    renderWithRouter(<CancelSubscription />);
    const textarea = screen.getByPlaceholderText(/let us know why you decided to cancel/i);
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/thank you for your feedback!/i)).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('Feedback submitted:', 'Test feedback');
  });

  test('hides feedback form after submission', () => {
    renderWithRouter(<CancelSubscription />);
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    
    fireEvent.click(submitButton);
    
    expect(screen.queryByLabelText(/we'd love your feedback/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /submit feedback/i })).not.toBeInTheDocument();
  });

  test('has resubscribe link with correct href', () => {
    renderWithRouter(<CancelSubscription />);
    const resubscribeLink = screen.getByRole('link', { name: /resubscribe/i });
    expect(resubscribeLink).toBeInTheDocument();
    expect(resubscribeLink).toHaveAttribute('href', '/pricing');
  });

  test('has back to home link with correct href', () => {
    renderWithRouter(<CancelSubscription />);
    const homeLink = screen.getByRole('link', { name: /back to home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  test('applies correct container styling', () => {
    renderWithRouter(<CancelSubscription />);
    const container = screen.getByRole('heading').closest('div').parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50', 'p-4');
  });

  test('applies correct card styling', () => {
    renderWithRouter(<CancelSubscription />);
    const card = screen.getByRole('heading').closest('div');
    expect(card).toHaveClass('max-w-md', 'w-full', 'bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'space-y-6');
  });

  test('resubscribe link has correct custom styling', () => {
    renderWithRouter(<CancelSubscription />);
    const resubscribeLink = screen.getByRole('link', { name: /resubscribe/i });
    expect(resubscribeLink).toHaveClass('block', 'w-full', 'bg-[#2E3A87]', 'text-white', 'py-2', 'rounded-md', 'text-center', 'transition');
  });
});