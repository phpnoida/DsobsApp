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
import NewsListing from '../screen/News/NewsListing';
import GalleryListing from '../screen/Gallery/GalleryListing';
import GalleryDetail from '../screen/Gallery/GalleryDetail';
import ImageList from '../screen/Gallery/ImageList';
import TagUser from '../screen/Gallery/TagUser';
import AboutPhoto from '../screen/Gallery/AboutPhoto';
import FilteredResult from '../screen/Gallery/FilteredResult';
import YellowPages from '../screen/YellowPage/YellowPages';
import ListMyBusiness from '../screen/YellowPage/AddPage/ListMyBusiness';
import BusinessDetails from '../screen/YellowPage/BusinessDetails';
import AboutYellowPage from '../screen/YellowPage/AboutYellowPage';
import NotificationListing from '../screen/Notification/NotificationListing';
import Teachers from '../screen/Teacher/Teachers';
import TeachersList from '../screen/Teacher/TeachersList';
import VolunteerList from '../screen/Teacher/VolunteerList';
import SocialListing from '../screen/SocialWork/SocialListing';
import ListMyWork from '../screen/SocialWork/AddListing/ListMyWork';
import ListingDetails from '../screen/SocialWork/Details/ListingDetails';
import ListSocialVenture from '../screen/SocialVentures/AddListing/ListSocialVenture';
import SocialVenture from '../screen/SocialVentures/SocialVenture';
import SocialVentureDetails from '../screen/SocialVentures/Details';
import SocialEvents from '../screen/Events/';
import ListSocialEvent from '../screen/Events/AddListing';
import EventDetails from '../screen/Events/Details';
import CommonRoom from '../screen/Ticker/';
import PostTicker from '../screen/Ticker/AddPost/';
import Settings from '../screen/Ticker/Settings/';
import Etiquette from '../screen/Ticker/Etiquette';
import MyPreviousPost from '../screen/Ticker/MyPreviousPost';
import Comments from '../screen/Ticker/Comments';
import ImageDemo from '../ImageDemo';
import JobListing from '../screen/jobs/';
import AddJobPost from '../screen/jobs/PostJob';
import JobDetails from '../screen/jobs/JobDetails/';
import VideoPlayer from '../component/VideoPlayer';
import YoutubePlayer from '../component/YoutubePlayer';
import ChatUserList from '../screen/chat/';
import ChatSettings from '../screen/chat/ChatSettings';
import ChatEtiquette from '../screen/chat/ChatEtiquette';
import StartChatWith from '../screen/chat/StartChatWith';
import ChatScreen from '../screen/chat/ChatScreen';
import ChatUserProfile from '../screen/chat/ChatUserProfile';
import TestScreen from '../screen/chat/TestScreen';
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
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppRules"
        component={AppRules}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppCommittee"
        component={AppCommittee}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppRepresentives"
        component={AppRepresentives}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AppChapters"
        component={AppChapters}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CommonWebPage"
        component={CommonWebPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Video"
        component={Video}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NewsListing"
        component={NewsListing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GalleryListing"
        component={GalleryListing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GalleryDetail"
        component={GalleryDetail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ImageList"
        component={ImageList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TagUser"
        component={TagUser}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AboutPhoto"
        component={AboutPhoto}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FilteredResult"
        component={FilteredResult}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="YellowPages"
        component={YellowPages}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ListMyBusiness"
        component={ListMyBusiness}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AboutYellowPage"
        options={{headerShown: false}}
        component={AboutYellowPage}
      />
      <Stack.Screen
        name="NotificationListing"
        component={NotificationListing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Teachers"
        component={Teachers}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TeachersList"
        component={TeachersList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VolunteerList"
        component={VolunteerList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SocialListing"
        component={SocialListing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ListMyWork"
        component={ListMyWork}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ListingDetails"
        component={ListingDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ListSocialVenture"
        component={ListSocialVenture}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SocialVenture"
        component={SocialVenture}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SocialVentureDetails"
        component={SocialVentureDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SocialEvents"
        component={SocialEvents}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ListSocialEvent"
        component={ListSocialEvent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EventDetails"
        component={EventDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CommonRoom"
        component={CommonRoom}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostTicker"
        component={PostTicker}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Etiquette"
        component={Etiquette}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MyPreviousPost"
        component={MyPreviousPost}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Comments"
        component={Comments}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="JobListing"
        component={JobListing}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddJobPost"
        component={AddJobPost}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="JobDetails"
        component={JobDetails}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VideoPlayer"
        component={VideoPlayer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="YoutubePlayer"
        component={YoutubePlayer}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatUserList"
        component={ChatUserList}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatSettings"
        component={ChatSettings}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatEtiquette"
        component={ChatEtiquette}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StartChatWith"
        component={StartChatWith}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ChatUserProfile"
        component={ChatUserProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};
