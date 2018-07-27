const os = require('os');
const path = require('path');
const exec = require('child_process').exec;

const _root = path.resolve(__dirname, '..');


/**
 * Plaform independant path to an executable cmd
 * @param {string} path
 */
platformPath = (path) => {
  return /^win/.test(os.platform()) ? `${path}.cmd` : path;
};

/**
 *
 * @param {string[]} args
 */
rootDir = (...args) => {
  return path.join.apply(path, [_root].concat(...args));
};

/**
 *
 * @param {string} cmd
 */
binPath = (cmd) => {
  return platformPath(`/node_modules/.bin/${cmd}`);
};

/**
 * Promisified child_process.exec
 *
 * @param cmd
 * @param opts See child_process.exec node docs
 * https://nodejs.org/docs/latest-v8.x/api/child_process.html#child_process_child_process_exec_command_options_callback
 * @returns {Promise<number>}
 */
execp = (cmd, opts) => {
  opts = Object.assign(opts || {}, {
    stdout: process.stdout,
    stderr: process.stderr,
    maxBuffer: 10 * 1024 * 1024 // 10 MB
  });
  return new Promise((resolve, reject) => {
    const child = exec(cmd, opts,
      (err, stdout, stderr) => err ? reject(err.code) : resolve(0));

    if (opts.stdout) {
      child.stdout.pipe(opts.stdout);
    }
    if (opts.stderr) {
      child.stderr.pipe(opts.stderr);
    }
  });
};

/**
 * Install dependencies using yarn, if present, or npm otherwise.
 * @param opts See child_process.exec node docs
 * @returns {Promise<number>}
 */
installDependencies = (opts) => {
  return execp('npm install', opts);
};

var exports = module.exports = {
  root: rootDir,
  execp: execp,
  binPath: binPath,
  platformPath: platformPath,
  installDependencies: installDependencies
};
