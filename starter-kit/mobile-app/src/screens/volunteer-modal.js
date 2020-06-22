import React, {Component, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

const VolunteerModal = ({modalVisible, setModalVisible, volunteersList}) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {volunteersList.length ? (
              volunteersList.map((item, index) => (
                <React.Fragment>
                  <Text style={styles.modalText}>{`${index + 1}. Name : ${
                    item.name
                  }`}</Text>
                  <Text style={styles.modalTextcontact}>{`Mobile Number : ${
                    item.contact
                  }`}</Text>
                  <Text style={styles.modalTextBottom} />
                </React.Fragment>
              ))
            ) : (
              <Text style={styles.defaultText}>No volunteers assigned</Text>
            )}
            <View style={styles.centeredView}>
              <TouchableHighlight
                style={{...styles.openButton}}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 30,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 70,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 4,
    width: 100,
    marginLeft: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTextBottom: {
    marginBottom: 2,
  },
  modalTextcontact: {
    marginLeft: 15,
  },
  defaultText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VolunteerModal;
