import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import ResetPassword from './ResetPassword';

// Mock useParams
const mockUseParams = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockUseParams(),
  };
});

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

describe('ResetPassword', () => {
  beforeEach(() => {
    fetch.mockClear();
    consoleSpy.mockClear();
    mockUseParams.mockReturnValue({ token: 'reset-token-123' });
  });

  test('renders without crashing', () => {
    renderWithRouter(<ResetPassword />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<ResetPassword />);
    const heading = screen.getByRole('heading', { name: /reset your speaker password/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays new password input field', () => {
    renderWithRouter(<ResetPassword />);
    const newPasswordInput = screen.getByLabelText(/new password/i);
    expect(newPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toHaveAttribute('type', 'password');
  });

  test('displays confirm password input field', () => {
    renderWithRouter(<ResetPassword />);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('displays reset password button', () => {
    renderWithRouter(<ResetPassword />);
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    expect(resetButton).toBeInTheDocument();
  });

  test('displays back to sign in link', () => {
    renderWithRouter(<ResetPassword />);
    const signInLink = screen.getByRole('link', { name: /back to sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');
  });

  test('allows user to type in password fields', () => {
    renderWithRouter(<ResetPassword />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword123' } });
    
    expect(newPasswordInput.value).toBe('newPassword123');
    expect(confirmPasswordInput.value).toBe('newPassword123');
  });

  test('successful password reset', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Password reset successfully!' }),
    });

    renderWithRouter(<ResetPassword />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.click(resetButton);
    
    // Should show loading modal
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText(/reseting password/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/reset/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            new_password: 'newPassword123',
            confirm_password: 'newPassword123',
            token: 'reset-token-123',
          }),
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('Password reset successfully!');
    });
  });

  test('handles password reset failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Invalid token' }),
    });

    renderWithRouter(<ResetPassword />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('Invalid token');
    });

    expect(consoleSpy).toHaveBeenCalledWith('error', expect.any(Object));
  });

  test('handles network error during password reset', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<ResetPassword />);
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('data', expect.any(Error));
    });
  });

  test('handles missing detail in error response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unknown error' }),
    });

    renderWithRouter(<ResetPassword />);
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('failed to send email try again later');
    });
  });

  test('uses token from URL params', async () => {
    mockUseParams.mockReturnValue({ token: 'custom-token-456' });
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    renderWithRouter(<ResetPassword />);
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            new_password: '',
            confirm_password: '',
            token: 'custom-token-456',
          }),
        })
      );
    });
  });

  test('form submission prevents default behavior', async () => {
    const mockPreventDefault = vi.fn();
    
    renderWithRouter(<ResetPassword />);
    
    const form = screen.getByRole('button', { name: /reset password/i }).closest('form');
    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test('applies correct container styling', () => {
    renderWithRouter(<ResetPassword />);
    const container = screen.getByRole('heading').closest('div');
    expect(container).toHaveClass('max-w-md', 'mx-auto', 'p-6', 'bg-white', 'rounded-lg', 'shadow-md', 'mt-40', 'mb-20');
  });

  test('heading has correct styling', () => {
    renderWithRouter(<ResetPassword />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-center', 'text-[#2E3A87]');
  });

  test('form has correct styling', () => {
    renderWithRouter(<ResetPassword />);
    const form = screen.getByRole('button', { name: /reset password/i }).closest('form');
    expect(form).toHaveClass('mt-6', 'space-y-4');
  });

  test('password inputs have correct styling', () => {
    renderWithRouter(<ResetPassword />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    expect(newPasswordInput).toHaveClass('w-full', 'mt-1', 'px-4', 'py-2', 'border', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-[#2E3A87]');
    expect(confirmPasswordInput).toHaveClass('w-full', 'mt-1', 'px-4', 'py-2', 'border', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-[#2E3A87]');
  });

  test('reset button has correct styling', () => {
    renderWithRouter(<ResetPassword />);
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    expect(resetButton).toHaveClass('w-full', 'bg-[#2E3A87]', 'text-white', 'py-2', 'rounded-md', 'hover:bg-[#1f2d6f]', 'transition');
  });

  test('back to sign in link has correct styling', () => {
    renderWithRouter(<ResetPassword />);
    const signInLink = screen.getByRole('link', { name: /back to sign in/i });
    expect(signInLink).toHaveClass('block', 'text-center', 'mt-2', 'text-sm', 'text-[#2E3A87]', 'hover:underline', 'cursor-pointer');
  });

  test('labels have correct styling', () => {
    renderWithRouter(<ResetPassword />);
    
    const newPasswordLabel = screen.getByText('New Password', { selector: 'label' });
    const confirmPasswordLabel = screen.getByText('Confirm Password', { selector: 'label' });
    
    expect(newPasswordLabel).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
    expect(confirmPasswordLabel).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
  });

  test('handles empty form submission', async () => {
    renderWithRouter(<ResetPassword />);
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/reset/',
        expect.objectContaining({
          body: JSON.stringify({
            new_password: '',
            confirm_password: '',
            token: 'reset-token-123',
          }),
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

    renderWithRouter(<ResetPassword />);
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    // Should show loading immediately
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  test('input IDs match their purposes', () => {
    renderWithRouter(<ResetPassword />);
    
    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    expect(newPasswordInput).toHaveAttribute('id', 'password');
    expect(newPasswordInput).toHaveAttribute('name', 'newPassword');
    expect(confirmPasswordInput).toHaveAttribute('id', 'confirmPassword');
    expect(confirmPasswordInput).toHaveAttribute('name', 'confirmPassword');
  });

  test('handles missing token in URL params', () => {
    mockUseParams.mockReturnValue({ token: undefined });
    
    renderWithRouter(<ResetPassword />);
    
    const resetButton = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetButton);

    // Should still attempt to make request with undefined token
    expect(fetch).toHaveBeenCalled();
  });
});