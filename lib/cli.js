#! /usr/bin/env node

const parsedArgs = require('minimist')(process.argv.slice(2));
const command = parsedArgs._[0];

if (parsedArgs.help) {
  console.log('show usage instructions');
  return;
}

switch (command) {
  case 'edit': 
    console.log('run edit');
    const editor = process.env.EDITOR || 'vi';
    const { spawnSync } = require('child_process');
    const result = spawnSync(editor, ['tmp.json'], { stdio: 'inherit' });
    console.log('result', result);;
    break;
  case 'read': 
    console.log('run read');
    break;
  default:
    console.log(`spawn ${command}`);
    break;
}