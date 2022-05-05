import * as React from 'react';
import { render, screen } from '@testing-library/react';
import ClassComp from './ClassComp';

describe('FuncComp Component', () => {
  it('Should render correctly', () => {
    render(<ClassComp />);
    const textElement = screen.getByText(/Test Component/i);
    expect(textElement).toBeInTheDocument();
  });
});
