function convertStringToNumber(str, notation=10) {
    let num = 0;
    let i = 0;
    while(i < str.length) {
        let c = str.charAt(i)
        if(c === '.') {
            break
        }
        let code = str.charCodeAt(i) - 48;
        num = num * notation + code
        ++i
    }
    ++i

    let multiple = 1;
    while(i < str.length) {
        let code = str.charCodeAt(i) - 48;
        multiple *= notation;
        num += code / multiple
        ++i;
    }
    console.log(num)
}
convertStringToNumber("10.012306", 10)

function convertHexStringToNumber(str) {
    let num = 0;
    let i = 0;
    while(i < str.length) {
        let c = str.charCodeAt(i);
        let code = 0;
        if (c >= 48 && c <=56) {
            code = c - 48;
        } else if (c >= 97 && c <= 102) {
            code = c - 87;
        }
        num = num * 16 + code;

        ++i;
    }
    console.log(num)
}

convertHexStringToNumber("ffff");

// 保留 significant 位有效数字
function convertNumberToString(num, significant = 6) {
    let str = "";
    if (num < 0) {
        str += '-';
    }
    let integer = Math.floor(num);
    let fraction = num % 1;
    let multiple = 10;
    let intNum = Math.abs(integer / multiple);
    // 计算出num整数位数
    while(intNum >= 10) {
        multiple *= 10;
        intNum = intNum / multiple;
    }
    let absNum = Math.abs(integer)
    let tmpNum = 0;
    while(multiple >= 1) {
        tmpNum = Math.floor(absNum / multiple);
        str += String.fromCharCode(tmpNum + 48);

        absNum = absNum - tmpNum * multiple;
        multiple /= 10;
    }

    if (fraction > Number.EPSILON) {
        str += '.';
        // 保留6位小数
        let cnt = 0;
        while(cnt < significant) {
            fnum = fraction * 10;
            let n = Math.floor(fnum);
            str += String.fromCharCode(n + 48);
            ++cnt;
            fraction = fnum % 1;
        }
    }


    console.log(str)
}

convertNumberToString(123.001, 2)
