// function to send a json object
const respond = (request, response, status, object, type) => {
  if (type === 'text/xml') {
    response.writeHead(status, { 'Content-Type': 'text/xml' });
    let responseXML = '<response>';
    if (object.id) {
      responseXML = `${responseXML} <message>${object.message}</message>`;
    }
    responseXML = `${responseXML} <message>${object.message}</message></response>`;
    response.write(responseXML);
  } else {
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(object));
  }

  response.end();
};

// function to show a success status code
const success = (request, response, type) => {
  // message to send
  const responseJSON = {
    message: 'This is a successful response',
  };

  // send our json with a success status code
  respond(request, response, 200, responseJSON, type);
};

// function to show a bad request without the correct parameters
const badRequest = (request, response, params, type) => {
  // message to send
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    // give the error a consistent id 
    responseJSON.id = 'badRequest';
    // return our json with a 400 bad request code
    return respond(request, response, 400, responseJSON, type);
  }

  // if the parameter is here, send json with a success status code
  return respond(request, response, 200, responseJSON, type);
};

const unAuthorized = (request, response, params, type) => {
  // message to send
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    // set our error message
    responseJSON.message = 'Missing loggedIn query parameter set to yes';
    // give the error a consistent id 
    responseJSON.id = 'badRequest';
    // return our json with a 401 bad request code
    return respond(request, response, 401, responseJSON, type);
  }

  return respond(request, response, 200, responseJSON, type);
};

// function to show internal error
const forbidden = (request, response, params, type) => {
  // error messsage with a description and consistent error id
  const responseJSON = {
    message: 'Message: You do not have access to this content.',
    id: 'Forbidden',
  };

  respond(request, response, 403, responseJSON, type);
};

// function to show internal error
const internal = (request, response, params, type) => {
  // error messsage with a description and consistent error id
  const responseJSON = {
    message: 'Message: Internal Server Error. Something went wrong.',
    id: 'Internal Server Error',
  };

  respond(request, response, 500, responseJSON, type);
};

// function to show not impelemented error
const notImplemented = (request, response, params, type) => {
  // error messsage with a description and consistent error id
  const responseJSON = {
    message: 'Message: A get request for this page has not been implemented yet. Check again for later updated content.',
    id: 'Not Implemented',
  };

  respond(request, response, 501, responseJSON, type);
};

// function to show not found error
const notFound = (request, response) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  // return our json with a 404 not found error code
  respond(request, response, 404, responseJSON);
};


// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  success,
  badRequest,
  unAuthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
