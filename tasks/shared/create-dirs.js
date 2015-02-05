var registerTask = require('../../lib/register-task');
var getShipit = require('../../lib/get-shipit');
var chalk = require('chalk');
var sprintf = require('sprintf-js').sprintf;
var path = require('path2/posix');

/**
 * Create required directories for linked files and dirs.
 * - shared:create-dirs
 */

module.exports = function (gruntOrShipit) {
  var shipit = getShipit(gruntOrShipit);
  registerTask(gruntOrShipit, 'shared:create-dirs', task);

  function task() {
    function createDirs(paths, remote, isFile) {
      paths = paths || [.];
      isFile = isFile || false;
      var method = remote ? 'remote' : 'local';
      var pathStr = paths.map(function(curPath) {
        return path.join(shipit.sharedPath, isFile ? sprintf('$(dirname %s)', curPath) : curPath);
      }).join(' ');

      return shipit[method](
        sprintf('mkdir -p %s', pathStr)
      );
    }

    shipit.log('Creating shared directories on remote.');
    shipit.sharedPath = path.join(shipit.config.deployTo, 'shared');

    return createDirs(shipit.config.linkedDirs, true, false)
    .then(createDirs(shipit.config.linkedFiles, true, true))
    .then(function () {
      shipit.emit('dirs-created');
      shipit.log(chalk.green('Shared directories created on remote.'));
    });
  }
};
