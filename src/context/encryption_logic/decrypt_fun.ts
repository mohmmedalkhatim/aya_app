import sodium from 'libsodium-wrappers-sumo';
import { getPassword } from 'tauri-plugin-keyring-api';
import { Data } from '..';


export const decrypt = async (payload: string, name: string): Promise<Data> => {
  await sodium.ready;

  const password = await getPassword('encryption_key', name);
  if (!password) throw new Error('Missing encryption key');

  const parsed = JSON.parse(payload);
  const ciphertext = sodium.from_base64(parsed.ciphertext);
  const nonce = sodium.from_base64(parsed.nonce);
  const salt = sodium.from_base64(parsed.salt);

  // Re-derive same key
  const key = sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  const decrypted = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
  if (!decrypted) {
    throw new Error('Decryption failed (wrong password or tampered data)');
  }

  return JSON.parse(sodium.to_string(decrypted));
};
