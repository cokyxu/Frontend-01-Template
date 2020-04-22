# 作业

1. 写一个正则表达式 匹配所有 Number 直接量
- 整数

```
/^-?[0-9]+$/g
```

- 浮点数

```
/^[-+]?[0-9]*\.?[0-9]+$/g
```

- 二进制数

```
/^[01]+$/
```

- 八进制数

```
/^[0-7]+\$/
```

- 十六进制数

```
/(^0x[a-f0-9]{1,2}$)|(^0X[A-F0-9]{1,2}$)|(^[A-F0-9]{1,2}$)|(^[a-f0-9]{1,2}$)/g
```

- Number 字面量正则

```
/^(-?[0-9]+)| ([-+]?[0-9]*\.?[0-9]+) | ([01]+) | ([0-7]+\) |(0x[a-f0-9]{1,2}$)|(^0X[A-F0-9]{1,2}$)|(^[A-F0-9]{1,2}$)|(^[a-f0-9]{1,2})$/g
```


2. 写一个 UTF-8 Encoding 的函数

```
function UTF_Encoding (str) {
    var back = [];
    var byteSize = 0;
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
              byteSize += 1;
              back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
              byteSize += 2;
              back.push((192 | (31 & (code >> 6))));
              back.push((128 | (63 & code)))
        } else if ((0x800 <= code && code <= 0xd7ff) 
                || (0xe000 <= code && code <= 0xffff)) {
              byteSize += 3;
              back.push((224 | (15 & (code >> 12))));
              back.push((128 | (63 & (code >> 6))));
              back.push((128 | (63 & code)))
        }
     }
     for (i = 0; i < back.length; i++) {
          back[i] &= 0xff;
     }
     const hexArr = back.map(item => {
        return item.toString(16);
    })
     return `\\u${hexArr.join('')}`;
}
```



3. 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```
/^(("([^"]|\")*")|('([^']|\')*'))$/
```

