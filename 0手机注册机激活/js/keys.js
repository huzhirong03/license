/**
 * 密钥配置文件
 * ⚠️ 此文件包含私钥，请勿分享！
 */

// ==================== 访问密码 ====================
const ACCESS_PASSWORD = '150904';

// ==================== R2V 配置 ====================
// AES 密钥（与 C# 版本一致）
const LICENSE_FILE_KEY = 'fage_r2v_license_2024_aes256';
const LICENSE_FILE_IV = 'fage_iv_16bytes!';

// RSA 私钥（从 private.key 复制）
const RSA_PRIVATE_KEY_XML = `<RSAKeyValue><Modulus>3dDMo1XJOQzvGNBdR4An3syRxggaHPCYQfn2XUo9uDyaN8lvvpGqLBKZRGX/LgKNmwm/hvLBO5IUIuXywRhJlcE3EW/cnDabfKzsIp+7/Z/p8t08tf+kuYawgtqSjZB3q3rtxEXT2McCGWY8weIwqkpMDWdxWJvvk3pmM0tySJZPbC3TIHN/PEjmdXj3ZznqsjWE0Yae9/y0oBOyjQZl+dhpL2mUqfkiG0xfhTMkWTnEdaOMpDSPSEO/rXK8sHdrgbvbxcPtMm2p0N5Wdto/iuvTP/pMZ2rD9eDPPDGV2L6/2p6y/u0lu4l9L7HnX8EfrafgvdFimVt79EtJeCD0HQ==</Modulus><Exponent>AQAB</Exponent><P>/3QCRnTpTeMGsZsg1vXJEZ8hwZ/4zqSzNB9HYhfJBdXVDfq8wykGjMeULLcf/EECHUt3AqeXSKiiC+AbLt2mdGtgU7Dw2wqw62E33o2DCR5bwCkvE2NIs71UEw5ULiTZ9+p/PiGCzKmZVKlNjIs8DbUucWGtIm/q7bsFeOd8LO8=</P><Q>3kpbU4TmAER7NFePIX3iL0AH3MnuSmOQmqCvV9YKniIblGI5Oirc2xll7CJZKZ4K1m3R+tsKSk6pqAef1nSHDKJuxYks2e7PZfW9M8JkMHejG5iBuSKsVngBgwt3ubApk2wFs/sy0ayjW/uHzEc02z8p17J2lTw9fEjZh+AdB7M=</Q><DP>a9Z7R2b/PkQChWNpX5VuhiPZSjXQANwCUpSJu90ynWYBhN8+ZFyjSTbPVHkR5ZlD3T4IRXSeJqwZjE3U69nh9O+HQI1HgBBpU1Q9E5RFpsnMDbjVCKg2/rmEDm9UFg60fTXe9UmMP/2wns7Bz/zPIzJDItYLEqiQUj9LNhjykL0=</DP><DQ>iBOuun71qZ5CabVcGl2Mc+5XodI/vGwc3nuVO0j9MPaiOYCzlacdkkaG/Tm9qVtlOQT7cPxb3UcwVntsXoTxE0vwUZ56xWKKtdjsHN5YJM9oGwGOD/5oz3ohOs5vWU289dE/4IDbCD4NtsZQyD2i3sBY5gEK1KqO3SFfgO0x+D8=</DQ><InverseQ>mpVEE0l/qlVKUadPQPMYwYs/io0xM8DECdiA08e3INk/8pD+FgOYE+1petzAbJOsE3bxUh/1cRZ7Sq2QcgzdGNxH5a1ksgT8mTilNQs6YO5TK2kH9/4erTIIaC/IfIpzxzF+1uH/RgWBkFtkyTfpgYxUiWH7YFTQs3jtTUX1C1s=</InverseQ><D>CAxtgHe6Z3GKs3HMEK4bxD/UAkWE/QvV2n8Ba30oJCk+x0tt3JJYhGTgXtT8n2TEUp3V70WbsVepl2KUnmENOnvaTa2raZepqKp1nwQAxEErMf7JFymBhqHWgckAjFZzoStCuV53Q2RlNRq6laZpcaRkghAA0uBFnypPzwiryupn/ZCSok5O4Zwe7p/wcFH644eJArWNHJeu76TdeJlU5NDOLBC5qwv6x+b4XX7QNwqtQEhg7SzyLtXxR2lVI/y2nyI2JO8RFy+1iCborCkhTDPU/yYXl8y3wr7Kge8Ck2wVib2NfCfbp9dTjK5YFdSVR8AVlriQfS7fNcQYFx+12Q==</D></RSAKeyValue>`;

// ==================== VBA插件 配置 ====================
// 密钥（与 ActivationModule.bas 中的 SECRET_KEY 一致）
const VBA_SECRET_KEY = 'fage_cdr_plugin_2024_vba_key';

// ==================== QuickPaiban 閰嶇疆（QPA1-RSA） ====================
const QUICKPAIBAN_PRODUCT_ID = 'CDRPAIBAN_QUICKPAIBAN_2026';
const QUICKPAIBAN_ISSUER = 'QuickPaiban-Release';
const QUICKPAIBAN_PRIVATE_KEY_XML = `<RSAKeyValue><Modulus>1gyrtAURadOGv25fxbkmrdZCZ8J0ACKUK8KxHBgxldWirTQlEwwKH20Hk1pQXYFototBxKNCJxEsvOBiDDqCOf24SMXP9peQoUWdjOb0e9w3OpQoZgyyyZLv5zr94vc2uq+SNupcmuCLh/6be66ipb3h3vEKJEPz+ZT+ameZOYyXHGhE6zhwGojt4yPoT6zLsHaKFAM39ay10gn9r5qBZnQU8ka6B1GcCnTlrcd0Xb1qIK7q+Vc35xLXZaOw0dF96iqYhSyWntcT3kzo3DNifjpKrJG0EQPLzmXu0JSooAjmzFB5fZs4Z6LckcfYMefW+58quRZUASC2e+y4siWuXQ==</Modulus><Exponent>AQAB</Exponent><P>9HFe/YiTlk2via2IT4YbZQUJ9t9rjxzezP4ToQuOCs14hvG2KQKg0fkc+1QPq93xiPeFNzp4Dvwjfg1OMCvPvURZVO6LYhLRZgrMqILpKSHbYzJxs8mjUXEPV36QuzIuwWWgZgPrjprA9bcKedOKIvOUFyyVTBFOfWsGd1TAsMs=</P><Q>4CtuiK3HUHUDY+Icj68KuuXEwSXZlE7XrDVHa1OBVT7PR5kF4g4UCSK4yphYWxq8BJARitZJuXGDT9vxK6K8och5lzFKP0vdVK3IIiCo/ZYy2+hxslPecN9fzQupp/8Hjcc74e3ZYeu0ksQQ+ObjmkahLNMtzJnfm7fb8tzKgHc=</Q><DP>2i1iqoq/qFUYi5tO4iQByY3Q0f+ioi8TkgZpgMGue2ff3xpZC4uj/SYLPyxNfIpxrl23Eo9mX4GfMEAx/H7uQbGCxnLQB65iJmEXQITwFV150rVQlTcxRVzTY7W8+siUwNuzabqwAi2QcwB4Ijq0vfOIx5Jsg2OjGgBv2gzUnDc=</DP><DQ>uBIxwz2e6mwLCpuChGFhWDKPq2IfFW7gHeHp8TEyhAL9RXdbo1GYFiBSyNjrxHNhbAW4wd5Pz1xsTMj3cbNBXT82yHWK2Aq9hWjla1CSMxiATp7BrYK8psZk7gPjnbUGSN8ORuh9lbBsKA+jOB6vSeExO5N0igrX2A/TJcsy5OU=</DQ><InverseQ>m1u1HRDiC4d6iNtyBGTG/v+aJmk/x/WNa05MNfRCeRFoQBh//KY60cDgYV3WqUj4yeTOlkD9jty3iE6+rEEHcZkilBENFyzk8FJ86dPLqsMXT0ia9KYdhylZTD6pndBanh4mSLNl8fluD/sdbXrSUPwO2XOsbTm7FosUgCGwD5k=</InverseQ><D>S/MXAbtCoIAzsb0iMnAt70S1L0fqDRo35Qch/MwA3B9/p2F3PjjpZpkzNO+40FTYqNzkqzcag+4uJ56ea6RfDOCgAQJfdin1YaPn8VUJruFGn3xukTc0QR3oDe36pAv/2WHuyZmC3lmKaOjIlqwyfgjQGmEArjmGWiqp02uLDMXVmZ14yYhJ8Wa3mujafBUI4gtYF28Orp02iT+d1GxpmytWl+q3hj28n27Kv7xyfoeQSKov6ccMVNMm0oJvP8fI2dUAEL04LFmkuCOKZaGgKgL63+gvNJYRdCabQzdIp7gFoMiDxBB2VMnWqmzlW+1xMhW3jk6gITEC79MeY7dtaQ==</D></RSAKeyValue>`;
const QUICKPAIBAN_LICENSE_TYPES = {
    'PERM': { name: '永久', lt: 'PERM', d: 0 },
    'D001': { name: '1天', lt: 'D001', d: 1 },
    'M030': { name: '30天', lt: 'M030', d: 30 },
    'Y365': { name: '365天', lt: 'Y365', d: 365 },
    'DAYS_CUSTOM': { name: '自定义天数', lt: 'DAYS', d: -1 },
    'MINUTES_CUSTOM': { name: '自定义分钟(测试)', lt: 'MINUTES', d: -1 },
    'M001': { name: '1分钟(测试)', lt: 'M001', d: 1 }
};

// ==================== Supabase 配置（R2V + QuickPaiban）====================
const SUPABASE_URL = 'https://cdvoeabekfuujaehxocl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkdm9lYWJla2Z1dWphZWh4b2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM3MDQsImV4cCI6MjA4MTczOTcwNH0.VrT3fJfKKXwwOF_dx1v_vMkNm1bXIEhhL_4iui0RKB8';
const SUPABASE_TABLE_QP_ACTIVATIONS = 'activations_quickpaiban';
const SUPABASE_TABLE_QP_HISTORY = 'activation_history_quickpaiban';

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
