import * as React from 'react';
import {CommonActions} from '@react-navigation/native';

export const navigationRef = React.createRef();
export const isReadyRef = React.createRef();

export function navigate(routeName, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.navigate(routeName, params);
  }
}
export function resetNavigation(routeName, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: routeName}, params],
      }),
    );
  }
}
