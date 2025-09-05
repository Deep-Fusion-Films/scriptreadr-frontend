import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import About from './About';

describe('About', () => {
  test('renders without crashing', () => {
    render(<About />);
  });

  test('displays the main heading', () => {
    render(<About />);
    const heading = screen.getByRole('heading', { name: /about scriptreadr/i });
    expect(heading).toBeInTheDocument();
  });

  test('displays the first paragraph about ScriptReadr purpose', () => {
    render(<About />);
    const firstParagraph = screen.getByText(/scriptreadr is a modern tool designed for scriptwriters/i);
    expect(firstParagraph).toBeInTheDocument();
  });

  test('displays the second paragraph about voice integration', () => {
    render(<About />);
    const secondParagraph = screen.getByText(/with powerful voice integration and a seamless user experience/i);
    expect(secondParagraph).toBeInTheDocument();
  });

  test('displays the third paragraph about trust and plans', () => {
    render(<About />);
    const thirdParagraph = screen.getByText(/scriptreadr is trusted by teams and solo creators/i);
    expect(thirdParagraph).toBeInTheDocument();
  });

  test('mentions key target audiences', () => {
    render(<About />);
    expect(screen.getByText(/scriptwriters, producers, and content creators/i)).toBeInTheDocument();
  });

  test('mentions screenplay development use case', () => {
    render(<About />);
    expect(screen.getByText(/whether you're developing a screenplay, a podcast, or a narrative/i)).toBeInTheDocument();
  });

  test('mentions voice integration feature', () => {
    render(<About />);
    expect(screen.getByText(/powerful voice integration/i)).toBeInTheDocument();
  });

  test('mentions natural-sounding speech', () => {
    render(<About />);
    expect(screen.getByText(/natural-sounding speech/i)).toBeInTheDocument();
  });

  test('mentions free plan and Pro options', () => {
    render(<About />);
    expect(screen.getByText(/whether you're on the free plan or going pro/i)).toBeInTheDocument();
  });

  test('applies correct section styling', () => {
    render(<About />);
    const section = screen.getByRole('heading').closest('section');
    expect(section).toHaveClass('py-16', 'px-6', 'max-w-5xl', 'mx-auto', 'mb-20');
  });

  test('heading has correct styling', () => {
    render(<About />);
    const heading = screen.getByRole('heading');
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-center', 'text-[#2E3A87]', 'mb-8');
  });

  test('all paragraphs have consistent styling', () => {
    render(<About />);
    const paragraphs = screen.getAllByText(/scriptreadr/i);
    
    paragraphs.forEach(paragraph => {
      if (paragraph.tagName.toLowerCase() === 'p') {
        expect(paragraph).toHaveClass('text-lg', 'text-white', 'leading-relaxed');
      }
    });
  });

  test('first and second paragraphs have margin bottom', () => {
    render(<About />);
    const firstParagraph = screen.getByText(/scriptreadr is a modern tool designed/i);
    const secondParagraph = screen.getByText(/with powerful voice integration/i);
    
    expect(firstParagraph).toHaveClass('mb-6');
    expect(secondParagraph).toHaveClass('mb-6');
  });

  test('third paragraph does not have margin bottom', () => {
    render(<About />);
    const thirdParagraph = screen.getByText(/scriptreadr is trusted by teams/i);
    expect(thirdParagraph).not.toHaveClass('mb-6');
  });

  test('brand name is bold in first paragraph', () => {
    render(<About />);
    const brandSpan = screen.getByText('ScriptReadr', { selector: 'span' });
    expect(brandSpan).toHaveClass('font-semibold');
  });

  test('uses semantic HTML structure', () => {
    render(<About />);
    const section = screen.getByRole('heading').closest('section');
    const heading = screen.getByRole('heading');
    
    expect(section.tagName.toLowerCase()).toBe('section');
    expect(heading.tagName.toLowerCase()).toBe('h1');
  });

  test('content mentions key benefits', () => {
    render(<About />);
    expect(screen.getByText(/boost your creative process/i)).toBeInTheDocument();
    expect(screen.getByText(/sharpen your dialogue/i)).toBeInTheDocument();
    expect(screen.getByText(/make editing faster and more engaging/i)).toBeInTheDocument();
  });

  test('content mentions efficiency and accessibility', () => {
    render(<About />);
    expect(screen.getByText(/efficiency, accessibility, and a touch of fun/i)).toBeInTheDocument();
  });

  test('mentions upload and generate functionality', () => {
    render(<About />);
    expect(screen.getByText(/upload or generate scripts/i)).toBeInTheDocument();
  });

  test('mentions film and TV use cases', () => {
    render(<About />);
    expect(screen.getByText(/film or tv/i)).toBeInTheDocument();
  });

  test('contains complete brand value proposition', () => {
    render(<About />);
    expect(screen.getByText(/helping your script sound as brilliant as it reads/i)).toBeInTheDocument();
  });

  test('all text content is accessible', () => {
    render(<About />);
    // Check that all text has sufficient contrast by verifying white text class
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      expect(p).toHaveClass('text-white');
    });
  });

  test('responsive design classes are applied', () => {
    render(<About />);
    const section = screen.getByRole('heading').closest('section');
    expect(section).toHaveClass('max-w-5xl', 'mx-auto');
  });
});