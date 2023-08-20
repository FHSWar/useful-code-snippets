const isPureHanziFactory = () => {
  const regex =
    /[^a-zA-Z0-9\s\·\~\！\@\#\￥\%\……\&\*\（\）\——\-\+\=\【\】\{\}\、\|\；\‘\’\：\“\”\《\》\？\，\。\、\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]/;

  return (str) => {
    return str.split("").every((char) => regex.test(char));
  };
};

const isPureHanzi = isPureHanziFactory();

const pureHanzi =
  "㐀䐀䫟㛃㛚㧑䴖䶮䶵䏲䐀䓖䲠䴘䴕㑊㘎㟃㥄㠓仛一廿渀绿踀黿卿腾亁俪韡棣頔龥骏鑑鵸黛齡﨩𠀀𡀀𢀀𣀀𤀀𥀀𦀀𧀀𨀀𩀀𪀀𪛖‎𠅤𬀩𦺗𠉢𠔵𠡶𠥋𡝬𩾌𪟝𪣻𪤗𫞩𫟅𫟦𫟹𫟼𫠆𫢸𫫇𫭟𬜬𬱖𬍛𬞟𬬭𬴂𬷕";

const notPure =
  "abc㐀䐀䫟㛃㛚㧑䴖䶮䶵䏲䐀䓖䲠䴘䴕㑊㘎㟃㥄㠓仛一廿渀绿踀黿卿腾亁俪韡棣頔龥骏鑑鵸黛齡﨩𠀀𡀀𢀀𣀀𤀀𥀀𦀀𧀀𨀀𩀀𪀀𪛖‎𠅤𬀩𦺗𠉢𠔵𠡶𠥋𡝬𩾌𪟝𪣻𪤗𫞩𫟅𫟦𫟹𫟼𫠆𫢸𫫇𫭟𬜬𬱖𬍛𬞟𬬭𬴂𬷕";

console.log('isPureHanzi(pureHanzi)', isPureHanzi(pureHanzi))
console.log('isPureHanzi(notPure)', isPureHanzi(notPure))