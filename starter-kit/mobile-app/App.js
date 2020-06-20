import 'react-native-gesture-handler';
import * as React from 'react';

import {Button, AsyncStorage} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LoadingScreen from './src/screens/loading';
import Home from './src/screens/home';
import Chat from './src/screens/chat';
import SearchResources from './src/screens/resources-search';
import Map from './src/screens/map';
import Login from './src/screens/login';
import Register from './src/screens/register';
import Account from './src/screens/user-account';
import EventRegistration from './src/screens/event-registration';
import {
  HomeIcon,
  SearchIcon,
  LoginIcon,
  RegisterIcon,
} from './src/images/svg-icons';
import RequestForm from './src/screens/request-form';
import {logout, getToken} from './src/lib/utils';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true),
    [user, setUser] = React.useState(''),
    value = getToken().then(value => setUser(value && value.name));

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const logoutUser = navigation => {
    getToken().then(
      user =>
        user &&
        logout(user._id).then(() => {
          setUser('');
          AsyncStorage.removeItem('user').then(() =>
            navigation.navigate('Login'),
          );
        }),
    );
  };

  const ResourcesStackOptions = ({navigation}) => {
    return {
      headerRight: () => (
        <Button
          color="#ff8c00"
          onPress={() => navigation.navigate('Chat')}
          title="Chat"
        />
      ),
    };
  };

  const AccountStackOptions = ({navigation}) => {
    return {
      headerRight: () => (
        <Button
          color="#ff8c00"
          onPress={() => logoutUser(navigation)}
          title="Logout"
        />
      ),
    };
  };

  const welcomeMessage = () => {
    return {
      headerRight: () => <Text color="#ff8c00">Welcome</Text>,
    };
  };

  const tabBarOptions = {
    activeTintColor: '#ff7700',
    inactiveTintColor: '#000',
    style: {
      backgroundColor: '#F1F0EE',
      paddingTop: 5,
    },
  };

  const TabLayout = props => (
    <Tab.Navigator
      style={{paddingTop: 50}}
      initialRouteName="Home"
      tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="Home"
        component={HomeStackLayout}
        options={{
          tabBarIcon: ({color}) => <HomeIcon fill={color} />,
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchStackLayout}
        options={{
          tabBarIcon: ({color}) => <SearchIcon fill={color} />,
        }}
      />
      {props.showEventTab ? (
        <React.Fragment>
          <Tab.Screen
            name="Register Event"
            component={EventRegisterStackLayout}
            options={{
              tabBarIcon: ({color}) => <RegisterIcon fill={color} />,
            }}
          />
          <Tab.Screen
            name="Account"
            component={AccountStackLayout}
            options={{
              tabBarIcon: ({color}) => <LoginIcon fill={color} />,
            }}
          />
        </React.Fragment>
      ) : (
        <Tab.Screen
          name="Login"
          component={LoginStackLayout}
          options={{
            tabBarIcon: ({color}) => <LoginIcon fill={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );

  const SearchStackLayout = () => (
    <Stack.Navigator>
      <Stack.Screen name="Search Resources" options={ResourcesStackOptions}>
        {navigation => <SearchResources user={user} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Map" component={Map} />
    </Stack.Navigator>
  );

  const LoginStackLayout = () => (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {navigation => <Login setUser={setUser} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen name="User Registration" component={Register} />
    </Stack.Navigator>
  );

  const AccountStackLayout = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={Account}
        options={AccountStackOptions}
      />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );

  const EventRegisterStackLayout = () => (
    <Stack.Navigator>
      <Stack.Screen name="Event Registration" component={EventRegistration} />
    </Stack.Navigator>
  );

  const HomeStackLayout = () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Register Request" component={RequestForm} />
    </Stack.Navigator>
  );

  if (isLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <NavigationContainer>
        <TabLayout showEventTab={user} />
      </NavigationContainer>
    );
  }
};

export default App;
