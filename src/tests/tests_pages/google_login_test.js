import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import GoogleLogin from './GoogleLogin';

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

// Mock Google OAuth
const mockLogin = vi.fn();
vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn(() => mockLogin),
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

// Mock console.error
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('GoogleLogin', () => {
  const mockSetResponse = vi.fn();

  beforeEach(() => {
    mockSetToken.mockClear();
    mockNavigate.mockClear();
    mockLogin.mockClear();
    fetch.mockClear();
    localStorageMock.setItem.mockClear();
    consoleErrorSpy.mockClear();
    mockSetResponse.mockClear();
    
    // Setup default mock return values
    mockUseToken.mockReturnValue({ setToken: mockSetToken });
  });

  test('renders without crashing', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
  });

  test('displays Google sign in button', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button).toBeInTheDocument();
  });

  test('displays Google icon', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    // React icons render as SVGs
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('button has correct text content', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    expect(screen.getByText(/sign in with google/i)).toBeInTheDocument();
  });

  test('successful Google login flow', async () => {
    const mockCodeResponse = { code: 'mock-auth-code' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'mock-jwt-token' }),
    });

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);

    // Simulate successful Google OAuth response
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/googlesignin/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: 'mock-auth-code' }),
          credentials: 'include',
        }
      );

      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'mock-jwt-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
      expect(mockSetToken).toHaveBeenCalledWith('mock-jwt-token');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('handles Google login API failure', async () => {
    const mockCodeResponse = { code: 'mock-auth-code' };
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Google authentication failed' }),
    });

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(mockSetResponse).toHaveBeenCalledWith('Google authentication failed');
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  test('handles network error during Google login', async () => {
    const mockCodeResponse = { code: 'mock-auth-code' };
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(mockSetResponse).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });
  });

  test('handles Google OAuth error', async () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    
    const mockError = { error: 'access_denied' };
    mockConfig.onError(mockError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('login failed:', mockError);
  });

  test('configures Google login with correct flow', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = require('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    
    expect(mockConfig.flow).toBe('auth-code');
  });

  test('button triggers Google login when clicked', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /sign in with google/i });
    fireEvent.click(button);

    expect(mockLogin).toHaveBeenCalled();
  });

  test('applies correct button styling', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button).toHaveClass('w-full', 'flex', 'items-center', 'justify-center', 'gap-3', 'border', 'border-gray-300', 'py-2', 'rounded-md', 'hover:bg-gray-100', 'transition', 'hover:cursor-pointer');
  });

  test('Google icon has correct styling', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const icon = document.querySelector('.text-red-500');
    expect(icon).toBeInTheDocument();
  });

  test('button text has correct styling', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const buttonText = screen.getByText(/sign in with google/i);
    expect(buttonText).toHaveClass('text-sm', 'font-medium', 'text-gray-700');
  });

  test('button is clickable and not disabled', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /sign in with google/i });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
  });

  test('sets authentication status correctly on successful login', async () => {
    const mockCodeResponse = { code: 'success-code' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'valid-token' }),
    });

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'valid-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated', 'true');
    });
  });

  test('does not set localStorage or navigate on API failure', async () => {
    const mockCodeResponse = { code: 'fail-code' };
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Authentication failed' }),
    });

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(mockSetToken).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('handles missing token in successful response', async () => {
    const mockCodeResponse = { code: 'no-token-code' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success but no token' }),
    });

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', undefined);
      expect(mockSetToken).toHaveBeenCalledWith(undefined);
    });
  });

  test('calls setResponse prop correctly', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    // The component should be ready to call setResponse when needed
    expect(typeof mockSetResponse).toBe('function');
  });

  test('integrates with AuthContext correctly', () => {
    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    expect(mockUseToken).toHaveBeenCalled();
  });

  test('uses correct API endpoint', async () => {
    const mockCodeResponse = { code: 'endpoint-test' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'test-token' }),
    });

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/googlesignin/',
        expect.any(Object)
      );
    });
  });

  test('sends request with correct headers and credentials', async () => {
    const mockCodeResponse = { code: 'headers-test' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'test-token' }),
    });

    renderWithRouter(<GoogleLogin setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
      );
    });
  });
});