const fs = require('fs');
const crypto = require('crypto');

// Generate an RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
});

// Save the keys to files
fs.writeFileSync('public-key.pem', publicKey.export({ type: 'spki', format: 'pem' }));
fs.writeFileSync('private-key.pem', privateKey.export({ type: 'pkcs8', format: 'pem' }));

