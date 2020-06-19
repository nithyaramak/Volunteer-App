import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PickerSelect from 'react-native-picker-select';
import {CheckedIcon, UncheckedIcon, RegisterIcon} from '../images/svg-icons';
import Geolocation from '@react-native-community/geolocation';

import {apiCall, userID} from '../lib/utils';

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  splitView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeArea: {
    width: '40%',
    color: '#FFF',
  },
  label: {
    fontFamily: 'IBMPlexSans-Medium',
    color: '#000',
    fontSize: 14,
    paddingBottom: 5,
  },
  selector: {
    fontFamily: 'IBMPlexSans-Medium',
    borderColor: '#ff8c00',
    borderWidth: 2,
    padding: 16,
    marginBottom: 25,
    color: '#000',
  },
  quantityArea: {
    width: '40%',
  },
  textInput: {
    fontFamily: 'IBMPlexSans-Medium',
    flex: 1,
    borderColor: '#ff8c00',
    borderWidth: 2,
    padding: 5,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  checkboxLabel: {
    fontFamily: 'IBMPlexSans-Light',
    fontSize: 13,
  },
  textInputDisabled: {
    fontFamily: 'IBMPlexSans-Medium',
    backgroundColor: '#f4f4f4',
    color: '#999',
    flex: 1,
    padding: 16,
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

const Register = function({navigation}) {
  const clearItem = {
    name: '',
    password:'',
    contact: '',
    userType: 'Volunteer',
    type: 'Food',
    email: 'abc@startv.com',
    description: 'adbc',
    city: '',
    state: '',
    country: '',
    pan: '',
  };

  const [item, setItem] = React.useState(clearItem);

  React.useEffect(() => {
    setItem({...clearItem});
  }, []);

  const validations = payload => {
    console.log(payload.name);
    if (payload.name.length === 0 || !payload.name.match(/[A-Za-z]/ig)) {
      Alert.alert('Please enter valid name');
      return false;
    }
    if (payload.password.length === 0) {
      Alert.alert('Please enter password');
      return false;
    }
    if (payload.password.length < 8) {
      Alert.alert('password length should be more than 8 characters');
      return false;
    }
    if (payload.contact.length < 10) {
      Alert.alert('Contact number cannot be less than 10 digits');
      return false;
    }
    if (payload.city.length === 0) {
      Alert.alert('Please enter city name');
      return false;
    }
    return true;
  };
  const sendItem = () => {
    const payload = {
      ...item,
    }, url = `signup`
    if (validations(payload)) {
      apiCall(payload, url)
        .then(() => {
          Alert.alert('Thank you!', 'Registration Successful.', [{text: 'OK'}]);
          setItem({...clearItem});
        })
        .catch(err => {
          console.log(err, 'err----');
          Alert.alert(
            'ERROR',
            'Please try again. If the problem persists contact an administrator.',
            [{text: 'OK'}],
          );
        });
    }
  };

  return (
    <ScrollView style={styles.outerView}>
      <Text style={styles.label}>User Type</Text>
      <PickerSelect
        style={{inputIOS: styles.selector}}
        value={item.userType}
        onValueChange={t => setItem({...item, userType: t})}
        items={[
          {label: 'Volunteer', value: 'Volunteer'},
          {label: 'Beneficiary', value: 'Beneficiary'},
          {label: 'Organization', value: 'Organization'},
        ]}
      />
      <Text style={styles.label}>Cause / Needs</Text>
      <PickerSelect
        style={{inputIOS: styles.selector}}
        value={item.type}
        onValueChange={t => setItem({...item, type: t})}
        items={[
          {label: 'Food', value: 'Food'},
          {label: 'Medicine', value: 'Medicine'},
          {label: 'Shelter', value: 'Shelter'},
          {label: 'Food/Water', value: 'Food/Water'},
          {label: 'Educational Help', value: 'Educational Help'},
          {label: 'Daily Essentials', value: 'Daily Essentials'},
        ]}
      />
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.textInput}
        value={item.name}
        onChangeText={t => setItem({...item, name: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Name"
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
        blurOnSubmit={false}
      />
      <Text style={styles.label}>Contact</Text>
      <TextInput
        style={styles.textInput}
        value={item.contact}
        onChangeText={t => setItem({...item, contact: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Contact"
      />
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.textInput}
        value={item.city}
        onChangeText={t => setItem({...item, city: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="City"
      />
      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.textInput}
        value={item.state}
        onChangeText={t => setItem({...item, state: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="State"
      />
      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.textInput}
        value={item.country}
        onChangeText={t => setItem({...item, country: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Country"
      />

      <Text style={styles.label}>PAN Card Details</Text>
      <TextInput
        style={styles.textInput}
        value={item.pan}
        onChangeText={t => setItem({...item, pan: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="PAN ID"
      />

      {item.type !== '' &&
        item.name.trim() !== '' &&
        item.contact.trim() !== '' && (
          <TouchableOpacity onPress={sendItem}>
            <Text style={styles.button}>Register</Text>
          </TouchableOpacity>
        )}
    </ScrollView>
  );
};

export default Register;
