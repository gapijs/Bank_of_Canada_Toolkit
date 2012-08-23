/**
* Interest rate by code. The codes can be found at the bank's website:
* http://www.bankofcanada.ca/rates/interest-rates/canadian-interest-rates/
*
* @param {string} code Interest rate codes; Example: "V122495" - Prime Rate (monthly).
* @param {date} lookup_date Date for the exchange rate.
* @return {number} rate found or an error message if the rate cannot be found
*/
function getInterestRateByCode(code, lookup_date)
{
  return getToolValue_(ToolType.IR, code, lookup_date);
}
