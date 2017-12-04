function objectTag() {
	var result = ts.browseForFileURL();
	if (result) {
		if (ts.isPHP())
			result = '<?php include("' + result + '"); ?>';
		else
			result = '<!--#include file="' + result + '" -->';
	}
	return result;
}