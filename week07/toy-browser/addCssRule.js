const css = require("css");

// 收集 css 规则
let rules = [];
module.exports.addCssRules = function addCssRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
};

function match(element, selector) {
  if(!element || !selector) {
    return false;
  }

  if(selector.charCodeAt(0) =='#') {
    var attr = element.attributes.filter(item => item.name == 'id')[0];

    if(attr && attr.value === selector.replace('#', '')) {
      return true;
    }
  } else if(selector.charCodeAt(0) == '.') {
    var attr = element.attributes.filter(item => item.name == 'class')[0];

    if(attr && attr.value === selector.replace('.', '')) {
      return true;
    }
  } else {
    if(element.tagName === selector) {
      return true;
    }
  }

  return false;
}

function specificity(selector) {
  let p = [0, 0, 0, 0];
  let selectorParts = selector.split(' ');

  for(let sel of selectorParts) {
    if(sel.charCodeAt(0) === '#') {
      p[1] += 1;
    } else if(sel.charCodeAt(0) === '.') {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if(sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  }
  if(sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  }
  if(sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return sp1[3] - sp2[3];
}

module.exports.computeCss = function computeCss(element, stack) {
  let elements = stack.slice().reverse(); // 相当于复制整个数组，再逆序
  if(!element.computedStyle) {
    element.computedStyle = {};
  }

  for(let rule of rules) {
    let selectorParts = rule.selectors[0].split(' ').reverse();
    let matched = false;

    if(!match(element, selectorParts[0])) {
      continue;
    }

    let j = 1;
    for(let i = 0 ;i < elements.length; i++) {
      if(match(elements[i], selectorParts[j])) {
        j++;
      }
    }

    if(j >= selectorParts.length) {
      matched = true;
    }

    if(matched) {
      // 匹配到，则加入
      let sp = specificity(selectorParts[0]);
      let computedStyle = element.computedStyle;
      for(let declaration of rule.declarations) {
        if(!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }

        if(!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].specificity = sp;
          computedStyle[declaration.property].value = declaration.value;
        } else if(compare(computedStyle[declaration.property].specificity, sp) < 0){
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }

      }
    }
  }
};
