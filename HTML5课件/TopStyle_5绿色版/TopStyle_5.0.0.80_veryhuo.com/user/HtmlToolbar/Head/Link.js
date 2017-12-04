function initUI() {
  document.forms[0].href.focus();
}

function objectTag(){
  var result = '';

  var href = document.forms[0].href.value;
  var id = document.forms[0].id.value;
  var rel = document.forms[0].rel.value;
  var rev = document.forms[0].rev.value;
  var title = document.forms[0].title.value;
  
  if (!href) href = "|";
  result += ' href="' + href + '"';

  if (id)
    result += ' id="' + id + '"';
  
  if (rel) {
    result +=' rel="' + rel + '"';
	  if (rel.toLowerCase().indexOf("stylesheet") != -1)
	    result += ' type="text/css"';
  }	
  
  if (rev)
    result += ' rev="' + rev + '"';
  
  if (title)
    result += ' title="' + title + '"';

  if (ts.isXHTML()) result += ' /';
  
  return '<link' + result + '>';
}