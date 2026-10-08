// Currency formatter for Indian Rupee
const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(val));
};

// Two-way sync helper between number input & slider
function linkInputAndSlider(inputEl, sliderEl, onChange) {
  sliderEl.addEventListener('input', () => {
    inputEl.value = sliderEl.value;
    onChange();
  });

  inputEl.addEventListener('input', () => {
    sliderEl.value = inputEl.value;
    onChange();
  });
}

/* ========================================================
   1. TAB SWITCHING LOGIC
======================================================== */
const navButtons = document.querySelectorAll('.nav-btn');
const views = {
  sip: document.getElementById('sipView'),
  emi: document.getElementById('emiView'),
  loan: document.getElementById('loanView')
};

navButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selectedTab = btn.getAttribute('data-tab');
    Object.keys(views).forEach(tab => {
      views[tab].classList.toggle('active', tab === selectedTab);
    });
  });
});

/* ========================================================
   2. SIP CALCULATOR
======================================================== */
const sipInvestmentInput = document.getElementById('sipInvestmentInput');
const sipInvestmentSlider = document.getElementById('sipInvestmentSlider');
const sipReturnInput = document.getElementById('sipReturnInput');
const sipReturnSlider = document.getElementById('sipReturnSlider');
const sipTenureInput = document.getElementById('sipTenureInput');
const sipTenureSlider = document.getElementById('sipTenureSlider');

const sipInvestedAmount = document.getElementById('sipInvestedAmount');
const sipEstReturns = document.getElementById('sipEstReturns');
const sipTotalValue = document.getElementById('sipTotalValue');
const sipProgressInvested = document.getElementById('sipProgressInvested');
const sipProgressReturns = document.getElementById('sipProgressReturns');

function calculateSIP() {
  const P = parseFloat(sipInvestmentInput.value) || 0;
  const annualRate = parseFloat(sipReturnInput.value) || 0;
  const years = parseFloat(sipTenureInput.value) || 0;

  const i = annualRate / (12 * 100);
  const n = years * 12;
  const invested = P * n;
  let total = 0;

  if (i > 0 && n > 0 && P > 0) {
    total = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  } else {
    total = invested;
  }

  const returns = Math.max(0, total - invested);

  sipInvestedAmount.textContent = formatCurrency(invested);
  sipEstReturns.textContent = formatCurrency(returns);
  sipTotalValue.textContent = formatCurrency(total);

  if (total > 0) {
    sipProgressInvested.style.width = `${(invested / total) * 100}%`;
    sipProgressReturns.style.width = `${(returns / total) * 100}%`;
  }
}

linkInputAndSlider(sipInvestmentInput, sipInvestmentSlider, calculateSIP);
linkInputAndSlider(sipReturnInput, sipReturnSlider, calculateSIP);
linkInputAndSlider(sipTenureInput, sipTenureSlider, calculateSIP);

/* ========================================================
   3. EMI CALCULATOR
======================================================== */
const emiAmountInput = document.getElementById('emiAmountInput');
const emiAmountSlider = document.getElementById('emiAmountSlider');
const emiRateInput = document.getElementById('emiRateInput');
const emiRateSlider = document.getElementById('emiRateSlider');
const emiTenureInput = document.getElementById('emiTenureInput');
const emiTenureSlider = document.getElementById('emiTenureSlider');

const emiMonthly = document.getElementById('emiMonthly');
const emiPrincipal = document.getElementById('emiPrincipal');
const emiInterest = document.getElementById('emiInterest');
const emiTotal = document.getElementById('emiTotal');
const emiProgressPrincipal = document.getElementById('emiProgressPrincipal');
const emiProgressInterest = document.getElementById('emiProgressInterest');

function calculateEMI() {
  const P = parseFloat(emiAmountInput.value) || 0;
  const annualRate = parseFloat(emiRateInput.value) || 0;
  const years = parseFloat(emiTenureInput.value) || 0;

  const r = annualRate / (12 * 100);
  const n = years * 12;

  let monthlyEMI = 0;
  if (r > 0 && n > 0 && P > 0) {
    monthlyEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    monthlyEMI = P / n;
  }

  const totalPayment = monthlyEMI * n;
  const totalInterest = Math.max(0, totalPayment - P);

  emiMonthly.textContent = formatCurrency(monthlyEMI);
  emiPrincipal.textContent = formatCurrency(P);
  emiInterest.textContent = formatCurrency(totalInterest);
  emiTotal.textContent = formatCurrency(totalPayment);

  if (totalPayment > 0) {
    emiProgressPrincipal.style.width = `${(P / totalPayment) * 100}%`;
    emiProgressInterest.style.width = `${(totalInterest / totalPayment) * 100}%`;
  }
}

linkInputAndSlider(emiAmountInput, emiAmountSlider, calculateEMI);
linkInputAndSlider(emiRateInput, emiRateSlider, calculateEMI);
linkInputAndSlider(emiTenureInput, emiTenureSlider, calculateEMI);

/* ========================================================
   4. LOAN CALCULATOR
======================================================== */
const loanAmountInput = document.getElementById('loanAmountInput');
const loanAmountSlider = document.getElementById('loanAmountSlider');
const loanRateInput = document.getElementById('loanRateInput');
const loanRateSlider = document.getElementById('loanRateSlider');
const loanTenureInput = document.getElementById('loanTenureInput');
const loanTenureSlider = document.getElementById('loanTenureSlider');
const loanFeeInput = document.getElementById('loanFeeInput');
const loanFeeSlider = document.getElementById('loanFeeSlider');

const loanMonthly = document.getElementById('loanMonthly');
const loanFeeAmount = document.getElementById('loanFeeAmount');
const loanInterestTotal = document.getElementById('loanInterestTotal');
const loanGrandTotal = document.getElementById('loanGrandTotal');
const loanProgressPrincipal = document.getElementById('loanProgressPrincipal');
const loanProgressInterest = document.getElementById('loanProgressInterest');

function calculateLoan() {
  const P = parseFloat(loanAmountInput.value) || 0;
  const annualRate = parseFloat(loanRateInput.value) || 0;
  const years = parseFloat(loanTenureInput.value) || 0;
  const feePercent = parseFloat(loanFeeInput.value) || 0;

  const r = annualRate / (12 * 100);
  const n = years * 12;

  let monthly = 0;
  if (r > 0 && n > 0 && P > 0) {
    monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    monthly = P / n;
  }

  const interestOnly = Math.max(0, (monthly * n) - P);
  const feeVal = (P * feePercent) / 100;
  const grandTotal = (monthly * n) + feeVal;

  loanMonthly.textContent = formatCurrency(monthly);
  loanFeeAmount.textContent = formatCurrency(feeVal);
  loanInterestTotal.textContent = formatCurrency(interestOnly);
  loanGrandTotal.textContent = formatCurrency(grandTotal);

  if (grandTotal > 0) {
    const principalPct = (P / grandTotal) * 100;
    loanProgressPrincipal.style.width = `${principalPct}%`;
    loanProgressInterest.style.width = `${100 - principalPct}%`;
  }
}

linkInputAndSlider(loanAmountInput, loanAmountSlider, calculateLoan);
linkInputAndSlider(loanRateInput, loanRateSlider, calculateLoan);
linkInputAndSlider(loanTenureInput, loanTenureSlider, calculateLoan);
linkInputAndSlider(loanFeeInput, loanFeeSlider, calculateLoan);

// Initial computations on load
calculateSIP();
calculateEMI();
calculateLoan();