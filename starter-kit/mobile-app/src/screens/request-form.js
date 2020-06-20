import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import PickerSelect from 'react-native-picker-select';

import {apiCall} from '../lib/utils';

const styles = StyleSheet.create({
  outerView: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  textInput: {
    fontFamily: 'IBMPlexSans-Medium',
    flex: 1,
    borderColor: '#ff8c00',
    borderWidth: 2,
    padding: 5,
    marginBottom: 20,
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

const RequestForm = function({navigation}) {
  const clearItem = {
    name: '',
    contact: '',
    causeType: 'Food/Water',
    description: 'description',
    city: '',
    state: '',
    country: ''
  };

  const [item, setItem] = React.useState(clearItem);

  React.useEffect(() => {
    setItem({...clearItem});
  }, []);

  const validations = payload => {
    console.log(payload.name);
    if (payload.name.length === 0 || !payload.name.match(/[A-Za-z]/gi)) {
      Alert.alert('Please enter valid name');
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
      },
      url = `api/request`;
    if (validations(payload)) {
      apiCall(payload, url)
        .then(() => {
          navigation.navigate('Home');
          Alert.alert(
            'Thank you!',
            'Request registered Successful',
            [{text: 'OK'}],
          );
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
      <Text style={styles.label}>Cause</Text>
      <PickerSelect
        style={{inputIOS: styles.selector}}
        value={item.causeType}
        onValueChange={t => setItem({...item, causeType: t})}
        items={[
          {label: 'Food/Water', value: 'Food/Water'},
          {label: 'Medicine', value: 'Medicine'},
          {label: 'Shelter', value: 'Shelter'},
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
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.textInput}
        value={item.contact}
        onChangeText={t => setItem({...item, contact: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Mobile Number"
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

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textInput}
        value={item.description}
        onChangeText={t => setItem({...item, description: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Event Description"
      />

      {item.causeType !== '' &&
        item.name.trim() !== '' &&
        item.contact.trim() !== '' && (
          <TouchableOpacity onPress={sendItem}>
            <Text style={styles.button}>Register</Text>
          </TouchableOpacity>
        )}
    </ScrollView>
  );
};

export default RequestForm;
