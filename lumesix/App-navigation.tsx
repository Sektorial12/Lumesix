/**
 * Lumesix - AI-Powered Subscription Analytics
 * Main App Component
 */

import React from 'react';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />
      <AppNavigator />
    </>
  );
}

export default App;
