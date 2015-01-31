exports.start = function () {
	var path = require('path');
	var exec = require('child_process').exec;
	var os = require('os');

	var testEnv = {};
	testEnv['TEST_ROOT'] = __dirname;
	testEnv['JAVA_HOME'] = path.join(__dirname, 'jdk');
	testEnv['ANDROID_HOME'] = path.join(__dirname, 'sdk');
	if (os.platform() == 'darwin') {
		testEnv['PATH'] = path.join(__dirname, 'sdk', 'platform-tools') + ':'
								+ path.join(__dirname, 'sdk', 'tools') + ':'
								+ path.join(__dirname, 'nodejs') + ':'
								+ path.join(__dirname, 'jdk', 'bin') + ':'
								+ process.env['PATH'];
	} else {
		testEnv['Path'] = path.join(__dirname, 'sdk', 'platform-tools') + ';'
								+ path.join(__dirname, 'sdk', 'tools') + ';'
								+ path.join(__dirname, 'nodejs') + ';'
								+ path.join(__dirname, 'jdk', 'bin') + ';'
								+ process.env['Path'];
	}

	for (var key in testEnv) {
		process.env[key] = testEnv[key];
	}

	var child = exec('java -Dfile.encoding=UTF-8 -jar ' + path.join(__dirname, 'autotest.jar'), {env: testEnv}, function (error, stdout, stderr){
		console.log(' ');
		console.log('--------------------');
	    console.log('-->Test finished!<--');
	    console.log('--------------------');
	    if(error){
	      console.log('exec error: ' + error);
	    }
	});

	process.stdin.on('data', function (text) {
	    child.stdin.write(text);
	});

	child.stdout.pipe(process.stdout);
	child.on('close', function(code) {
	    
	});
};