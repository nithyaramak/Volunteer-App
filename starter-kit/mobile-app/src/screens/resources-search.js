import React, {Fragment} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PickerSelect from 'react-native-picker-select';
import {ScrollView} from 'react-native-gesture-handler';
import {search, patchCall} from '../lib/utils';
import {Card} from 'react-native-shadow-cards';

const styles = StyleSheet.create({
  outerView: {
    backgroundColor: '#FFF',
    width: '100%',
    height: '100%',
  },
  inputsView: {
    backgroundColor: '#F1F0EE',
    padding: 16,
    padding: 22,
  },
  label: {
    fontFamily: 'IBMPlexSans-Medium',
    color: '#000',
    fontSize: 14,
    paddingBottom: 5,
  },
  selector: {
    fontFamily: 'IBMPlexSans-Medium',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 10,
  },
  textInput: {
    fontFamily: 'IBMPlexSans-Medium',
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 10,
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
  searchResultText: {
    fontFamily: 'IBMPlexSans-Bold',
    padding: 5,
    color: 'gray',
  },
  flatListView: {
    backgroundColor: '#FFF',
  },
  itemTouchable: {
    flexDirection: 'column',
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 0.25,
  },
  itemView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 24,
    fontFamily: 'IBMPlexSans-Medium',
  },
  itemQuantity: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Medium',
    color: 'gray',
  },
  itemDescription: {
    fontSize: 14,
    fontFamily: 'IBMPlexSans-Medium',
    color: 'gray',
  },
  buttonJoin: {
    backgroundColor: '#ff8c00',
    color: '#FFFFFF',
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 14,
    overflow: 'hidden',
    textAlign: 'center',
    paddingTop: 5,
    width: 70,
    height: 30,
    borderRadius: 4,
  },
  joinView: {
    alignItems: 'flex-end',
  },
});

const SearchResources = function({navigation, user}) {
  const [query, setQuery] = React.useState({type: 'events', filter: 'active'});
  const [items, setItems] = React.useState([]);
  const [info, setInfo] = React.useState(''),
    joinEvent = item => {
      const url = `api/event/join/${item._id}`;
      patchCall(item, url).then(() => {
        Alert.alert('Thank you!', 'Event Joined Successfully', [{text: 'OK'}]);
      });
    },
    updateEvent = item => {
      navigation.navigate('Event Registration');
    },
    closeEvent = item => {},
    getVacancy = item =>
      item.volunteerRequired - (item.volunteers ? item.volunteers.length : 0),
    getActionButtons = item => {
      return (
        <Fragment>
          {item.createdBy &&
          item.createdBy._id !== user._id &&
          getVacancy(item) ? (
            <View style={styles.joinView}>
              <TouchableOpacity onPress={() => joinEvent(item)}>
                <Text style={styles.buttonJoin}>Join</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {item.createdBy && item.createdBy._id === user._id && (
            <Fragment>
              <View style={styles.joinView}>
                <TouchableOpacity onPress={() => updateEvent(item)}>
                  <Text style={styles.buttonJoin}>Update</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.joinView}>
                <TouchableOpacity onPress={() => closeEvent(item)}>
                  <Text style={styles.buttonJoin}>Close</Text>
                </TouchableOpacity>
              </View>
            </Fragment>
          )}
        </Fragment>
      );
    },
    searchItem = () => {
      const payload = {
        ...query,
      };

      search(payload)
        .then(results => {
          setInfo(`${results.result.length} result(s)`);
          setItems(results.result);
          console.log(results.result[0].createdBy, 'zzzzzzz');
        })
        .catch(err => {
          console.log(err);
          Alert.alert(
            'ERROR',
            'Please try again. If the problem persists contact an administrator.',
            [{text: 'OK'}],
          );
        });
    };
  return (
    <View style={styles.outerView}>
      <View style={styles.inputsView}>
        <Text style={styles.label}>Type</Text>
        <PickerSelect
          style={{inputIOS: styles.selector}}
          value={query.type}
          onValueChange={t => setQuery({...query, type: t})}
          items={[
            {label: 'Events', value: 'events'},
            {label: 'Requests', value: 'requests'},
          ]}
        />
        <Text style={styles.label}>Filter</Text>
        <PickerSelect
          style={{inputIOS: styles.selector}}
          value={query.filter}
          onValueChange={t => setQuery({...query, filter: t})}
          items={[
            {label: 'Active', value: 'active'},
            {label: 'All', value: 'all'},
          ]}
        />

        <TouchableOpacity onPress={searchItem}>
          <Text style={styles.button}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.outerView}>
        <Text style={styles.searchResultText}>{info}</Text>
        <View style={styles.container}>
          {items.map((item, index) => {
            return (
              <Card key={index} style={{padding: 10, margin: 10}}>
                {query.type === 'events' && getActionButtons(item)}
                <Text style={styles.searchResultText}>
                  {`${query.type === 'events' ? 'Event Name' : 'Name'}`} :
                  {item.name}
                </Text>
                {query.type === 'events' && (
                  <Text style={styles.searchResultText}>
                    Event Owner : {item.createdBy && item.createdBy.name}
                  </Text>
                )}
                <Text style={styles.searchResultText}>
                  Mobile Number : {item.contact}
                </Text>
                {item.address && (
                  <Fragment>
                    <Text style={styles.searchResultText}>
                      City : {item.address.city}
                    </Text>
                  </Fragment>
                )}
                {query.type === 'events' && (
                  <Text style={styles.searchResultText}>
                    Vacancy : {getVacancy(item)}
                  </Text>
                )}
                <Text style={styles.searchResultText}>
                  Cause/Need : {item.causeType}
                </Text>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchResources;
