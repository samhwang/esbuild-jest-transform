import * as React from 'react';
import { render, screen } from '@testing-library/react';
import FuncComp from './FuncComp';

describe('FuncComp Component', () => {
  it('Should render correctly', () => {
    render(<FuncComp />);
    const textElement = screen.getByText(/Test Component/i);
    expect(textElement).toBeInTheDocument();
  });
});
