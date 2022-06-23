import React from 'react';
import ActivityLoggerExercise from '../../components/ActivityLoggerExercise'
import renderer from 'react-test-renderer';

describe('ActivityLoggerExercise', () => {
  it('should render correctly', () => {
    const header = renderer.create(
      <ActivityLoggerExercise />
    ).toJSON;
    expect(header).toMatchSnapshot();
  });
});