var ToolType = {
  MEX: "1",
  IR: "2"
};

function getInstrumentConfig_(instName)
{
  var config = 
      {
        instruments: [
          {
            type: ToolType.MEX,
            url:  "http://www.bankofcanada.ca/stats/results/p_xml?endRange={year}-{month}-01&dFromMonth={month}&dFromYear={year}&dToMonth={month}&dToYear={year}&lP=lookup_monthly_exchange_rates.php&sR={date10}&se=L_{code}",
            elementnames: [ 'Observation', 'Currency_name', 'Observation_data' ]
          },          
          {
            type: ToolType.IR,
            url : "http://www.bankofcanada.ca/stats/results/p_xml?ByDate_frequency=daily&lP=lookup_canadian_interest.php&sR={date10}&se=LOOKUPS_{code}&dF={fromDay}&dT={date}",
            elementnames: [ 'Observation', 'Currency_name', 'Observation_data' ]
          }          
          
        ]
      };
  
  for (var i in config.instruments) {
    if (config.instruments[i].type == instName) {
      return config.instruments[i];
    }
  }
}


function getToolValue_(toolType, code, date, bypassCache)
{
  if (date > new Date()) {
    return "error: future date";
  }
  if (bypassCache != undefined && bypassCache != true) {
    var cache = CacheService.getPublicCache();
    var parm = cache.get(toolType + code + date);
    if (parm != null) {
      return parm;
    }
  }
  try {
    var instrument = getInstrumentConfig_(toolType);
    var url = parseURL_(instrument.url, date, code);
    
    var response = UrlFetchApp.fetch(url);
    var text = response.getContentText();
    
    var doc = Xml.parse(text, false);
    if (doc == null) {
      return "Cannot parse XML data.";      
    }
    
    var elements = doc.getElement().getElements(instrument.elementnames[0]);
    var el = elements[0];
    for (var c = 1; c < instrument.elementnames.length; c++) {  
      el = el.getElement(instrument.elementnames[c]);
    }
    var value = el.getText();
    
    if (bypassCache != undefined && bypassCache != true) {
      var cache = CacheService.getPublicCache();
      cache.put(toolType + code + date, value);
    }
    
    return value;
    
  } catch (ex) {
    Logger.log("Exception reading value for tool " + toolType + ", date: " + date + ": " + ex.message);
    //return "exeption: " + ex.message;
  }
  return "Cannot get value";
}


function parseURL_(url, date, code)
{
  //var timeZone = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  
  var year = date.getFullYear();
  var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  var date2 = getDateFormatted_(date);
  
  var df = new Date(date);
  df.setDate(df.getDate() - 40); //-40 days; get some interval of dates to guarantee returned list is not empty
  var fromDay = getDateFormatted_(df);
  
  var d10 = new Date(date);
  d10.setFullYear(d10.getFullYear() - 10); //-10 years lookup max; actually oldest is 2002-08-23.
  var date10 = getDateFormatted_(d10);
  
  return url
    .replace(/{year}/g, year)
    .replace(/{month}/g, month)
    .replace(/{day}/g, day)
    .replace(/{date}/g, date2)
    .replace(/{fromDay}/g, fromDay)
    .replace(/{date10}/g, date10)
    .replace(/{code}/g, code);
}

function getDateFormatted_(date)
{
  var year = date.getFullYear();
  var month = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  return year + '-' + month + '-' + day;  
}
