import sodium from 'libsodium-wrappers-sumo';
import { setPassword } from 'tauri-plugin-keyring-api';
import { Data } from '..';
import { v7 } from 'uuid';

export const encrypt = async (payload: Data, name: string) => {
  try {
    await sodium.ready;

    const password = v7();
    await setPassword('encryption_key', name, password);
    if (!password) throw new Error('Missing encryption key');

    // Generate salt (store it)
    const salt = sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);

    // Derive key from password
    const key = sodium.crypto_pwhash(
      sodium.crypto_secretbox_KEYBYTES,
      password,
      salt,
      sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
      sodium.crypto_pwhash_ALG_DEFAULT
    );

    // Generate nonce (store it)
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

    const message = sodium.from_string(JSON.stringify(payload));

    // Encrypt (authenticated)
    const ciphertext = sodium.crypto_secretbox_easy(message, nonce, key);

    return JSON.stringify({
      ciphertext: sodium.to_base64(ciphertext),
      nonce: sodium.to_base64(nonce),
      salt: sodium.to_base64(salt),
    });
  } catch (err) {
    console.log(err);
  }
};
