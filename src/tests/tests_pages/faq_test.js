import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Faq from './Faq';

describe('Faq', () => {
  test('renders without crashing', () => {
    render(<Faq />);
  });

  test('displays the main heading', () => {
    render(<Faq />);
    const heading = screen.getByRole('heading', { name: /frequently asked questions/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('displays all FAQ questions', () => {
    render(<Faq />);
    
    expect(screen.getByRole('heading', { name: /what is scriptreadr/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /who can use scriptreadr/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /do i need to install any software/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /how accurate are the ai voices/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /is there a free version/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /can i export audio from scriptreadr/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /how do subscriptions work/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /is my script data private/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /who do i contact for support/i })).toBeInTheDocument();
  });

  test('displays answer about what ScriptReadr is', () => {
    render(<Faq />);
    expect(screen.getByText(/scriptreadr is an ai-powered tool designed for creatives/i)).toBeInTheDocument();
    expect(screen.getByText(/natural-sounding voice technology/i)).toBeInTheDocument();
  });

  test('displays answer about who can use ScriptReadr', () => {
    render(<Faq />);
    expect(screen.getByText(/anyone working with written scripts or narrative content/i)).toBeInTheDocument();
    expect(screen.getByText(/screenwriters, producers, directors, educators/i)).toBeInTheDocument();
  });

  test('displays answer about software installation', () => {
    render(<Faq />);
    expect(screen.getByText(/no installation is needed/i)).toBeInTheDocument();
    expect(screen.getByText(/fully web-based platform accessible through your browser/i)).toBeInTheDocument();
  });

  test('displays answer about AI voice accuracy', () => {
    render(<Faq />);
    expect(screen.getByText(/advanced ai voice synthesis/i)).toBeInTheDocument();
    expect(screen.getByText(/not a substitute for human actors/i)).toBeInTheDocument();
  });

  test('displays answer about free version', () => {
    render(<Faq />);
    expect(screen.getByText(/yes! scriptreadr offers a free plan/i)).toBeInTheDocument();
    expect(screen.getByText(/premium and pro plans provide access/i)).toBeInTheDocument();
  });

  test('displays answer about audio export', () => {
    render(<Faq />);
    expect(screen.getByText(/users on premium and pro plans can export/i)).toBeInTheDocument();
    expect(screen.getByText(/mp3 format/i)).toBeInTheDocument();
  });

  test('displays answer about subscriptions', () => {
    render(<Faq />);
    expect(screen.getByText(/once you subscribe, your account will be upgraded/i)).toBeInTheDocument();
    expect(screen.getByText(/basic, premium, or pro/i)).toBeInTheDocument();
  });

  test('displays answer about data privacy with link', () => {
    render(<Faq />);
    expect(screen.getByText(/absolutely. scriptreadr takes privacy seriously/i)).toBeInTheDocument();
    
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacypolicies');
  });

  test('displays answer about support with email link', () => {
    render(<Faq />);
    expect(screen.getByText(/for help, questions, or technical support/i)).toBeInTheDocument();
    
    const supportEmail = screen.getByRole('link', { name: /support@scriptreadr.com/i });
    expect(supportEmail).toBeInTheDocument();
    expect(supportEmail).toHaveAttribute('href', 'mailto:support@scriptreadr.com');
  });

  test('applies correct section styling', () => {
    render(<Faq />);
    const section = screen.getByRole('heading', { level: 1 }).closest('section');
    expect(section).toHaveClass('py-16', 'px-6', 'max-w-5xl', 'mx-auto', 'mb2');
  });

  test('main heading has correct styling', () => {
    render(<Faq />);
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveClass('text-4xl', 'font-bold', 'text-center', 'text-[#2E3A87]', 'mb-10');
  });

  test('FAQ container has correct spacing', () => {
    render(<Faq />);
    const faqContainer = screen.getByRole('heading', { name: /what is scriptreadr/i }).closest('div').parentElement;
    expect(faqContainer).toHaveClass('space-y-8');
  });

  test('question headings have correct styling', () => {
    render(<Faq />);
    const questionHeadings = screen.getAllByRole('heading').filter(h => h.tagName.toLowerCase() === 'h2');
    
    questionHeadings.forEach(heading => {
      expect(heading).toHaveClass('text-2xl', 'font-semibold', 'text-[#2E3A87]', 'mb-2');
    });
  });

  test('answer paragraphs have correct styling', () => {
    render(<Faq />);
    const paragraphs = document.querySelectorAll('p');
    
    paragraphs.forEach(paragraph => {
      expect(paragraph).toHaveClass('text-white');
    });
  });

  test('privacy policy link has correct styling', () => {
    render(<Faq />);
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    expect(privacyLink).toHaveClass('text-blue-600', 'underline');
  });

  test('support email link has correct styling', () => {
    render(<Faq />);
    const supportEmail = screen.getByRole('link', { name: /support@scriptreadr.com/i });
    expect(supportEmail).toHaveClass('text-white', 'underline');
  });

  test('uses semantic HTML structure', () => {
    render(<Faq />);
    
    const section = screen.getByRole('heading', { level: 1 }).closest('section');
    const mainHeading = screen.getByRole('heading', { level: 1 });
    const questionHeadings = screen.getAllByRole('heading').filter(h => h.tagName.toLowerCase() === 'h2');
    
    expect(section.tagName.toLowerCase()).toBe('section');
    expect(mainHeading.tagName.toLowerCase()).toBe('h1');
    expect(questionHeadings).toHaveLength(9); // 9 FAQ questions
  });

  test('mentions key features and benefits', () => {
    render(<Faq />);
    
    expect(screen.getByText(/ai-powered tool/i)).toBeInTheDocument();
    expect(screen.getByText(/natural-sounding voice/i)).toBeInTheDocument();
    expect(screen.getByText(/clear intonation and pacing/i)).toBeInTheDocument();
    expect(screen.getByText(/advanced voice features/i)).toBeInTheDocument();
    expect(screen.getByText(/longer script lengths/i)).toBeInTheDocument();
  });

  test('mentions target audience groups', () => {
    render(<Faq />);
    
    expect(screen.getByText(/scriptwriters, filmmakers, or content teams/i)).toBeInTheDocument();
    expect(screen.getByText(/screenwriters, producers, directors, educators, and content creators/i)).toBeInTheDocument();
  });

  test('addresses technical capabilities', () => {
    render(<Faq />);
    
    expect(screen.getByText(/desktop, tablet, or mobile devices/i)).toBeInTheDocument();
    expect(screen.getByText(/high-quality, natural speech/i)).toBeInTheDocument();
    expect(screen.getByText(/encrypted storage and secure authentication/i)).toBeInTheDocument();
  });

  test('mentions pricing and plans', () => {
    render(<Faq />);
    
    expect(screen.getByText(/free plan with limited features/i)).toBeInTheDocument();
    expect(screen.getByText(/basic, premium, or pro/i)).toBeInTheDocument();
    expect(screen.getByText(/upgraded or cancelled at any time/i)).toBeInTheDocument();
  });

  test('addresses privacy and security', () => {
    render(<Faq />);
    
    expect(screen.getByText(/never shared with third parties/i)).toBeInTheDocument();
    expect(screen.getByText(/encrypted storage/i)).toBeInTheDocument();
    expect(screen.getByText(/secure authentication/i)).toBeInTheDocument();
  });

  test('provides support information', () => {
    render(<Faq />);
    
    expect(screen.getByText(/our team typically responds within 24 hours/i)).toBeInTheDocument();
  });

  test('has proper FAQ structure with questions and answers', () => {
    render(<Faq />);
    
    const faqItems = document.querySelectorAll('div > h2');
    expect(faqItems).toHaveLength(9);
    
    // Each question should be followed by an answer paragraph
    faqItems.forEach(question => {
      const answer = question.nextElementSibling;
      expect(answer.tagName.toLowerCase()).toBe('p');
    });
  });
});