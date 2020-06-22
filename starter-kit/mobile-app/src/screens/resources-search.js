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
    marginLeft: 250,
  },
  buttonUpdate: {
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
    marginLeft: 200,
  },
  buttonClose: {
    backgroundColor: '#ff8c00',
    color: '#FFFFFF',
    fontFamily: 'IBMPlexSans-Medium',
    fontSize: 14,
    overflow: 'hidden',
    textAlign: 'center',
    padding: 5,
    width: 70,
    height: 30,
    borderRadius: 4,
    marginLeft: 10,
  },
  joinView: {
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  updateView: {
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  memberText: {
    fontFamily: 'IBMPlexSans-Bold',
    padding: 5,
    color: 'gray',
    marginLeft: 250
  },
});
const titleize = str => {
  return str
    .replace(/_/g, ' ')
    .replace(
      /\w\S*/g,
      txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
};

const SearchResources = function({navigation, userID}) {
  const [query, setQuery] = React.useState({type: 'events', filter: 'active'});
  const [items, setItems] = React.useState([]);
  const [info, setInfo] = React.useState(''),
    joinEvent = item => {
      const requestType = item.id === 'events' ? 'event' : 'request',
        url = `api/${requestType}/join/${item._id}`;

      patchCall(item, url).then(() => {
        searchItem();
        Alert.alert(
          'Thank you!',
          `${titleize(requestType)} Joined Successfully`,
          [{text: 'OK'}],
        );
      });
    },
    updateEvent = item => {
      const payload = {
        id: item._id,
        name: item.name,
        description: item.description,
        contact: item.contact,
        city: item.address.city,
        state: item.address.state,
        country: item.address.country,
        volunteerRequired: item.volunteerRequired,
        funds: item.funds,
        causeType: item.causeType,
      };

      navigation.jumpTo('Event Registration', {payload, searchItem});
    },
    closeEvent = item => {
      const requestType = item.id === 'events' ? 'event' : 'request',
        url = `api/${requestType}/close/${item._id}`;

      patchCall(item, url).then(() => {
        searchItem();
        Alert.alert(
          'Thank you!',
          `${titleize(requestType)} Closed Successfully`,
          [{text: 'OK'}],
        );
      });
    },
    getVacancy = item =>
      item.volunteerRequired - (item.volunteers ? item.volunteers.length : 0),
    existingVolunteer = item => {
      return (
        item.volunteers &&
        item.volunteers
          .filter(volunteer => volunteer)
          .find(volunteer => volunteer._id === userID)
      );
    },
    memberAlready = item => {
      return item.id === 'events'
        ? item.createdBy && item.createdBy._id !== userID
        : true;
    },
    closeQueryCondition = item => {
      return item.id === 'events'
        ? item.createdBy && item.createdBy._id === userID
        : item.volunteers &&
            item.volunteers.find(volunteer => volunteer._id === userID);
    },
    getUpdateButton = item => {
      return (
        item.createdBy &&
        item.createdBy._id === userID && (
          <TouchableOpacity onPress={() => updateEvent(item)}>
            <Text style={styles.buttonUpdate}>Update</Text>
          </TouchableOpacity>
        )
      );
    },
    getFilterOptions = () => {
      const options = [
        {label: 'Active', value: 'active'},
        {label: 'All', value: 'all'},
      ];
      if (userID) {
        const label = query.type === 'events' ? 'My Events' : 'My Requests';
        options.push({label, value: 'self'});
      }
      return options;
    },
    searchItem = () => {
      const payload = {
        ...query,
      };
      let url = `api/${payload.type}`;
      if (payload.filter === 'self') {
        url = `api/${
          payload.type === 'events' ? 'event/list' : 'request/list'
        }`;
      }

      search(payload, url)
        .then(results => {
          setInfo(`${results.result.length} result(s)`);
          setItems(results.result);
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
  const queryTypeCheck = item =>
    item.id === 'events'
      ? getVacancy(item) && item.createdBy && item.createdBy._id !== userID
      : true;

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
          items={getFilterOptions()}
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
                {item.isActive && userID && (
                  <View style={styles.joinView}>
                    {queryTypeCheck(item) ? (
                      !existingVolunteer(item) ? (
                        <TouchableOpacity onPress={() => joinEvent(item)}>
                          <Text style={styles.buttonJoin}>Join</Text>
                        </TouchableOpacity>
                      ) : memberAlready(item) ? (
                        <Text style={styles.memberText}>Member</Text>
                      ) : null
                    ) : null}
                    {item.id === 'events' && getUpdateButton(item)}
                    {closeQueryCondition(item) && (
                      <TouchableOpacity onPress={() => closeEvent(item)}>
                        <Text style={styles.buttonClose}>Close</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <Text style={styles.searchResultText}>
                  {`${item.id === 'events' ? 'Event Name' : 'Name'}`} :
                  {item.name}
                </Text>
                {item.id === 'events' && (
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
                {item.id === 'events' && (
                  <Text style={styles.searchResultText}>
                    Vacancy : {getVacancy(item)}
                  </Text>
                )}
                <Text style={styles.searchResultText}>
                  Cause/Need : {item.causeType}
                </Text>
                <Text style={styles.searchResultText}>
                  Active : {item.isActive ? 'Yes' : 'No'}
                </Text>
                <Text style={styles.searchResultText}>
                  Volunteer Contact :{' '}
                  {(item.volunteers &&
                    item.volunteers.length &&
                    item.volunteers[0].contact) ||
                    'N/A'}
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
