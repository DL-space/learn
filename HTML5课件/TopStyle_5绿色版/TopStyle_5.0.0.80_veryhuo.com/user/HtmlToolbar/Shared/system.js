function _canInsertObject() {
  document.forms[0].tsCallBack.value = canInsertObject();
}

function _onOK() {
  document.forms[0].tsCallBack.value = onOK();
}

function _objectTag() {
  document.forms[0].tsObjectTag.value = objectTag();
}

function _CallBack(value) {
  document.forms[0].tsCallBack.value = value;
}

function _CallBackAsString(value) {
  var answer;
  _CallBack(value);
  answer = document.forms[0].tsCallBack.value;
  while (answer == value) {
    answer = document.forms[0].tsCallBack.value;
  }
  return answer;
}

function _CallBackAsBoolean(value) {
  var answer;
  answer = _CallBackAsString(value);
  return (answer == 'true' || answer == '1');
}

function _CallBackAsInteger(value) {
  return Number(_CallBackAsString(value));
}

function tsElem() {
  this.index = 0;
  this.tagName = '';
  this.getAttribute = function(name) {
    return _CallBackAsString('getAttribute(' + this.tagName + ',' + this.index + ',' + name + ')');
  }
}

function findInArray(arrayToSearch, searchValue) {
  var retVal = -1;
  for (var i=0; i < arrayToSearch.length; i++) {
    if (arrayToSearch[i] == searchValue) {
      retVal = i;
      break;
    }
  }
  return retVal;
}

function tsDOM() {
  this.getElementsByTagName = function(tagName) {
    var result = new Array(_CallBackAsInteger('getElementsByTagName(' + tagName + ')'));
    for (var i = 0; i < result.length; i++) {
      result[i] = new tsElem();
      result[i].tagName = tagName;
      result[i].index = i;
    }
    return result;
  }
  this.getUniqueNameForTag = function(tagType, baseName) {
    var tagCounter = 1;
    var possName = baseName + tagCounter;

    var objArray = this.getElementsByTagName(tagType.toLowerCase());
    var objNames = new Array();
    var objName;

    if (objArray.length > 0) {
      // create the list of object names
      for (var i = 0; i < objArray.length; i++) {
        objName = objArray[i].getAttribute("name");
        if (objName)
          objNames.push(objName);
        objName = objArray[i].getAttribute("id");
        if (objName)
          objNames.push(objName);
      }
      while (findInArray(objNames, possName) != -1) {
        tagCounter++;
        possName = baseName + tagCounter;
      }
    }
    return possName;
  }
}

function tsObj() {
  this.isXHTML = function() {
    return _CallBackAsBoolean('isXHTML');
  }
  this.isASP = function() {
    return _CallBackAsBoolean('isASP');
  }
  this.isASP_VB = function() {
    return _CallBackAsBoolean('isASP_VB');
  }
  this.isPHP = function() {
    return _CallBackAsBoolean('isPHP');
  }
  this.isCFML = function() {
    return _CallBackAsBoolean('isCFML');
  }
  this.isJSP = function() {
    return _CallBackAsBoolean('isJSP');
  }
  this.getCharSet = function() {
    return _CallBackAsString('getCharSet');
  }
  this.hasSelection = function() {
    return _CallBackAsBoolean('hasSelection');
  }
  this.getSelection = function(bPipe, bTrim) {
    var result;
    if (this.hasSelection()) {
      result = _CallBackAsString('getSelection');
      if (bTrim)
        // replace carriage returns (and the space on either side of
        // any carriage returns, if one exists) with a single space.
        result = result.replace(/\s*[\n\r]+\s*/g, ' ');
    } 
    else {
      if (bPipe)
        result = '|'
      else
        result = '';
    }
    return result;
  }
  this.urlEncode = function(value) {
    return _CallBackAsString('urlEncode(' + value + ')');
  }
  this.urlDecode = function(value) {
    return _CallBackAsString('urlDecode(' + value + ')');
  }
  this.browseForFileURL = function(sDefault, bPreview, sTitle) {
    var result = _CallBackAsString('browseForFileURL(' + bPreview + ',' + sTitle + ')');
    if (result)
      return result;
    else
      return sDefault;
  }
  this.showPopupMenu = function(sDefault, values) {
    var result = _CallBackAsString('showPopupMenu(' + values + ')');
    if (result)
      return result
    else
      return sDefault;
  }
  this.getDocumentDOM = function() {
    _CallBack('getDocumentDOM');
    return new tsDOM();
  }
  this.getImageSize = function(value) {
    var result = _CallBackAsString('getImageSize(' + value + ')');
    if (result)
      return eval('new Array(' + result + ')')
    else
      return null;
  }
  this.hasParent = function(tagName, attrName, attrValue) {
    return _CallBackAsBoolean('hasParent(' + tagName + ',' + attrName + ',' + attrValue + ')');
  }
}

var ts = new tsObj();