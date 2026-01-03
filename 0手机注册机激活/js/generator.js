/**
 * 激活码生成器 - JavaScript 版本 v3.0
 * 
 * 支持程序：
 * 1. R2V 矢量转换工具（AES加密 + SHA256签名）
 * 2. VBA 宏嫖边工具（SimpleHash）
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
        updateLicenseTypeOptions(); // 初始化选项
    } else {
        errorElement.textContent = '密码错误，请重试';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 回车键登录
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // 检查是否已登录
    if (sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainScreen').style.display = 'block';
        updateLicenseTypeOptions();
    }
});

// ==================== 程序切换处理 ====================

function updateLicenseTypeOptions() {
    try {
        const programSelect = document.getElementById('programSelect');
        const licenseTypeSelect = document.getElementById('licenseType');
        const customerGroup = document.getElementById('customerGroup');
        const phoneGroup = document.getElementById('phoneGroup');
        
        if (!programSelect || !licenseTypeSelect) {
            console.error('找不到必要的DOM元素');
            return;
        }
        
        const programCode = programSelect.value;
        
        // 清空现有选项
        licenseTypeSelect.innerHTML = '';
        
        // 根据程序类型加载对应的激活类型
        let types;
        if (programCode === 'R2V') {
            types = typeof R2V_LICENSE_TYPES !== 'undefined' ? R2V_LICENSE_TYPES : {};
            if (customerGroup) customerGroup.style.display = 'block';
            if (phoneGroup) phoneGroup.style.display = 'block';
        } else {
            types = typeof VBA_LICENSE_TYPES !== 'undefined' ? VBA_LICENSE_TYPES : {};
            if (customerGroup) customerGroup.style.display = 'none';
            if (phoneGroup) phoneGroup.style.display = 'none';
        }
        
        // 检查types是否为空
        if (Object.keys(types).length === 0) {
            console.error('授权类型配置为空，请检查 keys.js');
            return;
        }
        
        for (const [code, info] of Object.entries(types)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = info.name;
            if (code === 'M30') {
                option.selected = true;
            }
            licenseTypeSelect.appendChild(option);
        }
        
        toggleCustomDays();
    } catch (error) {
        console.error('updateLicenseTypeOptions 错误:', error);
    }
}

function toggleCustomDays() {
    const programCode = document.getElementById('programSelect').value;
    const licenseType = document.getElementById('licenseType').value;
    const customDaysInput = document.getElementById('customDays');
    
    // 只有 R2V 才有自定义天数选项
    if (programCode === 'R2V' && licenseType === 'CUSTOM') {
        customDaysInput.style.display = 'inline-block';
    } else {
        customDaysInput.style.display = 'none';
    }
}

// ==================== VBA插件 SimpleHash 算法 ====================

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

// ==================== 工具函数 ====================

function generateSalt() {
    return Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
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

// ==================== R2V AES 加密 ====================

function aesEncrypt(plainText) {
    const keyHash = CryptoJS.SHA256(LICENSE_FILE_KEY);
    const key = CryptoJS.lib.WordArray.create(keyHash.words.slice(0, 8));
    const iv = CryptoJS.enc.Utf8.parse(LICENSE_FILE_IV.substring(0, 16));
    
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    
    return encrypted.toString();
}

// ==================== R2V HMAC 签名 ====================

function hmacSign(data) {
    // 使用 HMAC-SHA256 签名
    const hash = CryptoJS.HmacSHA256(data, LICENSE_FILE_KEY);
    return CryptoJS.enc.Base64.stringify(hash);
}

// ==================== Supabase API（仅R2V）====================

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
    const programCode = document.getElementById('programSelect').value;
    const machineCode = document.getElementById('machineCode').value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    let typeCode = document.getElementById('licenseType').value;

    // 更新输入框显示
    document.getElementById('machineCode').value = machineCode;

    // 验证机器码格式
    const cleanCode = machineCode.replace(/-/g, '');
    if (cleanCode.length !== 16) {
        alert(`机器码格式不正确！\n\n当前长度：${cleanCode.length} 位\n应该是：16 位\n\n格式示例：XXXX-XXXX-XXXX-XXXX`);
        return;
    }

    let licenseKey;
    let expiryInfo;
    const salt = generateSalt();

    if (programCode === 'R2V') {
        // ==================== R2V 激活码生成 ====================
        const customerName = document.getElementById('customerName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        
        // 计算天数
        let days = R2V_LICENSE_TYPES[typeCode].days;
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
            expiryInfo = '永久有效';
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
            expiryInfo = `到期：${expiryDate}`;
        }
        
        // 构建证书数据（字段名必须与 C# LicenseFileData 一致！）
        const licenseData = {
            machine_code: machineCode,
            license_type: typeCode,      // C# 用 license_type
            expiry_date: expiryDate,     // C# 用 expiry_date
            create_time: formatDateTime(getBeijingTime()),  // C# 用 create_time
            customer: customerName
        };
        
        // 签名内容（不包含 signature 字段）
        const signContent = JSON.stringify(licenseData);
        
        // HMAC 签名
        const signature = hmacSign(signContent);
        
        // 添加签名到数据
        licenseData.signature = signature;
        
        // AES 加密
        const jsonStr = JSON.stringify(licenseData);
        const encryptedData = aesEncrypt(jsonStr);
        
        // 生成激活码（两行合并用|分隔）
        licenseKey = `${encryptedData}|${signature}`;
        
        // 显示结果
        document.getElementById('resultArea').style.display = 'block';
        document.getElementById('licenseResult').value = licenseKey;
        
        const typeName = R2V_LICENSE_TYPES[document.getElementById('licenseType').value]?.name || `${days}天`;
        document.getElementById('licenseInfo').innerHTML = 
            `<strong>程序：</strong>矢量转换工具 (R2V)<br>` +
            `<strong>机器码：</strong>${machineCode}<br>` +
            `<strong>授权类型：</strong>${typeName}<br>` +
            `<strong>有效期：</strong>${expiryInfo}<br>` +
            `<strong>客户：</strong>${customerName || '未填写'}`;
        
        // 上传到云端
        document.getElementById('cloudStatus').innerHTML = '☁️ 正在同步到云端...';
        const uploaded = await upsertActivation(machineCode, customerName, typeCode, expiryDate, days, phone);
        document.getElementById('cloudStatus').innerHTML = uploaded 
            ? '✅ 已同步到云端' 
            : '⚠️ 云端同步失败（激活码仍然有效）';
        
    } else {
        // ==================== VBA插件激活码生成 ====================
        const types = VBA_LICENSE_TYPES;
        const typeInfo = types[typeCode];
        
        // 组合数据（包含激活类型和盐值）
        const rawData = `${cleanCode}|LICENSE|${VBA_SECRET_KEY}|${typeCode}|${salt}`;
        
        // 生成哈希
        const hash = simpleHash(rawData);
        
        // 激活码 = Hash前12位 + 盐值4位
        const licenseCode = hash.substring(0, 12) + salt;
        licenseKey = formatCode(licenseCode);
        
        // 有效期说明
        if (typeInfo.days === 0) {
            expiryInfo = '永久有效';
        } else if (typeCode.startsWith('S')) {
            expiryInfo = `激活后 ${typeCode.substring(1)} 秒内有效`;
        } else {
            expiryInfo = `激活后 ${typeInfo.days} 天内有效`;
        }
        
        // 显示结果
        document.getElementById('resultArea').style.display = 'block';
        document.getElementById('licenseResult').value = licenseKey;
        document.getElementById('licenseInfo').innerHTML = 
            `<strong>程序：</strong>宏嫖边工具 (VBA插件)<br>` +
            `<strong>机器码：</strong>${machineCode}<br>` +
            `<strong>类型：</strong>${typeInfo.name}<br>` +
            `<strong>有效期：</strong>${expiryInfo}<br>` +
            `<span style="color: #3498db;">💡 每次点击生成都会产生新的激活码</span>`;
        
        // VBA插件不需要云端同步
        document.getElementById('cloudStatus').innerHTML = '';
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
