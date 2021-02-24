import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppTour from '../screen/AppTour';
import Login from '../screen/Auth/Login';
import Register from '../screen/Auth/Register';
import Dashboard from '../screen/dashboard/Dashboard';
import Profile from '../screen/baseProfile/Profile';
import UserProfile from '../screen/userProfile/UserProfile';
import EditProfile from '../screen/editProfile/EditProfile';
import SearchDirectory from '../screen/Directory/SearchDirectory';
import DirectoryDetails from '../screen/Directory/DirectoryDetails';
import Magazine from '../screen/magazine/Magazine';
import Summary from '../screen/magazine/Summary';
import MagazineDetails from '../screen/magazine/MagazineDetails';
import AppRules from '../screen/CmsPages/AppRules';
import AppCommittee from '../screen/CmsPages/AppCommittee';
import AppRepresentives from '../screen/CmsPages/AppRepresentives';
import AppChapters from '../screen/CmsPages/AppChapters';
import CommonWebPage from '../screen/CommonWebPage';
import Video from '../screen/Video/Video';

const Stack = createStackNavigator();

export const RootNavigators = (baseRoute) => {
  return (
    <Stack.Navigator initialRouteName={baseRoute}>
      <Stack.Screen
        name="AppTour"
        component={AppTour}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Magazine"
        component={Magazine}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Summary"
        component={Summary}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MagazineDetails"
        component={MagazineDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SearchDirectory"
        component={SearchDirectory}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DirectoryDetails"
        component={DirectoryDetails}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="AppRules"
        component={AppRules}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="AppCommittee"
        component={AppCommittee}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="AppRepresentives"
        component={AppRepresentives}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="AppChapters"
        component={AppChapters}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="CommonWebPage"
        component={CommonWebPage}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Video"
        component={Video}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
