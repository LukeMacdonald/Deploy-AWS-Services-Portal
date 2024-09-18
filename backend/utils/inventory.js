const { Client } = require('ssh2');

const instance_services = (ip, key) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Client :: ready');
      conn.exec('sudo systemctl list-units --type=service --state=running', (err, stream) => {
        if (err) return reject(err);
        let output = '';
        stream.on('close', (code, signal) => {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
          resolve(output);
        }).on('data', (data) => {
          console.log('STDOUT: ' + data);
          output += data.toString();
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
          reject(data.toString());
        });
      });
    }).connect({
      host: ip,
      port: 22,
      username: 'ubuntu',
      privateKey: key
    });
  });
};

const apache_sites = (ip, key) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Client :: ready');
      conn.exec('ls /etc/apache2/sites-available', (err, stream) => {
        if (err) return reject(err);
        let output = '';
        stream.on('close', (code, signal) => {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
          resolve(output);
        }).on('data', (data) => {
          console.log('STDOUT: ' + data);
          output += data.toString();
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
          reject(data.toString());
        });
      });
    }).connect({
      host: ip,
      port: 22,
      username: 'ubuntu',
      privateKey: key
    });
  });
};

const nginx_sites = (ip, key) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Client :: ready');
      conn.exec('ls /etc/nginx/sites-available', (err, stream) => {
        if (err) return reject(err);
        let output = '';
        stream.on('close', (code, signal) => {
          console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
          conn.end();
          resolve(output);
        }).on('data', (data) => {
          console.log('STDOUT: ' + data);
          output += data.toString();
        }).stderr.on('data', (data) => {
          console.log('STDERR: ' + data);
          reject(data.toString());
        });
      });
    }).connect({
      host: ip,
      port: 22,
      username: 'ubuntu',
      privateKey: key
    });
  });
};

module.exports = {
  instance_services,
  apache_sites,
  nginx_sites,
};