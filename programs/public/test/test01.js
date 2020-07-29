
require('../public/javascripts/myjs/myNodeModule.js');

console.log('11111111111111111');
console.log('2222222222222222222222');

//----------------------------------------------------------------------
let json = {

    aaa: '11111'

}

let hhh = json_to_utf8_hex_string(json);

console.log('hhh=', hhh);