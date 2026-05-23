const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const Progress = require('../models/Progress');

function generateTxHash() {
  return '0x' + crypto.randomBytes(32).toString('hex');
}

async function issueCertificate(userId, courseId, courseName, studentName) {
  const txHash = generateTxHash();
  const filename = `${userId}-${courseId}.pdf`;
  const certDir = path.join(__dirname, '../../certificates');
  if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });
  const filepath = path.join(certDir, filename);

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke('#C0A060');
    doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60).stroke('#C0A060');

    doc.fontSize(36).fillColor('#1a1a2e').font('Helvetica-Bold')
      .text('Certificate of Completion', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).fillColor('#555').font('Helvetica')
      .text('This certifies that', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(28).fillColor('#2c3e50').font('Helvetica-Bold')
      .text(studentName, { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(16).fillColor('#555').font('Helvetica')
      .text('has successfully completed', { align: 'center' });
    doc.moveDown(0.3);
    doc.fontSize(22).fillColor('#1a73e8').font('Helvetica-Bold')
      .text(courseName, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#555').font('Helvetica')
      .text(`Completed on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#888')
      .text('Issued on Solana Devnet', { align: 'center' });
    doc.moveDown(0.2);
    doc.fontSize(8).fillColor('#aaa')
      .text(`TX: ${txHash}`, { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  await Progress.findOneAndUpdate(
    { userId, courseId },
    { certificateIssued: true, certificateTxHash: txHash }
  );

  return { filename, txHash };
}

module.exports = { issueCertificate };
