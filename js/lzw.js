/*

   Copyright (c) 2011 Sebastien P.

   http://twitter.com/_sebastienp

   MIT licensed.

   ---

   LZW compression/decompression attempt for 140byt.es.

   Thanks to @bytespider for the 5 bytes shorter compression tip !

   ---

   See http://rosettacode.org/wiki/LZW_compression#JavaScript ...

*/

LZW = {

    // 158 bytes
    compress: function (
        a, // String to compress
        b, // Placeholder for dictionary
        c, // Placeholder for dictionary size
        d, // Placeholder for iterator
        e, // Placeholder for w
        f, // Placeholder for result
        g, // Placeholder for c
        h  // Placeholder for wc
    ){

        for (b = {}, c = d = 256; d--;)

            b[String.fromCharCode(d)] = d;

        for (e = f = []; g = a[++d];)

            e = b[h = e + g] ? h : (f.push(b[e]), b[h] = c++, g);

        f.push(b[e]);

        return f

    },

    // 158 bytes
    decompress: function (
        a, // Array to decompress
        b, // Placeholder for dictionary
        c, // Placeholder for dictionary size
        d, // Placeholder for iterator
        e, // Placeholder for w
        f, // Placeholder for result
        g, // Placeholder for entry
        h  // Placeholder for k
    ) {

        for (b = [], c = d = 256, e = String.fromCharCode; d--;)

            b[d] = e(d);

        for (e = f = e(a[d = 0]); (h = a[++d]) <= c;)

            g = b[h] || e + e[0], b[c++] = e + g[0], f += e = g;

        return f

    }
};