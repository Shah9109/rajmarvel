const Bill = require('../models/Bill');
const Project = require('../models/Project');
const PDFDocument = require('pdfkit');

// @desc    Generate a bill
// @route   POST /api/bills/generate & POST /api/bills
// @access  Private/Admin
const generateBill = async (req, res) => {
  try {
    const { projectId, items } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const totalAmount = items.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );

    const bill = await Bill.create({ projectId, items, totalAmount });
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: convert number to words (Indian system)
const numToWords = (n) => {
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
                'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (n === 0) return 'Zero';
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
  if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + numToWords(n%100) : '');
  if (n < 100000) return numToWords(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + numToWords(n%1000) : '');
  if (n < 10000000) return numToWords(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + numToWords(n%100000) : '');
  return numToWords(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + numToWords(n%10000000) : '');
};

// @desc    Download professional PDF invoice for a bill
// @route   GET /api/bills/:id/pdf
// @access  Private
const downloadBillPdf = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.billId)
      .populate({ path: 'projectId', populate: { path: 'userId', select: 'name email' } });

    if (!bill) return res.status(404).json({ message: 'Bill not found' });

    const project = bill.projectId;

    // Auth check
    if (
      project.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // ── Colour palette ──────────────────────────────────────────────────
    const C = {
      dark:      '#1A1A2E',
      red:       '#C0392B',
      redLight:  '#E74C3C',
      grayBg:    '#F7F7F7',
      grayLine:  '#E0E0E0',
      textDark:  '#2C2C2C',
      textMid:   '#555555',
      textLight: '#999999',
      white:     '#FFFFFF',
    };

    const L = 50, R = 545, W = R - L;

    const doc = new PDFDocument({ margin: 0, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=RajMarvel-Invoice-${bill._id.toString().slice(-8).toUpperCase()}.pdf`
    );
    doc.pipe(res);

    // ═══════════════════════════════════════════════════════════════════
    // HEADER BAND
    // ═══════════════════════════════════════════════════════════════════
    doc.rect(0, 0, 595, 135).fill(C.dark);

    // Left — company name
    doc.fillColor(C.white).fontSize(28).font('Helvetica-Bold')
       .text('RAJ MARVEL', L, 25, { characterSpacing: 1 });
    doc.fillColor(C.red).fontSize(11).font('Helvetica-Bold')
       .text('EXTERIOR DESIGNS', L, 57, { characterSpacing: 2 });
    doc.fillColor('#AAAAAA').fontSize(8).font('Helvetica')
       .text('Complete Exterior Marble Work – Design Se Installation Tak', L, 75);
    doc.fillColor('#888888').fontSize(7.5)
       .text('+91 98765 43210  |  rajmarvel@gmail.com  |  Gujarat, India', L, 89);

    // Right — INVOICE label + number
    doc.fillColor(C.white).fontSize(32).font('Helvetica-Bold')
       .text('INVOICE', 0, 30, { align: 'right', width: 540 });
    doc.fillColor(C.red).fontSize(10).font('Helvetica-Bold')
       .text(`No.  #${bill._id.toString().slice(-8).toUpperCase()}`, 0, 68, { align: 'right', width: 540 });
    doc.fillColor('#AAAAAA').fontSize(8).font('Helvetica')
       .text(`Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 0, 84, { align: 'right', width: 540 });

    // Red accent strip
    doc.rect(0, 135, 595, 6).fill(C.red);

    // ═══════════════════════════════════════════════════════════════════
    // BILL TO / INVOICE META CARDS
    // ═══════════════════════════════════════════════════════════════════
    let y = 160;
    const halfW = W / 2 - 8;

    // Bill To card
    doc.rect(L, y, halfW, 105).fill(C.grayBg).stroke(C.grayLine);
    doc.rect(L, y, halfW, 20).fill(C.red);
    doc.fillColor(C.white).fontSize(9).font('Helvetica-Bold')
       .text('BILL TO', L + 12, y + 6);
    doc.fillColor(C.textDark).fontSize(11).font('Helvetica-Bold')
       .text(project.personName || project.userId?.name || 'Client', L + 12, y + 28);
    doc.fillColor(C.textMid).fontSize(8.5).font('Helvetica')
       .text(project.address || 'Address not provided', L + 12, y + 44, { width: halfW - 20 });
    doc.text(`Phone: ${project.phone || '—'}`, L + 12, y + 68);
    doc.text(`Email: ${project.userId?.email || '—'}`, L + 12, y + 82);

    // Invoice details card
    const bx = L + halfW + 16;
    doc.rect(bx, y, halfW, 105).fill(C.grayBg).stroke(C.grayLine);
    doc.rect(bx, y, halfW, 20).fill(C.dark);
    doc.fillColor(C.white).fontSize(9).font('Helvetica-Bold')
       .text('PROJECT DETAILS', bx + 12, y + 6);

    const meta = [
      ['Project',     project.title],
      ['Invoice No.', `#${bill._id.toString().slice(-8).toUpperCase()}`],
      ['Invoice Date', new Date(bill.createdAt).toLocaleDateString('en-IN')],
      ['Status',      'PAYMENT DUE'],
    ];
    meta.forEach(([label, val], i) => {
      const ry = y + 28 + i * 18;
      doc.fillColor(C.textLight).fontSize(8).font('Helvetica').text(label + ':', bx + 12, ry);
      doc.fillColor(C.textDark).font('Helvetica-Bold')
         .text(val, bx + 100, ry, { width: halfW - 110 });
    });

    // ═══════════════════════════════════════════════════════════════════
    // ITEMS TABLE
    // ═══════════════════════════════════════════════════════════════════
    y += 120;

    // Column positions
    const COL = { sno: L, desc: L + 25, qty: L + 290, rate: L + 355, amt: L + 440 };

    // Table header
    doc.rect(L, y, W, 26).fill(C.dark);
    doc.fillColor(C.white).fontSize(9).font('Helvetica-Bold');
    doc.text('#',          COL.sno + 4,  y + 9);
    doc.text('DESCRIPTION', COL.desc,    y + 9);
    doc.text('QTY',        COL.qty,      y + 9);
    doc.text('RATE (₹)',   COL.rate,     y + 9);
    doc.text('AMOUNT (₹)', COL.amt,      y + 9);
    y += 26;

    // Rows
    bill.items.forEach((item, idx) => {
      const rowBg = idx % 2 === 0 ? C.white : C.grayBg;
      const rowH  = 24;
      doc.rect(L, y, W, rowH).fill(rowBg).stroke(C.grayLine);

      doc.fillColor(C.textLight).fontSize(8.5).font('Helvetica')
         .text(`${idx + 1}`, COL.sno + 4, y + 7);
      doc.fillColor(C.textDark).fontSize(9).font('Helvetica')
         .text(item.name, COL.desc, y + 7, { width: 255 });
      doc.fillColor(C.textMid).fontSize(9)
         .text(item.quantity.toString(), COL.qty, y + 7);
      doc.text(`${Number(item.price).toLocaleString('en-IN')}`, COL.rate, y + 7);
      doc.fillColor(C.dark).font('Helvetica-Bold')
         .text(`${(item.quantity * item.price).toLocaleString('en-IN')}`, COL.amt, y + 7);
      y += rowH;
    });

    // ═══════════════════════════════════════════════════════════════════
    // TOTALS
    // ═══════════════════════════════════════════════════════════════════
    y += 12;
    const totX = L + W / 2;
    const totW = W / 2;

    const totRows = [
      { label: 'Subtotal',    val: `₹ ${bill.totalAmount.toLocaleString('en-IN')}`, bg: C.grayBg, bold: false },
      { label: 'GST / Tax',   val: '₹ 0',                                           bg: C.grayBg, bold: false },
    ];
    totRows.forEach(({ label, val, bg, bold }) => {
      doc.rect(totX, y, totW, 22).fill(bg).stroke(C.grayLine);
      doc.fillColor(C.textMid).fontSize(9).font(bold ? 'Helvetica-Bold' : 'Helvetica').text(label, totX + 12, y + 7);
      doc.fillColor(C.textDark).font('Helvetica-Bold').text(val, totX, y + 7, { width: totW - 12, align: 'right' });
      y += 22;
    });

    // Grand total
    doc.rect(totX, y, totW, 32).fill(C.red);
    doc.fillColor(C.white).fontSize(10).font('Helvetica-Bold').text('TOTAL AMOUNT', totX + 12, y + 11);
    doc.fillColor(C.white).fontSize(12).font('Helvetica-Bold')
       .text(`₹ ${bill.totalAmount.toLocaleString('en-IN')}`, totX, y + 11, { width: totW - 12, align: 'right' });
    y += 42;

    // Amount in words
    doc.fillColor(C.textLight).fontSize(8).font('Helvetica-Oblique')
       .text(`In Words: ${numToWords(Math.floor(bill.totalAmount))} Rupees Only`, L, y);
    y += 20;

    // ═══════════════════════════════════════════════════════════════════
    // TERMS & PAYMENT INFO
    // ═══════════════════════════════════════════════════════════════════
    y += 10;
    const boxH = 88;

    // Terms box
    doc.rect(L, y, halfW, boxH).fill(C.grayBg).stroke(C.grayLine);
    doc.rect(L, y, halfW, 20).fill(C.dark);
    doc.fillColor(C.white).fontSize(8.5).font('Helvetica-Bold').text('TERMS & CONDITIONS', L + 10, y + 6);
    doc.fillColor(C.textMid).fontSize(8).font('Helvetica')
       .text(
         '1. Payment due within 7 days of invoice.\n' +
         '2. Inspect completed work within 3 days.\n' +
         '3. Report any disputes within 24 hours.\n' +
         '4. Prices include material + labour costs.',
         L + 10, y + 27, { width: halfW - 18 }
       );

    // Bank details box
    doc.rect(bx, y, halfW, boxH).fill(C.grayBg).stroke(C.grayLine);
    doc.rect(bx, y, halfW, 20).fill(C.dark);
    doc.fillColor(C.white).fontSize(8.5).font('Helvetica-Bold').text('PAYMENT DETAILS', bx + 10, y + 6);
    doc.fillColor(C.textMid).fontSize(8).font('Helvetica')
       .text(
         'Bank: State Bank of India\n' +
         'A/C Name: Raj Marvel Exterior Designs\n' +
         'A/C No: XXXX XXXX XXXX 1234\n' +
         'IFSC: SBIN0001234\n' +
         'UPI: rajmarvel@upi',
         bx + 10, y + 27, { width: halfW - 18 }
       );
    y += boxH + 20;

    // ═══════════════════════════════════════════════════════════════════
    // SIGNATURE LINE
    // ═══════════════════════════════════════════════════════════════════
    doc.moveTo(R - 150, y).lineTo(R, y).strokeColor(C.grayLine).lineWidth(1).stroke();
    doc.fillColor(C.textLight).fontSize(8).font('Helvetica').text('Authorised Signatory', R - 150, y + 5);
    doc.fillColor(C.dark).fontSize(9).font('Helvetica-Bold').text('Raj Marvel Exterior Designs', R - 160, y + 18);

    // ═══════════════════════════════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════════════════════════════
    doc.rect(0, 775, 595, 67).fill(C.dark);
    doc.rect(0, 775, 595, 4).fill(C.red);
    doc.fillColor(C.white).fontSize(10).font('Helvetica-Bold')
       .text('Thank you for choosing Raj Marvel Exterior Designs!', 0, 790, { width: 595, align: 'center' });
    doc.fillColor('#AAAAAA').fontSize(7.5).font('Helvetica')
       .text('+91 98765 43210  •  rajmarvel@gmail.com  •  Gujarat, India', 0, 808, { width: 595, align: 'center' });
    doc.fillColor(C.red).fontSize(7).font('Helvetica')
       .text(`Invoice ID: ${bill._id}  |  Generated: ${new Date().toLocaleString('en-IN')}`, 0, 824, { width: 595, align: 'center' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bills for a project
// @route   GET /api/bills/:projectId
// @access  Private
const getProjectBills = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these bills' });
    }

    const bills = await Bill.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateBill, getProjectBills, downloadBillPdf };
