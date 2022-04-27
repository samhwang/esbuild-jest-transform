import { addNumber } from './index';

it('Should calculate 1 + 1 = 2', () => {
  const result = addNumber(1, 1);
  expect(result).toEqual(2);
});
