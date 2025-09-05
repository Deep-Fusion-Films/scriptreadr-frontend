import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Signin from './Signin';

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

// Mock the components
vi.mock('../components/ModalPopUp', () => ({
  default: vi.fn(({ isLoading, text }) => 
    isLoading ? <div data-testid="modal">{text}</div> : null
  ),
}));

vi.mock('./GoogleLogin', () => ({
  default: vi.fn(({ setResponse }) => (
    <button onClick={() => setResponse('Google login clicked')}>Google Login</button>
  )),
}));

vi.mock('../components/ResponseMessage', () => ({
  default: vi.fn(({ response }) => 
    response ? <div data-testid="response-message">{response}</div> : null
  ),
}));

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock environment variable
vi.stubEnv('VITE_LOCAL', 'http://localhost:8000');

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Signin', () => {
  beforeEach(() => {
    mockSetToken.mockClear();
    mockNavigate.mockClear();
    fetch.mockClear();
    localStorageMock.setItem.mockClear();
    
    // Setup default mock return values
    mockUseToken.mockReturnValue({ setToken: mockSetToken });
  });

  test('renders without crashing', () => {
    renderWithRouter(<Signin />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<Signin />);
    const heading = screen.getByRole('heading', { name: /sign in with speaker/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays email input field', () => {
    renderWithRouter(<Signin />);
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('displays password input field', () => {
    renderWithRouter(<Signin />);
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('displays sign in button', () => {
    renderWithRouter(<Signin />);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  test('displays forgot password link', () => {
    renderWithRouter(<Signin />);
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgotpassword');
  });

  test('displays register link', () => {
    renderWithRouter(<Signin />);
    const registerLink = screen.getByRole('link', { name: /register for free/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/signup');
  });

  test('displays Google Login component', () => {
    renderWithRouter(<Signin />);
    const googleLogin = screen.getByRole('button', { name: /google login/i });
    expect(googleLogin).toBeInTheDocument();
  });

  test('displays sign in with Google divider', () => {
    renderWithRouter(<Signin />);
    const dividerText = screen.getByText(/or sign in with google/i);
    expect(dividerText).toBeInTheDocument();
  });

  test('allows user to type in form fields', () => {
    renderWithRouter(<Signin />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('successful sign in flow', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'jwt-token-123' }),
    });

    renderWithRouter(<Signin />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(signInButton);
    
    // Should show loading modal
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText(/signing you in please wait/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
          credentials: 'include',
        }
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'jwt-token-123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      expect(mockSetToken).toHaveBeenCalledWith('jwt-token-123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles sign in failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Invalid credentials' }),
    });

    renderWithRouter(<Signin />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('Invalid credentials');
    });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockSetToken).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles network error during sign in', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<Signin />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('An error occured please try again later');
    });
  });

  test('handles missing detail in error response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Unknown error' }),
    });

    renderWithRouter(<Signin />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('Login failed');
    });
  });

  test('form submission prevents default behavior', async () => {
    const mockPreventDefault = vi.fn();
    
    renderWithRouter(<Signin />);
    
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test('Google Login integration works', () => {
    renderWithRouter(<Signin />);
    
    const googleButton = screen.getByRole('button', { name: /google login/i });
    fireEvent.click(googleButton);
    
    expect(screen.getByTestId('response-message')).toHaveTextContent('Google login clicked');
  });

  test('applies correct container styling', () => {
    renderWithRouter(<Signin />);
    const container = screen.getByRole('heading').closest('div').parentElement;
    expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center', 'px-4', 'mb-20');
  });

  test('applies correct card styling', () => {
    renderWithRouter(<Signin />);
    const card = screen.getByRole('heading').closest('div');
    expect(card).toHaveClass('bg-white', 'p-8', 'rounded-2xl', 'shadow-xl', 'w-full', 'max-w-md');
  });

  test('heading has correct styling', () => {
    renderWithRouter(<Signin />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-center', 'mb-6', 'text-[#2E3A87]');
  });

  test('form has correct styling', () => {
    renderWithRouter(<Signin />);
    const form = screen.getByRole('button', { name: /sign in/i }).closest('form');
    expect(form).toHaveClass('space-y-4');
  });

  test('input fields have correct styling', () => {
    renderWithRouter(<Signin />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(emailInput).toHaveClass('mt-1', 'w-full', 'px-4', 'py-2', 'border', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-[#2E3A87]');
    expect(passwordInput).toHaveClass('mt-1', 'w-full', 'px-4', 'py-2', 'border', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-[#2E3A87]');
  });

  test('sign in button has correct styling', () => {
    renderWithRouter(<Signin />);
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toHaveClass('w-full', 'bg-[#2E3A87]', 'text-white', 'py-2', 'rounded-md', 'hover:bg-[#1e2e6f]', 'transition', 'duration-300', 'hover:cursor-pointer');
  });

  test('forgot password link has correct styling', () => {
    renderWithRouter(<Signin />);
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    expect(forgotPasswordLink).toHaveClass('absolute', 'right-0', 'text-sm', 'text-[#2E3A87]', 'hover:underline');
  });

  test('register link has correct styling', () => {
    renderWithRouter(<Signin />);
    const registerLink = screen.getByRole('link', { name: /register for free/i });
    expect(registerLink).toHaveClass('text-[#2E3A87]', 'hover:underline');
  });

  test('password field container has relative positioning', () => {
    renderWithRouter(<Signin />);
    const passwordContainer = screen.getByLabelText(/password/i).closest('.relative');
    expect(passwordContainer).toHaveClass('relative');
  });

  test('labels have correct styling', () => {
    renderWithRouter(<Signin />);
    
    const emailLabel = screen.getByText('Email address', { selector: 'label' });
    const passwordLabel = screen.getByText('Password', { selector: 'label' });
    
    expect(emailLabel).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
    expect(passwordLabel).toHaveClass('text-sm', 'font-medium', 'text-gray-700');
  });

  test('divider styling is correct', () => {
    renderWithRouter(<Signin />);
    
    const dividerContainer = screen.getByText(/or sign in with google/i).closest('div');
    expect(dividerContainer).toHaveClass('flex', 'items-center', 'my-6');
    
    const dividerLines = dividerContainer.querySelectorAll('.flex-grow.h-px.bg-gray-300');
    expect(dividerLines).toHaveLength(2);
  });

  test('register prompt has correct styling', () => {
    renderWithRouter(<Signin />);
    const registerPrompt = screen.getByText(/don't have an account/i);
    expect(registerPrompt).toHaveClass('text-center', 'text-sm', 'text-gray-600', 'mt-4');
  });

  test('handles empty form submission', async () => {
    renderWithRouter(<Signin />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/login/',
        expect.objectContaining({
          body: JSON.stringify({
            email: '',
            password: '',
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
        json: async () => ({ token: 'test-token' }),
      }), 100);
    }));

    renderWithRouter(<Signin />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // Should show loading immediately
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  test('component uses correct API endpoint', async () => {
    renderWithRouter(<Signin />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/login/',
        expect.any(Object)
      );
    });
  });

  test('sends credentials with request', async () => {
    renderWithRouter(<Signin />);
    
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'include',
        })
      );
    });
  });
});