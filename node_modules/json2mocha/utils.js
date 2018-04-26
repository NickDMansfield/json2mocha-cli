
const fs = require('fs');
const path = require("path");

let mochaConfig = null;

const getFindElementStringViaTargetObj = targetObj => {
  if (targetObj.searchBy == "cssSelector") {
    return "driver.findElement(" + targetObj.searchBy + "(" + targetObj.value + "))";
  }
  return "driver.findElement(webdriver.By." + targetObj.searchBy + "(" + targetObj.value + "))";
};

const getActionStringFromActionObj = actionObj => {
  let returnString =  actionObj.method + "(";
  if (actionObj.values && actionObj.values.length > 0) {
    for (let val of actionObj.values) {
      returnString += val + ",";
    }
    returnString = returnString.slice(0, -1);
  }
  returnString += ")";
  return returnString;
};

const addActionText = (actionObj) => {
  // expects an object with a target and an action property
  let editedString = "";
  const actionTargetString = actionObj.target ? getFindElementStringViaTargetObj(actionObj.target) : "driver";
  const actionActionString = getActionStringFromActionObj(actionObj.action);
  editedString += actionTargetString +"." + actionActionString;
  return editedString;
};

const getStringsForActionsArray = (actionsArr, indents = 0) => {
  let retStr = "";
  for (let action of actionsArr) {
    if (mochaConfig != null && mochaConfig.hasOwnProperty('autoDelay')) {
      // If an auto delay is enabled, will put a lag between each action
      retStr += " ".repeat(indents) + addActionText({ action: { method: 'sleep', values: [mochaConfig.autoDelay] }}) + ";\r\n";
    }
    retStr += " ".repeat(indents) + addActionText(action) + ";\r\n";
  }
  return retStr;
};

const convertJsonObjToMochaString = (obj) => {
  let mochaString = "";
  mochaConfig = obj.config;

  for (let describesCount = 0; describesCount < obj.describes.length; ++describesCount) {
    const currentDescribe = obj.describes[describesCount];
    // Set up initial describe
    mochaString = mochaString.concat("test.describe('" + currentDescribe.description + "', function () {\r\n");


    for (let itsCount = 0; itsCount < currentDescribe.its.length; ++itsCount) {
      let indent ="  ";
      const currentIt = currentDescribe.its[itsCount];
      // Begin it statement
      mochaString = mochaString.concat(indent + "test.it('" + currentIt.should + "', function() {\r\n");


        // If there are any shared describe actions, apply them
        if (obj.sharedItActions && obj.sharedItActions.length > 0) {
          mochaString += getStringsForActionsArray(obj.sharedItActions, 4);
        }

      // Gets all actions
      mochaString += getStringsForActionsArray(currentIt.actions, 4);

      //Close out it statement
      mochaString += indent + "});\r\n"
    }

    // Close out describe section
    mochaString = mochaString.concat("});\r\n\r\n");
  }
  return mochaString;
};

const feID = function(str) {
  try {
    return fe(webdriver.By.id, str);
  }catch(ex) {
    return null;
  }
};
const fe = function(type, str) {
  return driver.findElement(type(str));
}
const feCN = function(str) {
  try {
    return fe(webdriver.By.className, str);
  }catch(err) {
    return null;
  }
};
const feName = function(str) {
  try {
    return fe(webdriver.By.name, str);
  }catch(err) {
    return null;
  }
};

const getBaseTemplateText = callback => {

  return fs.readFile(path.join(__dirname, 'mochaTemplate.js'), 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    return callback(data);
  });
};

const writeMochaFile = (fileLoc, mochaText, callback) => {
  fs.writeFile(fileLoc, mochaText, () => {
    callback();
  });
};

module.exports = {
  convertJsonObjToMochaString,
  getBaseTemplateText,
  writeMochaFile
};
