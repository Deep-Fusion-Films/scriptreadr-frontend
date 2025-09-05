import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import PrivacyPolicies from './PrivacyPolicies';

describe('PrivacyPolicies', () => {
  test('renders without crashing', () => {
    render(<PrivacyPolicies />);
  });

  test('displays the main heading', () => {
    render(<PrivacyPolicies />);
    const heading = screen.getByRole('heading', { name: /privacy policy/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('displays all section headings', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByRole('heading', { name: /information we collect/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /how we use your information/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /sharing of information/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /data security/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your rights/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /cookies/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /third-party links/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /changes to this policy/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
  });

  test('displays introduction paragraph', () => {
    render(<PrivacyPolicies />);
    const intro = screen.getByText(/this privacy policy explains how/i);
    expect(intro).toBeInTheDocument();
    expect(screen.getByText(/scriptreadr/i)).toBeInTheDocument();
  });

  test('displays information collection details', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/account information:/i)).toBeInTheDocument();
    expect(screen.getByText(/usage data:/i)).toBeInTheDocument();
    expect(screen.getByText(/uploaded content:/i)).toBeInTheDocument();
    expect(screen.getByText(/payment information:/i)).toBeInTheDocument();
  });

  test('mentions specific data types collected', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/your name, email address, and password/i)).toBeInTheDocument();
    expect(screen.getByText(/pages visited, features used, and session duration/i)).toBeInTheDocument();
    expect(screen.getByText(/scripts or documents you upload/i)).toBeInTheDocument();
    expect(screen.getByText(/handled securely by our payment processor/i)).toBeInTheDocument();
  });

  test('displays how information is used', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/to provide and improve our services/i)).toBeInTheDocument();
    expect(screen.getByText(/to personalize user experience/i)).toBeInTheDocument();
    expect(screen.getByText(/to manage subscriptions and payments/i)).toBeInTheDocument();
    expect(screen.getByText(/to communicate updates and support/i)).toBeInTheDocument();
    expect(screen.getByText(/to comply with legal obligations/i)).toBeInTheDocument();
  });

  test('addresses data sharing policies', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/we do not sell or rent your personal data/i)).toBeInTheDocument();
    expect(screen.getByText(/third-party service providers/i)).toBeInTheDocument();
    expect(screen.getByText(/law enforcement or legal authorities/i)).toBeInTheDocument();
    expect(screen.getByText(/merger, acquisition, or asset sale/i)).toBeInTheDocument();
  });

  test('addresses data security', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/we implement appropriate technical and organizational measures/i)).toBeInTheDocument();
    expect(screen.getByText(/no system is 100% secure/i)).toBeInTheDocument();
    expect(screen.getByText(/use strong passwords/i)).toBeInTheDocument();
  });

  test('describes user rights', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/you may access, update, or delete your personal data/i)).toBeInTheDocument();
    expect(screen.getByText(/eu and california residents have additional rights/i)).toBeInTheDocument();
    expect(screen.getByText(/gdpr and ccpa/i)).toBeInTheDocument();
  });

  test('addresses cookies policy', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/scriptreadr uses cookies to enhance functionality/i)).toBeInTheDocument();
    expect(screen.getByText(/continuing to use the site, you consent/i)).toBeInTheDocument();
    expect(screen.getByText(/adjust cookie settings in your browser/i)).toBeInTheDocument();
  });

  test('addresses third-party links', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/our service may contain links to third-party websites/i)).toBeInTheDocument();
    expect(screen.getByText(/not responsible for their privacy practices/i)).toBeInTheDocument();
  });

  test('addresses policy changes', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/we may update this privacy policy from time to time/i)).toBeInTheDocument();
    expect(screen.getByText(/review this page periodically/i)).toBeInTheDocument();
    expect(screen.getByText(/continued use of scriptreadr after changes/i)).toBeInTheDocument();
  });

  test('displays contact information with email link', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/if you have any questions about this privacy policy/i)).toBeInTheDocument();
    
    const emailLink = screen.getByRole('link', { name: /support@scriptreadr.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:support@scriptreadr.com');
  });

  test('applies correct section styling', () => {
    render(<PrivacyPolicies />);
    const section = screen.getByRole('heading', { level: 1 }).closest('section');
    expect(section).toHaveClass('py-16', 'px-6', 'max-w-4xl', 'mx-auto', 'mb-20');
  });

  test('main heading has correct styling', () => {
    render(<PrivacyPolicies />);
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveClass('text-4xl', 'font-bold', 'text-center', 'text-[#2E3A87]', 'mb-8');
  });

  test('section headings have correct styling', () => {
    render(<PrivacyPolicies />);
    const sectionHeadings = screen.getAllByRole('heading').filter(h => h.tagName.toLowerCase() === 'h2');
    
    sectionHeadings.forEach(heading => {
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'mt-8', 'mb-2', 'text-[#2E3A87]');
    });
  });

  test('paragraphs have correct styling', () => {
    render(<PrivacyPolicies />);
    const paragraphs = document.querySelectorAll('p');
    
    // Filter out paragraphs that might contain links or have different styling
    const regularParagraphs = Array.from(paragraphs).filter(p => 
      !p.querySelector('a') && p.classList.contains('text-white')
    );
    
    regularParagraphs.forEach(paragraph => {
      expect(paragraph).toHaveClass('text-white', 'mb-4');
    });
  });

  test('lists have correct styling', () => {
    render(<PrivacyPolicies />);
    const lists = document.querySelectorAll('ul');
    
    lists.forEach(list => {
      expect(list).toHaveClass('list-disc', 'list-inside', 'text-white', 'mb-4');
    });
  });

  test('email link has correct styling', () => {
    render(<PrivacyPolicies />);
    const emailLink = screen.getByRole('link', { name: /support@scriptreadr.com/i });
    expect(emailLink).toHaveClass('text-white', 'underline');
  });

  test('uses semantic HTML structure', () => {
    render(<PrivacyPolicies />);
    
    const section = screen.getByRole('heading', { level: 1 }).closest('section');
    const mainHeading = screen.getByRole('heading', { level: 1 });
    const subHeadings = screen.getAllByRole('heading').filter(h => h.tagName.toLowerCase() === 'h2');
    
    expect(section.tagName.toLowerCase()).toBe('section');
    expect(mainHeading.tagName.toLowerCase()).toBe('h1');
    expect(subHeadings.length).toBe(9); // 9 numbered sections
  });

  test('displays company name in bold', () => {
    render(<PrivacyPolicies />);
    const boldScriptReadr = screen.getByText('ScriptReadr', { selector: 'strong' });
    expect(boldScriptReadr).toBeInTheDocument();
  });

  test('mentions specific third-party services', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/stripe/i)).toBeInTheDocument();
    expect(screen.getByText(/hosting, payment processing/i)).toBeInTheDocument();
  });

  test('addresses legal compliance', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/legal obligations/i)).toBeInTheDocument();
    expect(screen.getByText(/law enforcement/i)).toBeInTheDocument();
    expect(screen.getByText(/required by law/i)).toBeInTheDocument();
  });

  test('mentions specific regulations', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/gdpr/i)).toBeInTheDocument();
    expect(screen.getByText(/ccpa/i)).toBeInTheDocument();
    expect(screen.getByText(/eu and california residents/i)).toBeInTheDocument();
  });

  test('provides actionable user guidance', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/logging into your account or contacting us/i)).toBeInTheDocument();
    expect(screen.getByText(/adjust cookie settings in your browser/i)).toBeInTheDocument();
    expect(screen.getByText(/review their policies before interacting/i)).toBeInTheDocument();
  });

  test('addresses business operations', () => {
    render(<PrivacyPolicies />);
    
    expect(screen.getByText(/merger, acquisition, or asset sale/i)).toBeInTheDocument();
    expect(screen.getByText(/analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/subscriptions and payments/i)).toBeInTheDocument();
  });

  test('includes numbered sections', () => {
    render(<PrivacyPolicies />);
    
    for (let i = 1; i <= 9; i++) {
      const numberedHeading = screen.getByRole('heading', { name: new RegExp(`^${i}\\.`, 'i') });
      expect(numberedHeading).toBeInTheDocument();
    }
  });
});