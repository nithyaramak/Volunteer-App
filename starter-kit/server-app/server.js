require('dotenv').config({silent: true})

const express = require('express');
const bodyParser = require('body-parser');

const assistant = require('./lib/assistant.js');
const port = process.env.PORT || 3000

const cloudant = require('./lib/cloudant.js');

const app = express();
app.use(bodyParser.json());

const testConnections = () => {
  const status = {}
  return assistant.session()
    .then(sessionid => {
      status['assistant'] = 'ok';
      return status
    })
    .catch(err => {
      console.error(err);
      status['assistant'] = 'failed';
      return status
    })
    .then(status => {
      return cloudant.info();
    })
    .then(info => {
      status['cloudant'] = 'ok';
      return status
    })
    .catch(err => {
      console.error(err);
      status['cloudant'] = 'failed';
      return status
    });
};

const handleError = (res, err) => {
  const status = err.code !== undefined && err.code > 0 ? err.code : 500;
  return res.status(status).json(err);
};

app.get('/', (req, res) => {
  testConnections().then(status => res.json({ status: status }));
});

/**
 * Get a session ID
 *
 * Returns a session ID that can be used in subsequent message API calls.
 */
app.get('/api/session', (req, res) => {
  assistant
    .session()
    .then(sessionid => res.send(sessionid))
    .catch(err => handleError(res, err));
});

/**
 * Post process the response from Watson Assistant
 *
 * We want to see if this was a request for resources/supplies, and if so
 * look up in the Cloudant DB whether any of the requested resources are
 * available. If so, we insert a list of the resouces found into the response
 * that will sent back to the client.
 * 
 * We also modify the text response to match the above.
 */
function post_process_assistant(result) {
  let resource
  // First we look to see if a) Watson did identify an intent (as opposed to not
  // understanding it at all), and if it did, then b) see if it matched a supplies entity
  // with reasonable confidence. "supplies" is the term our trained Watson skill uses
  // to identify the target of a question about resources, i.e.:
  //
  // "Where can i find face-masks?"
  //
  // ....should return with an enitity == "supplies" and entitty.value = "face-masks"
  //
  // That's our trigger to do a lookup - using the entitty.value as the name of resource
  // to to a datbase lookup.
  if (result.intents.length > 0 ) {
    result.entities.forEach(item => {
      if ((item.entity == "supplies") &&  (item.confidence > 0.3)) {
        resource = item.value
      }
    })
  }
  if (!resource) {
    return Promise.resolve(result)
  } else {
    // OK, we have a resource...let's look this up in the DB and see if anyone has any.
    return cloudant
      .find('', resource, '')
      .then(data => {
        let processed_result = result
        if ((data.statusCode == 200) && (data.data != "[]")) {
          processed_result["resources"] = JSON.parse(data.data)
          processed_result["generic"][0]["text"] = 'There is' + '\xa0' + resource + " available"
        } else {
          processed_result["generic"][0]["text"] = "Sorry, no" + '\xa0' + resource + " available"           
        }
        return processed_result
      })
  }
}

/**
 * Post a messge to Watson Assistant
 *
 * The body must contain:
 * 
 * - Message text
 * - sessionID (previsoulsy obtained by called /api/session)
 */
app.post('/api/message', (req, res) => {
  const text = req.body.text || '';
  const sessionid = req.body.sessionid;
  console.log(req.body)
  assistant
    .message(text, sessionid)
    .then(result => {
      return post_process_assistant(result)
    })
    .then(new_result => {
      res.json(new_result)
    })
    .catch(err => handleError(res, err));
});

/**
 * Get a list of events
 *
 * The query string may contain the following qualifiers:
 * 
 * - isActive
 *
 * A list of event objects will be returned (which can be an empty list)
 */
app.get('/api/events', (req, res) => {
  cloudant
    .find("events", req.params)
    .then(data => {
      if (data.statusCode != 200) {
        res.send(data)
        res.status(data.statusCode)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

/**
 * Get a list of requests
 *
 * The query string may contain the following qualifiers:
 * 
 * - isActive
 *
 * A list of request objects will be returned (which can be an empty list)
 */
app.get('/api/requests', (req, res) => {
  cloudant
    .find("requests", req.params)
    .then(data => {
      if (data.statusCode != 200) {
        res.send(data)
        res.status(data.statusCode)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//create event
app.post('/api/event', (req, res) => {
  if (!req.body.description) {
    return res.status(422).json({ errors: "Description of event must be provided"});
  }
  if (!req.body.name) {
    return res.status(422).json({ errors: "Name of event must be provided"});
  }
  if (!req.body.contact) {
    return res.status(422).json({ errors: "A method of conact must be provided"});
  }

  cloudant
    .createEvent(req.body, req.headers)
    .then(data => {
      if (data.statusCode != 201) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//create request
app.post('/api/request', (req, res) => {
  if (!req.body.causeType) {
    return res.status(422).json({ errors: "Cause/Needs must be provided"});
  }
  if (!causeTypes.includes(req.body.causeType)) {
    return res.status(422).json({ errors: "Cause/Needs must be one of " + causeTypes.toString()});
  }
  if (!req.body.name) {
    return res.status(422).json({ errors: "Name of requestor must be provided"});
  }
  if (!req.body.contact) {
    return res.status(422).json({ errors: "A method of contact must be provided"});
  }
  volunteer = cloudant.assignVolunteerForRequest(req.body.city);
  console.log("printing voluteer");
  console.log(volunteer);
  params = req.body;
  params['volunteer'] = volunteer;
  cloudant
    .createRequest(params)
    .then(data => {
      if (data.statusCode != 201) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//signup into the system
let userTypes = ["Beneficiary", "Volunteer", "Organisation"]
let causeTypes = ["Food/Water", "Medicine", "Shelter", "Educational Help", "Daily Essentials"]
app.post('/signup', (req, res) => {
  req.body['activeRequestCount'] = 0;
  req.body['totalRequestCount'] = 0;
  if (!req.body.userType) {
    return res.status(422).json({ errors: "User type must be provided"});
  }
  if (!userTypes.includes(req.body.userType)) {
    return res.status(422).json({ errors: "User type must be one of " + userTypes.toString()});
  }
  if (!req.body.causeType) {
    return res.status(422).json({ errors: "Cause/Needs must be provided"});
  }
  if (!causeTypes.includes(req.body.causeType)) {
    return res.status(422).json({ errors: "Cause/Needs must be one of " + causeTypes.toString()});
  }
  if (!req.body.name) {
    return res.status(422).json({ errors: "Name of user must be provided"});
  }
  if (!req.body.email) {
    return res.status(422).json({ errors: "Email of user must be provided"});
  }
  if (!req.body.contact) {
    return res.status(422).json({ errors: "A method of contact must be provided"});
  }

  cloudant
    .createUser(req.body, req.headers)
    .then(data => {
      if (data.statusCode != 201) {
        res.status(data.statusCode);
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//logout from the system
app.delete('/logout/:id', (req, res) => {
  cloudant
    .logout("users", req.params)
    .then(data => {
      if (data.statusCode != 201) {
        res.sendStatus(data.statusCode)
      } else {
        res.send({"message": "Logged out successfully"})
      }
    })
    .catch(err => handleError(res, err));
});

//login into the system
app.post('/login', (req, res) => {
  cloudant
    .login("users", req.body)
    .then(data => {
      console.log(data)
      if (data.statusCode != 200) {
        res.sendStatus(data.statusCode)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//close request after completion
app.patch('/api/request/close/:id', (req, res) => {
  cloudant
    .closeEventOrRequest(req.params)
    .then(data => {
      if (data.statusCode != 200) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//close event after completion
app.patch('/api/event/close/:id', (req, res) => {
  cloudant
    .closeEventOrRequest(req.params)
    .then(data => {
      if (data.statusCode != 200) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//volunter joins to participate in event
app.patch('/api/event/join/:id', (req, res) => {
  cloudant
    .joinEventOrRequest(req.params, req.headers)
    .then(data => {
      if (data.statusCode != 200) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//volunteer joins to participate in request
app.patch('/api/request/join/:id', (req, res) => {
  cloudant
    .joinEventOrRequest(req.params, req.headers)
    .then(data => {
      if (data.statusCode != 200) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//event update
app.patch('/api/event/:id', (req, res) => {
  cloudant
    .updateEvent(req.params, req.headers, req.body)
    .then(data => {
      if (data.statusCode != 200) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//list of events assigned or created by volunteer
app.get('/api/event/list', (req, res) => {
  cloudant
    .getMyEvents(req.headers)
    .then(data => {
      if (data.statusCode != 200) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

//list of requests assigned to volunteer
app.get('/api/request/list', (req, res) => {
  cloudant
    .getMyRequests(req.headers)
    .then(data => {
      if (data.statusCode != 200) {
        res.status(data.statusCode)
        res.send(data)
      } else {
        res.send(data)
      }
    })
    .catch(err => handleError(res, err));
});

const server = app.listen(port, () => {
   const host = server.address().address;
   const port = server.address().port;
   console.log(`Voluntee App listening at http://${host}:${port}`);
});
