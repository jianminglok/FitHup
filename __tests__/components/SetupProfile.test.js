import React from 'react';
import SetupProfile from '../../components/SetupProfile'
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import profileReducer from '../../slices/profileSlice'
import { combineReducers, createStore } from 'redux';

export function createTestStore() {
  const store = createStore(
    combineReducers({
      profile: profileReducer
    })
  );  
  return store;
}

describe('SetupProfile', () => {
  beforeEach(() => {
    store = createTestStore();
  });

  it('should render correctly', () => {
    const header = renderer.create(
      <Provider store={store}>
        <SetupProfile />
      </Provider>
    ).toJSON;
    expect(header).toMatchSnapshot();
  });
});