import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

import {add} from '../lib/utils';

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 22,
    backgroundColor: '#fff',
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
  },
});

const Login = function({navigation}) {
  const clearItem = {
    userName: '',
    password: ''
    };
  const [item, setItem] = React.useState(clearItem);

  React.useEffect(() => {
    setItem({...clearItem});
  }, []);

  const sendItem = () => {
    const payload = {
      ...item,
    };

    add(payload)
      .then(() => {
        Alert.alert('Success', 'Login Successful.', [{text: 'OK'}]);
        setItem({...clearItem});
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

      <Text style={styles.label}>UserName</Text>
      <TextInput
        style={styles.textInput}
        value={item.userName}
        onChangeText={t => setItem({...item, userName: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="UserName"
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
          <Text style={styles.button}>Sign Up</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;
