    const A = 197384,
        H = 16777215,
        $ = 15723490,
        O = 14736598,
        B = 9144968,
        W = 3552822,
        k = 1907996,
        N = 1052689,
        U = 937983,
        q = 71679,
        X = 2707,
        G = 201894,
        j = 15039511,
        Y = 14325564,
        K = 12743201,
        J = 16711686,
        Q = 9043972,
        Z = 7340294,
        ee = 16725065,
        ne = 11144468,
        te = 1039424,
        ae = 218915,
        oe = 757052,
        re = 155936;
    le = [
        [
            [A, O, W],
            [O, W, A]
        ],
        [
            [N, $, W],
            [$, W, B]
        ],
        [
            [A, H, W],
            [W, H, A]
        ],
        [
            [B, $, 65793],
            [$, B, k]
        ],
        [
            [W, $, 65793],
            [$, W, k]
        ],
        [
            [A, te, ae]
        ],
        [
            [A, te, W],
            [$, te, k]
        ],
        [
            [k, te, H],
            [H, te, k]
        ],
        [
            [N, ae, B]
        ],
        [
            [A, J, Z]
        ],
        [
            [A, J, W],
            [$, J, k]
        ],
        [
            [k, J, H],
            [$, J, W]
        ],
        [
            [N, Z, B]
        ],
        [
            [A, U, q],
            [U, X, A]
        ],
        [
            [A, U, W],
            [$, q, k]
        ],
        [
            [k, U, H],
            [$, U, W]
        ],
        [
            [U, H, A],
            [H, U, A]
        ],
        [
            [U, X, $],
            [$, q, U]
        ],
        [
            [N, q, B]
        ],
        [
            [N, Y, K],
            [H, Y, j]
        ],
        [
            [A, W, K],
            [O, k, j]
        ],
        [
            [k, j, H],
            [$, j, W]
        ],
        [
            [N, ee, ne]
        ],
        [
            [N, ee, W],
            [ee, A, W]
        ],
        [
            [A, W, ne],
            [B, k, ee]
        ],
        [
            [$, G, G]
        ],
        [
            [$, U, G]
        ],
        [
            [$, G, B]
        ],
        [
            [$, U, k]
        ],
        [
            [$, re, re]
        ],
        [
            [$, oe, re]
        ],
        [
            [$, oe, k]
        ],
        [
            [$, re, B]
        ],
        [
            [$, Q, Q]
        ],
        [
            [$, J, Q]
        ],
        [
            [$, Q, B]
        ],
        [
            [$, j, j]
        ],
        [
            [$, j, B]
        ],
        [
            [$, G, J]
        ],
        [
            [$, U, Q]
        ],
        [
            [$, Q, re]
        ],
        [
            [$, Q, j]
        ],
        [
            [$, ee, ne]
        ],
        [
            [A, te, J]
        ],
        [
            [A, U, Z]
        ],
        [
            [A, X, J]
        ],
        [
            [A, ee, U]
        ],
        [
            [A, U, Z],
            [U, A, Z]
        ],
        [
            [A, ee, U]
        ],
        [
            [N, Q, U]
        ],
        [
            [N, ee, U]
        ],
        [
            [N, ee, J]
        ],
        [
            [N, U, K]
        ],
        [
            [$, re, re]
        ]
    ];
    ! function(e = 256) {
        let n = [],
            t = [];
        for (let e = 0; e < le.length; e++) {
            let a = le[e];
            a.length > 1 ? (n.push([a[0]]), n.push([a[1]]), n.push(a), t.push(e, e, e)) : (n.push(a), t.push(e))
        }
        let a = [...n],
            o = [...t];
        if (n.length < e) {
            let r = 0,
                i = 1;
            for (let s = n.length; s < e; s++) {
                let e = n[r];
                if ((i + 1) % 2 == 0)
                    if (1 == e.length) {
                        let n = e[0];
                        e = [
                            [n[0], n[2], n[1]]
                        ]
                    } else 2 == e.length && (e = [e[1], e[0]]);
                a.push(e), o.push(t[r]), r == n.length - 1 ? (r = 0, i++) : r++
            }
        }
        let r = new M(1),
            i = [];
        for (let n = 0; n < e; n++) i.push(n);
        i.splice(0, 1), i = r.random_shuffle(i), i.splice(0, 0, 0);
        let s = [],
            l = [];
        for (let e = 0; e < i.length; e++) {
            let n = i[e];
            s.push(a[n]), l.push(o[n])
        }
        se = s, ie = l
    }();
