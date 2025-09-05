import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, expect } from 'vitest';
import Footer from './Footer';

// Helper function to render component with router context
const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Footer', () => {
  test('renders without crashing', () => {
    renderWithRouter(<Footer />);
  });

  test('displays all navigation links', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByRole('link', { name: /terms of use/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /privacy policies/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /disclaimer/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByRole('link', { name: /terms of use/i })).toHaveAttribute('href', '/termsofuse');
    expect(screen.getByRole('link', { name: /privacy policies/i })).toHaveAttribute('href', '/privacypolicies');
    expect(screen.getByRole('link', { name: /disclaimer/i })).toHaveAttribute('href', '/disclaimer');
    expect(screen.getByRole('link', { name: /faq/i })).toHaveAttribute('href', '/faq');
  });

  test('displays all social media icons with correct aria-labels', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
  });

  test('social media links have placeholder href attributes', () => {
    renderWithRouter(<Footer />);
    
    const facebookLink = screen.getByLabelText('Facebook');
    const twitterLink = screen.getByLabelText('Twitter');
    const instagramLink = screen.getByLabelText('Instagram');
    
    expect(facebookLink).toHaveAttribute('href', '#');
    expect(twitterLink).toHaveAttribute('href', '#');
    expect(instagramLink).toHaveAttribute('href', '#');
  });

  test('applies correct footer styling', () => {
    renderWithRouter(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-[#0F172A]', 'text-white', 'px-6', 'py-12');
  });

  test('applies correct container styling', () => {
    renderWithRouter(<Footer />);
    
    const container = screen.getByRole('list').parentElement;
    expect(container).toHaveClass('flex', 'flex-col', 'md:flex-row', 'justify-between', 'items-center', 'md:items-start', 'gap-6');
  });

  test('navigation list has correct styling', () => {
    renderWithRouter(<Footer />);
    
    const navList = screen.getByRole('list');
    expect(navList).toHaveClass('flex', 'flex-col', 'md:flex-row', 'items-center', 'md:items-start', 'gap-4', 'md:gap-8', 'text-sm');
  });

  test('social media container has correct styling', () => {
    renderWithRouter(<Footer />);
    
    const socialContainer = screen.getByLabelText('Facebook').parentElement;
    expect(socialContainer).toHaveClass('flex', 'gap-4', 'text-xl');
  });

  test('social media links have hover styling classes', () => {
    renderWithRouter(<Footer />);
    
    const facebookLink = screen.getByLabelText('Facebook');
    const twitterLink = screen.getByLabelText('Twitter');
    const instagramLink = screen.getByLabelText('Instagram');
    
    expect(facebookLink).toHaveClass('hover:text-blue-400');
    expect(twitterLink).toHaveClass('hover:text-blue-300');
    expect(instagramLink).toHaveClass('hover:text-pink-400');
  });

  test('contains all expected navigation items', () => {
    renderWithRouter(<Footer />);
    
    const navItems = screen.getAllByRole('listitem');
    expect(navItems).toHaveLength(4);
    
    const navTexts = navItems.map(item => item.textContent);
    expect(navTexts).toContain('Terms of Use');
    expect(navTexts).toContain('Privacy Policies');
    expect(navTexts).toContain('Disclaimer');
    expect(navTexts).toContain('FAQ');
  });

  test('social media icons are rendered as SVGs', () => {
    renderWithRouter(<Footer />);
    
    // React icons render as SVGs
    const svgElements = document.querySelectorAll('svg');
    expect(svgElements.length).toBeGreaterThanOrEqual(3); // At least 3 for social media icons
  });

  test('footer is semantically correct', () => {
    renderWithRouter(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer.tagName.toLowerCase()).toBe('footer');
  });

  test('navigation links are properly grouped in a list', () => {
    renderWithRouter(<Footer />);
    
    const list = screen.getByRole('list');
    const listItems = screen.getAllByRole('listitem');
    
    expect(list).toBeInTheDocument();
    expect(listItems).toHaveLength(4);
  });
});