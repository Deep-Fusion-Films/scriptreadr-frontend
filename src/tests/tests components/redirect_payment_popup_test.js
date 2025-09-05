import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import RedirectToPaymentPopUp from './RedirectToPaymentPopUp';

// Mock console.log to capture the debug output
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('RedirectToPaymentPopUp', () => {
  afterEach(() => {
    consoleSpy.mockClear();
  });

  test('renders when isLoadingPayment is true', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text="Redirecting to payment..." />);
    
    expect(screen.getByText(/redirecting to payment/i)).toBeInTheDocument();
  });

  test('does not render when isLoadingPayment is false', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={false} text="Redirecting to payment..." />);
    
    expect(screen.queryByText(/redirecting to payment/i)).not.toBeInTheDocument();
  });

  test('displays the correct text prop', () => {
    const testText = "Processing your payment request...";
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text={testText} />);
    
    expect(screen.getByText(new RegExp(testText, 'i'))).toBeInTheDocument();
  });

  test('displays different text when prop changes', () => {
    const { rerender } = render(<RedirectToPaymentPopUp isLoadingPayment={true} text="First message" />);
    expect(screen.getByText(/first message/i)).toBeInTheDocument();
    
    rerender(<RedirectToPaymentPopUp isLoadingPayment={true} text="Second message" />);
    expect(screen.getByText(/second message/i)).toBeInTheDocument();
    expect(screen.queryByText(/first message/i)).not.toBeInTheDocument();
  });

  test('logs debug message when isLoadingPayment is true', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text="Test message" />);
    
    expect(consoleSpy).toHaveBeenCalledWith('is loading payment works: true');
  });

  test('logs debug message when isLoadingPayment is false', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={false} text="Test message" />);
    
    expect(consoleSpy).toHaveBeenCalledWith('is loading payment works: false');
  });

  test('applies correct overlay styling', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text="Test message" />);
    
    const overlay = screen.getByText(/test message/i).closest('div').parentElement;
    expect(overlay).toHaveClass('fixed', 'inset-0', 'z-50', 'flex', 'items-center', 'justify-center', 'bg-black/50', 'rounded-md');
  });

  test('applies correct modal styling', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text="Test message" />);
    
    const modal = screen.getByText(/test message/i).closest('div');
    expect(modal).toHaveClass('relative', 'bg-white', 'p-6', 'rounded', 'shadow-lg', 'text-center', 'w-80');
  });

  test('text has correct styling', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text="Test message" />);
    
    const text = screen.getByText(/test message/i);
    expect(text).toHaveClass('mb-4', 'text-lg', 'font-semibold');
  });

  test('handles empty text prop', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text="" />);
    
    // Should still render but with empty text
    const modal = document.querySelector('.bg-white');
    expect(modal).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('is loading payment works: true');
  });

  test('handles undefined text prop gracefully', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} />);
    
    // Should still render the modal structure
    const modal = document.querySelector('.bg-white');
    expect(modal).toBeInTheDocument();
    expect(consoleSpy).toHaveBeenCalledWith('is loading payment works: true');
  });

  test('console.log is called with correct boolean value', () => {
    const { rerender } = render(<RedirectToPaymentPopUp isLoadingPayment={true} text="Test" />);
    expect(consoleSpy).toHaveBeenCalledWith('is loading payment works: true');
    
    consoleSpy.mockClear();
    
    rerender(<RedirectToPaymentPopUp isLoadingPayment={false} text="Test" />);
    expect(consoleSpy).toHaveBeenCalledWith('is loading payment works: false');
  });

  test('modal structure is consistent when rendered', () => {
    render(<RedirectToPaymentPopUp isLoadingPayment={true} text="Consistent test" />);
    
    // Check the nested div structure
    const outerDiv = document.querySelector('.fixed.inset-0');
    const innerDiv = document.querySelector('.relative.bg-white');
    const paragraph = document.querySelector('p');
    
    expect(outerDiv).toBeInTheDocument();
    expect(innerDiv).toBeInTheDocument();
    expect(paragraph).toBeInTheDocument();
    expect(paragraph.parentElement).toBe(innerDiv);
  });

  test('renders with boolean props correctly', () => {
    // Test with explicit boolean values
    const { rerender } = render(<RedirectToPaymentPopUp isLoadingPayment={Boolean(true)} text="Boolean test" />);
    expect(screen.getByText(/boolean test/i)).toBeInTheDocument();
    
    rerender(<RedirectToPaymentPopUp isLoadingPayment={Boolean(false)} text="Boolean test" />);
    expect(screen.queryByText(/boolean test/i)).not.toBeInTheDocument();
  });
});