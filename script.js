document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ohmForm');
    const resistanceInput = document.getElementById('resistance');
    const resUnitSelect = document.getElementById('resUnit');
    const currentInput = document.getElementById('current');
    const currUnitSelect = document.getElementById('currUnit');
    
    const resultBox = document.getElementById('resultBox');
    const voltageOutput = document.getElementById('voltageOutput');
    const powerOutput = document.getElementById('powerOutput');
    
    const resetBtn = document.getElementById('resetBtn');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistory');

    let history = [];

    // تنسيق الأرقام والوحدات تلقائياً
    function formatMetric(value, unit) {
        if (value === 0) return `0 ${unit}`; const absVal = Math.abs(value); if (absVal >= 1e6) return `${(value / 1e6).toFixed(3).replace(/\.?0+$/, '')} M${unit}`;
        if (absVal >= 1e3) return `${(value / 1e3).toFixed(3).replace(/\.?0+$/, '')} k${unit}`; if (absVal < 1 && absVal >= 1e-3) return `${(value * 1e3).toFixed(3).replace(/\.?0+$/, '')} m${unit}`;
        if (absVal < 1e-3) return `${(value * 1e6).toFixed(3).replace(/\.?0+$/, '')} µ${unit}`; return `${value.toFixed(3).replace(/\.?0+$/, '')}${unit}`;
    }

    function calculateVoltage(e) {
        if (e) e.preventDefault();

        const rVal = parseFloat(resistanceInput.value);
        const iVal = parseFloat(currentInput.value);

        if (isNaN(rVal) || isNaN(iVal)) return;

        // التحويل إلى الوحدات الأساسية (أوم وأمبير)
        const rInOhms = rVal * parseFloat(resUnitSelect.value);
        const iInAmps = iVal * parseFloat(currUnitSelect.value);

        // الحساب: V = I * R و P = V * I
        const voltage = iInAmps * rInOhms;
        const power = voltage * iInAmps;

        const formattedVoltage = formatMetric(voltage, 'V');
        const formattedPower = formatMetric(power, 'W');

        voltageOutput.textContent = formattedVoltage;
        powerOutput.textContent = formattedPower;
        resultBox.classList.remove('hidden');

        // إضافة للسجل عند الضغط على زر الحساب
        if (e) {
            const resText = `${rVal}${resUnitSelect.options[resUnitSelect.selectedIndex].text.split(' ')[0]}`;
            const currText = `${iVal}${currUnitSelect.options[currUnitSelect.selectedIndex].text.split(' ')[0]}`;
            addToHistory(currText, resText, formattedVoltage);
        }
    }

    function addToHistory(currentStr, resStr, voltStr) {
        history.unshift({ currentStr, resStr, voltStr });
        if (history.length > 5) history.pop();
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<li class="empty-msg">لا توجد عمليات حسابية بعد</li>';
            return;
        }
        history.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${item.currentStr} ×${item.resStr}</span> <strong style="color:#38bdf8">= ${item.voltStr}</strong>`;
            historyList.appendChild(li);
        });
    }

    // الحساب الفوري أثناء الكتابة
    [resistanceInput, currentInput, resUnitSelect, currUnitSelect].forEach(el => {
        el.addEventListener('input', () => {
            if (resistanceInput.value && currentInput.value) {
                calculateVoltage();
            }
        });
    });

    form.addEventListener('submit', calculateVoltage);

    resetBtn.addEventListener('click', () => {
        form.reset();
        resultBox.classList.add('hidden');
        resistanceInput.focus();
    });

    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        renderHistory();
    });
});