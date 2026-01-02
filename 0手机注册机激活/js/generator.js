/**
 * R2V 证书生成器 - JavaScript 版本 v3.0
 * 
 * 功能：
 * 1. 生成 RSA 签名的激活码
 * 2. 支持时间叠加
 * 3. 云端同步到 Supabase
 * 
 * 注意：此代码仅供管理员使用，请勿分享！
 */

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
};

// ==================== UI 控制 ====================

function toggleCustomDays() {
    const licenseType = document.getElementById('licenseType').value;
    const customDaysInput = document.getElementById('customDays');
    customDaysInput.style.display = licenseType === 'CUSTOM' ? 'inline-block' : 'none';
}

// ==================== RSA 签名 ====================

/**
 * 解析 XML 格式的 RSA 私钥并进行签名
 */
function rsaSignWithXmlKey(data, xmlKey) {
    try {
        // 解析 XML 密钥
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlKey, 'text/xml');
        
        const getElement = (name) => {
            const el = xmlDoc.getElementsByTagName(name)[0];
            return el ? el.textContent : '';
        };
        
        // 获取密钥组件（Base64编码）
        const n = getElement('Modulus');
        const e = getElement('Exponent');
        const d = getElement('D');
        const p = getElement('P');
        const q = getElement('Q');
        const dp = getElement('DP');
        const dq = getElement('DQ');
        const qi = getElement('InverseQ');
        
        if (!n || !d) {
            throw new Error('密钥格式错误，请检查 keys.js 中的 RSA_PRIVATE_KEY_XML');
        }
        
        // 使用 jsrsasign 库创建 RSA 密钥
        const key = KEYUTIL.getKey({
            n: b64tohex(n),
            e: b64tohex(e),
            d: b64tohex(d),
            p: b64tohex(p),
            q: b64tohex(q),
            dp: b64tohex(dp),
            dq: b64tohex(dq),
            qi: b64tohex(qi)
        });
        
        // 创建签名对象
        const sig = new KJUR.crypto.Signature({alg: 'SHA256withRSA'});
        sig.init(key);
        sig.updateString(data);
        const signature = sig.sign();
        
        // 返回 Base64 编码的签名
        return hextob64(signature);
    } catch (error) {
        console.error('RSA 签名失败:', error);
        throw error;
    }
}

// ==================== AES 加密 ====================

/**
 * AES-256-CBC 加密（与 C# 版本一致）
 */
function aesEncrypt(plainText) {
    // 使用 SHA256 生成 32 字节密钥
    const keyHash = CryptoJS.SHA256(LICENSE_FILE_KEY);
    const key = CryptoJS.lib.WordArray.create(keyHash.words.slice(0, 8)); // 256 bits
    
    // IV 使用 UTF8 编码，取前 16 字节
    const iv = CryptoJS.enc.Utf8.parse(LICENSE_FILE_IV.substring(0, 16));
    
    // 加密
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString(); // Base64 编码
}

// ==================== 日期处理 ====================

/**
 * 获取北京时间
 */
function getBeijingTime() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (8 * 3600000)); // UTC+8
}

/**
 * 格式化日期为 yyyy-MM-dd
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * 格式化日期时间为 yyyy-MM-dd HH:mm:ss
 */
function formatDateTime(date) {
    return `${formatDate(date)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
}

// ==================== Supabase API ====================

/**
 * 查询激活记录
 */
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

/**
 * 上传或更新激活记录
 */
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
            // 更新
            response = await fetch(
                `${SUPABASE_URL}/rest/v1/activations_r2v?machine_code=eq.${machineCode}`,
                {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );
        } else {
            // 插入
            response = await fetch(
                `${SUPABASE_URL}/rest/v1/activations_r2v`,
                {
                    method: 'POST',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }
            );
        }
        
        // 记录历史
        if (response.ok) {
            await addHistory(machineCode, customerName, licenseType, daysAdded, 
                oldRecord?.expiry_date, expiryDate, phone);
        }
        
        return response.ok;
    } catch (error) {
        console.error('上传失败:', error);
        return false;
    }
}

/**
 * 添加历史记录
 */
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
        
        await fetch(
            `${SUPABASE_URL}/rest/v1/activation_history_r2v`,
            {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }
        );
    } catch (error) {
        console.error('历史记录失败:', error);
    }
}

// ==================== 激活码生成 ====================

async function generateLicense() {
    try {
        // 获取输入
        const machineCode = document.getElementById('machineCode').value.trim().toUpperCase();
        const customerName = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        let typeCode = document.getElementById('licenseType').value;
        
        // 验证机器码
        const cleanCode = machineCode.replace(/-/g, '');
        if (cleanCode.length !== 16) {
            alert(`机器码格式不正确！\n\n当前长度：${cleanCode.length} 位\n应该是：16 位\n\n格式示例：XXXX-XXXX-XXXX-XXXX`);
            return;
        }
        
        // 计算天数
        let days = LICENSE_TYPES[typeCode].days;
        if (typeCode === 'CUSTOM') {
            days = parseInt(document.getElementById('customDays').value) || 0;
            if (days <= 0) {
                alert('请输入有效的天数！');
                return;
            }
            typeCode = `D${days}`;
        }
        
        // 计算过期日期
        let expiryDate;
        const today = getBeijingTime();
        
        if (typeCode === 'PERM' || days === 0) {
            expiryDate = '永久';
        } else {
            // 查询旧记录，计算叠加时间
            const oldRecord = await getActivation(machineCode);
            let baseDate = today;
            
            if (oldRecord && oldRecord.expiry_date) {
                const oldExpiry = new Date(oldRecord.expiry_date);
                if (oldExpiry > today) {
                    baseDate = oldExpiry;
                }
            }
            
            const newExpiry = new Date(baseDate);
            newExpiry.setDate(newExpiry.getDate() + days);
            expiryDate = formatDate(newExpiry);
        }
        
        // 构建证书数据
        const licenseData = {
            machine_code: machineCode,
            type: typeCode,
            expiry: expiryDate,
            customer: customerName,
            created: formatDateTime(getBeijingTime())
        };
        
        // 生成签名内容（与 C# 版本一致）
        const signContent = JSON.stringify({
            machine_code: licenseData.machine_code,
            type: licenseData.type,
            expiry: licenseData.expiry,
            customer: licenseData.customer,
            created: licenseData.created
        });
        
        // RSA 签名
        let signature;
        try {
            signature = rsaSignWithXmlKey(signContent, RSA_PRIVATE_KEY_XML);
        } catch (error) {
            alert('RSA 签名失败！请检查 keys.js 中的密钥是否正确配置。\n\n错误：' + error.message);
            return;
        }
        
        // 添加签名到数据
        licenseData.signature = signature;
        
        // AES 加密
        const jsonStr = JSON.stringify(licenseData);
        const encryptedData = aesEncrypt(jsonStr);
        
        // 生成激活码（两行合并用|分隔）
        const activationCode = `${encryptedData}|${signature}`;
        
        // 显示结果
        document.getElementById('resultArea').style.display = 'block';
        document.getElementById('licenseResult').value = activationCode;
        
        // 显示信息
        const typeName = LICENSE_TYPES[document.getElementById('licenseType').value]?.name || `${days}天`;
        document.getElementById('licenseInfo').innerHTML = 
            `<strong>机器码：</strong>${machineCode}<br>` +
            `<strong>授权类型：</strong>${typeName}<br>` +
            `<strong>到期时间：</strong>${expiryDate}<br>` +
            `<strong>客户：</strong>${customerName || '未填写'}<br>` +
            `<strong>手机：</strong>${phone || '未填写'}`;
        
        // 上传到云端
        document.getElementById('cloudStatus').innerHTML = '☁️ 正在同步到云端...';
        const uploaded = await upsertActivation(machineCode, customerName, typeCode, expiryDate, days, phone);
        document.getElementById('cloudStatus').innerHTML = uploaded 
            ? '✅ 已同步到云端' 
            : '⚠️ 云端同步失败（激活码仍然有效）';
        
    } catch (error) {
        alert('生成失败：' + error.message);
        console.error(error);
    }
}

// ==================== 复制功能 ====================

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
