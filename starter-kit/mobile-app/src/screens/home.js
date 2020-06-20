import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Button, Linking, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  center: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF'
  },
  scroll: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 25,
    paddingTop: 120
  },
  image: {
    alignSelf: 'flex-start',
    height: '20%',
    width:'50%',
    resizeMode: 'contain'
  },
  title: {
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 36,
    color: '#323232',
    paddingBottom: 10,
    fontWeight: "bold"
  },
  subtitle: {
    fontFamily: 'IBMPlexSans-Light',
    fontSize: 24,
    color: '#323232',
    textDecorationColor: '#D0E2FF',
    textDecorationLine: 'underline',
    paddingBottom: 5,
    paddingTop: 20
  },
  content: {
    fontFamily: 'IBMPlexSans-Light',
    color: '#323232',
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  buttonGroup: {
    flex: 1,
    paddingTop: 15,
    width: 175
  },
  button: {
    backgroundColor: '#1062FE',
    color: '#FFFFFF',
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 16,
    overflow: 'hidden',
    padding: 12,
    textAlign:'center',
    marginTop: 15
  },
  backgroundImage: {
    flex: 1,
    width:null,
    height: 120,
    zIndex:-1,
    resizeMode: 'cover', // or 'stretch'
  }
});

const Home = () => (
  <View style={styles.center}>
        <ImageBackground
        style={styles.backgroundImage}
        source={require('../images/GettyImages-1188864563Yevhenii-Dubinko.jpg')}
      >
    <ScrollView style={styles.scroll}>

      <Text style={styles.title}>Guardian Angels</Text>
      <Text style={styles.content}>
        There is a great deal of satisfaction that comes from making a difference to people in your local community.
        There is a growing interest in enabling communities to cooperate among themselves to solve problems in times of crisis
      </Text>
      <Text style={styles.content}>
        What is needed is a solution that connects volunteers with people to understand and help with their basic needs.
      </Text>
      <Text style={styles.content}>
      Our motive is to build a self-sufficient society, connecting the helping hands to the needy ones.
      </Text>
    
    </ScrollView>
    </ImageBackground>
  </View>
);

export default Home;
