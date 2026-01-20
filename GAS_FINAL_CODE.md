
# Google Apps Script Code (FINAL VERSION)

Please **COPY** the entire code below and **PASTE** it into your Google Apps Script project (replacing all existing code).
After pasting, click **Deploy** -> **New Deployment** -> Select type **Web app** -> Configuration: **Diff** (New Version) -> **Deploy**.

**Ensure permissions are set to: "Anyone"**

```javascript
/* --------------------------------------------------------------------------------
   SHANTHOSH MOBILES HUB - BACKEND SCRIPT (PRODUCTS, OFFERS, ORDERS)
   -------------------------------------------------------------------------------- */

var SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
var SHEET_NAME_PRODUCTS = "Products";
var SHEET_NAME_OFFERS = "Post Offers";
var SHEET_NAME_ORDERS = "Orders";

// FOLDER ID for saving images (Optional: Set this if you want a specific folder)
// Otherwise loops to find or create "Product Images"
var UPLOAD_FOLDER_NAME = "Product Images"; 

function doGet(e) {
  var params = e.parameter;
  var action = params.action;

  if (action == "getProducts") {
    return getProducts();
  } else if (action == "getOffers") {
    return getOffers();
  } else if (action == "getOrders") {
    return getOrders();
  }

  return ContentService.createTextOutput("Invalid Action: " + action);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action == "addProduct") {
      return addProduct(data);
    } else if (action == "deleteProduct") {
      return deleteProduct(data.id);
    } else if (action == "addOffer") {
      return addOffer(data);
    } else if (action == "deleteOffer") {
      return deleteOffer(data.id);
    } else if (action == "updateOrder") {
      return updateOrder(data);
    }
    
    return responseJSON({ success: false, message: "Unknown action" });

  } catch (error) {
    return responseJSON({ success: false, error: error.toString() });
  }
}

/* -------------------- GET FUNCTIONS -------------------- */

function getProducts() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME_PRODUCTS);
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return responseJSON({ data: [] });

  var headers = data.shift(); // Remove header
  // Map rows to Objects
  var products = data.map(function(row) {
    return {
      id: row[0],
      title: row[1],
      brand: row[2],
      category: row[3],
      price: row[4],
      image: row[5],
      date: row[6],
      description: row[7]
    };
  }).filter(function(p) { return p.id != ""; }); // Filter empty rows

  return responseJSON({ data: products });
}

function getOffers() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME_OFFERS);
  if (!sheet) return responseJSON({ data: [], message: "Sheet not found" });

  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return responseJSON({ data: [] });

  var headers = data.shift(); // Remove header
  
  // Mapping based on Screenshot: Col A=ID, B=Name, C=Date, D=URL
  var offers = data.map(function(row) {
    return {
      id: row[0],
      title: row[1],
      image: row[3] // Image URL is in Column D (Index 3)
    };
  }).filter(function(o) { return o.image && o.image != ""; });

  return responseJSON({ data: offers });
}

function getOrders() {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME_ORDERS);
  if (!sheet) return responseJSON({ data: [] });
  var data = sheet.getDataRange().getValues();
  // Return raw rows for Orders (as expected by Frontend)
  if (data.length > 0) data.shift(); // Remove header
  return responseJSON({ data: data });
}

/* -------------------- ADD/DELETE FUNCTIONS -------------------- */

function addProduct(data) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME_PRODUCTS);
  var id = "SM" + new Date().getFullYear() + "P" + ("000" + (sheet.getLastRow())).slice(-3); // e.g. SM2025P001
  
  var imageUrl = data.image;
  // Handle Base64 Upload
  if (data.imageBase64) {
    imageUrl = uploadImageToDrive(data.imageBase64, data.mimeType, data.title + "_prod");
  }

  var row = [
    id,
    data.title,
    data.brand,
    data.category,
    data.price,
    imageUrl,
    new Date().toLocaleString(),
    data.description
  ];

  sheet.appendRow(row);
  return responseJSON({ success: true, id: id });
}

function deleteProduct(id) {
  return deleteRowById(SHEET_NAME_PRODUCTS, 0, id); // ID is Col 0
}

function addOffer(data) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME_OFFERS);
  if (!sheet) {
    sheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(SHEET_NAME_OFFERS);
    sheet.appendRow(["POST ID", "Post Name", "Date & Time", "Image URL"]);
  }

  var id = "SMHP" + ("000" + sheet.getLastRow()).slice(-3); // e.g. SMHP001
  
  var imageUrl = data.image;
  if (data.imageBase64) {
    imageUrl = uploadImageToDrive(data.imageBase64, data.mimeType, "Offer_" + id);
  }

  var row = [
    id,
    data.title || "Offer",
    new Date().toLocaleString(),
    imageUrl
  ];

  sheet.appendRow(row);
  return responseJSON({ success: true, id: id });
}

function deleteOffer(id) {
  return deleteRowById(SHEET_NAME_OFFERS, 0, id); // ID is Col 0
}

function updateOrder(data) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME_ORDERS);
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    // Assuming Order ID is in Col 2 (Index 2) - check frontend logic if matches
    // Frontend sends 'orderId' which seems to be the content of row[2]
    if (rows[i][2] == data.orderId) { 
        // Status Column assumed to be Index 11 based on frontend 'row[11]'
        sheet.getRange(i + 1, 12).setValue(data.status); // Col 12 is Index 11
        return responseJSON({ success: true });
    }
  }
  return responseJSON({ success: false, message: "Order not found" });
}

/* -------------------- HELPER FUNCTIONS -------------------- */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function deleteRowById(sheetName, idColIndex, id) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][idColIndex] == id) {
      sheet.deleteRow(i + 1);
      return responseJSON({ success: true });
    }
  }
  return responseJSON({ success: false, message: "ID not found" });
}

function uploadImageToDrive(base64, mimeType, filename) {
  try {
    var decoded = Utilities.base64Decode(base64);
    var blob = Utilities.newBlob(decoded, mimeType, filename);
    
    var folder;
    var folders = DriveApp.getFoldersByName(UPLOAD_FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(UPLOAD_FOLDER_NAME);
    }
    
    var file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Return a direct download link or view link that works with <img>
    // The "export=view" link often works better for hotlinking than "view?usp=sharing"
    // But "uc?export=view&id=" is the standard hack request.
    return "https://lh3.googleusercontent.com/d/" + file.getId();
  } catch (e) {
    return "Error: " + e.toString();
  }
}
```
