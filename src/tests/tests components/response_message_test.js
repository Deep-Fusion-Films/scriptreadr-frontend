import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import ResponseMessage from './ResponseMessage';

describe('ResponseMessage', () => {
  test('renders without crashing', () => {
    render(<ResponseMessage response="Test message" />);
  });

  test('displays the response message', () => {
    const testMessage = "This is a test error message";
    render(<ResponseMessage response={testMessage} />);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('displays different messages when prop changes', () => {
    const { rerender } = render(<ResponseMessage response="First message" />);
    expect(screen.getByText('First message')).toBeInTheDocument();
    
    rerender(<ResponseMessage response="Second message" />);
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    render(<ResponseMessage response="Styled message" />);
    
    const message = screen.getByText('Styled message');
    expect(message).toHaveClass('block', 'text-sm', 'font-medium', 'text-red-700');
  });

  test('renders as a paragraph element', () => {
    render(<ResponseMessage response="Paragraph test" />);
    
    const message = screen.getByText('Paragraph test');
    expect(message.tagName.toLowerCase()).toBe('p');
  });

  test('handles empty response prop', () => {
    render(<ResponseMessage response="" />);
    
    const message = screen.getByText('');
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('block', 'text-sm', 'font-medium', 'text-red-700');
  });

  test('handles undefined response prop gracefully', () => {
    render(<ResponseMessage />);
    
    // Should render a paragraph element even without response prop
    const paragraph = document.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('block', 'text-sm', 'font-medium', 'text-red-700');
  });

  test('handles null response prop gracefully', () => {
    render(<ResponseMessage response={null} />);
    
    const paragraph = document.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('block', 'text-sm', 'font-medium', 'text-red-700');
  });

  test('displays numeric response values', () => {
    render(<ResponseMessage response={123} />);
    
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  test('displays boolean response values', () => {
    const { rerender } = render(<ResponseMessage response={true} />);
    expect(screen.getByText('true')).toBeInTheDocument();
    
    rerender(<ResponseMessage response={false} />);
    expect(screen.getByText('false')).toBeInTheDocument();
  });

  test('handles long text messages', () => {
    const longMessage = "This is a very long error message that contains multiple sentences and should still render correctly within the component structure and maintain proper styling classes.";
    render(<ResponseMessage response={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  test('handles special characters in response', () => {
    const specialMessage = "Error: Invalid input! @#$%^&*()";
    render(<ResponseMessage response={specialMessage} />);
    
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  test('maintains text color for error styling', () => {
    render(<ResponseMessage response="Error message" />);
    
    const message = screen.getByText('Error message');
    expect(message).toHaveClass('text-red-700');
  });

  test('maintains block display styling', () => {
    render(<ResponseMessage response="Block display test" />);
    
    const message = screen.getByText('Block display test');
    expect(message).toHaveClass('block');
  });

  test('maintains font styling', () => {
    render(<ResponseMessage response="Font test" />);
    
    const message = screen.getByText('Font test');
    expect(message).toHaveClass('text-sm', 'font-medium');
  });

  test('component structure is minimal and clean', () => {
    render(<ResponseMessage response="Structure test" />);
    
    // Should only render a single paragraph element, no wrapper divs
    const message = screen.getByText('Structure test');
    expect(message.parentElement).toBe(document.body.firstChild);
  });

  test('handles multiline text', () => {
    const multilineMessage = "Line 1\nLine 2\nLine 3";
    render(<ResponseMessage response={multilineMessage} />);
    
    expect(screen.getByText(multilineMessage)).toBeInTheDocument();
  });
});