import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import Home from './Home';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home', () => {
  test('renders without crashing', () => {
    renderWithRouter(<Home />);
  });

  test('displays the main hero heading', () => {
    renderWithRouter(<Home />);
    const heading = screen.getByRole('heading', { name: /bring your scripts to life with deep fusion films' scriptreadr/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays the hero subtext', () => {
    renderWithRouter(<Home />);
    const subtext = screen.getByText(/tool that brings voice and character to your scripts/i);
    expect(subtext).toBeInTheDocument();
  });

  test('displays Get Started button linking to sign in', () => {
    renderWithRouter(<Home />);
    const getStartedButton = screen.getByRole('link', { name: /get started/i });
    expect(getStartedButton).toBeInTheDocument();
    expect(getStartedButton).toHaveAttribute('href', '/signin');
  });

  test('displays Watch Demo button', () => {
    renderWithRouter(<Home />);
    const watchDemoButton = screen.getByRole('button', { name: /watch demo/i });
    expect(watchDemoButton).toBeInTheDocument();
  });

  test('displays "Everything you need in one place" section heading', () => {
    renderWithRouter(<Home />);
    const sectionHeading = screen.getByRole('heading', { name: /everything you need in one place/i });
    expect(sectionHeading).toBeInTheDocument();
  });

  test('displays all four feature cards in "Everything you need" section', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByRole('heading', { name: /ai script suggestions/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /listen to your scripts/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /export and share/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /collaborative tools/i })).toBeInTheDocument();
  });

  test('displays feature descriptions in "Everything you need" section', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/get real time ideas and fixes to your scripts/i)).toBeInTheDocument();
    expect(screen.getByText(/no need to spend hours reading your scripts/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf final draft or web links in seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/invite editors and co-writers easily/i)).toBeInTheDocument();
  });

  test('displays "How it works" section heading', () => {
    renderWithRouter(<Home />);
    const howItWorksHeading = screen.getByRole('heading', { name: /how it works/i });
    expect(howItWorksHeading).toBeInTheDocument();
  });

  test('displays all four steps in "How it works" section', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByRole('heading', { name: /sign up in seconds/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /upload your scripts or use a template/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /listen, write, edit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /export and pitch/i })).toBeInTheDocument();
  });

  test('displays step descriptions in "How it works" section', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/in order to use this tool you need to be signed in/i)).toBeInTheDocument();
    expect(screen.getByText(/import your already pre-written scripts or use one of the templates/i)).toBeInTheDocument();
    expect(screen.getByText(/listen to your script, adjust your script for your desired outcome/i)).toBeInTheDocument();
    expect(screen.getByText(/satisfied\? export your script and pitch to your stake holders/i)).toBeInTheDocument();
  });

  test('hero section has correct styling', () => {
    renderWithRouter(<Home />);
    const heroSection = screen.getByRole('heading', { name: /bring your scripts to life/i }).closest('section');
    expect(heroSection).toHaveClass('text-white', 'h-[60vh]', 'flex', 'flex-col', 'justify-center', 'items-center', 'text-center');
  });

  test('hero title and subtitle have correct styling', () => {
    renderWithRouter(<Home />);
    const titleContainer = screen.getByRole('heading', { name: /bring your scripts to life/i }).closest('div');
    expect(titleContainer).toHaveClass('text-2xl', 'font-bold', 'mb-4');
  });

  test('Get Started button has correct styling', () => {
    renderWithRouter(<Home />);
    const getStartedButton = screen.getByRole('link', { name: /get started/i }).querySelector('button');
    expect(getStartedButton).toHaveClass('bg-[#2E3A87]', 'text-white', 'px-6', 'py-2', 'rounded', 'hover:cursor-pointer');
  });

  test('Watch Demo button has correct styling', () => {
    renderWithRouter(<Home />);
    const watchDemoButton = screen.getByRole('button', { name: /watch demo/i });
    expect(watchDemoButton).toHaveClass('text-white', 'border', 'border-[#2E3A87]', 'hover:cursor-pointer', 'text-[#2E3A87]', 'px-6', 'py-2', 'rounded');
  });

  test('button container has correct styling', () => {
    renderWithRouter(<Home />);
    const buttonContainer = screen.getByRole('link', { name: /get started/i }).parentElement;
    expect(buttonContainer).toHaveClass('flex', 'gap-4');
  });

  test('feature sections have correct styling', () => {
    renderWithRouter(<Home />);
    const featuresSection = screen.getByRole('heading', { name: /everything you need in one place/i }).closest('section');
    expect(featuresSection).toHaveClass('py-12', 'px-6');
  });

  test('feature section headings have correct styling', () => {
    renderWithRouter(<Home />);
    const featureHeading = screen.getByRole('heading', { name: /everything you need in one place/i });
    expect(featureHeading).toHaveClass('text-white', 'text-center', 'text-2xl', 'font-bold', 'mb-8');
  });

  test('feature grids have correct styling', () => {
    renderWithRouter(<Home />);
    const featureGrid = screen.getByRole('heading', { name: /ai script suggestions/i }).closest('.grid');
    expect(featureGrid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
  });

  test('feature cards have correct styling', () => {
    renderWithRouter(<Home />);
    const featureCard = screen.getByRole('heading', { name: /ai script suggestions/i }).closest('div');
    expect(featureCard).toHaveClass('bg-white', 'shadow-md', 'p-6', 'rounded', 'lg:p-15');
  });

  test('feature card headings have correct styling', () => {
    renderWithRouter(<Home />);
    const cardHeading = screen.getByRole('heading', { name: /ai script suggestions/i });
    expect(cardHeading).toHaveClass('text-lg', 'font-semibold', 'mb-2');
  });

  test('feature card descriptions have correct styling', () => {
    renderWithRouter(<Home />);
    const cardDescription = screen.getByText(/get real time ideas and fixes to your scripts/i);
    expect(cardDescription).toHaveClass('text-sm', 'text-gray-600');
  });

  test('how it works section has correct styling', () => {
    renderWithRouter(<Home />);
    const howItWorksSection = screen.getByRole('heading', { name: /how it works/i }).closest('section');
    expect(howItWorksSection).toHaveClass('py-12', 'px-6', 'mb-20');
  });

  test('mentions key product features', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/ai powered script reading/i)).toBeInTheDocument();
    expect(screen.getByText(/formats and polish your scripts like a pro/i)).toBeInTheDocument();
    expect(screen.getByText(/voice and character to your scripts/i)).toBeInTheDocument();
  });

  test('mentions Deep Fusion Films branding', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/deep fusion films' scriptreadr/i)).toBeInTheDocument();
  });

  test('uses semantic HTML structure', () => {
    renderWithRouter(<Home />);
    
    const sections = document.querySelectorAll('section');
    expect(sections).toHaveLength(3); // Hero, features, how it works
    
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(8); // Multiple headings throughout
  });

  test('responsive grid classes are applied', () => {
    renderWithRouter(<Home />);
    
    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4');
    });
  });

  test('all feature cards are properly structured', () => {
    renderWithRouter(<Home />);
    
    const featureCards = document.querySelectorAll('.bg-white.shadow-md');
    expect(featureCards).toHaveLength(8); // 4 features + 4 how-it-works steps
    
    featureCards.forEach(card => {
      const heading = card.querySelector('h2');
      const description = card.querySelector('p');
      expect(heading).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });

  test('mentions specific functionality', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/real time ideas and fixes/i)).toBeInTheDocument();
    expect(screen.getByText(/pdf final draft/i)).toBeInTheDocument();
    expect(screen.getByText(/web links/i)).toBeInTheDocument();
    expect(screen.getByText(/templates available/i)).toBeInTheDocument();
  });

  test('addresses user workflow', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/sign up in seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/upload your scripts/i)).toBeInTheDocument();
    expect(screen.getByText(/listen, write, edit/i)).toBeInTheDocument();
    expect(screen.getByText(/export and pitch/i)).toBeInTheDocument();
  });

  test('collaborative features mentioned', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/collaborative tools/i)).toBeInTheDocument();
    expect(screen.getByText(/invite editors and co-writers/i)).toBeInTheDocument();
  });

  test('emphasizes efficiency benefits', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/no need to spend hours reading/i)).toBeInTheDocument();
    expect(screen.getByText(/in seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/easily/i)).toBeInTheDocument();
  });

  test('targets specific user personas', () => {
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/editors and co-writers/i)).toBeInTheDocument();
    expect(screen.getByText(/stake holders/i)).toBeInTheDocument();
  });

  test('calls-to-action are present', () => {
    renderWithRouter(<Home />);
    
    const getStartedButton = screen.getByRole('link', { name: /get started/i });
    const watchDemoButton = screen.getByRole('button', { name: /watch demo/i });
    
    expect(getStartedButton).toBeInTheDocument();
    expect(watchDemoButton).toBeInTheDocument();
  });

  test('hero section takes up proper viewport height', () => {
    renderWithRouter(<Home />);
    
    const heroSection = screen.getByRole('heading', { name: /bring your scripts to life/i }).closest('section');
    expect(heroSection).toHaveClass('h-[60vh]');
  });

  test('consistent spacing and layout', () => {
    renderWithRouter(<Home />);
    
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index > 0) { // Skip hero section
        expect(section).toHaveClass('py-12', 'px-6');
      }
    });
    
    // Last section should have bottom margin
    const lastSection = sections[sections.length - 1];
    expect(lastSection).toHaveClass('mb-20');
  });

  test('proper heading hierarchy', () => {
    renderWithRouter(<Home />);
    
    const h1Elements = screen.getAllByRole('heading', { level: 1 });
    const h2Elements = screen.getAllByRole('heading', { level: 2 });
    
    expect(h1Elements.length).toBeGreaterThan(0);
    expect(h2Elements.length).toBeGreaterThan(0);
  });

  test('buttons are interactive elements', () => {
    renderWithRouter(<Home />);
    
    const getStartedLink = screen.getByRole('link', { name: /get started/i });
    const watchDemoButton = screen.getByRole('button', { name: /watch demo/i });
    
    expect(getStartedLink).toHaveAttribute('href');
    expect(watchDemoButton).toHaveAttribute('type', 'button');
  });

  test('content is accessible', () => {
    renderWithRouter(<Home />);
    
    // All interactive elements should be keyboard accessible
    const interactiveElements = screen.getAllByRole('button').concat(screen.getAllByRole('link'));
    interactiveElements.forEach(element => {
      expect(element).toBeVisible();
    });
  });

  test('proper text contrast with background', () => {
    renderWithRouter(<Home />);
    
    // White text on dark background for hero
    const heroSection = screen.getByRole('heading', { name: /bring your scripts to life/i }).closest('section');
    expect(heroSection).toHaveClass('text-white');
    
    // White text for section headings
    const sectionHeadings = screen.getAllByRole('heading', { name: /everything you need|how it works/i });
    sectionHeadings.forEach(heading => {
      expect(heading).toHaveClass('text-white');
    });
  });
});