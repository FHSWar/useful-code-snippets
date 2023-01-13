/*
const 明文buffer流 = crypto.AES.decrypt(
    crypto.lib.CipherParams.create({
        ciphertext: crypto.enc.Hex.parse(密文)
    }),
    crypto.enc.Utf8.parse(密钥),
    {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7,
        enc: crypto.enc.Hex
    }
)

明文 = 明文buffer流.toString(crypto.enc.Utf8)
*/
