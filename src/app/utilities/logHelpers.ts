namespace Log {

  var _stackRegex = /\s*at\s+([\w\.$_]+(\.([\w$_]+))*)\((.*)?:(\d+)\).*\[(.*)\]/

  export function formatStackTrace(exception:any): string {
    if (!exception) {
      return '';
    }
    // turn exception into an array
    if (!angular.isArray(exception) && angular.isString(exception)) {
      exception = exception.split('\n');
    }

    if (!angular.isArray(exception)) {
      return '';
    }

    var answer = '<ul class="unstyled">\n';
    exception.forEach((line) => answer += "<li>" + Log.formatStackLine(line) + "</li>\n");
    answer += "</ul>\n";
    return answer;
  }

  export function formatStackLine(line: string): string {
    var match = _stackRegex.exec(line);
    if (match && match.length > 6) {
      var classAndMethod = match[1];
      var fileName = match[4];
      var line = match[5];
      var mvnCoords = match[6];
      // we can ignore line if its not present...
      if (classAndMethod && fileName && mvnCoords) {
        var className = classAndMethod;
        var idx = classAndMethod.lastIndexOf('.');
        if (idx > 0) {
          className = classAndMethod.substring(0, idx);
        }
        var link = "#/source/view/" + mvnCoords + "/class/" + className + "/" + fileName;
        if (angular.isDefined(line)) {
          link += "?line=" + line;
        }
/*
        console.log("classAndMethod: " + classAndMethod);
        console.log("fileName: " + fileName);
        console.log("line: " + line);
        console.log("mvnCoords: " + mvnCoords);
        console.log("Matched " + JSON.stringify(match));
*/
        return "<div class='stack-line'>  at <a href='" + link + "'>" + classAndMethod + "</a>(<span class='fileName'>" + fileName + "</span>:<span class='lineNumber'>" + line + "</span>)[<span class='mavenCoords'>" + mvnCoords + "</span>]</div>";
      }
    }
    var bold = true;
    if (line) {
      line = _.trim(line);
      if (_.startsWith(line, 'at')) {
        line = '  '  + line;
        bold = false;
      }
    }
    if (bold) {
      return '<pre class="stack-line bold">' + line + '</pre>';
    } else {
      return '<pre class="stack-line">' + line + '</pre>';
    }
  }


}
