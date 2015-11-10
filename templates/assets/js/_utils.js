// Pad numbers
Number.prototype.pad = function (len) {
  return (new Array(len+1).join("0") + this).slice(-len);
}

/**
 * Array.prototype.[method name] allows you to define/overwrite an objects method
 * needle is the item you are searching for
 * this is a special variable that refers to "this" instance of an Array.
 * returns true if needle is in the array, and false otherwise
 */
Array.prototype.contains = function ( needle ) {
  for (i in this) {
    if (this[i] == needle) return true;
  }
  return false;
}

// Pad minutes
Date.prototype.getMinutesTwoDigits = function() {
  var retval = this.getMinutes();
  if (retval < 10) {
    return ("0" + retval.toString());
  }
  else {
    return retval.toString();
  }
}