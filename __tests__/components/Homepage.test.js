import React from 'react';
import Homepage from '../../components/Homepage'
import renderer from 'react-test-renderer';

describe('Homepage', () => {
  it('should render correctly', () => {
    const header = renderer.create(
      <Homepage />
    ).toJSON;
    expect(header).toMatchSnapshot();
  });
});