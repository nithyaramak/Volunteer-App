const jwt = require('jsonwebtoken');
const randtoken = require('rand-token');
function randomToken(){
  // Generate a 16 character alpha-numeric token:
  return randtoken.generate(16);
}

function constructResourceObject(id, params){
  let whenCreated = Date.now();
  let item = {
    _id: id,
    id: "resources",
    type: params.type,
    name: params.name,
    description: params.description,
    quantity: params.quantity,
    location: params.location,
    contact: params.contact,
    userID: params.userID,
    whenCreated: whenCreated
  };
  return item;
}

function constructEventObject(id, params, currentUser){
  let now = Date.now();
  let item = {
    _id: id,
    id: "events",
    name: params.name,
    description: params.description,
    volunteerRequired: params.volunteerRequired || 1,
    volunteerPresent: 1,
    funds: params.funds || 0,
    contact: params.contact,
    address: {
      city: params.city,
      state: params.state,
      country: params.country
    },
    whenCreated: now,
    whenUpdated: now,
    volunteers: [{
      _id: currentUser._id,
      _rev: currentUser._rev,
      id: "users",
      name: currentUser.name,
      email: currentUser.email,
      address: currentUser.address,
      userType: currentUser.userType,
      causeType: currentUser.causeType,
      contact: currentUser.contact,
      pan: currentUser.pan
    }],
    createdBy: {
      _id: currentUser._id,
      _rev: currentUser._rev,
      id: "users",
      name: currentUser.name,
      email: currentUser.email,
      address: currentUser.address,
      userType: currentUser.userType,
      causeType: currentUser.causeType,
      contact: currentUser.contact,
      pan: currentUser.pan
    },
    isActive: true
  };
  return item;
}

function constructRequestObject(id, params){
  let now = Date.now();
  let item = {
    _id: id,
    id: "requests",
    name: params.name,
    description: params.description,
    contact: params.contact,
    address: {
      city: params.city,
      state: params.state,
      country: params.country
    },
    causeType: params.causeType,
    whenCreated: now,
    whenUpdated: now,
    volunteers: params.volunteers,
    isActive: true
  };
  return item;
}

function constructUserObject(id, params){
  let now = Date.now();
  let item = {
    _id: id,
    id: "users",
    name: params.name,
    email: params.email,
    address: {
      city: params.city.toLowerCase(),
      state: params.state,
      country: params.country,
      pincode: params.pincode
    },
    password: params.password,
    userType: params.userType,
    causeType: params.causeType,
    contact: params.contact,
    pan: params.pan,
    token: randomToken(),
    activeRequestCount: params.activeRequestCount,
    totalRequestCount: params.totalRequestCount,
    whenCreated: now,
    whenUpdated: now
  };
  return item;
}

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

module.exports = {
  constructResourceObject: constructResourceObject,
  constructEventObject: constructEventObject,
  constructUserObject: constructUserObject,
  randomToken: randomToken,
  constructRequestObject: constructRequestObject,
  validateEmail: validateEmail
};