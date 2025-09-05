import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Contact from './Contact';

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
vi.mock('../util', () => ({
  checkAuthToken: mockCheckAuthToken,
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

describe('Contact', () => {
  beforeEach(() => {
    mockSetToken.mockClear();
    mockNavigate.mockClear();
    mockCheckAuthToken.mockClear();
    fetch.mockClear();
    consoleSpy.mockClear();
    
    // Setup default mock return values
    mockUseToken.mockReturnValue({ setToken: mockSetToken });
    mockCheckAuthToken.mockResolvedValue('fake-token');
  });

  test('renders without crashing', () => {
    renderWithRouter(<Contact />);
  });

  test('displays the main heading', () => {
    renderWithRouter(<Contact />);
    const heading = screen.getByRole('heading', { name: /contact us/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays all form fields', () => {
    renderWithRouter(<Contact />);
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  test('displays submit button', () => {
    renderWithRouter(<Contact />);
    const submitButton = screen.getByRole('button', { name: /send/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('allows user to type in form fields', () => {
    renderWithRouter(<Contact />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(subjectInput.value).toBe('Test Subject');
    expect(messageInput.value).toBe('Test message');
  });

  test('logs form data to console', () => {
    renderWithRouter(<Contact />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    expect(consoleSpy).toHaveBeenCalled();
  });

  test('successful form submission', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ detail: 'Message sent successfully!' }),
    });

    renderWithRouter(<Contact />);
    
    // Fill out