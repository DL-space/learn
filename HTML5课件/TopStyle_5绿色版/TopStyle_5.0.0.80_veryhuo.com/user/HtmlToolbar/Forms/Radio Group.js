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

function getRadioButtonString(groupName, option) {
  var result = '<input type="radio" name="' + groupName + '" value="' + option.text + '"';
  if (ts.isXHTML()) result += ' /';
  result += '>';
  return result;
}

function getTableRowString(groupName, option) {
  return '<tr><td><label>' + getRadioButtonString(groupName, option) + option.text + '</label></td></tr>\n';
}

function getLineBreakString(groupName, option) {
  var result = '<label>' + getRadioButtonString(groupName, option) + option.text + '</label>';
  if (ts.isXHTML())
    result += '<br />'
  else
    result += '<br>';
  result += '\n';
  return result;
}

function addOuterTag(result, isTable) {
  return (isTable) ? '<table>\n' + result + '</table>' : '<p>\n' + result + '</p>';
}

function createRadioGroupString(groupName, isTable, labels) {
  var result = '';
  if (labels) {
    for (var i = 0; i < labels.length; i++)
      result += (isTable) ? getTableRowString(groupName, labels[i]) : getLineBreakString(groupName, labels[i]);
  }
  return addOuterTag(result, isTable);
}

//---------------     API FUNCTIONS    ---------------

function initUI() {
  var gn = getGroupName();
  if (gn) {
    var dom = getDOM();
    if (dom)
      gn.value = dom.getUniqueNameForTag('input', 'RadioGroup');
    gn.focus();  // set focus to radio group name
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
    return createRadioGroupString(gn.value, getSelectedIndex(document.forms[0].Layout) == 1, getSelect().options);
  }
}