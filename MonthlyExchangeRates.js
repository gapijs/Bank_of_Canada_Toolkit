/**
* Monthly average exchange rate by exchange code. The codes can be found thru by analyzing 
* resulting XML file url parameters on the bank's page: 
* http://www.bankofcanada.ca/rates/exchange/monthly-average-lookup/
* RULES: there is no monthly exchange rate for the current month.
* Exchange code examples: IEXM0102 - USD to CAD. 
*
* @param {string} code Exchange code; examples: "IEXM0102" - USD to CAD; "IEXM_EUROCAE01" - EUR to CAD
* @param {date} lookup_date Date for the exchange rate.
* @return {number} found rate or error message if the rate cannot be found
*/
function getMonthlyExchangeRateByCode(code, lookup_date)
{
  return getToolValue_(ToolType.MEX, code, lookup_date);
}
