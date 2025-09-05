import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import AccountDeleteConfirm from './AccountDeleteConfirm';

// Mock the AuthContext
const mockSetToken = vi.fn();
const mockUseToken = vi.fn(() => ({ setToken: mockSetToken }));
vi.mock('../store/AuthContext', () => ({
  useToken: () => mockUseToken(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock utility functions
const mockCheckAuthToken = vi.fn();
const mockLogout = vi.fn();
vi.mock('../util', () => ({
  checkAuthToken: mockCheckAuthToken,
  logout: mockLogout,
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

describe('AccountDeleteConfirm', () => {
  beforeEach(() => {
    mockSetToken.mockClear();
    mockNavigate.mockClear();
    mockCheckAuthToken.mockClear();
    mockLogout.mockClear();
    fetch.mockClear();
    consoleSpy.mockClear();
    
    // Setup default mock return values
    mockUseToken.mockReturnValue({ setToken: mockSetToken });
    mockCheckAuthToken.mockResolvedValue('fake-token');
    mockLogout.mockResolvedValue(undefined);
  });

  test('renders without crashing', () => {
    renderWithRouter(<AccountDeleteConfirm />);
  });

  test('displays the main heading', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const heading = screen.getByRole('heading', { name: /ready to delete your account/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays subscription cancellation warning', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const warning = screen.getByText(/please ensure you have cancelled any active subscriptions/i);
    expect(warning).toBeInTheDocument();
  });

  test('displays list of items to be deleted', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    
    expect(screen.getByText(/your account and login credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/all your saved scripts/i)).toBeInTheDocument();
    expect(screen.getByText(/all essential cookies/i)).toBeInTheDocument();
    expect(screen.getByText(/associated personal data in our systems/i)).toBeInTheDocument();
  });

  test('displays irreversible action warning', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const warning = screen.getByText(/this action is irreversible/i);
    expect(warning).toBeInTheDocument();
  });

  test('displays feedback form initially', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    
    expect(screen.getByLabelText(/we'd love your feedback before you leave/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/let us know why you are deleting your account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
  });

  test('allows user to type in feedback textarea', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const textarea = screen.getByPlaceholderText(/let us know why you are deleting your account/i);
    
    fireEvent.change(textarea, { target: { value: 'Not using the service anymore' } });
    expect(textarea.value).toBe('Not using the service anymore');
  });

  test('submits feedback and shows thank you message', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const textarea = screen.getByPlaceholderText(/let us know why you are deleting your account/i);
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    
    fireEvent.change(textarea, { target: { value: 'Test feedback' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByText(/thank you for your feedback!/i)).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('Feedback submitted:', 'Test feedback');
  });

  test('hides feedback form after submission', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    
    fireEvent.click(submitButton);
    
    expect(screen.queryByLabelText(/we'd love your feedback/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /submit feedback/i })).not.toBeInTheDocument();
  });

  test('displays delete account button', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const deleteButton = screen.getByRole('button', { name: /proceed to delete account/i });
    expect(deleteButton).toBeInTheDocument();
  });

  test('displays back to home button', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const homeButton = screen.getByRole('button', { name: /back to home/i });
    expect(homeButton).toBeInTheDocument();
  });

  test('navigates to home when back button is clicked', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const homeButton = screen.getByRole('button', { name: /back to home/i });
    
    fireEvent.click(homeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('successful account deletion flow', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Account deleted successfully' }),
    });

    renderWithRouter(<AccountDeleteConfirm />);
    const deleteButton = screen.getByRole('button', { name: /proceed to delete account/i });
    
    fireEvent.click(deleteButton);
    
    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText(/deleting your account/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockCheckAuthToken).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/delete_user/',
        {
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer fake-token',
          },
        }
      );
      expect(mockLogout).toHaveBeenCalledWith(mockSetToken);
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('handles account deletion failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Deletion failed' }),
    });

    renderWithRouter(<AccountDeleteConfirm />);
    const deleteButton = screen.getByRole('button', { name: /proceed to delete account/i });
    
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/accountdeletefailed');
    });
  });

  test('handles network error during deletion', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<AccountDeleteConfirm />);
    const deleteButton = screen.getByRole('button', { name: /proceed to delete account/i });
    
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/accountdeletefailed');
    });
  });

  test('handles missing auth token', async () => {
    mockCheckAuthToken.mockResolvedValueOnce(null);

    renderWithRouter(<AccountDeleteConfirm />);
    const deleteButton = screen.getByRole('button', { name: /proceed to delete account/i });
    
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockSetToken).toHaveBeenCalledWith(null);
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('applies correct container styling', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const container = screen.getByRole('heading').closest('div').parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'bg-gray-50', 'p-4');
  });

  test('applies correct card styling', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const card = screen.getByRole('heading').closest('div');
    expect(card).toHaveClass('max-w-md', 'w-full', 'bg-white', 'rounded-xl', 'shadow-lg', 'p-6', 'space-y-6');
  });

  test('warning text has correct styling', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const warning = screen.getByText(/please ensure you have cancelled any active subscriptions/i);
    expect(warning).toHaveClass('text-center', 'text-red-600', 'font-semibold');
  });

  test('delete button has correct styling', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const deleteButton = screen.getByRole('button', { name: /proceed to delete account/i });
    expect(deleteButton).toHaveClass('block', 'w-full', 'bg-red-600', 'text-white', 'py-2', 'rounded-md', 'text-center', 'hover:bg-red-700', 'transition');
  });

  test('back to home button has correct styling', () => {
    renderWithRouter(<AccountDeleteConfirm />);
    const homeButton = screen.getByRole('button', { name: /back to home/i });
    expect(homeButton).toHaveClass('block', 'w-full', 'bg-gray-300', 'text-gray-800', 'py-2', 'rounded-md', 'text-center', 'hover:bg-gray-400', 'transition');
  });
});