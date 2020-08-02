
sendRequest = function (form) {
    let url = "/";
    let params = "name=Sam";
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
}

//メソッド実行-----------------------------------------------------------------------------------------------------
done = function (resData, textStatus, jqXHR) {
    let hexSt = resData.hexSt;
    let json = utf8_hex_string_to_json(hexSt);
    let methodName = json.methodName;
    let executeName = methodName + "(resData, textStatus, jqXHR);";
    eval(executeName);
}

//---------------------------------------------------------------------------------------------------------------
zeroPadding = function (num, length) {
    return ('0000000000' + num).slice(-length);
}

//-----------------------------------------------------------------------------------------------------
postData = function (inUrl, inJsonData) {

    let hexStr = json_to_utf8_hex_string(inJsonData);

    let w_key = "hexStr=" + hexStr;

    $.ajax({
        url: inUrl,
        type: 'POST',
        timeout: 8000,
        data: w_key
    }).done(function (resData, textStatus, jqXHR) {
        done(resData, textStatus, jqXHR);
    }).fail(function (jqXHR, textStatus, errorThrown) {
        doFail(jqXHR, textStatus, errorThrown);
    }).always(function () {

    });
    return true;
}

//２つの数を足して返す------------------------------------------------------------------------------------------------
addSuu = function (inSuuSt, inAddNum) {
    let suu = Number(inSuuSt);
    suu = suu + inAddNum;
    return suu;
}

//-----------------------------------------------------------------------------------------------------------------
utf8_to_b64 = function (str) {
    let data01 = encodeURI(str);
    let data02 = encodeURIComponent(data01);
    let data03 = window.btoa(data02);
    return data03;
}

//-----------------------------------------------------------------------------------------------------------------
b64_to_utf8 = function (b64St) {
    let data01 = window.atob(b64St);
    let data02 = decodeURIComponent(data01);
    let data03 = decodeURI(data02);
    return data03;
}

//Ｍａｐからサーバーに渡す文字列に変換------------------------------------------------------------------------------
makeArraySt = function (iMap) {
    let array = new Array();

    //マップはキーと値をタブで区切り、その内容をリストに出力する
    for (let [key, value] of iMap) {
        //「タブ(\t)+キャリッジリターン(\r)+タブ(\t)」で区切った文字列にする-------------------------------------
        array.push(key + '\t\r\t' + value);
    }

    //配列を、「タブ(\t)+バックスラッシュ(\b)+タブ(\t)」で区切った文字列にする-------------------------------------
    let arraySt = array.join('\t\b\t');

    return arraySt;
}
//------------------------------------------------------------------------------------------------------------------
retWindowClose = function (resData, textStatus, jqXHR, inChild_win) {
    window.open('', '_self').close();
    sessionStorage.clear();
}

//---------------------------------------------------------------------------------------------------------------------
get = function (iKey) {
    let value = sessionStorage.getItem(iKey);

    //値の型が数値の場合
    if (isNaN(value) == false) {
        return Number(value);
    }
    return value;
}

//---------------------------------------------------------------------------------------------------------------------
get_utf8_hex_string_to_json = function (iKey) {
    let value = get(iKey);
    return utf8_hex_string_to_json(value);
}

//---------------------------------------------------------------------------------------------------------------------
get_json_from_request = function (req) {
    let hexStr = req.body.hexStr;
    return utf8_hex_string_to_json(hexStr);
}

//---------------------------------------------------------------------------------------------------------------------
set = function (iKey, iValue) {
    return sessionStorage.setItem(iKey, iValue);
}

//---------------------------------------------------------------------------------------------------------------------
doFail = function (jqXHR, textStatus, errorThrown) {
    console.log("textStatus=", textStatus);
}

//--------------------------------------------------------------------------------------
evalExecute = function (req, res) {

    let json = get_json_from_request(req);

    return json.doServerMethod + '(req, res)';
};

//----------------------------------------------------------------------------------------
makeJson = function (iJson) {

    let w_hex = json_to_utf8_hex_string(iJson);

    let json = {
        hexSt: w_hex
    }

    return json;
};

// 文字列をUTF8の16進文字列に変換--------------------------------------------------------------------------------------
string_to_utf8_hex_string = function (text) {
	let bytes   = string_to_utf8_bytes(text);
	let hex_str = bytes_to_hex_string(bytes);
	return hex_str;
};

// JSONをUTF8の16進文字列に変換--------------------------------------------------------------------------------------
json_to_utf8_hex_string = function (json) {
    let jsf = JSON.stringify(json);
    return string_to_utf8_hex_string(jsf);
};

// UTF8の16進文字列を文字列に変換--------------------------------------------------------------------------------------
utf8_hex_string_to_string = function (hex_str1) {
    if (hex_str1 == undefined) {
        console.log('== ERR utf8_hex_string_to_string 引数がundefinedです');
        hex_str1 = "";
    }
	let bytes = hex_string_to_bytes(hex_str1);
    return utf8_bytes_to_string(bytes);
};

// UTF8の16進文字列をJSONに変換--------------------------------------------------------------------------------------
utf8_hex_string_to_json = function (hex_str1) {
    if (hex_str1 == undefined) {
        console.log('== ERR utf8_hex_string_to_json 引数がundefinedです');
        return {};
    }
    let sendJsonDataSt = utf8_hex_string_to_string(hex_str1);
    return JSON.parse(sendJsonDataSt);
};

// 文字列をUTF8のバイト配列に変換--------------------------------------------------------------------------------------
string_to_utf8_bytes = function (text) {
    let result = [];
    if (text == null)
        return result;
    for (let i = 0; i < text.length; i++) {
        let c = text.charCodeAt(i);
        if (c <= 0x7f) {
            result.push(c);
        } else if (c <= 0x07ff) {
            result.push(((c >> 6) & 0x1F) | 0xC0);
            result.push((c & 0x3F) | 0x80);
        } else {
            result.push(((c >> 12) & 0x0F) | 0xE0);
            result.push(((c >> 6) & 0x3F) | 0x80);
            result.push((c & 0x3F) | 0x80);
        }
    }
    return result;
};

// バイト値を16進文字列に変換-------------------------------------------------------------------------------------------
byte_to_hex = function (byte_num) {
    let digits = (byte_num).toString(16);
    if (byte_num < 16) return '0' + digits;
    return digits;
};

// バイト配列を16進文字列に変換----------------------------------------------------------------------------------------
bytes_to_hex_string = function (bytes) {
    let	result = "";

    for (let i = 0; i < bytes.length; i++) {
		result += byte_to_hex(bytes[i]);
	}
	return result;
};

// 16進文字列をバイト値に変換------------------------------------------------------------------------------------------
hex_to_byte = function (hex_str) {
	return parseInt(hex_str, 16);
};

// バイト配列を16進文字列に変換----------------------------------------------------------------------------------------
hex_string_to_bytes = function (hex_str) {
    let	result = [];

    for (let i = 0; i < hex_str.length; i+=2) {
		result.push(hex_to_byte(hex_str.substr(i,2)));
	}
	return result;
};

//UTF8のバイト配列を文字列に変換---------------------------------------------------------------------------------------
utf8_bytes_to_string = function (arr) {
    if (arr == null)
        return null;
    let result = "";
    let i;
    while (i = arr.shift()) {
        if (i <= 0x7f) {
            result += String.fromCharCode(i);
        } else if (i <= 0xdf) {
            let c = ((i&0x1f)<<6);
            c += arr.shift()&0x3f;
            result += String.fromCharCode(c);
        } else if (i <= 0xe0) {
            let c = ((arr.shift()&0x1f)<<6)|0x0800;
            c += arr.shift()&0x3f;
            result += String.fromCharCode(c);
        } else {
            let c = ((i&0x0f)<<12);
            c += (arr.shift()&0x3f)<<6;
            c += arr.shift() & 0x3f;
            result += String.fromCharCode(c);
        }
    }
    return result;
};

//Ｍａｐからサーバーに渡す文字列に変換------------------------------------------------------------------------------
makeArraySt = function (iMap) {
	let array = new Array();

	//マップはキーと値をタブで区切り、その内容をリストに出力する
    for (let [key, value] of iMap) {
		//「タブ(\t)+キャリッジリターン(\r)+タブ(\t)」で区切った文字列にする-------------------------------------
		array.push(key + '\r\t' + value);
	}

	//配列を、「タブ(\t)+バックスラッシュ(\b)+タブ(\t)」で区切った文字列にする-------------------------------------
	let arraySt = array.join('\t\b\t');

	return arraySt;
}

//-----------------------------------------------------------------------------------------------------------------
mapToArray = function (map) {
  if (Object.getPrototypeOf(map) === Map.prototype) {
    map = [...map];
    let i = map.length;

    while (i--) {
      const entry = map[i],
            value = entry[1];

      if (Object.getPrototypeOf(value) === Map.prototype || Array.isArray(value)) {
        entry[1] = mapToArray(value);
      }
    }

    map = {'map-object': map};
  } else if (Array.isArray(map)) {
    let i = map.length;

    while (i--) {
      const value = map[i];

      if (Object.getPrototypeOf(value) === Map.prototype || Array.isArray(value)) {
        map[i] = mapToArray(value);
      }
    }
  }

  return map;
}

//-----------------------------------------------------------------------------------------------------------------
undefinedSetSpace = function (iData) {
	if(iData == undefined){
		return '';
	}
	return iData;
}

//-----------------------------------------------------------------------------------------------------------------
isNumber = function (val){
    let regexp = new RegExp(/^[0-9]+(\.[0-9]+)?$/);
	return regexp.test(val);
}

//現在時間取得----------------------------------------------------------------------------------------------------------
getNowDate = function () {
    let dd = new Date();
    let hh = dd.getHours();
    let mm = dd.getMinutes();
    let ss = dd.getSeconds();
    let ms = dd.getMilliseconds();

    if (hh < 10) {
        hh = "0" + hh;
    }
    return hh + ":" + mm + ":" + ss + "." + ms;
}

//現在日付取得(yyyy/mm/dd)----------------------------------------------------------------------------------------------
getYyyyMmDd = function () {
    let dt = new Date();
    let y = dt.getFullYear();
    let m = ("00" + (dt.getMonth() + 1)).slice(-2);
    let d = ("00" + dt.getDate()).slice(-2);
    let result = y + "/" + m + "/" + d;
    return result;
}

// ボタン押下時に呼び出す ---------------------------------------------------------------
btn_onclick = function (iMoji) {
    var $form = $("#form");
    $form.attr("action", iMoji);
    $form.submit();
};

//HTMLにスクリプトを設定する①------------------------------------------------------------
setScriptToHTML = function (idName, iSt) {
    let fragment = document.createDocumentFragment();
    let elem2 = document.getElementById(idName);
    replaceHTML(elem2, iSt);
    fragment.appendChild(elem2);
    document.body.appendChild(fragment);
};

//HTMLにスクリプトを設定する②------------------------------------------------------------
replaceHTML = function (element, html) {
    element.innerHTML = html;
    element.querySelectorAll('script').forEach(scriptElement => {
        const _script = document.createElement('script');
        _script.textContent = scriptElement.textContent;
        scriptElement.replaceWith(_script);
    });
};

//プルダウン文字列を作成する ---------------------------------------------------------------
make_option_mojiertu = function (data002, selecedCount, iLabel, iName) {

    let moij = "<label for='number'>" + iLabel +"</label>" +
        "<select name='" + iName + "' id='id_info'>";

    for (let i = 0; i < data002.length; i++) {
        if (i == selecedCount) {
            moij = moij + "<option selected='selected'>";
        } else {
            moij = moij + "<option>";
        }
        moij = moij + data002[i] + "</option>";
    }

    moij = moij + "</select>";

    return moij;
};

//指定時間処理を止める ---------------------------------------------------------------
sleep = function (waitMsec) {
    var startMsec = new Date();
    // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
    while (new Date() - startMsec < waitMsec);
}

//命令を短くする (document.getElementById)---------------------------------------------------------------
getElemVal = function (id) {
    return document.getElementById(id).value;
}

//命令を短くする (document.getElementById)---------------------------------------------------------------
getElem = function (id) {
    return document.getElementById(id);
}

// 日付をYYYYMMDDHHMISSMSの書式(17桁)で返すメソッド
function formatDate(dt) {
    var y  = dt.getFullYear();
    var m  = ('00' + (dt.getMonth() + 1)).slice(-2);
    var d  = ('00' + dt.getDate()).slice(-2);
    var h  = ('00' + dt.getHours()).slice(-2);
    var mi = ('00' + dt.getMinutes()).slice(-2);
    var s =  ('00' + dt.getSeconds()).slice(-2);
    var ms = ('000' + dt.getMilliseconds()).slice(-3);
    return (y + m + d + h + mi + s + ms);
}

aaaavvvvvOYA = function (iStr) {
    console.log('aaaavvvvvOYA' + iStr);
}