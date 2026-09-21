const babel=require('/home/claude/work/suafaculMobile-main/suafaculMobile-main/node_modules/@babel/core');
const fs=require('fs'),path=require('path');
const root='/home/claude/work/suafaculMobile-main/suafaculMobile-main/src';
const out='/tmp/harness/src';
fs.mkdirSync(out+'/api',{recursive:true});
for (const f of ['config.js','mappers.js','api/client.js','api/services.js']){
  const r=babel.transformFileSync(path.join(root,f),{babelrc:false,configFile:false,plugins:[require.resolve('/home/claude/work/suafaculMobile-main/suafaculMobile-main/node_modules/@babel/plugin-transform-modules-commonjs')]});
  fs.writeFileSync(path.join(out,f),r.code);
}
