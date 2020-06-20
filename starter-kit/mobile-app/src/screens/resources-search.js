import React from 'react';
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
import { ScrollView } from 'react-native-gesture-handler';
import {search} from '../lib/utils';
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
    borderRadius: 4
  },
  joinView: {
    alignItems: "flex-end" 
  },
});

const SearchResources = function({route, navigation}) {
  const [query, setQuery] = React.useState({type: 'Food', name: ''});
  const [items, setItems] = React.useState([]);
  const [info, setInfo] = React.useState('');

  const Item = props => {
    return (
      <TouchableOpacity
        style={styles.itemTouchable}
        onPress={() => {
          navigation.navigate('Map', {item: props});
        }}>
        <View style={styles.itemView}>
          <Text style={styles.itemName}>{props.name}</Text>
          <Text style={styles.itemQuantity}> ( {props.quantity} ) </Text>
        </View>
        <Text style={styles.itemDescription}>{props.description}</Text>
      </TouchableOpacity>
    );
  };

  const searchItem = () => {
    const payload = {
      ...query,
    };

    search(payload)
      .then(results => {
        setInfo(`${results.length} result(s)`);
        setItems(results);
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
  const users = [
    {Name: 'Mayuri', Address: 'Mumbai', Contact: '12349585849', Vacancy: "Yes"},
    {Name: 'Ankita', Address: 'Mumbai', Contact: '12349585849', Vacancy: "No"},
    {Name: 'Mayuri', Address: 'Mumbai', Contact: '12349585849', Vacancy: "Yes"},
    {Name: 'Ankita', Address: 'Mumbai', Contact: '12349585849', Vacancy: "No"}
  ];
  return (
    <View style={styles.outerView}>
      <View style={styles.inputsView}>
        <Text style={styles.label}>Type</Text>
        <PickerSelect
          style={{inputIOS: styles.selector}}
          value={query.type}
          onValueChange={t => setQuery({...query, type: t})}
          items={[
            {label: 'Volunteers', value: 'volunteers'},
            {label: 'Event', value: 'Event'},
            {label: 'Organisation', value: 'Organisation'},
          ]}
        />

        <TouchableOpacity onPress={searchItem}>
          <Text style={styles.button}>Search</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.outerView}>
      <View style={styles.container}>
        {Object.keys(users).map((key, i) => {
          return (
            <Card key={i} style={{padding: 10, margin: 10}}>
              <View style={styles.joinView}>
              <TouchableOpacity>
                <Text style={styles.buttonJoin}>Join</Text>
              </TouchableOpacity>
              </View>

              {Object.keys(users[key]).map((item, index) => {
                return (
                  <Text style={styles.searchResultText}>
                    {item} : {users[key][item]}
                  </Text>
                );
              })}
            </Card>
          );
        })}
      </View>
      </ScrollView>

      <FlatList
        style={styles.flatListView}
        data={items}
        renderItem={({item}) => <Item {...item} />}
        keyExtractor={item => item.id || item['_id']}
      />
    </View>
  );
};

export default SearchResources;
