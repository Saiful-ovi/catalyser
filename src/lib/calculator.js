export function calculatePrice(catalyser, settings) {
  // Step 1
  const dry_weight = catalyser.weightGram * (1 - catalyser.moisture);

  // Step 2
  const dry_weight_kg = dry_weight / 1000;
  const pt_gram = (catalyser.ptPpm * dry_weight_kg) / 1000;
  const pd_gram = (catalyser.pdPpm * dry_weight_kg) / 1000;
  const rh_gram = (catalyser.rhPpm * dry_weight_kg) / 1000;

  // Step 3
  const pt_payable = pt_gram * settings.metals.pt.returnRate;
  const pd_payable = pd_gram * settings.metals.pd.returnRate;
  const rh_payable = rh_gram * settings.metals.rh.returnRate;

  // Calculate AED per gram prices from settings
  // AED per gram = (USD x 3.6725) / 31.1034768
  const usdToAed = settings.usdToAed;
  const ounceToGram = settings.ounceToGram;
  
  const pt_price_aed = (settings.metals.pt.usdPerOunce * usdToAed) / ounceToGram;
  const pd_price_aed = (settings.metals.pd.usdPerOunce * usdToAed) / ounceToGram;
  const rh_price_aed = (settings.metals.rh.usdPerOunce * usdToAed) / ounceToGram;

  // Step 4
  const pt_value = pt_payable * pt_price_aed;
  const pd_value = pd_payable * pd_price_aed;
  const rh_value = rh_payable * rh_price_aed;

  const total_value = pt_value + pd_value + rh_value;

  // Step 5: Pure Metal in KG
  const pt_payable_kg = pt_payable / 1000;
  const pd_payable_kg = pd_payable / 1000;
  const rh_payable_kg = rh_payable / 1000;

  // Step 6: Refining Cost (based on pure metal kg)
  const refining_cost = 
    (pt_payable_kg * settings.metals.pt.refiningCharge) +
    (pd_payable_kg * settings.metals.pd.refiningCharge) +
    (rh_payable_kg * settings.metals.rh.refiningCharge);

  // Step 7: Treatment Cost (based on WET weight kg)
  const wet_weight_kg = catalyser.weightGram / 1000;
  const treatment_cost = wet_weight_kg * settings.treatmentCharge;

  // Step 8: Margin Cost (if any)
  const margin_cost = total_value * (settings.serviceMargin / 100);

  // Step 9: Final Price
  const final_price = total_value - (refining_cost + treatment_cost + margin_cost);

  return {
    final_price,
    total_value,
    refining_cost,
    treatment_cost,
    margin_cost,
    dry_weight,
    pt_gram, pd_gram, rh_gram,
    pt_payable, pd_payable, rh_payable,
    pt_value, pd_value, rh_value,
    pt_price_aed, pd_price_aed, rh_price_aed
  };
}
