/**
 * 激活码生成器 - JavaScript 版本 v4.0
 * 支持：R2V / QuickPaiban / VBA_TOOL
 */

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    const errorElement = document.getElementById('loginError');

    if (input === ACCESS_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        sessionStorage.setItem('authenticated', 'true');
        updateLicenseTypeOptions();
    } else {
        errorElement.textContent = '密码错误，请重试';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') checkPassword();
        });
    }

    if (sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        updateLicenseTypeOptions();
    }
});

function updateLicenseTypeOptions() {
    try {
        const programSelect = document.getElementById('programSelect');
        const licenseTypeSelect = document.getElementById('licenseType');
        const customerGroup = document.getElementById('customerGroup');
        const phoneGroup = document.getElementById('phoneGroup');

        if (!programSelect || !licenseTypeSelect) return;

        const programCode = programSelect.value;
        licenseTypeSelect.innerHTML = '';

        let types = {};
        if (programCode === 'R2V') {
            types = R2V_LICENSE_TYPES || {};
            if (customerGroup) customerGroup.style.display = 'block';
            if (phoneGroup) phoneGroup.style.display = 'block';
        } else if (programCode === 'QUICKPAIBAN') {
            types = QUICKPAIBAN_LICENSE_TYPES || {};
            if (customerGroup) customerGroup.style.display = 'none';
            if (phoneGroup) phoneGroup.style.display = 'none';
        } else {
            types = VBA_LICENSE_TYPES || {};
            if (customerGroup) customerGroup.style.display = 'none';
            if (phoneGroup) phoneGroup.style.display = 'none';
        }

        for (const [code, info] of Object.entries(types)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = info.name;
            if ((programCode === 'R2V' && code === 'M30') ||
                (programCode === 'QUICKPAIBAN' && code === 'M030')) {
                option.selected = true;
            }
            licenseTypeSelect.appendChild(option);
        }

        toggleCustomDays();
    } catch (error) {
        console.error('updateLicenseTypeOptions error:', error);
    }
}

function toggleCustomDays() {
    const programCode = document.getElementById('programSelect').value;
    const licenseType = document.getElementById('licenseType').value;
    const customDaysInput = document.getElementById('customDays');

    const show = (programCode === 'R2V' && licenseType === 'CUSTOM') ||
        (programCode === 'QUICKPAIBAN' && (licenseType === 'DAYS_CUSTOM' || licenseType === 'MINUTES_CUSTOM'));

    customDaysInput.style.display = show ? 'inline-block' : 'none';
    customDaysInput.placeholder = (programCode === 'QUICKPAIBAN' && licenseType === 'MINUTES_CUSTOM') ? '分钟' : '天数';
}

function simpleHash(inputStr) {
    let h1 = 5381;
    let h2 = 5387;
    let h3 = 5393;
    let h4 = 5399;

    for (let i = 0; i < inputStr.length; i++) {
        const c = inputStr.charCodeAt(i);
        h1 = ((h1 & 0xFFFF) * 33 + c) & 0x7FFFFFFF;
        h2 = ((h2 & 0xFFFF) * 37 + c) & 0x7FFFFFFF;
        h3 = ((h3 & 0xFFFF) * 41 + c) & 0x7FFFFFFF;
        h4 = ((h4 & 0xFFFF) * 43 + c) & 0x7FFFFFFF;
    }

    return (h1 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0') +
        (h2 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0') +
        (h3 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0') +
        (h4 & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function formatCode(code) {
    let clean = code.replace(/-/g, '').toUpperCase();
    if (clean.length < 16) clean = clean + '0'.repeat(16 - clean.length);
    if (clean.length > 16) clean = clean.substring(0, 16);
    return `${clean.substring(0, 4)}-${clean.substring(4, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}`;
}

function generateSalt() {
    return Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function generateNonceHex(length) {
    const chars = '0123456789abcdef';
    let out = '';
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

function getBeijingTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (8 * 3600000));
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateTime(date) {
    return `${formatDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

function aesEncrypt(plainText) {
    const keyBytes = [];
    for (let i = 0; i < 32; i++) keyBytes.push(i < LICENSE_FILE_KEY.length ? LICENSE_FILE_KEY.charCodeAt(i) : 0);
    const key = CryptoJS.lib.WordArray.create(new Uint8Array(keyBytes));

    const ivBytes = [];
    for (let i = 0; i < 16; i++) ivBytes.push(i < LICENSE_FILE_IV.length ? LICENSE_FILE_IV.charCodeAt(i) : 0);
    const iv = CryptoJS.lib.WordArray.create(new Uint8Array(ivBytes));

    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}

function hmacSign(data) {
    const hash = CryptoJS.HmacSHA256(data, LICENSE_FILE_KEY);
    return CryptoJS.enc.Base64.stringify(hash);
}

function base64ToBase64Url(b64) {
    return (b64 || '').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function toBase64UrlFromBytes(bytes) {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        const sub = bytes.subarray(i, i + chunk);
        binary += String.fromCharCode.apply(null, sub);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function extractXmlTag(xml, tagName) {
    const re = new RegExp(`<${tagName}>([^<]+)</${tagName}>`, 'i');
    const m = re.exec(xml || '');
    return m ? m[1] : '';
}

function parseQuickPaibanPrivateKeyToJwk() {
    const xml = QUICKPAIBAN_PRIVATE_KEY_XML || '';
    return {
        kty: 'RSA',
        n: base64ToBase64Url(extractXmlTag(xml, 'Modulus')),
        e: base64ToBase64Url(extractXmlTag(xml, 'Exponent')),
        d: base64ToBase64Url(extractXmlTag(xml, 'D')),
        p: base64ToBase64Url(extractXmlTag(xml, 'P')),
        q: base64ToBase64Url(extractXmlTag(xml, 'Q')),
        dp: base64ToBase64Url(extractXmlTag(xml, 'DP')),
        dq: base64ToBase64Url(extractXmlTag(xml, 'DQ')),
        qi: base64ToBase64Url(extractXmlTag(xml, 'InverseQ')),
        alg: 'RS256',
        ext: true,
        key_ops: ['sign']
    };
}

async function generateQuickPaibanCode(machineCode, typeCode, customValue) {
    if (!window.crypto || !window.crypto.subtle) {
        throw new Error('当前浏览器不支持 WebCrypto，无法生成 QuickPaiban 激活码。');
    }

    const typeInfo = QUICKPAIBAN_LICENSE_TYPES[typeCode];
    if (!typeInfo) throw new Error('QuickPaiban 激活类型无效。');

    let lt = typeInfo.lt;
    let d = typeInfo.d;

    if (typeCode === 'DAYS_CUSTOM' || typeCode === 'MINUTES_CUSTOM') {
        const num = parseInt(customValue, 10) || 0;
        if (num <= 0) {
            throw new Error(typeCode === 'DAYS_CUSTOM' ? '请输入有效天数。' : '请输入有效分钟数。');
        }
        d = num;
    }

    const payload = {
        v: 1,
        pid: QUICKPAIBAN_PRODUCT_ID,
        mid: machineCode,
        lt: lt,
        d: d > 0 ? d : 0,
        iat: Math.floor(Date.now() / 1000),
        n: generateNonceHex(32),
        iss: QUICKPAIBAN_ISSUER
    };

    const payloadJson = JSON.stringify(payload);
    const payloadBytes = new TextEncoder().encode(payloadJson);
    const payloadB64Url = toBase64UrlFromBytes(payloadBytes);

    const jwk = parseQuickPaibanPrivateKeyToJwk();
    const key = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, payloadBytes);
    const signatureB64Url = toBase64UrlFromBytes(new Uint8Array(signature));
    const licenseKey = `QPA1.${payloadB64Url}.${signatureB64Url}`;

    let typeName = typeInfo.name;
    if (typeCode === 'DAYS_CUSTOM') typeName = `自定义天数(${d}天)`;
    if (typeCode === 'MINUTES_CUSTOM') typeName = `自定义分钟(${d}分钟)`;

    let expiryInfo = '永久有效';
    if (lt === 'DAYS') expiryInfo = `激活后 ${d} 天有效`;
    else if (lt === 'MINUTES') expiryInfo = `激活后 ${d} 分钟有效`;
    else if (lt === 'M001') expiryInfo = '激活后 1 分钟有效';
    else if (lt === 'D001') expiryInfo = '激活后 1 天有效';
    else if (lt === 'M030') expiryInfo = '激活后 30 天有效';
    else if (lt === 'Y365') expiryInfo = '激活后 365 天有效';

    return { licenseKey, typeName, expiryInfo };
}

async function getActivation(machineCode) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/activations_r2v?machine_code=eq.${machineCode}&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        if (response.ok) {
            const data = await response.json();
            return data.length > 0 ? data[0] : null;
        }
        return null;
    } catch (error) {
        console.error('查询失败:', error);
        return null;
    }
}

async function upsertActivation(machineCode, customerName, licenseType, expiryDate, daysAdded, phone) {
    try {
        const oldRecord = await getActivation(machineCode);
        const beijingTime = formatDateTime(getBeijingTime());

        const data = {
            machine_code: machineCode,
            customer_name: customerName || '',
            phone: phone || '',
            license_type: licenseType,
            expiry_date: expiryDate === '永久' ? null : expiryDate,
            activation_count: (oldRecord?.activation_count || 0) + 1,
            last_activation_time: beijingTime,
            updated_at: beijingTime
        };

        let response;
        if (oldRecord) {
            response = await fetch(`${SUPABASE_URL}/rest/v1/activations_r2v?machine_code=eq.${machineCode}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } else {
            response = await fetch(`${SUPABASE_URL}/rest/v1/activations_r2v`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            await addHistory(machineCode, customerName, licenseType, daysAdded, oldRecord?.expiry_date, expiryDate, phone);
        }

        return response.ok;
    } catch (error) {
        console.error('上传失败:', error);
        return false;
    }
}

async function addHistory(machineCode, customerName, licenseType, daysAdded, expiryBefore, expiryAfter, phone) {
    try {
        const data = {
            machine_code: machineCode,
            customer_name: customerName || '',
            phone: phone || '',
            license_type: licenseType,
            days_added: daysAdded,
            expiry_date_before: expiryBefore || null,
            expiry_date_after: expiryAfter === '永久' ? null : expiryAfter,
            activation_source: 'MOBILE_WEB',
            remark: ''
        };

        await fetch(`${SUPABASE_URL}/rest/v1/activation_history_r2v`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('历史记录失败:', error);
    }
}

async function getQpActivation(machineCode) {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE_QP_ACTIVATIONS}?machine_code=eq.${machineCode}&product_id=eq.${QUICKPAIBAN_PRODUCT_ID}&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );
        if (response.ok) {
            const data = await response.json();
            return data.length > 0 ? data[0] : null;
        }
        return null;
    } catch (error) {
        console.error('QuickPaiban 查询失败:', error);
        return null;
    }
}

async function upsertQpActivation(machineCode, licenseType, daysAdded, customerName, phone) {
    try {
        const oldRecord = await getQpActivation(machineCode);
        const beijingTime = formatDateTime(getBeijingTime());

        const data = {
            product_id: QUICKPAIBAN_PRODUCT_ID,
            machine_code: machineCode,
            license_type: licenseType,
            customer_name: customerName || '',
            phone: phone || '',
            activation_count: (oldRecord?.activation_count || 0) + 1,
            updated_at: beijingTime
        };

        let response;
        if (oldRecord) {
            response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE_QP_ACTIVATIONS}?machine_code=eq.${machineCode}&product_id=eq.${QUICKPAIBAN_PRODUCT_ID}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } else {
            data.created_at = beijingTime;
            response = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE_QP_ACTIVATIONS}`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        }

        if (response.ok) {
            await addQpHistory(machineCode, licenseType, daysAdded, customerName, phone);
        }

        return response.ok;
    } catch (error) {
        console.error('QuickPaiban 上传失败:', error);
        return false;
    }
}

async function addQpHistory(machineCode, licenseType, daysAdded, customerName, phone) {
    try {
        const data = {
            product_id: QUICKPAIBAN_PRODUCT_ID,
            machine_code: machineCode,
            license_type: licenseType,
            days_added: daysAdded > 0 ? daysAdded : null,
            customer_name: customerName || '',
            phone: phone || '',
            activation_source: 'MOBILE_WEB',
            remark: ''
        };

        await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE_QP_HISTORY}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    } catch (error) {
        console.error('QuickPaiban 历史记录失败:', error);
    }
}

async function generateLicense() {
    try {
        const programCode = document.getElementById('programSelect').value;
        const machineCode = document.getElementById('machineCode').value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
        let typeCode = document.getElementById('licenseType').value;

        document.getElementById('machineCode').value = machineCode;

        const cleanCode = machineCode.replace(/-/g, '');
        if (cleanCode.length !== 16) {
            alert(`机器码格式不正确！\n\n当前长度：${cleanCode.length} 位\n应该是：16 位\n\n示例：XXXX-XXXX-XXXX-XXXX`);
            return;
        }

        let licenseKey;
        let expiryInfo;

        if (programCode === 'R2V') {
            const customerName = document.getElementById('customerName').value.trim();
            const phone = document.getElementById('phone').value.trim();

            let days = R2V_LICENSE_TYPES[typeCode].days;
            if (typeCode === 'CUSTOM') {
                days = parseInt(document.getElementById('customDays').value, 10) || 0;
                if (days <= 0) {
                    alert('请输入有效的天数！');
                    return;
                }
                typeCode = `D${days}`;
            }

            let expiryDate;
            const today = getBeijingTime();

            if (typeCode === 'PERM' || days === 0) {
                expiryDate = '永久';
                expiryInfo = '永久有效';
            } else {
                const oldRecord = await getActivation(machineCode);
                let baseDate = today;
                if (oldRecord && oldRecord.expiry_date) {
                    const oldExpiry = new Date(oldRecord.expiry_date);
                    if (oldExpiry > today) baseDate = oldExpiry;
                }
                const newExpiry = new Date(baseDate);
                newExpiry.setDate(newExpiry.getDate() + days);
                expiryDate = formatDate(newExpiry);
                expiryInfo = `到期：${expiryDate}`;
            }

            const licenseData = {
                machine_code: machineCode,
                license_type: typeCode,
                expiry_date: expiryDate,
                create_time: formatDateTime(getBeijingTime()),
                customer: customerName
            };

            const signContent = JSON.stringify(licenseData);
            const signature = hmacSign(signContent);
            licenseData.signature = signature;
            licenseData.phone = phone || '';

            const jsonStr = JSON.stringify(licenseData);
            const encryptedData = aesEncrypt(jsonStr);
            licenseKey = `${encryptedData}|${signature}`;

            document.getElementById('resultArea').style.display = 'block';
            document.getElementById('licenseResult').value = licenseKey;

            const typeName = R2V_LICENSE_TYPES[document.getElementById('licenseType').value]?.name || `${days}天`;
            document.getElementById('licenseInfo').innerHTML =
                `<strong>程序：</strong>矢量转换工具 (R2V)<br>` +
                `<strong>机器码：</strong>${machineCode}<br>` +
                `<strong>授权类型：</strong>${typeName}<br>` +
                `<strong>有效期：</strong>${expiryInfo}<br>` +
                `<strong>客户：</strong>${customerName || '未填写'}`;

            document.getElementById('cloudStatus').innerHTML = '☁️ 正在同步到云端...';
            const uploaded = await upsertActivation(machineCode, customerName, typeCode, expiryDate, days, phone);
            document.getElementById('cloudStatus').innerHTML = uploaded
                ? '✅ 已同步到云端'
                : '⚠️ 云端同步失败（激活码仍然有效）';

        } else if (programCode === 'QUICKPAIBAN') {
            const customValue = document.getElementById('customDays').value;
            const result = await generateQuickPaibanCode(machineCode, typeCode, customValue);
            licenseKey = result.licenseKey;

            document.getElementById('resultArea').style.display = 'block';
            document.getElementById('licenseResult').value = licenseKey;
            document.getElementById('licenseInfo').innerHTML =
                `<strong>程序：</strong>快速排版助手 (QuickPaiban)<br>` +
                `<strong>机器码：</strong>${machineCode}<br>` +
                `<strong>类型：</strong>${result.typeName}<br>` +
                `<strong>有效期：</strong>${result.expiryInfo}<br>` +
                `<span style="color: #3498db;">💡 生成格式：QPA1.payload.signature（RSA-SHA256）</span>`;

            document.getElementById('cloudStatus').innerHTML = '☁️ 正在同步到云端...';
            const qpCustomerName = document.getElementById('customerName').value.trim();
            const qpPhone = document.getElementById('phone').value.trim();
            const typeInfo = QUICKPAIBAN_LICENSE_TYPES[typeCode];
            let daysVal = typeInfo ? typeInfo.d : 0;
            if ((typeCode === 'DAYS_CUSTOM' || typeCode === 'MINUTES_CUSTOM') && customValue) {
                daysVal = parseInt(customValue, 10) || 0;
            }
            const uploaded = await upsertQpActivation(machineCode, typeCode, daysVal, qpCustomerName, qpPhone);
            document.getElementById('cloudStatus').innerHTML = uploaded
                ? '✅ 已同步到云端'
                : '⚠️ 云端同步失败（激活码仍然有效）';

        } else {
            const typeInfo = VBA_LICENSE_TYPES[typeCode];
            const salt = generateSalt();
            const rawData = `${cleanCode}|LICENSE|${VBA_SECRET_KEY}|${typeCode}|${salt}`;
            const hash = simpleHash(rawData);
            const licenseCode = hash.substring(0, 12) + salt;
            licenseKey = formatCode(licenseCode);

            if (typeInfo.days === 0) {
                expiryInfo = '永久有效';
            } else if (typeCode.startsWith('S')) {
                expiryInfo = `激活后 ${typeCode.substring(1)} 秒内有效`;
            } else {
                expiryInfo = `激活后 ${typeInfo.days} 天内有效`;
            }

            document.getElementById('resultArea').style.display = 'block';
            document.getElementById('licenseResult').value = licenseKey;
            document.getElementById('licenseInfo').innerHTML =
                `<strong>程序：</strong>宏嫖边工具 (VBA插件)<br>` +
                `<strong>机器码：</strong>${machineCode}<br>` +
                `<strong>类型：</strong>${typeInfo.name}<br>` +
                `<strong>有效期：</strong>${expiryInfo}<br>` +
                `<span style="color: #3498db;">💡 每次点击生成都会产生新的激活码</span>`;
            document.getElementById('cloudStatus').innerHTML = '';
        }
    } catch (err) {
        console.error(err);
        alert(`生成失败：${err.message || err}`);
    }
}

function copyLicense() {
    const textarea = document.getElementById('licenseResult');
    textarea.select();
    textarea.setSelectionRange(0, 99999);

    try {
        navigator.clipboard.writeText(textarea.value).then(() => {
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
    btn.textContent = '✅ 已复制！';
    btn.style.background = '#2ecc71';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '#27ae60';
    }, 1500);
}
