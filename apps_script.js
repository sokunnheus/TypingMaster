// ============================================================
// TYPING MASTER KH - Google Apps Script
// ចម្លង code នេះទៅ Apps Script Editor
// ============================================================
const SHEET_NAME = 'Students';

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1,1,1,9).setValues([['Time','Name','Class','WPM','Accuracy(%)','Errors','Lesson','Lang','Session']]);
    sheet.getRange(1,1,1,9).setBackground('#1a73e8').setFontColor('#fff').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1,160);sheet.setColumnWidth(2,140);sheet.setColumnWidth(3,100);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    sheet.appendRow([
      new Date().toLocaleString('en-GB',{timeZone:'Asia/Phnom_Penh'}),
      data.name||'', data.cls||'', data.wpm||0,
      data.acc||0, data.errors||0, data.lesson||'', data.lang||'en', data.session||''
    ]);
    return ContentService.createTextOutput(JSON.stringify({status:'ok'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status:'error',msg:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = getSheet();
    const rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
    const headers = ['time','name','cls','wpm','acc','errors','lesson','lang','session'];
    const all = rows.slice(1).map(r => {
      const obj={};headers.forEach((h,i)=>obj[h]=r[i]);return obj;
    });
    // Best WPM per student
    const best={};
    all.forEach(d=>{
      const k=d.name+'|'+d.cls;
      if(!best[k]||Number(d.wpm)>Number(best[k].wpm)) best[k]=d;
    });
    return ContentService.createTextOutput(JSON.stringify(Object.values(best)))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({error:err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
