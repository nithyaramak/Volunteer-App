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

import {add, userID} from '../lib/utils';

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 22,
    backgroundColor: '#fff',
  },
  splitView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: "#FFF"
  },
  quantityArea: {
    width: '40%',
  },
  textInput: {
    fontFamily: 'IBMPlexSans-Medium',
    flex: 1,
    borderColor: '#ff8c00',
    borderWidth: 2,
    padding: 14,
    marginBottom: 25,
    
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
    userID: userID(),
    type: 'Event',
    userType: 'Beneficiary',
    name: '',
    address: '',
    pan: '',
    contact: ''
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
        Alert.alert('Thank you!', 'Registration Successful.', [{text: 'OK'}]);
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
      <Text style={styles.label}>User Type</Text>
      <PickerSelect
        style={{inputIOS: styles.selector}}
        value={item.userType}
        onValueChange={t => setItem({...item, userType: t})}
        items={[
          {label: 'Beneficiary', value: 'Beneficiary'},
          {label: 'Volunteer', value: 'Volunteer'},
          {label: 'Organization', value: 'Organization'},
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
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.textInput}
        value={item.address}
        onChangeText={t => setItem({...item, address: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Address"
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

        <Text style={styles.label}>Cause / Needs</Text>
        <PickerSelect
            style={{inputIOS: styles.selector}}
            value={item.cause}
            onValueChange={t => setItem({...item, cause: t})}
                items={[
                {label: 'Food', value: 'Food'},
                {label: 'Help', value: 'Help'},
                {label: 'Other', value: 'Other'},
                ]}
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
