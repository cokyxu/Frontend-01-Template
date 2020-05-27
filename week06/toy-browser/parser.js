const EOF = Symbol("EOF"); // End Of File，这里要放一个唯一的东西代表文件结束
const cssRule =require('./addCssRule');

let currentToken = null;
let currentAttribute = null;
let stack = [{type: "document", children: []}]
let currentTextNode = null;

function emit(token) {
  let top = stack[stack.length - 1];

  if(token.type == "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: []
    }

    element.tagName = token.tagName;

    for(let p in token) {
      if(p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p]
        });
      }
    }

    cssRule.computeCss(element, stack);

    top.children.push(element)
    element.parent = top;

    if(!token.isSelfColsing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if(token.type == "endTag") {
    if(top.tagName != token.tagName) {
      throw new Error("Tag start end doesn't match!")
    } else {
      // 收集css规则
      if(top.tagName == 'style') {
        cssRule.addCssRules(top.children[0].content);
      }

      stack.pop();
    }
    currentTextNode = null;
  } else if(token.type == "text") {
    if(currentTextNode == null) {
      currentTextNode = {
        type: "text",
        content: ""
      }
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }

  // console.log(token);
}

function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c === EOF) {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}

function tagOpen(c) {
  if (c == "/") {
    return endTagOpen;
  } else if (c.match(/[a-zA-z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
      emit({
          type: "text",
          content: c
      });
  }
}

function tagName(c) {
  if (c.match(/[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/") {
    return selfClosingTagStart;
  } else if (c == ">") {
    emit(currentToken);
    return data;
  } else if (c.match(/[a-zA-Z]$/)) {
    currentToken.tagName += c;
    return tagName;
  } else {
    return tagName;
  }
}

function endTagOpen(c) {
  if (c.match(/[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
    return tagName(c);
  } else if (c == ">") {
    return data;
  } else {

  }
}

// 这个函数忽略了取属性值的步骤，现在我们只关注tag
function beforeAttributeName(c) {
  if (c.match(/[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c == "/" || c == ">" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    // 抛错
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function attributeName(c) {
  if (c.match(/[\t\n\f ]$/) || c == "/" || c == EOF) {
    return afterAttributeName(c);
  } else if (c == "=") {
    return beforeAttributeValue;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function afterAttributeName(c) {
  if (c.match(/[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if(c == "/") {
      return selfClosingTagStart;
  } else if(c == "=") {
      return beforeAttributeValue;
  } else if(c == ">") {
      currentToken[currentAttribute.name] = currentAttribute.value;
      emit(currentToken);
      return data;
  } else if(c == "EOF") {

  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
        name: "",
        value: ""
    }
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if (c.match(/[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
    return beforeAttributeValue(c);
  } else if (c == '"') {
    return doubleQuoteAttributeValue;
  } else if (c == "'") {
    return singleQuoteAttributeValue;
  } else {
    return UnquotedAttributeValue(c);
  }
}

function doubleQuoteAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
      } else if (c == "\u0000") {
      } else if (c == EOF) {

      } else {
          currentAttribute.value += c;
          return doubleQuoteAttributeValue;
      }
}

function singleQuoteAttributeValue(c) {
    if (c == "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
      } else if (c == "\u0000") {
      } else if (c == EOF) {

      } else {
          currentAttribute.value += c;
          return singleQuoteAttributeValue;
      }
}

function afterQuoteAttributeValue(c) {
    if(c.match(/[\r\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingTagStart;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuoteAttributeValuel
    }
}

function UnquotedAttributeValue(c) {
  if (c.match(/[\t\n\f ]$/)) {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c == "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfClosingTagStart;
  } else if (c == ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == "\u0000") {
  } else if (c == '"' || c == "'" || c == "<" || c == "=" || c == "`") {
  } else if(c == EOF) {

  } else {
      currentAttribute.value += c;
      return UnquotedAttributeValue;
  }
}

function selfClosingTagStart(c) {
  if (c == ">") {
    currentToken.isSelfColsing = true;
    emit(currentToken)
    return data;
  } else if(c == EOF) {
    
  } else {

  }
}

module.exports.parserHtml = function parserHtml(html) {
  let state = data;
  for (let c of html) {
      try {
        state = state(c);
      }catch(e) {
          // console.log(e, c);
      }
  }
  state = state(EOF); // 处理结束
  return stack[0];
};
