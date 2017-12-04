function initUI(){
  document.forms[0].metaValue.focus();
}

function objectTag() {
  var content = '';
  var metaAttribute = (document.forms[0].metaAttribute.selectedIndex == 0) ? 'name' : 'http-equiv';
  
  // convert any returns in the Content to spaces before inserting.
  // if this replacement results in double spaces, convert to single spaces.
  content = document.forms[0].Content.value.replace(/[\n\r]/g, " ");
  content = content.replace(/\s+/g, " ");
  if (!content) content = '|';
  
  var result = '<meta ' + metaAttribute + '="' + document.forms[0].metaValue.value + '" content="' + content + '"';
  
  if (ts.isXHTML()) result += ' /';

  result += '>';

  return result;
}