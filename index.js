const {
	performance
} = require('perf_hooks');
const EthCrypto = require('eth-crypto');
const CryptoJS = require("crypto-js");

const identity_Bob = EthCrypto.createIdentity();

function randomString(string_length) {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var randomstring = '';
	for (var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
}

// generate the payload to be encrypted
const msg = randomString(100000);

console.log('message before =', msg.substring(0, 50), '...');

// generate an AES key
const AESkey = randomString(50);

// Encrypt data (Alice) using AES symmetric key
performance.mark('A');
var ciphertext = CryptoJS.AES.encrypt(msg, AESkey);
performance.mark('B');
performance.measure('A to B', 'A', 'B');

// asymmetrically Encrypt AES key with public key of Bob
EthCrypto.encryptWithPublicKey(
	identity_Bob.publicKey,
	AESkey
).then((encrypted) => {

	performance.mark('C');
	EthCrypto.decryptWithPrivateKey(
			identity_Bob.privateKey,
			encrypted)
		.then((decryptedAESKey) => {
			performance.mark('D');
			performance.measure('C to D', 'C', 'D');

			performance.mark('E');

			// Decrypt message using decrypted AES key
			var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), decryptedAESKey);
			var plaintext = bytes.toString(CryptoJS.enc.Utf8);

			console.log('message after  =', plaintext.substring(0, 50), '...');

			performance.mark('F');
			performance.measure('E to F', 'E', 'F');

			console.log('AES key length ' + decryptedAESKey.length);
			console.log('message encrypted. Duration ' + performance.getEntriesByName('A to B')[0].duration + ' ms');
			console.log('key decrypted. Duration ' + performance.getEntriesByName('C to D')[0].duration + ' ms');
			console.log('message decrypted. Duration ' + performance.getEntriesByName('E to F')[0].duration + ' ms');

		});
});
