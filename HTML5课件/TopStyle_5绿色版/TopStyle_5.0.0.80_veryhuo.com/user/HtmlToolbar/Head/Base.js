function objectTag(){
  var result = '';
  var href = document.forms[0].hrefFileName.value;
  if (!href) href = '|';
  result += 'href="' + href + '"';
  var frameTarget = document.forms[0].frameTarget.value;
  if (frameTarget)
    result += ' target="' + frameTarget + '"';
  if (ts.isXHTML()) result += ' /';
  return '<base ' + result + '>';
}