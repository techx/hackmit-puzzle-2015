# QR Code Puzzle

The main point of this puzzle is to convert a 2D list of `0`'s and `1`'s into a scannable QR code.

For example, the following binaryQR should scan to `Testing QR code`

```
1 1 1 1 1 1 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1
1 0 0 0 0 0 1 0 0 0 1 1 0 0 1 0 0 0 0 0 1
1 0 1 1 1 0 1 0 1 1 0 1 0 0 1 0 1 1 1 0 1
1 0 1 1 1 0 1 0 1 1 0 1 1 0 1 0 1 1 1 0 1
1 0 1 1 1 0 1 0 1 0 0 1 1 0 1 0 1 1 1 0 1
1 0 0 0 0 0 1 0 0 1 1 1 0 0 1 0 0 0 0 0 1
1 1 1 1 1 1 1 0 1 0 1 0 1 0 1 1 1 1 1 1 1
0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0
1 1 1 1 0 0 1 0 1 1 1 1 0 1 0 0 1 1 1 0 1
1 1 0 0 0 0 0 1 1 1 0 0 0 0 0 1 1 1 1 0 1
0 0 1 1 1 1 1 0 1 0 1 0 0 0 1 0 0 0 0 1 1
0 0 1 1 0 1 0 1 1 0 1 1 1 0 0 1 0 1 0 1 0
0 0 0 0 0 0 1 0 0 0 1 1 0 1 0 0 0 1 0 1 0
0 0 0 0 0 0 0 0 1 0 0 1 1 0 1 0 1 1 0 1 1
1 1 1 1 1 1 1 0 0 1 1 1 0 0 0 1 1 1 1 0 0
1 0 0 0 0 0 1 0 0 1 0 1 0 1 0 1 1 1 1 1 1
1 0 1 1 1 0 1 0 0 0 0 1 0 1 1 1 1 0 1 1 0
1 0 1 1 1 0 1 0 1 1 0 0 1 1 0 0 0 1 0 1 0
1 0 1 1 1 0 1 0 1 0 1 1 1 0 1 0 0 0 1 0 0
1 0 0 0 0 0 1 0 1 1 0 1 0 0 1 1 0 0 0 0 1
1 1 1 1 1 1 1 0 1 1 0 0 0 1 1 0 0 0 1 0 0
```

`qr.py` includes functions to both create a binaryQR code from a string `qrToBin()` and generate a scannable QR code image from a binaryQR code `binToQr`.

The data to encode/decode can be of any reasonable size.
