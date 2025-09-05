import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Signup from './Signup';

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

vi.mock('./GoogleRegister', () => ({
  default: vi.fn(({ setResponse }) => (
    <button onClick={() => setResponse('Google register clicked')}>Google Register</button>
  )),
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

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Signup', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    fetch.mockClear();
  });

  test('renders without crashing', () => {
    renderWithRouter(<Signup />);
  });

  test('displays the correct heading', () => {
    renderWithRouter(<Signup />);
    const heading = screen.getByRole('heading', { name: /create your account/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays registration instruction', () => {
    renderWithRouter(<Signup />);
    const instruction = screen.getByText(/register with your email/i);
    expect(instruction).toBeInTheDocument();
  });

  test('displays all form fields', () => {
    renderWithRouter(<Signup />);
    
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  test('displays register button', () => {
    renderWithRouter(<Signup />);
    const registerButton = screen.getByRole('button', { name: /register/i });
    expect(registerButton).toBeInTheDocument();
  });

  test('displays terms and conditions link', () => {
    renderWithRouter(<Signup />);
    const termsLink = screen.getByRole('link', { name: /terms and conditions/i });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '/termsofuse');
  });

  test('displays sign in link', () => {
    renderWithRouter(<Signup />);
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/signin');
  });

  test('displays Google Register component', () => {
    renderWithRouter(<Signup />);
    const googleRegister = screen.getByRole('button', { name: /google register/i });
    expect(googleRegister).toBeInTheDocument();
  });

  test('allows user to type in all form fields', () => {
    renderWithRouter(<Signup />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    
    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('successful registration flow', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Registration successful' }),
    });

    renderWithRouter(<Signup />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    fireEvent.click(registerButton);
    
    // Should show loading modal
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText(/signing you up please wait/i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/register/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            confirm_password: 'password123',
          }),
        }
      );
      
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  test('handles registration failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Email already exists' }),
    });

    renderWithRouter(<Signup />);
    
    const emailInput = screen.getByLabelText(/email address/i);
    const registerButton = screen.getByRole('button', { name: /register/i });
    
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('Email already exists');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('handles network error during registration', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<Signup />);
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByTestId('response-message')).toHaveTextContent('An error occured, please try again later.');
    });
  });

  test('form submission prevents default behavior', async () => {
    const mockPreventDefault = vi.fn();
    
    renderWithRouter(<Signup />);
    
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test('Google Register integration works', () => {
    renderWithRouter(<Signup />);
    
    const googleButton = screen.getByRole('button', { name: /google register/i });
    fireEvent.click(googleButton);
    
    expect(screen.getByTestId('response-message')).toHaveTextContent('Google register clicked');
  });

  test('applies correct container styling', () => {
    renderWithRouter(<Signup />);
    const container = screen.getByRole('heading').closest('div');
    expect(container).toHaveClass('max-w-lg', 'mx-auto', 'p-6', 'bg-white', 'rounded-lg', 'shadow-md', 'mt-20', 'mb-20');
  });

  test('heading has correct styling', () => {
    renderWithRouter(<Signup />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-center', 'text-[#2E3A87]');
  });

  test('instruction text has correct styling', () => {
    renderWithRouter(<Signup />);
    const instruction = screen.getByText(/register with your email/i);
    expect(instruction).toHaveClass('text-center', 'text-sm', 'text-gray-600', 'mt-1');
  });

  test('form has correct styling', () => {
    renderWithRouter(<Signup />);
    const form = screen.getByRole('button', { name: /register/i }).closest('form');
    expect(form).toHaveClass('mt-6', 'space-y-4');
  });

  test('name fields grid has correct styling', () => {
    renderWithRouter(<Signup />);
    const nameGrid = screen.getByLabelText(/first name/i).closest('.grid');
    expect(nameGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'gap-4');
  });

  test('input fields have correct styling', () => {
    renderWithRouter(<Signup />);
    
    const inputs = [
      screen.getByLabelText(/first name/i),
      screen.getByLabelText(/last name/i),
      screen.getByLabelText(/email address/i),
      screen.getByLabelText(/^password$/i),
      screen.getByLabelText(/confirm password/i),
    ];
    
    inputs.forEach(input => {
      expect(input).toHaveClass('w-full', 'mt-1', 'px-4', 'py-2', 'border', 'rounded-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-[#2E3A87]');
    });
  });

  test('register button has correct styling', () => {
    renderWithRouter(<Signup />);
    const registerButton = screen.getByRole('button', { name: /register/i });
    expect(registerButton).toHaveClass('block', 'text-center', 'w-full', 'bg-[#2E3A87]', 'text-white', 'py-2', 'rounded-md', 'hover:bg-[#1f2d6f]', 'transition');
  });

  test('terms link has correct styling', () => {
    renderWithRouter(<Signup />);
    const termsLink = screen.getByRole('link', { name: /terms and conditions/i });
    expect(termsLink).toHaveClass('text-[#2E3A87]', 'hover:underline', 'cursor-pointer');
  });

  test('sign in link has correct styling', () => {
    renderWithRouter(<Signup />);
    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toHaveClass('text-[#2E3A87]', 'hover:underline', 'cursor-pointer');
  });

  test('labels have correct styling', () => {
    renderWithRouter(<Signup />);
    
    const labels = screen.getAllByText(/first name|last name|email address|password|confirm password/i)
      .filter(el => el.tagName.toLowerCase() === 'label');
    
    labels.forEach(label => {
      expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
    });
  });

  test('terms text has correct styling', () => {
    renderWithRouter(<Signup />);
    const termsText = screen.getByText(/by creating an account, you agree to our/i);
    expect(termsText).toHaveClass('text-sm', 'text-gray-600');
  });

  test('sign in prompt has correct styling', () => {
    renderWithRouter(<Signup />);
    const signInPrompt = screen.getByText(/already have an account/i);
    expect(signInPrompt).toHaveClass('text-sm', 'text-center', 'mt-2', 'text-gray-600');
  });

  test('divider has correct styling', () => {
    renderWithRouter(<Signup />);
    const dividerContainer = screen.getByText(/or register with/i).closest('div');
    expect(dividerContainer).toHaveClass('flex', 'items-center', 'my-4');
  });

  test('input types are correct', () => {
    renderWithRouter(<Signup />);
    
    expect(screen.getByLabelText(/first name/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/last name/i)).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText(/confirm password/i)).toHaveAttribute('type', 'password');
  });

  test('handles empty form submission', async () => {
    renderWithRouter(<Signup />);
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/register/',
        expect.objectContaining({
          body: JSON.stringify({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            confirm_password: '',
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

    renderWithRouter(<Signup />);
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    // Should show loading immediately
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  test('displays agreement to terms text', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByText(/by creating an account, you agree to our/i)).toBeInTheDocument();
  });

  test('displays already have account prompt', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  test('displays divider text', () => {
    renderWithRouter(<Signup />);
    expect(screen.getByText(/or register with/i)).toBeInTheDocument();
  });

  test('component uses correct API endpoint', async () => {
    renderWithRouter(<Signup />);
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/user/register/',
        expect.any(Object)
      );
    });
  });

  test('maps form fields to API payload correctly', async () => {
    renderWithRouter(<Signup />);
    
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    
    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({
            first_name: 'Jane',
            last_name: 'Smith',
            email: '',
            password: '',
            confirm_password: '',
          }),
        })
      );
    });
  });
});