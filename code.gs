// ==========================================
// KONFIGURASI ID SPREADSHEET
// ==========================================
const SS_USER_ID  = "id_spreatsheet1";  
const SS_STAFF_ID = "id_spreatsheet2"; 

function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'getDashboardSummary') return getDashboardSummary();
  if (action === 'getStaffProfile') return ambilDataStaffPerUser(e.parameter.username);
  if (action === 'getStaff') return ambilDataStaff();
  
  return ContentService.createTextOutput("✅ API Multi-Spreadsheet Aktif!").setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var action = params.action;

    if (action === 'login') {
      var sheetUser = SpreadsheetApp.openById(SS_USER_ID).getSheetByName('DataUser');
      var dataUser = sheetUser.getDataRange().getValues();
      var username = params.username.toString().trim();
      var password = params.password.toString().trim();
      for (var i = 1; i < dataUser.length; i++) {
        if (dataUser[i][0].toString().trim() === username && dataUser[i][1].toString().trim() === password) {
          return buatResponse({ status: 'sukses', role: dataUser[i][2], nama: username });
        }
      }
      return buatResponse({ status: 'gagal', msg: 'Username atau Password salah' });
    }

    if (action === 'addStaff' || action === 'updateStaff' || action === 'deleteStaff') {
      // Hapus cache dashboard setiap kali ada perubahan data
      CacheService.getScriptCache().remove("dashboard_summary");
      
      var ssStaff = SpreadsheetApp.openById(SS_STAFF_ID);
      var sheetStaff = ssStaff.getSheetByName('DataStaff');
      
      if (action === 'addStaff') {
        var headers = sheetStaff.getDataRange().getValues()[0];
        var newRow = headers.map(h => params[h] || "");
        sheetStaff.appendRow(newRow);
        SpreadsheetApp.openById(SS_USER_ID).getSheetByName('DataUser').appendRow([params[headers[0]], params.password_staff, params.role_staff]);
        return buatResponse({ status: 'sukses', msg: 'Staff berhasil ditambah!' });
      }
      // ... Logika Update/Delete Anda tetap sama, pastikan CacheService.remove dipanggil
    }
  } catch (error) { return buatResponse({ status: 'error', msg: error.toString() }); }
}

// --- FUNGSI AGREGASI SERVER-SIDE (MEMBUAT DASHBOARD CEPAT) ---
function getDashboardSummary() {
  var cache = CacheService.getScriptCache();
  var cached = cache.get("dashboard_summary");
  if (cached) return buatResponse(JSON.parse(cached));

  var data = SpreadsheetApp.openById(SS_STAFF_ID).getSheetByName('DataStaff').getDataRange().getValues();
  var headers = data[0].map(h => h.toString().toLowerCase());
  var rows = data.slice(1);

  var idxJK = headers.indexOf('jenis kelamin');
  var idxJab = headers.indexOf('jabatan');
  var idxStat = headers.indexOf('status');
  var idxUmur = headers.indexOf('umur');

  var summary = {
    total: rows.length, male: 0, female: 0,
    jabatan: {}, status: {},
    generasi: { "Gen Z": 0, "Millennials": 0, "Gen X": 0, "Others": 0 },
    timestamp: new Date().getTime()
  };

  rows.forEach(r => {
    if (idxJK > -1) {
      var jk = r[idxJK].toString().toLowerCase();
      if (jk.includes('laki')) summary.male++; else summary.female++;
    }
    if (idxJab > -1 && r[idxJab]) summary.jabatan[r[idxJab]] = (summary.jabatan[r[idxJab]] || 0) + 1;
    if (idxStat > -1 && r[idxStat]) summary.status[r[idxStat]] = (summary.status[r[idxStat]] || 0) + 1;
    if (idxUmur > -1) {
      var age = parseInt(r[idxUmur]);
      if (age <= 28) summary.generasi["Gen Z"]++;
      else if (age <= 44) summary.generasi["Millennials"]++;
      else if (age <= 60) summary.generasi["Gen X"]++;
      else if (!isNaN(age)) summary.generasi["Others"]++;
    }
  });

  var result = { status: 'sukses', summary: summary };
  cache.put("dashboard_summary", JSON.stringify(result), 600); 
  return buatResponse(result);
}

function buatResponse(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }