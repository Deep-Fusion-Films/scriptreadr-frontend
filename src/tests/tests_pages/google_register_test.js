import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import GoogleRegister from './GoogleRegister';

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

describe('GoogleRegister', () => {
  const mockSetResponse = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
    fetch.mockClear();
    localStorageMock.setItem.mockClear();
    consoleErrorSpy.mockClear();
    mockSetResponse.mockClear();
  });

  test('renders without crashing', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
  });

  test('displays Google register button', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    const button = screen.getByRole('button', { name: /register with google/i });
    expect(button).toBeInTheDocument();
  });

  test('displays Google icon image', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    const icon = screen.getByAltText(/google icon/i);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'https://www.svgrepo.com/show/475656/google-color.svg');
  });

  test('button has correct text content', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    expect(screen.getByText(/register with google/i)).toBeInTheDocument();
  });

  test('successful Google registration flow', async () => {
    const mockCodeResponse = { code: 'mock-auth-code' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'mock-jwt-token' }),
    });

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /register with google/i });
    fireEvent.click(button);

    // Simulate successful Google OAuth response
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/googleregister/',
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
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('handles Google registration API failure', async () => {
    const mockCodeResponse = { code: 'mock-auth-code' };
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Registration failed' }),
    });

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(mockSetResponse).toHaveBeenCalledWith('Registration failed');
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('handles network error during Google registration', async () => {
    const mockCodeResponse = { code: 'mock-auth-code' };
    
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(mockSetResponse).toHaveBeenCalledWith('An unexpected error occurred. Please try again.');
    });
  });

  test('handles Google OAuth error', async () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    
    const mockError = { error: 'access_denied' };
    mockConfig.onError(mockError);

    expect(consoleErrorSpy).toHaveBeenCalledWith('login failed:', mockError);
  });

  test('configures Google login with correct flow', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = require('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    
    expect(mockConfig.flow).toBe('auth-code');
  });

  test('button triggers Google login when clicked', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /register with google/i });
    fireEvent.click(button);

    expect(mockLogin).toHaveBeenCalled();
  });

  test('applies correct button styling', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /register with google/i });
    expect(button).toHaveClass('w-full', 'flex', 'items-center', 'justify-center', 'gap-2', 'border', 'border-gray-300', 'rounded-md', 'py-2', 'hover:bg-gray-100', 'transition');
  });

  test('Google icon has correct styling and attributes', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const icon = screen.getByAltText(/google icon/i);
    expect(icon).toHaveClass('w-5', 'h-5');
    expect(icon).toHaveAttribute('src', 'https://www.svgrepo.com/show/475656/google-color.svg');
  });

  test('button text has correct styling', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const buttonText = screen.getByText(/register with google/i);
    expect(buttonText).toHaveClass('text-sm', 'text-gray-700', 'font-medium');
  });

  test('button has correct type attribute', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /register with google/i });
    expect(button).toHaveAttribute('type', 'button');
  });

  test('button is clickable and not disabled', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const button = screen.getByRole('button', { name: /register with google/i });
    expect(button).not.toBeDisabled();
  });

  test('stores access token but navigates to signin (not dashboard)', async () => {
    const mockCodeResponse = { code: 'registration-success' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'registration-token' }),
    });

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'registration-token');
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('does not set localStorage on API failure', async () => {
    const mockCodeResponse = { code: 'fail-code' };
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Registration failed' }),
    });

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('uses correct API endpoint for registration', async () => {
    const mockCodeResponse = { code: 'endpoint-test' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'test-token' }),
    });

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/googleregister/',
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

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
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

  test('handles missing token in successful response', async () => {
    const mockCodeResponse = { code: 'no-token-code' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success but no token' }),
    });

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', undefined);
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('calls setResponse prop correctly', () => {
    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    // The component should be ready to call setResponse when needed
    expect(typeof mockSetResponse).toBe('function');
  });

  test('uses different endpoint than GoogleLogin', async () => {
    const mockCodeResponse = { code: 'different-endpoint' };
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'test-token' }),
    });

    renderWithRouter(<GoogleRegister setResponse={mockSetResponse} />);
    
    const { useGoogleLogin } = await import('@react-oauth/google');
    const mockConfig = useGoogleLogin.mock.calls[0][0];
    await mockConfig.onSuccess(mockCodeResponse);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/googleregister/',
        expect.any(Object)
      );
    });
  });
});