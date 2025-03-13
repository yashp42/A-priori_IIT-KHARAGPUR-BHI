document.addEventListener("DOMContentLoaded", function () {
    const params = {
        biomedical_ratio: 0.12,
        improper_segregation: 0.50,
        co2_conventional: 2.5,
        co2_solution: 0.8,
        water_saved: 5,
        bio_brick_yield: 0.3,
        fertilizer_yield: 0.45,
        bio_brick_price: 70,
        fertilizer_price: 50,
        carbon_credit_price: 1000,
        treatment_cost: 5,
        infection_risk_reduction: 0.65,
        needlestick_reduction: 0.70
    };

    let hospitalBeds = document.getElementById("hospitalBeds");
    let wastePerBed = document.getElementById("wastePerBed");
    let adoptionRate = document.getElementById("adoptionRate");

    let bedValue = document.getElementById("bedValue");
    let wasteValue = document.getElementById("wasteValue");
    let adoptionValue = document.getElementById("adoptionValue");

    let progressBar = document.getElementById("adoptionProgress");
    let impactResults = document.getElementById("impactResults");

    let ctx = document.getElementById("outputChart").getContext("2d");
    let outputChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Bio-bricks", "Fertilizer", "Carbon Credits"],
            datasets: [{
                label: "Daily Output (kg/tons)",
                backgroundColor: ["#2ecc71", "#f1c40f", "#3498db"],
                data: [0, 0, 0]
            }]
        }
    });

    function updateValues() {
        bedValue.textContent = hospitalBeds.value;
        wasteValue.textContent = wastePerBed.value;
        adoptionValue.textContent = adoptionRate.value;
        progressBar.value = adoptionRate.value;

        let dailyGeneral = hospitalBeds.value * wastePerBed.value * (1 - params.biomedical_ratio);
        let dailyBiomedical = hospitalBeds.value * wastePerBed.value * params.biomedical_ratio;
        let treatedWaste = dailyBiomedical * (adoptionRate.value / 100) * (1 - params.improper_segregation);

        let co2Reduction = (treatedWaste / 1000) * (params.co2_conventional - params.co2_solution);
        let waterSaved = treatedWaste * params.water_saved;
        let totalRevenue = treatedWaste * (params.bio_brick_yield * params.bio_brick_price + params.fertilizer_yield * params.fertilizer_price) + co2Reduction * params.carbon_credit_price;
        let treatmentCost = treatedWaste * params.treatment_cost;
        let netRevenue = totalRevenue - treatmentCost;

        impactResults.innerHTML = `
            <h3>Impact Summary</h3>
            <p><strong>Daily General Waste:</strong> ${dailyGeneral.toFixed(1)} kg</p>
            <p><strong>Daily Biomedical Waste:</strong> ${dailyBiomedical.toFixed(1)} kg</p>
            <p><strong>Treated Waste:</strong> ${treatedWaste.toFixed(1)} kg/day</p>
            <p><strong>CO₂ Reduction:</strong> ${co2Reduction.toFixed(1)} tons/day</p>
            <p><strong>Water Saved:</strong> ${waterSaved.toFixed(1)} liters/day</p>
            <p><strong>Net Revenue:</strong> ₹${netRevenue.toFixed(0)}/day</p>
        `;

        outputChart.data.datasets[0].data = [
            treatedWaste * params.bio_brick_yield,
            treatedWaste * params.fertilizer_yield,
            co2Reduction
        ];
        outputChart.update();
    }

    hospitalBeds.addEventListener("input", updateValues);
    wastePerBed.addEventListener("input", updateValues);
    adoptionRate.addEventListener("input", updateValues);

    updateValues();
});
