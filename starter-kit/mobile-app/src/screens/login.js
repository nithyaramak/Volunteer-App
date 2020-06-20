import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  AsyncStorage
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {apiCall} from '../lib/utils';

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 22,
    backgroundColor: '#fff'
  },
  label: {
    fontFamily: 'IBMPlexSans-Medium',
    color: '#000',
    fontSize: 14,
    paddingBottom: 5,
  },
  textInput: {
    fontFamily: 'IBMPlexSans-Medium',
    flex: 1,
    borderColor: '#ff8c00',
    borderWidth: 2,
    padding: 14,
    marginBottom: 25,
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
  }
});

const Login = ({navigation, setUser}) => {
  const clearItem = {
    contact: '',
    password: ''
    };
  const [item, setItem] = React.useState(clearItem);

   React.useEffect(() => {
    setItem({...clearItem});
  }, []);

console.log(navigation, setUser,"setUser");
  const sendItem = async () => {
    const payload = {
      ...item,
    }, url = `login`

     await apiCall(payload, url)
      .then((res) => {
        Alert.alert('Success', 'Login Successful.', [{text: 'OK'}]);
        setItem({...clearItem});
        setUser(payload.name)
        AsyncStorage.setItem('user', JSON.stringify(res.result)).then(()=> navigation.navigate('Home'));
      })
      .catch(err => {
        console.log(err,"err----");
        Alert.alert(
          'ERROR',
          'Please try again. If the problem persists contact an administrator.',
          [{text: 'OK'}],
        );
      });
  };

  return (
    <ScrollView style={styles.outerView}>
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.textInput}
        value={item.contact}
        onChangeText={t => setItem({...item, contact: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Mobile number"
        blurOnSubmit={false}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.textInput}
        value={item.password}
        onChangeText={t => setItem({...item, password: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        secureTextEntry={true}
        placeholder="Password"
      />
      <TouchableOpacity onPress={sendItem}>
        <Text style={styles.button}>Login</Text>
      </TouchableOpacity>
      
       <TouchableOpacity
         style={styles.itemTouchable}
         onPress={() => {
           navigation.navigate('User Registration');
         }}>
          <Text style={styles.button} >Sign Up</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;
