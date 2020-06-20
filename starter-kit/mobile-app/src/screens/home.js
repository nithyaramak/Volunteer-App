import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {getToken} from '../lib/utils';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 25,
    paddingTop: 120,
  },
  title: {
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 36,
    color: '#323232',
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  content: {
    fontFamily: 'IBMPlexSans-Light',
    color: '#323232',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff8c00',
    color: '#FFFFFF',
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 16,
    overflow: 'hidden',
    padding: 12,
    textAlign: 'center',
    marginTop: 15,
    width: 200,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: 120,
    zIndex: -1,
    resizeMode: 'cover', // or 'stretch'
  },
  requestView: {
    alignItems: 'center',
  },
});

const Home = ({navigation}) => {
  const [user, setUser] = React.useState(''),
    value = getToken().then(value => setUser(value ? value.name : ''));

  return (
    <View style={styles.center}>
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../images/GettyImages-1188864563Yevhenii-Dubinko.jpg')}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.title}>Guardian Angels {user}</Text>
          <Text style={styles.content}>
            There is a great deal of satisfaction that comes from making a
            difference to people in your local community. There is a growing
            interest in enabling communities to cooperate among themselves to
            solve problems in times of crisis
          </Text>
          <Text style={styles.content}>
            What is needed is a solution that connects volunteers with people to
            understand and help with their basic needs.
          </Text>
          <Text style={styles.content}>
            Our motive is to build a self-sufficient society, connecting the
            helping hands to the needy ones.
          </Text>
          <View style={styles.requestView}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register Request');
              }}>
              <Text style={styles.button}>Raise a Request</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default Home;
