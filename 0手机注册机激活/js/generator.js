/**
 * 激活码生成器 - JavaScript 版本 v2.0
 * 
 * 支持程序：
 * 1. R2V 矢量转换工具（SHA256 + MD5）
 * 2. VBA 宏嫖边工具（自定义 SimpleHash）
 * 
 * 注意：此代码仅供管理员使用，请勿分享！
 */

// ==================== 配置区域 ====================

// 访问密码
const ACCESS_PASSWORD = '150904';

// 密钥（与各程序保持一致）
const SECRET_KEYS = {
    'R2V': 'fage_laser_2024_secret_key_do_not_share',
    'VBA_TOOL': 'fage_cdr_plugin_2024_vba_key'
};

// 程序列表
const PROGRAMS = {
    'R2V': {
        name: '矢量转换工具 (R2V)',
        enabled: true
    },
    'VBA_TOOL': {
        name: '宏嫖边工具 (VBA插件)',
        enabled: true
    }
};

// R2V 激活类型
const R2V_LICENSE_TYPES = {
    'M1': { name: '1分钟（测试用）', code: 'M1' },
    'M30': { name: '1个月', code: 'M30' },
    'Y1': { name: '1年', code: 'Y1' },
    'PERM': { name: '永久', code: 'PERM' }
};

// VBA插件 激活类型
const VBA_LICENSE_TYPES = {
    'PERM': { name: '永久', code: 'PERM' },
    'Y365': { name: '1年（365天）', code: 'Y365' },
    'M030': { name: '1个月（30天）', code: 'M030' },
    'D001': { name: '1天', code: 'D001' },
    'S010': { name: '10秒（测试用）', code: 'S010' }
};

// ==================== 工具函数 ====================

// 生成4位随机盐值（十六进制）
function generateSalt() {
    return Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

// ==================== 密码验证 ====================

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('loginError');
    
    if (input === ACCESS_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
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
    // 初始化激活类型列表
    updateLicenseTypeOptions();
};

// ==================== 程序切换处理 ====================

function updateLicenseTypeOptions() {
    const programCode = document.getElementById('programSelect').value;
    const licenseTypeSelect = document.getElementById('licenseType');
    
    // 清空现有选项
    licenseTypeSelect.innerHTML = '';
    
    // 根据程序类型加载对应的激活类型
    let types;
    if (programCode === 'R2V') {
        types = R2V_LICENSE_TYPES;
    } else {
        types = VBA_LICENSE_TYPES;
    }
    
    for (const [code, info] of Object.entries(types)) {
        const option = document.createElement('option');
        option.value = code;
        option.textContent = info.name;
        if (code === 'PERM') {
            option.selected = true;
        }
        licenseTypeSelect.appendChild(option);
    }
}

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

// ==================== VBA插件专用 SimpleHash ====================

/**
 * VBA插件使用的自定义哈希算法
 * 与 ActivationModule.bas 中的 SimpleHash 函数完全一致
 */
function simpleHash(inputStr) {
    // 初始化哈希种子（与VBA完全一致）
    let h1 = 5381;
    let h2 = 5387;
    let h3 = 5393;
    let h4 = 5399;
    
    // 遍历每个字符进行哈希计算
    for (let i = 0; i < inputStr.length; i++) {
        const c = inputStr.charCodeAt(i);
        
        // 先限制范围再乘法，与VBA完全一致
        h1 = ((h1 & 0xFFFF) * 33 + c) & 0x7FFFFFFF;
        h2 = ((h2 & 0xFFFF) * 37 + c) & 0x7FFFFFFF;
        h3 = ((h3 & 0xFFFF) * 41 + c) & 0x7FFFFFFF;
        h4 = ((h4 & 0xFFFF) * 43 + c) & 0x7FFFFFFF;
    }
    
    // 组合结果
    const result = 
        (h1 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0') +
        (h2 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0') +
        (h3 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0') +
        (h4 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    
    return result;
}

/**
 * 格式化为 XXXX-XXXX-XXXX-XXXX
 */
function formatCode(code) {
    let clean = code.replace(/-/g, '').toUpperCase();
    
    // 确保16位
    if (clean.length < 16) {
        clean = clean + '0'.repeat(16 - clean.length);
    } else if (clean.length > 16) {
        clean = clean.substring(0, 16);
    }
    
    return `${clean.substring(0, 4)}-${clean.substring(4, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}`;
}

// ==================== 激活码生成 ====================

async function generateLicense() {
    const programCode = document.getElementById('programSelect').value;
    const machineCode = document.getElementById('machineCode').value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const typeCode = document.getElementById('licenseType').value;

    // 更新输入框显示
    document.getElementById('machineCode').value = machineCode;

    // 验证机器码格式
    const cleanCode = machineCode.replace(/-/g, '');
    if (cleanCode.length !== 16) {
        alert(`机器码格式不正确！\n\n当前长度：${cleanCode.length} 位\n应该是：16 位\n\n格式示例：XXXX-XXXX-XXXX-XXXX`);
        return;
    }

    let licenseKey;
    const salt = generateSalt();

    if (programCode === 'R2V') {
        // R2V 激活码生成（SHA256 + MD5 + 盐值）
        const secretKey = SECRET_KEYS['R2V'];
        const rawStr = cleanCode + typeCode + salt + secretKey;
        const hashHex = await sha256(rawStr);
        const typeHash = md5(typeCode).substring(0, 4);
        
        // 格式：前8位哈希 + 4位类型哈希 + 4位盐值
        licenseKey = `${hashHex.substring(0, 4)}-${hashHex.substring(4, 8)}-${typeHash}-${salt}`;
    } else {
        // VBA插件激活码生成（SimpleHash + 盐值）
        const secretKey = SECRET_KEYS['VBA_TOOL'];
        const rawData = `${cleanCode}|LICENSE|${secretKey}|${typeCode}|${salt}`;
        const hash = simpleHash(rawData);
        
        // 激活码 = Hash前12位 + 盐值4位
        const licenseCode = hash.substring(0, 12) + salt;
        licenseKey = formatCode(licenseCode);
    }

    // 显示结果
    document.getElementById('resultArea').style.display = 'block';
    document.getElementById('licenseResult').value = licenseKey;
    
    // 显示激活信息
    const programName = PROGRAMS[programCode].name;
    const types = programCode === 'R2V' ? R2V_LICENSE_TYPES : VBA_LICENSE_TYPES;
    const typeName = types[typeCode].name;
    document.getElementById('licenseInfo').innerHTML = 
        `<strong>程序：</strong>${programName}<br>` +
        `<strong>类型：</strong>${typeName}<br>` +
        `<strong>机器码：</strong>${machineCode}<br>` +
        `<span style="color: #3498db;">💡 每次点击生成都会产生新的激活码</span>`;
}

// ==================== 复制功能 ====================

function copyLicense() {
    const licenseInput = document.getElementById('licenseResult');
    licenseInput.select();
    licenseInput.setSelectionRange(0, 99999);

    try {
        navigator.clipboard.writeText(licenseInput.value).then(() => {
            showCopySuccess();
        }).catch(() => {
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
