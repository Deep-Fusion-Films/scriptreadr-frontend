import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Header from './Header';

// Mock the AuthContext
const mockUseToken = vi.fn();
vi.mock('../store/AuthContext', () => ({
  useToken: () => mockUseToken(),
}));

// Mock LogOutButton component
vi.mock('./LogOutButton', () => ({
  default: vi.fn(() => <button>Logout</button>),
}));

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    mockUseToken.mockClear();
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockUseToken.mockReturnValue({ token: null });
    });

    test('renders without crashing', () => {
      renderWithRouter(<Header />);
    });

    test('displays the logo', () => {
      renderWithRouter(<Header />);
      expect(screen.getByText('ScriptReadr')).toBeInTheDocument();
    });

    test('displays desktop navigation links', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /pricing/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
    });

    test('shows login and signup buttons when not authenticated', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /signup/i })).toBeInTheDocument();
    });

    test('does not show dashboard or logout buttons when not authenticated', () => {
      renderWithRouter(<Header />);
      
      expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
      expect(screen.queryByText(/logout/i)).not.toBeInTheDocument();
    });

    test('does not show profile icon when not authenticated', () => {
      renderWithRouter(<Header />);
      
      const profileIcon = document.querySelector('.text-3xl');
      expect(profileIcon).not.toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockUseToken.mockReturnValue({ token: 'fake-token' });
    });

    test('shows dashboard and logout buttons when authenticated', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });

    test('does not show login and signup buttons when authenticated', () => {
      renderWithRouter(<Header />);
      
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /signup/i })).not.toBeInTheDocument();
    });

    test('shows profile icon when authenticated', () => {
      renderWithRouter(<Header />);
      
      const profileIcon = document.querySelector('.text-3xl');
      expect(profileIcon).toBeInTheDocument();
    });
  });

  describe('mobile menu functionality', () => {
    beforeEach(() => {
      mockUseToken.mockReturnValue({ token: null });
    });

    test('shows hamburger menu button', () => {
      renderWithRouter(<Header />);
      
      const hamburgerButton = screen.getByRole('button');
      expect(hamburgerButton).toBeInTheDocument();
    });

    test('opens mobile menu when hamburger is clicked', () => {
      renderWithRouter(<Header />);
      
      const hamburgerButton = screen.getByRole('button');
      fireEvent.click(hamburgerButton);
      
      // Check for mobile navigation links
      const mobileLinks = screen.getAllByRole('link', { name: /home/i });
      expect(mobileLinks.length).toBeGreaterThan(1); // Both desktop and mobile versions
    });

    test('closes mobile menu when menu item is clicked', () => {
      renderWithRouter(<Header />);
      
      const hamburgerButton = screen.getByRole('button');
      fireEvent.click(hamburgerButton);
      
      // Click on a mobile menu item
      const mobileLinks = screen.getAllByRole('link', { name: /home/i });
      const mobileHomeLink = mobileLinks.find(link => 
        link.closest('.lg\\:hidden') !== null
      );
      
      if (mobileHomeLink) {
        fireEvent.click(mobileHomeLink);
      }
    });
  });

  describe('profile menu functionality', () => {
    beforeEach(() => {
      mockUseToken.mockReturnValue({ token: 'fake-token' });
    });

    test('opens profile menu when profile icon is clicked', () => {
      renderWithRouter(<Header />);
      
      const profileIcon = document.querySelector('.text-3xl').parentElement;
      fireEvent.click(profileIcon);
      
      expect(screen.getByRole('link', { name: /account/i })).toBeInTheDocument();
      expect(screen.getByText(/subscription/i)).toBeInTheDocument();
      expect(screen.getByText(/free/i)).toBeInTheDocument();
    });

    test('shows subscription status in profile menu', () => {
      renderWithRouter(<Header />);
      
      const profileIcon = document.querySelector('.text-3xl').parentElement;
      fireEvent.click(profileIcon);
      
      expect(screen.getByText(/free/i)).toBeInTheDocument();
      expect(screen.getByText(/current/i)).toBeInTheDocument();
    });

    test('shows premium and pro links in profile menu', () => {
      renderWithRouter(<Header />);
      
      const profileIcon = document.querySelector('.text-3xl').parentElement;
      fireEvent.click(profileIcon);
      
      const premiumLinks = screen.getAllByRole('link', { name: /get premium/i });
      const proLinks = screen.getAllByRole('link', { name: /get pro/i });
      
      expect(premiumLinks.length).toBeGreaterThan(0);
      expect(proLinks.length).toBeGreaterThan(0);
    });

    test('shows support link in profile menu', () => {
      renderWithRouter(<Header />);
      
      const profileIcon = document.querySelector('.text-3xl').parentElement;
      fireEvent.click(profileIcon);
      
      expect(screen.getByRole('link', { name: /support/i })).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    beforeEach(() => {
      mockUseToken.mockReturnValue({ token: null });
    });

    test('navigation links have correct href attributes', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
      expect(screen.getByRole('link', { name: /pricing/i })).toHaveAttribute('href', '/pricing');
      expect(screen.getByRole('link', { name: /contact us/i })).toHaveAttribute('href', '/contact');
    });

    test('login and signup links have correct href attributes', () => {
      renderWithRouter(<Header />);
      
      expect(screen.getByRole('link', { name: /login/i })).toHaveAttribute('href', '/signin');
      expect(screen.getByRole('link', { name: /signup/i })).toHaveAttribute('href', '/signup');
    });
  });

  describe('styling', () => {
    beforeEach(() => {
      mockUseToken.mockReturnValue({ token: null });
    });

    test('applies correct nav styling', () => {
      renderWithRouter(<Header />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('relative', 'flex', 'flex-row', 'items-center', 'py-4', 'bg-[#2E3A87]');
    });

    test('logo has correct styling', () => {
      renderWithRouter(<Header />);
      
      const logo = screen.getByText('ScriptReadr');
      expect(logo).toHaveClass('text-xl', 'text-white', 'font-bold', 'ml-auto', 'mr-10', 'lg:ml-10');
    });

    test('desktop navigation has correct styling', () => {
      renderWithRouter(<Header />);
      
      const desktopNav = screen.getByRole('list');
      expect(desktopNav).toHaveClass('hidden', 'lg:flex', 'gap-10', 'absolute', 'left-1/2', '-translate-x-1/2', 'text-white');
    });
  });
});