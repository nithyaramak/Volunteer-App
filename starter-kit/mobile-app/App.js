import 'react-native-gesture-handler';
import * as React from 'react';

import { Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoadingScreen from './src/screens/loading';
import Home from './src/screens/home';
import Chat from './src/screens/chat';
import SearchResources from './src/screens/resources-search';
import AddResource from './src/screens/resource-add';
import EditResource from './src/screens/resource-edit';
import MyResources from './src/screens/resources-my';
import Map from './src/screens/map';
import Login from './src/screens/login'
import Register from './src/screens/register'
import EventRegistration from './src/screens/event-registration';
import { HomeIcon, DonateIcon, SearchIcon, LoginIcon } from './src/images/svg-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ResourcesStackOptions = ({ navigation }) => {
  return ({
    headerRight: () => (
      <Button
        color='#ff8c00'
        onPress={() => navigation.navigate('Chat')}
        title='Chat '
      />
    )
  });
};

const tabBarOptions = {
  // showLabel: false,
  activeTintColor: '#ff7700',
  inactiveTintColor: '#000',
  style: {
    backgroundColor: '#F1F0EE',
    paddingTop: 5
  }
};

const TabLayout = () => (
  <Tab.Navigator
    style={{paddingTop: 50}}
    initialRouteName='Home'
    tabBarOptions={tabBarOptions} >
    <Tab.Screen
      name='Home'
      component={Home}
      options={{
        tabBarIcon: ({color}) => (<HomeIcon fill={color}/>)
      }}
    />
    <Tab.Screen
      name='Login'
      component={LoginStackLayout}
      options={{
        tabBarIcon: ({color}) => (<LoginIcon fill={color} />)
      }}
    />
{/*   <Tab.Screen
      name='Event Register'
      component={EventRegisterStackLayout}
      options={{
        tabBarIcon: ({color}) => (<LoginIcon fill={color} />)
      }}
    />*/}
    <Tab.Screen
      name='Search'
      component={SearchStackLayout}
      options={{
        tabBarIcon: ({color}) => (<SearchIcon fill={color} />)
      }}
    />
  </Tab.Navigator>
);

const SearchStackLayout = () => (
  <Stack.Navigator>
    <Stack.Screen name='Search Resources' component={SearchResources} options={ResourcesStackOptions} />
    <Stack.Screen name='Chat' component={Chat} />
    <Stack.Screen name='Map' component={Map} />
  </Stack.Navigator>
);

const LoginStackLayout = () => (
  <Stack.Navigator>
    <Stack.Screen name='Login' component={Login}  />
    <Stack.Screen name='User Registration' component={Register} />
  </Stack.Navigator>
);

const EventRegisterStackLayout = () => (
  <Stack.Navigator>
    <Stack.Screen name='Event Registration' component={EventRegistration}  />
  </Stack.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);


  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (<LoadingScreen />);
  } else {
    return (
      <NavigationContainer>
        <TabLayout/>
      </NavigationContainer>
    );
  }
};

export default App;
