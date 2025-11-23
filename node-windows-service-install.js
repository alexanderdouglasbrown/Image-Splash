var Service = require('node-windows').Service;

// https://github.com/coreybutler/node-windows#readme

// Create a new service object
var svc = new Service({
  name:'Image Splash',
  description: 'Start your day with a cool splash of images',
  script: require('path').join(__dirname,'app.js'),
  nodeOptions: [
    '--env-file=.env'
  ]
  //, workingDirectory: '...'
  //, allowServiceLogon: true
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();