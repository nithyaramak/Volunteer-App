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
import { YellowBox } from 'react-native';
import {apiCall, update} from '../lib/utils';

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

const EventRegistration = function({route, navigation}) {
  const clearItem = {
    name: '',
    description: '',
    contact: '',
    city: '',
    state: '',
    country: '',
    volunteerRequired: '1',
    funds: '',
    causeType: 'Food/Water',
  };
  const [item, setItem] = React.useState(clearItem);
  const [useLocation, setUseLocation] = React.useState(true);
  const [position, setPosition] = React.useState({});

  const validations = payload => {
    if (payload.name.length === 0) {
      Alert.alert('Please enter valid event name');
      return false;
    }
    if (payload.description.length === 0) {
      Alert.alert('Please enter event description');
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
  React.useEffect(() => {
    YellowBox.ignoreWarnings([
      'Non-serializable values were found in the navigation state',
    ]);
    if (route.params && route.params.payload) {
      setItem(route.params.payload);
    }
  }, [route.params]);


  const sendItem = () => {
    const payload = {
        ...item,
      },
      url = `api/event`;
    if (validations(payload)) {
      if (route.params) {
        update(item, url)
          .then(() => {
            route.params && route.params.searchItem();
            Alert.alert('Thank you', 'Event Updated Successfully!', [{text: 'OK'}]);
          })
          .catch(err => {
            console.log(err, 'error');
            Alert.alert(
              'ERROR',
              'Please try again. If the problem persists contact an administrator.',
              [{text: 'OK'}],
            );
          });
      } else {
        apiCall(payload, url)
          .then(() => {
            Alert.alert('Thank you', 'Event Registered!', [{text: 'OK'}]);
            setItem({...clearItem});
          })
          .catch(err => {
            console.log(err, 'error');
            Alert.alert(
              'ERROR',
              'Please try again. If the problem persists contact an administrator.',
              [{text: 'OK'}],
            );
          });
      }
    }
  };

  
  return (
    <ScrollView style={styles.outerView}>
      <Text style={styles.label}>Event Name</Text>
      <TextInput
        style={styles.textInput}
        value={item.name}
        onChangeText={t => setItem({...item, name: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="e.g., Free Education"
        blurOnSubmit={false}
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

      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.textInput}
        value={item.city}
        onChangeText={t => setItem({...item, city: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        blurOnSubmit={false}
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
        blurOnSubmit={false}
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
        blurOnSubmit={false}
        placeholder="Country"
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

      <Text style={styles.label}>Volunteer Count</Text>
      <TextInput
        style={styles.textInput}
        value={item.volunteerRequired}
        onChangeText={t => setItem({...item, volunteerRequired: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        placeholder="Number of Volunteers"
        blurOnSubmit={false}
      />
      <Text style={styles.label}>Estimated Funds</Text>
      <TextInput
        style={styles.textInput}
        value={item.funds}
        onChangeText={t => setItem({...item, funds: t})}
        onSubmitEditing={sendItem}
        returnKeyType="send"
        enablesReturnKeyAutomatically={true}
        keyboardType="numeric"
        blurOnSubmit={false}
        placeholder="Funds required"
      />
      <Text style={styles.label}>Cause / Needs</Text>
      <PickerSelect
        style={{inputIOS: styles.selector}}
        value={item.causeType}
        onValueChange={t => setItem({...item, causeType: t})}
        items={[
          {label: 'Medicine', value: 'Medicine'},
          {label: 'Shelter', value: 'Shelter'},
          {label: 'Food/Water', value: 'Food/Water'},
          {label: 'Educational Help', value: 'Educational Help'},
          {label: 'Daily Essentials', value: 'Daily Essentials'},
        ]}
      />
      {item.causeType !== '' &&
        item.name.trim() !== '' &&
        item.contact.trim() !== '' && (
          <TouchableOpacity onPress={sendItem}>
            <Text style={styles.button}>
              {route.params ? 'Update Event' : 'Register'}
            </Text>
          </TouchableOpacity>
        )}
    </ScrollView>
  );
};

export default EventRegistration;
