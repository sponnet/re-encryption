# re-encryption

Poor man's re-encryption.

## Flow

- Alice generates data
- Alice encrypts data using an AES key only known to Alice
- Alice publishes data on a public network
- Bob wants access to the data
- Bob sends his pubkey to Alice
- Alice encrypts the AES key with Bob's pubkey
- Alice sends this encrypted key to Bob over an insecure channel
- Bob uses his private key to decrypt the AES key
- Bob uses the AES key to decrypt Alice's initial data

# Usage

```
npm install
node index.js
```




