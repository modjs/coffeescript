var path = require('path');

exports.summary = 'Compile coffeescript files to javascript';

exports.usage = '<src> [options]';

exports.options = {
    "dest" : {
        alias : 'd'
        ,default : '<src>'
        ,describe : 'destination file'
    },

    "charset" : {
        alias : 'c'
        ,default : 'utf-8'
        ,describe : 'file encoding type'
    }
};

exports.run = function (options, done) {
    var src = options.src;
    var dest = options.dest;

    exports.async.eachSeries(exports.files, function(inputFile, callback){
        var outputFile = dest;
        if(exports.file.isDirFormat(dest)){
            outputFile = path.join(dest , path.basename(inputFile) );
            // replace file extname to .js
            outputFile = outputFile.replace('.coffee', '.js');
        }

        exports.compileCoffee(inputFile, outputFile, options, callback);
    }, done);
};

exports.compileCoffee = function(inputFile, outputFile, options, done){
    var coffee = require('coffee-script');
    var code = exports.file.read(inputFile);
    var js = coffee.compile(code, options);
    if (outputFile) {
        exports.file.write(outputFile, js);
        exports.log(inputFile, ">", outputFile);
    }
    done(null, js);
}
