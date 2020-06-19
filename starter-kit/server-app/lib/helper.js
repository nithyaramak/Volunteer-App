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

function constructEventObject(id, params){
  let whenCreated = Date.now();
  let item = {
    _id: id,
    id: "events",
    name: params.name,
    description: params.description,
    volunteerCount: params.volunteerCount,
    funds: params.funds,
    contact: params.contact,
    whenCreated: whenCreated
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
    address: params.address,
    password: params.password,
    userType: params.userType,
    cause: params.cause,
    contact: params.contact,
    pan: params.pan,
    token: randomToken(),
    whenCreated: now,
    whenUpdated: now
  };
  return item;
}

module.exports = {
  constructResourceObject: constructResourceObject,
  constructEventObject: constructEventObject,
  constructUserObject: constructUserObject,
  randomToken: randomToken
};