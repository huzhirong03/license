/**
 * 激活码生成器 - JavaScript 版本
 * 
 * 注意：此代码仅供管理员使用，请勿分享！
 */

// ==================== 配置区域 ====================

// 访问密码（加密存储）
const ACCESS_PASSWORD = '150904';

// 密钥（与各程序保持一致）
const SECRET_KEY = 'fage_laser_2024_secret_key_do_not_share';

// 程序列表
const PROGRAMS = {
    'R2V': {
        name: '矢量转换工具',
        enabled: true
    },
    'VBA_TOOL': {
        name: '宏嫖边工具',
        enabled: false  // 开发中
    }
    // 以后添加更多程序
};

// 激活类型
const LICENSE_TYPES = {
    'M1': { name: '1分钟', days: 1/1440 },
    'M30': { name: '1个月', days: 30 },
    'Y1': { name: '1年', days: 365 },
    'PERM': { name: '永久', days: 36500 }
};

// ==================== 密码验证 ====================

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('loginError');
    
    if (input === ACCESS_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        // 保存登录状态（当前会话）
        sessionStorage.setItem('authenticated', 'true');
    } else {
        errorElement.textContent = '密码错误，请重试';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// 回车键登录
document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkPassword();
    }
});

// 检查是否已登录
window.onload = function() {
    if (sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
    }
};

// ==================== SHA256 实现 ====================

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}

// ==================== MD5 实现 ====================

function md5(string) {
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) +
                (s.charCodeAt(i + 1) << 8) +
                (s.charCodeAt(i + 2) << 16) +
                (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n) {
        var s = '', j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] +
                hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    return hex(md51(string)).toUpperCase();
}

// ==================== 激活码生成 ====================

async function generateLicense() {
    const programCode = document.getElementById('programSelect').value;
    const machineCode = document.getElementById('machineCode').value.trim().toUpperCase();
    const typeCode = document.getElementById('licenseType').value;

    // 验证机器码格式
    const cleanCode = machineCode.replace(/-/g, '');
    if (cleanCode.length !== 16) {
        alert('机器码格式不正确！\n应该是16位，格式：XXXX-XXXX-XXXX-XXXX');
        return;
    }

    // 生成激活码
    // 公式：SHA256(机器码 + 类型代码 + SECRET_KEY)
    const rawStr = machineCode + typeCode + SECRET_KEY;
    const hashHex = await sha256(rawStr);
    
    // 生成类型标识（MD5的前4位）
    const typeHash = md5(typeCode).substring(0, 4);
    
    // 格式化激活码
    const licenseKey = `${hashHex.substring(0, 4)}-${hashHex.substring(4, 8)}-${hashHex.substring(8, 12)}-${typeHash}`;

    // 显示结果
    document.getElementById('resultArea').style.display = 'block';
    document.getElementById('licenseResult').value = licenseKey;
    
    // 显示激活信息
    const programName = PROGRAMS[programCode].name;
    const typeName = LICENSE_TYPES[typeCode].name;
    document.getElementById('licenseInfo').innerHTML = 
        `程序：${programName}<br>` +
        `类型：${typeName}<br>` +
        `机器码：${machineCode}`;
}

// ==================== 复制功能 ====================

function copyLicense() {
    const licenseInput = document.getElementById('licenseResult');
    licenseInput.select();
    licenseInput.setSelectionRange(0, 99999); // 移动端兼容

    try {
        navigator.clipboard.writeText(licenseInput.value).then(() => {
            showCopySuccess();
        }).catch(() => {
            // 降级方案
            document.execCommand('copy');
            showCopySuccess();
        });
    } catch (err) {
        document.execCommand('copy');
        showCopySuccess();
    }
}

function showCopySuccess() {
    const btn = document.querySelector('.copy-btn');
    const originalText = btn.textContent;
    btn.textContent = '已复制！';
    btn.style.background = '#2ecc71';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#27ae60';
    }, 1500);
}

