import React from 'react';
import ActivityLoggerCalorie from '../../components/ActivityLoggerCalorie'
import renderer from 'react-test-renderer';

describe('ActivityLoggerCalorie', () => {
  it('should render correctly', () => {
    const header = renderer.create(
      <ActivityLoggerCalorie />
    ).toJSON;
    expect(header).toMatchSnapshot();
  });
});