import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders create campaign header', () => {
  render(<App />);
  const header = screen.getByText(/create new campaign/i);
  expect(header).toBeInTheDocument();
});
