exports.start = function () {
	var path = require('path');
	var exec = require('child_process').exec;

	var testEnv = {};
	testEnv['JAVA_HOME'] = path.resolve(__dirname, 'jdk');
	testEnv['ANDROID_HOME'] = path.resolve(__dirname, 'sdk');
	testEnv['Path'] = path.resolve(__dirname, 'sdk\\platform-tools') + ';'
							+ path.resolve(__dirname, 'sdk\\tools') + ';'
							+ path.resolve(__dirname, 'nodejs') + ';'
							+ path.resolve(__dirname, 'jdk\\bin') + ';'
							+ process.env['Path'];

	for (var key in testEnv) {
		process.env[key] = testEnv[key];
	}

	var child = exec('java -Dfile.encoding=UTF-8 -jar environment/autotest.jar', {env: testEnv}, function (error, stdout, stderr){
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
};