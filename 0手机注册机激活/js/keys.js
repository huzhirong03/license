/**
 * 密钥配置文件
 * ⚠️ 此文件包含私钥，请勿分享！
 */

// ==================== 访问密码 ====================
const ACCESS_PASSWORD = '150904';

// ==================== R2V 配置 ====================
// AES 密钥（与 C# 版本一致）
const LICENSE_FILE_KEY = 'FaGe2024LicenseKey!@#$%^&*()_+';
const LICENSE_FILE_IV = 'FaGeLaser2024IV!';

// RSA 私钥（从 private.key 复制）
const RSA_PRIVATE_KEY_XML = `<RSAKeyValue><Modulus>3dDMo1XJOQzvGNBdR4An3syRxggaHPCYQfn2XUo9uDyaN8lvvpGqLBKZRGX/LgKNmwm/hvLBO5IUIuXywRhJlcE3EW/cnDabfKzsIp+7/Z/p8t08tf+kuYawgtqSjZB3q3rtxEXT2McCGWY8weIwqkpMDWdxWJvvk3pmM0tySJZPbC3TIHN/PEjmdXj3ZznqsjWE0Yae9/y0oBOyjQZl+dhpL2mUqfkiG0xfhTMkWTnEdaOMpDSPSEO/rXK8sHdrgbvbxcPtMm2p0N5Wdto/iuvTP/pMZ2rD9eDPPDGV2L6/2p6y/u0lu4l9L7HnX8EfrafgvdFimVt79EtJeCD0HQ==</Modulus><Exponent>AQAB</Exponent><P>/3QCRnTpTeMGsZsg1vXJEZ8hwZ/4zqSzNB9HYhfJBdXVDfq8wykGjMeULLcf/EECHUt3AqeXSKiiC+AbLt2mdGtgU7Dw2wqw62E33o2DCR5bwCkvE2NIs71UEw5ULiTZ9+p/PiGCzKmZVKlNjIs8DbUucWGtIm/q7bsFeOd8LO8=</P><Q>3kpbU4TmAER7NFePIX3iL0AH3MnuSmOQmqCvV9YKniIblGI5Oirc2xll7CJZKZ4K1m3R+tsKSk6pqAef1nSHDKJuxYks2e7PZfW9M8JkMHejG5iBuSKsVngBgwt3ubApk2wFs/sy0ayjW/uHzEc02z8p17J2lTw9fEjZh+AdB7M=</Q><DP>a9Z7R2b/PkQChWNpX5VuhiPZSjXQANwCUpSJu90ynWYBhN8+ZFyjSTbPVHkR5ZlD3T4IRXSeJqwZjE3U69nh9O+HQI1HgBBpU1Q9E5RFpsnMDbjVCKg2/rmEDm9UFg60fTXe9UmMP/2wns7Bz/zPIzJDItYLEqiQUj9LNhjykL0=</DP><DQ>iBOuun71qZ5CabVcGl2Mc+5XodI/vGwc3nuVO0j9MPaiOYCzlacdkkaG/Tm9qVtlOQT7cPxb3UcwVntsXoTxE0vwUZ56xWKKtdjsHN5YJM9oGwGOD/5oz3ohOs5vWU289dE/4IDbCD4NtsZQyD2i3sBY5gEK1KqO3SFfgO0x+D8=</DQ><InverseQ>mpVEE0l/qlVKUadPQPMYwYs/io0xM8DECdiA08e3INk/8pD+FgOYE+1petzAbJOsE3bxUh/1cRZ7Sq2QcgzdGNxH5a1ksgT8mTilNQs6YO5TK2kH9/4erTIIaC/IfIpzxzF+1uH/RgWBkFtkyTfpgYxUiWH7YFTQs3jtTUX1C1s=</InverseQ><D>CAxtgHe6Z3GKs3HMEK4bxD/UAkWE/QvV2n8Ba30oJCk+x0tt3JJYhGTgXtT8n2TEUp3V70WbsVepl2KUnmENOnvaTa2raZepqKp1nwQAxEErMf7JFymBhqHWgckAjFZzoStCuV53Q2RlNRq6laZpcaRkghAA0uBFnypPzwiryupn/ZCSok5O4Zwe7p/wcFH644eJArWNHJeu76TdeJlU5NDOLBC5qwv6x+b4XX7QNwqtQEhg7SzyLtXxR2lVI/y2nyI2JO8RFy+1iCborCkhTDPU/yYXl8y3wr7Kge8Ck2wVib2NfCfbp9dTjK5YFdSVR8AVlriQfS7fNcQYFx+12Q==</D></RSAKeyValue>`;

// ==================== VBA插件 配置 ====================
// 密钥（与 ActivationModule.bas 中的 SECRET_KEY 一致）
const VBA_SECRET_KEY = 'fage_cdr_plugin_2024_vba_key';

// ==================== Supabase 配置（仅R2V使用）====================
const SUPABASE_URL = 'https://cdvoeabekfuujaehxocl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdm9lYWJla2Z1dWphZWh4b2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM3MDQsImV4cCI6MjA4MTczOTcwNH0.VrT3fJfKKXwwOF_dx1v_vMkNm1bXIEhhL_4iui0RKB8';

// ==================== R2V 授权类型 ====================
const R2V_LICENSE_TYPES = {
    'D1': { name: '1天（测试）', days: 1 },
    'D7': { name: '7天', days: 7 },
    'M30': { name: '1个月', days: 30 },
    'M90': { name: '3个月', days: 90 },
    'Y1': { name: '1年', days: 365 },
    'PERM': { name: '永久', days: 0 },
    'CUSTOM': { name: '自定义天数', days: -1 }
};

// ==================== VBA插件 授权类型 ====================
const VBA_LICENSE_TYPES = {
    'PERM': { name: '永久', days: 0 },
    'Y365': { name: '1年（365天）', days: 365 },
    'M030': { name: '1个月（30天）', days: 30 },
    'D001': { name: '1天', days: 1 },
    'S010': { name: '10秒（测试用）', days: 0.0001 }
};
