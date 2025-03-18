const mkcert = require('mkcert');
const fs = require('fs');
const path = require('path');

async function createCertificates() {
  try {
    const certPath = path.join(__dirname, 'cert');
    if (!fs.existsSync(certPath)) {
      fs.mkdirSync(certPath);
    }

    console.log('Generating CA...');
    const ca = await mkcert.createCA({
      organization: 'My Local CA',
      countryCode: 'US',
      state: 'California',
      locality: 'San Francisco',
      validityDays: 365,
    });

    console.log('CA Generated:', ca);

    // 写入 CA 证书和密钥
    fs.writeFileSync(path.join(certPath, 'ca-cert.pem'), ca.cert);
    fs.writeFileSync(path.join(certPath, 'ca-key.pem'), ca.key);

    console.log('Generating Server Certificate...');
    const serverCert = await mkcert.createCert({
      domains: ['localhost'],
      validityDays: 365,
      caKey: ca.key,
      caCert: ca.cert,
    });

    console.log('Server Certificate Generated:', serverCert);

    // 写入服务器证书和密钥
    fs.writeFileSync(path.join(certPath, 'server-cert.pem'), serverCert.cert);
    fs.writeFileSync(path.join(certPath, 'server-key.pem'), serverCert.key);

    console.log('Certificates successfully generated in the "cert" directory.');
  } catch (error) {
    console.error('Error generating certificates:', error);
  }
}

createCertificates();
