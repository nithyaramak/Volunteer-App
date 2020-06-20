import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {getToken} from '../lib/utils';
import {Card} from 'react-native-shadow-cards';

import {ScrollView} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  searchResultText: {
    fontFamily: 'IBMPlexSans-Bold',
    padding: 5,
    color: 'gray',
  },
  outerView: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  }
});

const Account = ({navigation}) => {
  const [user, setUser] = React.useState({}),
    value = getToken().then(value => value && setUser(value));

  return (
    <ScrollView style={styles.outerView}>
      <View style={styles.container}>
        {Object.keys(user).length ? (
          <Card style={{padding: 10, margin: 10}}>
            <Fragment>
              <Text style={styles.searchResultText}>Name : {user.name}</Text>
              <Text style={styles.searchResultText}>
                Mobile Number : {user.contact}
              </Text>
              <Text style={styles.searchResultText}>
                City : {user.address.city}
              </Text>
              <Text style={styles.searchResultText}>
                State : {user.address.state}
              </Text>
              <Text style={styles.searchResultText}>
                Country : {user.address.country}
              </Text>
            </Fragment>
          </Card>
        ) : null}
      </View>
    </ScrollView>
  );
};

export default Account;
