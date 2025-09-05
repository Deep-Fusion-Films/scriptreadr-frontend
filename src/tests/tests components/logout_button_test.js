import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import LogOutButton from './LogOutButton';

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

// Mock the logout utility function
const mockLogout = vi.fn();
vi.mock('../util', () => ({
  logout: mockLogout,
}));

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LogOutButton', () => {
  beforeEach(() => {
    mockSetToken.mockClear();
    mockNavigate.mockClear();
    mockLogout.mockClear();
    mockUseToken.mockClear();
    
    // Setup default mock return values
    mockUseToken.mockReturnValue({ setToken: mockSetToken });
    mockLogout.mockResolvedValue(undefined);
  });

  test('renders without crashing', () => {
    renderWithRouter(<LogOutButton />);
  });

  test('displays logout button text', () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Logout');
  });

  test('button has correct styling class', () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toHaveClass('hover:cursor-pointer');
  });

  test('calls logout function when clicked', async () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith(mockSetToken);
    });
  });

  test('navigates to home page after logout', async () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('calls logout and navigate in correct sequence', async () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith(mockSetToken);
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    
    // Verify logout was called before navigate
    expect(mockLogout).toHaveBeenCalledBefore(mockNavigate);
  });

  test('handles logout function rejection gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockLogout.mockRejectedValue(new Error('Logout failed'));
    
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledWith(mockSetToken);
    });
    
    // Should still navigate even if logout fails
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('uses correct token context', () => {
    renderWithRouter(<LogOutButton />);
    
    expect(mockUseToken).toHaveBeenCalled();
  });

  test('button is clickable', () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('type', 'button');
  });

  test('button renders as a button element', () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button.tagName.toLowerCase()).toBe('button');
  });

  test('handles multiple clicks gracefully', async () => {
    renderWithRouter(<LogOutButton />);
    
    const button = screen.getByRole('button', { name: /logout/i });
    
    // Click multiple times rapidly
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    // Should still only call logout once per click
    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledTimes(3);
    });
  });

  test('maintains correct context dependencies', () => {
    renderWithRouter(<LogOutButton />);
    
    // Verify all required hooks and functions are properly mocked and called
    expect(mockUseToken).toHaveBeenCalled();
    
    const button = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(button);
    
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalled();
  });