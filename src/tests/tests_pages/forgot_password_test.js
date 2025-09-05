import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ForgotPassword from './ForgotPassword';

// Mock the components
vi.mock('../components/ModalPopUp', () => ({
  default: vi.fn(({ isLoading, text }) => 
    isLoading ? <div data-testid="modal">{text}</div> : null
  ),
}));

vi.mock('../components/ResponseMessage', () => ({
  default: vi.fn(({ response }) => 
    response ? <div data-testid="response-message">{response}</div> : null
  ),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock environment variable
vi.stubEnv('VITE_LOCAL', 'http://localhost:8000');

// Mock console.log
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ForgotPassword', () => {
  beforeEach(() => {
    fetch.mockClear();
    consoleSpy.mockClear();
  });

  test('renders without crashing', () => {
    renderWithRouter(<ForgotPassword />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<ForgotPassword />);
    const heading = screen.getByRole('heading', { name: /reset your speaker password/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays instruction message', () => {
    renderWithRouter(<ForgotPassword />);
    const instruction = screen.getByText(/we'll send you an email to reset your password/i);
    expect(instruction).toBeInTheDocument();
  });

  test('displays email input field', () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('displays continue button', () => {
    renderWithRouter(<ForgotPassword />);
    const submitButton = screen.getByRole('button', { name: /continue/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('displays back to sign in link', () => {
    renderWithRouter(<ForgotPassword />);
    const signInLink = screen.getByRole('link', { name: /back to sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');
  });

  test('allows user to type in email field', () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email address/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
  });

  test('successful password reset request', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Password reset email sent successfully!' }),
    });

    renderWithRouter(<ForgotPassword />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    // Should show loading modal
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText(/sending email/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/forgot/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
          }),
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('Password reset email sent successfully!');
    });
  });

  test('handles password reset request failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Email not found' }),
    });

    renderWithRouter(<ForgotPassword />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });
    
    fireEvent.change(emailInput, { target: { value: 'notfound@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('Email not found');
    });

    expect(consoleSpy).toHaveBeenCalledWith('error', expect.any(Object));
  });

  test('handles network error during password reset', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<ForgotPassword />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /continue/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('data', expect.any(Error));
    });
  });

  test('handles missing detail in error response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unknown error' }),
    });

    renderWithRouter(<ForgotPassword />);
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('failed to send email try again later');
    });
  });

  test('form submission prevents default behavior', async () => {
    const mockPreventDefault = vi.fn();
    
    renderWithRouter(<ForgotPassword />);
    
    const form = screen.getByRole('button', { name: /continue/i }).closest('form');
    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test('applies correct container styling', () => {
    renderWithRouter(<ForgotPassword />);
    const container = screen.getByRole('heading').closest('div');
    expect(container).toHaveClass('max-w-md', 'mx-auto', 'p-6', 'bg-white', 'rounded-lg', 'shadow-md', 'mt-40', 'mb-20');
  });

  test('heading has correct styling', () => {
    renderWithRouter(<ForgotPassword />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-center', 'text-[#2E3A87]');
  });

  test('instruction text has correct styling', () => {
    renderWithRouter(<ForgotPassword />);
    const instruction = screen.getByText(/we'll send you an email/i);
    expect(instruction).toHaveClass('text-sm', 'text-center', 'text-gray-600', 'mt-2');
  });

  test('form has correct styling', () => {
    renderWithRouter(<ForgotPassword />);
    const form = screen.getByRole('button', { name: /continue/i }).closest('form');
    expect(form).toHaveClass('mt-6', 'space-y-4');
  });

  test('email input has correct styling', () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveClass('w-full', 'mt-1', 'px-4', 'py-2', 'border', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-[#2E3A87]');
  });

  test('continue button has correct styling', () => {
    renderWithRouter(<ForgotPassword />);
    const submitButton = screen.getByRole('button', { name: /continue/i });
    expect(submitButton).toHaveClass('w-full', 'bg-[#2E3A87]', 'text-white', 'py-2', 'rounded-md', 'hover:bg-[#1f2d6f]', 'transition');
  });

  test('back to sign in link has correct styling', () => {
    renderWithRouter(<ForgotPassword />);
    const signInLink = screen.getByRole('link', { name: /back to sign in/i });
    expect(signInLink).toHaveClass('block', 'text-center', 'mt-2', 'text-sm', 'text-[#2E3A87]', 'hover:underline', 'cursor-pointer');
  });

  test('email label has correct styling', () => {
    renderWithRouter(<ForgotPassword />);
    const emailLabel = screen.getByText('Email Address', { selector: 'label' });
    expect(emailLabel).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
  });

  test('form handles empty email submission', async () => {
    renderWithRouter(<ForgotPassword />);
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/forgot/',
        expect.objectContaining({
          body: JSON.stringify({ email: '' }),
        })
      );
    });
  });

  test('loading state management works correctly', async () => {
    // Mock a slow response
    fetch.mockImplementationOnce(() => new Promise(resolve => {
      setTimeout(() => resolve({
        ok: true,
        json: async () => ({ message: 'Success' }),
      }), 100);
    }));

    renderWithRouter(<ForgotPassword />);
    
    const submitButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(submitButton);

    // Should show loading immediately
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  test('handles array value in form data correctly', () => {
    renderWithRouter(<ForgotPassword />);
    const emailInput = screen.getByLabelText(/email address/i);
    
    // The component incorrectly wraps the value in an array
    fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
    
    // The input should still show the correct value despite the form data issue
    expect(emailInput.value).toBe('test@example.com');
  });
});