const helper = require('./helper.js');
const Cloudant = require('@cloudant/cloudant');

const cloudant_id = process.env.CLOUDANT_ID || '<cloudant_id>'
const cloudant_apikey = process.env.CLOUDANT_IAM_APIKEY || '<cloudant_apikey>';

// UUID creation
const uuidv4 = require('uuid/v4');
var cloudant = new Cloudant({
    account: cloudant_id,
    plugins: {
      iamauth: {
        iamApiKey: cloudant_apikey
      }
    }
  })

// Cloudant DB reference
let db;
let db_name = "volunteer-app";

/**
 * Connects to the Cloudant DB, creating it if does not already exist
 * @return {Promise} - when resolved, contains the db, ready to go
 */
const dbCloudantConnect = () => {
    return new Promise((resolve, reject) => {
        Cloudant({  // eslint-disable-line
            account: cloudant_id,
                plugins: {
                    iamauth: {
                        iamApiKey: cloudant_apikey
                    }
                }
        }, ((err, cloudant) => {
            if (err) {
                console.log('Connect failure: ' + err.message + ' for Cloudant ID: ' +
                    cloudant_id);
                reject(err);
            } else {
                cloudant.db.list().then((body) => {
                    if (!body.includes(db_name)) {
                        console.log('DB Does not exist..creating: ' + db_name);
                        cloudant.db.create(db_name).then(() => {
                            if (err) {
                                console.log('DB Create failure: ' + err.message + ' for Cloudant ID: ' +
                                cloudant_id);
                                reject(err);
                            }
                        })
                    }
                    let db = cloudant.use(db_name);
                    console.log('Connect success! Connected to DB: ' + db_name);
                    resolve(db);
                }).catch((err) => { console.log(err); reject(err); });
            }
        }));
    });
}

// Initialize the DB when this module is loaded
(function getDbConnection() {
    console.log('Initializing Cloudant connection...', 'getDbConnection()');
    dbCloudantConnect().then((database) => {
        console.log('Cloudant connection initialized.', 'getDbConnection()');
        db = database;
    }).catch((err) => {
        console.log('Error while initializing DB: ' + err.message, 'getDbConnection()');
        throw err;
    });
})();

/**
 * Find all resources that match the specified partial name.
 * 
 * @param {String} type
 * @param {String} partialName
 * @param {String} userID
 * 
 * @return {Promise} Promise - 
 *  resolve(): all resource objects that contain the partial
 *          name, type or userID provided, or an empty array if nothing
 *          could be located that matches. 
 *  reject(): the err object from the underlying data store
 */
function find(id, params) {
    return new Promise((resolve, reject) => {
        let selector = {"id": id}
        if(params.isActive == true){
          selector["isActive"] = params.isActive
        }
        if(params.name != null){
          selector["name"] = params.name
        }
        db.find({ 
            'selector': selector
        }, (err, documents) => {
            if (err) {
                reject(err);
            } else {
                resolve({ result: documents.docs, statusCode: 200});
            }
        });
    });
}

/**
 * Delete a resource that matches a ID.
 * 
 * @param {String} id
 * 
 * @return {Promise} Promise - 
 *  resolve(): Status code as to whether to the object was deleted
 *  reject(): the err object from the underlying data store
 */
function deleteById(id, rev) {
    return new Promise((resolve, reject) => {
        db.get(id, (err, document) => {
            if (err) {
                resolve(err.statusCode);
            } else {
                db.destroy(id, document._rev, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(200);
                    }
                })
            }            
        })
    });
}

/**
 * Create a resource with the specified attributes
 * 
 * @param {String} type - the type of the item(event, user, resource)
 * @param {Json} params - the params in the request
 * 
 * @return {Promise} - promise that will be resolved (or rejected)
 * when the call to the DB completes
 */
function createEvent(params, headers) {
  return new Promise((resolve, reject) => {
      db.find({'selector': {"token": headers.token, "id": "users"}}, (err, users) => {
        if (err) {
          reject(err)
      } else {
        let user = users.docs.length > 0 ? users.docs[0] : null
        if(user != null){
          let id = uuidv4();
          let item = helper.constructEventObject(id, params, user)
          let selector = {"name": params.name, "id": "events"}
          db.find({ 'selector': selector},(err, documents) => {
            if (err) {
              console.log('Error occurred: ' + err.message, 'find()');
              reject(err);
            } else {
              if(documents.docs.length == 0 ){
                db.insert(item, (err, result) => {
                  if (err) {
                      console.log('Error occurred: ' + err.message, 'create()');
                      reject(err);
                  } else {
                      resolve({result: item, statusCode: 201 });
                  }
                });
              }else{
                resolve({"error": "Event already exists", statusCode: 400 });
              }
            }
          })
        }else{
          resolve({"error": "Unauthorised, please login to continue", statusCode: 401 });
        }
      }
    })
  });
}

function createUser(params, headers) {
  return new Promise((resolve, reject) => {
          let id = uuidv4();
          let item = helper.constructUserObject(id, params, null);
          let selector = {"contact": params.contact, "id": "users"}
          db.find({ 'selector': selector},(err, documents) => {
            if (err) {
              console.log('Error occurred: ' + err.message, 'find()');
              reject(err);
            } else {
              if(documents.docs.length == 0 ){
                db.insert(item, (err, result) => {
                  if (err) {
                      console.log('Error occurred: ' + err.message, 'create()');
                      reject(err);
                  } else {
                      resolve({result: item, statusCode: 201 });
                  }
                });
              }else{
                resolve({"error": "User already exists", statusCode: 400 });
              }
            }
          })
  });
}

function createRequest(params) {
  return new Promise((resolve, reject) => {
    let id = uuidv4();
    let item = helper.constructRequestObject(id, params)
    db.insert(item, (err, result) => {
      if (err) {
        console.log('Error occurred: ' + err.message, 'create()');
        reject(err);
      } else {
        resolve({result: item, statusCode: 201 });
      }
    });
  });
}

/**
 * Update a resource with the requested new attribute values
 * 
 * @param {String} id - the ID of the item (required)
 * 
 * The following parameters can be null
 * 
 * @param {String} type - the type of the item
 * @param {String} name - the name of the item
 * @param {String} description - the description of the item
 * @param {String} quantity - the quantity available 
 * @param {String} location - the GPS location of the item
 * @param {String} contact - the contact info 
 * @param {String} userID - the ID of the user 
 * 
 * @return {Promise} - promise that will be resolved (or rejected)
 * when the call to the DB completes
 */
function updateEvent(params, headers, body) {
    return new Promise((resolve, reject) => {
      db.find({'selector': {"token": headers.token, "id": "users"}}, (err, users) => {
        if (err) {
          reject(err)
      } else {
        let user = users.docs.length > 0 ? users.docs[0] : null
          if(user != null){
            db.get(params.id, (err, document) => {
              if (err) {
                  resolve({statusCode: err.statusCode});
              } else {
                if(document.createdBy._id == user._id){
                  let item = {
                      _id: document._id,
                      _rev: document._rev,            // Specifiying the _rev turns this into an update
                      id: document.id,
                      volunteerPresent: document.volunteerPresent,
                      isActive: document.isActive,
                      createdBy: document.createdBy,
                      whenCreated: document.whenCreated,
                      whenUpdated: Date.now(),
                      volunteers : document.volunteers
                  }
                  if (body.name) {item["name"] = body.name} else {item["name"] = document.name};
                  if (body.description) {item["description"] = body.description} else {item["description"] = document.description};
                  if (body.contact) {item["contact"] = body.contact} else {item["contact"] = document.contact};
                  if (body.causeType) {item["causeType"] = body.causeType} else {item["causeType"] = document.causeType};
                  if (body.volunteerRequired) {item["volunteerRequired"] = body.volunteerRequired} else {item["volunteerRequired"] = document.volunteerRequired};
                  if (body.funds) {item["funds"] = body.funds} else {item["funds"] = document.funds};
                  let address = {}
                  if (body.city) {address["city"] = body.city} else {address["city"] = document.address.city};
                  if (body.state) {address["state"] = body.state} else {address["state"] = document.address.state};
                  if (body.country) {address["country"] = body.country} else {address["country"] = document.address.country};
                  item["address"] = address
  
                  db.insert(item, (err, result) => {
                      if (err) {
                          console.log('Error occurred: ' + err.message, 'create()');
                          reject(err);
                      } else {
                          resolve({ result: item, statusCode: 200 });
                      }
                  });
              }else{
                resolve({ "error": "Doesn't have permission to update event", statusCode: 400 });
              }
            }            
          })
        }else{
          resolve({"error": "Unauthorised, please login to continue", statusCode: 401 });
        }
    }
  })
    });
}

function info() {
    return cloudant.db.get(db_name)
        .then(res => {
            console.log(res);
            return res;
        });
};

function logout(id, params) {
  return new Promise((resolve, reject) => {
    console.log(params.id)
      db.get(params.id, (err, document) => {
          if (err) {
              reject(err)
          } else {
              let item = {
                  _id: document._id,
                  _rev: document._rev, // Specifiying the _rev turns this into an update
                  token: null,
                  id: document.id,
                  name: document.name,
                  email: document.email,
                  address: document.address,
                  userType: document.userType,
                  causeTypecause: document.causeType,
                  contact: document.contact,
                  pan: document.pan,
                  password: document.password,
                  whenCreated: document.whenCreated,
                  whenUpdated: Date.now()     
              }
              db.insert(item, (err, result) => {
                  if (err) {
                      console.log('Error occurred: ' + err.message, 'create()');
                      reject(err);
                  } else {
                      resolve({ message: "Logged out successfully", statusCode: 200 });
                  }
              });
          }            
      })
  });
}

function login(id, params) {
  return new Promise((resolve, reject) => {
    let selector = {"contact": params.contact, "id": id}
    db.find({ 
        'selector': selector
    },(err, documents) => {
          if (err) {
            return resolve({statusCode: err.statusCode});
          } else {
            let document = documents.docs.length > 0 ? documents.docs[0] : null
              if(document != null && params.password == document.password){
                let item = {
                  _id: document._id,
                  _rev: document._rev, // Specifiying the _rev turns this into an update
                  id: document.id,
                  token: helper.randomToken(),
                  name: document.name,
                  email: document.email,
                  address: document.address,
                  userType: document.userType,
                  causeType: document.causeType,
                  contact: document.contact,
                  pan: document.pan,
                  password: document.password,
                  whenCreated: document.whenCreated,
                  whenUpdated: Date.now()     
                }
                db.insert(item, (err, result) => {
                  if (err) {
                      console.log('Error occurred: ' + err.message, 'create()');
                      reject(err);
                  } else {
                      resolve({ "result": item, statusCode: 200 });
                  }
              });
              }else{
                resolve({ "error": "Please check username and password", statusCode: 404 });
              }
          }            
      })
  });
}

function closeEventOrRequest(params){
  return new Promise((resolve, reject) => {
    db.get(params.id, (err, document) => {
      if(err){
        reject(err)
      }else{
        let item = {
          _id: document._id,
          _rev: document._rev, // Specifiying the _rev turns this into an update
          id: document.id,
          name: document.name,
          description: document.description,
          address: document.address,
          causeType: document.causeType,
          contact: document.contact,
          volunteers: document.volunteers,
          isActive: false,
          volunteerRequired: document.volunteerRequired,
          volunteerPresent: document.volunteerPresent,
          funds: document.funds,
          createdBy: document.createdBy,
          whenCreated: document.whenCreated,
          whenUpdated: Date.now()     
        }
        db.insert(item, (err, result) => {
          if (err) {
              console.log('Error occurred: ' + err.message, 'create()');
              reject(err);
          } else {
              resolve({"result": item, statusCode: 200 });
          }
        })
      }
    })
  })
}

function joinEventOrRequest(params, headers){
  return new Promise((resolve, reject) => {
    db.find({'selector': {"token": headers.token, "id": "users"}}, (err, users) => {
      if (err) {
        reject(err)
    } else {
      let user = users.docs.length > 0 ? users.docs[0] : null
        if(user != null){
          db.get(params.id, (err, document) => {
            if(err){
              reject(err)
            }else{
              if(document.id == "events" && document.volunteerPresent == document.volunteerRequired){
                return resolve({"error": "No more volunteers required", statusCode: 400 });
              }
              let volunteerList = document.volunteers
              for(i = 0; i < volunteerList.length ; i++){
                if(volunteerList[i]._id == user._id){
                  return resolve({"error": "Volunteer already present", statusCode: 400 });
                }
              }
              volunteerList.push({
                _id: user._id,
                _rev: user._rev,
                id: "users",
                name: user.name,
                email: user.email,
                address: user.address,
                userType: user.userType,
                causeType: user.causeType,
                contact: user.contact,
                pan: user.pan
              })
              let item = {
                _id: document._id,
                _rev: document._rev, // Specifiying the _rev turns this into an update
                id: document.id,
                name: document.name,
                description: document.description,
                address: document.address,
                causeType: document.causeType,
                contact: document.contact,
                volunteerRequired: document.volunteerRequired,
                volunteerPresent: document.volunteerPresent + 1,
                volunteers: volunteerList,
                isActive: document.isActive,
                volunteerCount: document.volunteerCount,
                funds: document.funds,
                createdBy: document.createdBy,
                whenCreated: document.whenCreated,
                whenUpdated: Date.now()     
              }
              db.insert(item, (err, result) => {
                if (err) {
                    console.log('Error occurred: ' + err.message, 'create()');
                    reject(err);
                } else {
                  return resolve({"result": item, statusCode: 200 });
                }
              })
            }
          })
        }else{
          return resolve({"error": "Unauthorised, please login to continue", statusCode: 401 });
        }
      }
    })
  })
}

function getMyRequests(headers){
  return new Promise((resolve, reject) => {
    if(headers.token == null){
      return resolve({"error": "Unauthorised, please login to continue", statusCode: 401 });
    }
    db.find({'selector': {"token": headers.token, "id": "users"}}, (err, users) => {
      if (err) {
        reject(err)
    } else {
      let user = users.docs.length > 0 ? users.docs[0] : null
        if(user != null){
          let selector = {"id": "requests", "volunteers": {"$elemMatch" : { "_id" : { "$in" : [user._id] } } } }
          db.find({'selector' : selector}, (err, documents) => {
            if(err){
              reject(err)
            }else{
              resolve({ result: documents.docs, statusCode: 200});
            }
          })
        }else{
          return resolve({"error": "Unauthorised, please login to continue", statusCode: 401 });
        }
      }
    })
  })
}

function getMyEvents(headers){
  return new Promise((resolve, reject) => {
    if(headers.token == null){
      return resolve({"error": "Unauthorised, please login to continue", statusCode: 401 });
    }
    db.find({'selector': {"token": headers.token, "id": "users"}}, (err, users) => {
      if (err) {
        reject(err)
    } else {
      let user = users.docs.length > 0 ? users.docs[0] : null
        if(user != null){
          let selector = {"id": "events", "volunteers": {"$elemMatch" : { "_id" : { "$in" : [user._id] } } } }
          db.find({'selector' : selector}, (err, documents) => {
            if(err){
              reject(err)
            }else{
              resolve({ result: documents.docs, statusCode: 200});
            }
          })
        }else{
          return resolve({"error": "Unauthorised, please login to continue", statusCode: 401 });
        }
      }
    })
  })
}

module.exports = {
    deleteById: deleteById,
    createEvent: createEvent,
    updateEvent: updateEvent,
    find: find,
    info: info,
    logout: logout,
    login: login,
    createUser: createUser,
    createRequest: createRequest,
    closeEventOrRequest: closeEventOrRequest,
    joinEventOrRequest: joinEventOrRequest,
    getMyRequests: getMyRequests,
    getMyEvents: getMyEvents
  };