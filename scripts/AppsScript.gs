/************** CONFIG **************/
let SHEET_ID = 'https://docs.google.com/spreadsheets/d/1F8kWXs7HjH6_bBBJG84cApHVUko7fFQcT2_S9QU6ork/edit';
let FOLDER_ID = 'https://drive.google.com/drive/folders/1GzuGSV3HhT8MjcejfnOcXMem9y4se4Xh';

/************** HELPERS **************/
function extractId(maybeUrl) {
  if (!maybeUrl) return '';
  const sheetMatch = maybeUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (sheetMatch) return sheetMatch[1];
  const folderMatch = maybeUrl.match(/folders\/([a-zA-Z0-9-_]+)/);
  if (folderMatch) return folderMatch[1];
  return maybeUrl;
}

SHEET_ID = extractId(SHEET_ID);
FOLDER_ID = extractId(FOLDER_ID);

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function parseUrlEncoded(raw) {
  const obj = {};
  if (!raw) return obj;
  raw.split('&').forEach(p => {
    const i = p.indexOf('=');
    if (i > -1) {
      const k = decodeURIComponent(p.slice(0, i).replace(/\+/g, ' '));
      const v = decodeURIComponent(p.slice(i + 1).replace(/\+/g, ' '));
      obj[k] = v;
    }
  });
  return obj;
}

function saveDataUrlToDrive(dataUrl, filename) {
  const match = String(dataUrl).match(/^data:(.+);base64,(.+)$/);
  if (!match) return '';
  const blob = Utilities.newBlob(
    Utilities.base64Decode(match[2]),
    match[1],
    filename
  );
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

/************** WEB APP **************/
function doPost(e) {
  try {
    let action = 'order';
    let data = {};
    const raw = e.postData?.contents || '';

    if (e.postData?.type?.includes('application/json')) {
      const body = JSON.parse(raw || '{}');
      action = body.action || action;
      data = body.data || body;
    } else if (e.parameter?.data) {
      action = e.parameter.action || action;
      data = JSON.parse(e.parameter.data || '{}');
    } else if (raw.includes('=')) {
      const parsed = parseUrlEncoded(raw);
      action = parsed.action || action;
      data = parsed.data ? JSON.parse(parsed.data) : {};
    }

    if (action === 'draft') {
      return jsonResponse({ success: true });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    let screenshotUrl = '';
    if (data.screenshot?.startsWith('data:')) {
      screenshotUrl = saveDataUrlToDrive(
        data.screenshot,
        'payment_' + Date.now() + '.jpg'
      );
    }

    sheet.appendRow([
      new Date(),
      data.customerName || '',
      data.phone || '',
      data.gender || '',
      data.address || '',
      data.productName || '',
      data.amount || '',
      data.upiId || '',
      data.transactionId || '',
      screenshotUrl,
      'Pending Verification'
    ]);

    return jsonResponse({ success: true });

  } catch (err) {
    return jsonResponse({ success: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({ status: 'API running ✅' });
}
