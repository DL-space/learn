//---------------   GLOBAL VARIABLES   ---------------

var DOM;
var SELECT;
var TF_GROUP_NAME;

//---------------    LOCAL FUNCTIONS   ---------------

function getDOM() {
  if (!DOM)
    DOM = ts.getDocumentDOM();
  return DOM;
}

function getSelect() {
  if (!SELECT)
    SELECT = document.forms[0].select;
  return SELECT;
}

function getGroupName() {
  if (!TF_GROUP_NAME)
    TF_GROUP_NAME = document.forms[0].GroupName;
  return TF_GROUP_NAME;
}

function getSelectedIndex(radioGroup) {
  var result = -1;
  for (var i = 0; i < radioGroup.length; i++) {
    if (radioGroup[i].checked) {
      result = i; 
      break;
    }
  }
  return result;
}

function getOptionString(option) {
  return '<option value="' + option.text + '">' + option.text + '</option>\r\n';
}

function createSelectString(groupName, labels) {
  var result = '<li class="select">\r\n<select name="' + groupName + '">\r\n';
  if (labels) {
    for (var i = 0; i < labels.length; i++) {
      result += getOptionString(labels[i]);
    }
  }
  return result += '</select>\r\n<span class="arrow"></span>\r\n</li>';
}

//---------------     API FUNCTIONS    ---------------

function canInsertObject() {
  if (ts.hasParent('ul', 'class', 'pageitem'))
    return true
  else {
    alert('Select MUST be inside <ul class="pageitem">');
    return false;
  }
}

function initUI() {
  var gn = getGroupName();
  if (gn) {
    var dom = getDOM();
    if (dom)
      gn.value = dom.getUniqueNameForTag('input', 'Select');
    gn.focus();  // set focus to group name
    gn.select(); // select current group name
  }
}

function onOK() {
  var gn = getGroupName();
  if (gn) {
    var value = gn.value;
    if (value.search(/\W/) != -1) {
      alert(MSG_InvalidName);
      gn.value = value.replace(/\W/g, "");
      gn.focus();
      return false;
    }
    else
      return true;
  }
}

function objectTag() {
  var gn = getGroupName();
  if (gn) {
    return createSelectString(gn.value, getSelect().options);
  }
}