import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Disclaimer from './Disclaimer';

describe('Disclaimer', () => {
  test('renders without crashing', () => {
    render(<Disclaimer />);
  });

  test('displays the main heading', () => {
    render(<Disclaimer />);
    const heading = screen.getByRole('heading', { name: /disclaimer/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('displays all section headings', () => {
    render(<Disclaimer />);
    
    expect(screen.getByRole('heading', { name: /no professional advice/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /no guarantees/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /user-generated content/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /external links/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /limitation of liability/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /changes to this disclaimer/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
  });

  test('displays introduction paragraph', () => {
    render(<Disclaimer />);
    const intro = screen.getByText(/the information provided by/i);
    expect(intro).toBeInTheDocument();
    expect(screen.getByText(/scriptreadr/i)).toBeInTheDocument();
  });

  test('displays no professional advice section content', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/scriptreadr is a digital tool designed to read scripts aloud/i)).toBeInTheDocument();
    expect(screen.getByText(/not intended to replace professional script analysts/i)).toBeInTheDocument();
  });

  test('displays no guarantees section content', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/we do not guarantee that the script-reading functionality will be error-free/i)).toBeInTheDocument();
    expect(screen.getByText(/scheduled maintenance or technical issues/i)).toBeInTheDocument();
  });

  test('displays user-generated content section', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/you are solely responsible for the content you upload/i)).toBeInTheDocument();
    expect(screen.getByText(/unauthorized use of copyrighted scripts/i)).toBeInTheDocument();
  });

  test('displays external links section', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/the website may contain links to other websites/i)).toBeInTheDocument();
    expect(screen.getByText(/not responsible for any content on third-party sites/i)).toBeInTheDocument();
  });

  test('displays limitation of liability section', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/under no circumstance shall scriptreadr be liable/i)).toBeInTheDocument();
    expect(screen.getByText(/your use of the site and our services is solely at your own risk/i)).toBeInTheDocument();
  });

  test('displays changes to disclaimer section', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/we may update this disclaimer at any time without notice/i)).toBeInTheDocument();
    expect(screen.getByText(/your continued use of the site and services/i)).toBeInTheDocument();
  });

  test('displays contact section with email', () => {
    render(<Disclaimer />);
    expect(screen.getByText(/if you have any questions about this disclaimer/i)).toBeInTheDocument();
    
    const emailLink = screen.getByRole('link', { name: /legal@scriptreadr.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:legal@scriptreadr.com');
  });

  test('applies correct section styling', () => {
    render(<Disclaimer />);
    const section = screen.getByRole('heading', { level: 1 }).closest('section');
    expect(section).toHaveClass('py-16', 'px-6', 'max-w-4xl', 'mx-auto', 'mb-20');
  });

  test('main heading has correct styling', () => {
    render(<Disclaimer />);
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveClass('text-4xl', 'font-bold', 'text-center', 'text-[#2E3A87]', 'mb-8');
  });

  test('section headings have correct styling', () => {
    render(<Disclaimer />);
    const sectionHeadings = screen.getAllByRole('heading').filter(h => h.tagName.toLowerCase() === 'h2');
    
    sectionHeadings.forEach(heading => {
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mt-8', 'mb-2', 'text-[#2E3A87]');
    });
  });

  test('paragraphs have correct styling', () => {
    render(<Disclaimer />);
    const paragraphs = document.querySelectorAll('p');
    
    paragraphs.forEach(paragraph => {
      if (!paragraph.querySelector('a')) { // Exclude paragraphs with links that might have different styling
        expect(paragraph).toHaveClass('text-white', 'mb-4');
      }
    });
  });

  test('email link has correct styling', () => {
    render(<Disclaimer />);
    const emailLink = screen.getByRole('link', { name: /legal@scriptreadr.com/i });
    expect(emailLink).toHaveClass('text-white', 'underline');
  });

  test('uses semantic HTML structure', () => {
    render(<Disclaimer />);
    
    const section = screen.getByRole('heading', { level: 1 }).closest('section');
    const mainHeading = screen.getByRole('heading', { level: 1 });
    const subHeadings = screen.getAllByRole('heading').filter(h => h.tagName.toLowerCase() === 'h2');
    
    expect(section.tagName.toLowerCase()).toBe('section');
    expect(mainHeading.tagName.toLowerCase()).toBe('h1');
    expect(subHeadings.length).toBe(7); // 7 numbered sections
  });

  test('displays company name in bold', () => {
    render(<Disclaimer />);
    const boldScriptReadr = screen.getByText('ScriptReadr', { selector: 'strong' });
    expect(boldScriptReadr).toBeInTheDocument();
  });

  test('contains all required legal disclaimers', () => {
    render(<Disclaimer />);
    
    // Check for key legal phrases
    expect(screen.getByText(/general informational purposes only/i)).toBeInTheDocument();
    expect(screen.getByText(/make no representation or warranty/i)).toBeInTheDocument();
    expect(screen.getByText(/solely responsible/i)).toBeInTheDocument();
    expect(screen.getByText(/limitation of liability/i)).toBeInTheDocument();
    expect(screen.getByText(/at your own risk/i)).toBeInTheDocument();
  });

  test('mentions key service features', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/read scripts aloud/i)).toBeInTheDocument();
    expect(screen.getByText(/content engagement/i)).toBeInTheDocument();
    expect(screen.getByText(/script-reading functionality/i)).toBeInTheDocument();
  });

  test('addresses copyright and intellectual property', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/copyrighted scripts or intellectual property/i)).toBeInTheDocument();
    expect(screen.getByText(/rights to share and process that material/i)).toBeInTheDocument();
  });

  test('mentions professional limitations', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/professional script analysts, voiceover artists, or editors/i)).toBeInTheDocument();
    expect(screen.getByText(/not intended to replace/i)).toBeInTheDocument();
  });

  test('includes technical service disclaimers', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/error-free, uninterrupted/i)).toBeInTheDocument();
    expect(screen.getByText(/scheduled maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/technical issues beyond our control/i)).toBeInTheDocument();
  });

  test('addresses third-party content', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/third parties/i)).toBeInTheDocument();
    expect(screen.getByText(/not investigated, monitored, or checked/i)).toBeInTheDocument();
  });

  test('includes update policy', () => {
    render(<Disclaimer />);
    
    expect(screen.getByText(/without notice/i)).toBeInTheDocument();
    expect(screen.getByText(/review this page periodically/i)).toBeInTheDocument();
    expect(screen.getByText(/deemed your acceptance/i)).toBeInTheDocument();
  });
});