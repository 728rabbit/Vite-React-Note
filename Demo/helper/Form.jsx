export function validateForm(form) {
    let valid = true;

    // 先清空之前的錯誤訊息
    const existingErrors = form.querySelectorAll('small.tips');
    existingErrors.forEach(err => err.remove());

    const processedCheckboxes = new Set();
    const processedRadios = new Set();

    for (let element of form.elements) {
        if (!element.name) continue;

        const validation = element.dataset.validation;
        if (!validation) continue;

        const rules = validation.split('|');
        let elementValid = true;
        let messages = [];

        for (let rule of rules) {
            // required
            if (rule === 'required') {
            if (element.type === 'checkbox') {
                if (processedCheckboxes.has(element.name)) continue;
                processedCheckboxes.add(element.name);
                const checkboxes = form.querySelectorAll(`input[name="${element.name}"]`);
                const checked = Array.from(checkboxes).some(cb => cb.checked);
                if (!checked) {
                elementValid = false;
                messages.push('必填');
                }
            } else if (element.type === 'radio') {
                if (processedRadios.has(element.name)) continue;
                processedRadios.add(element.name);
                const radios = form.querySelectorAll(`input[name="${element.name}"]`);
                const checked = Array.from(radios).some(r => r.checked);
                if (!checked) {
                elementValid = false;
                messages.push('必填');
                }
            } else {
                if (!element.value || element.value.trim() === '') {
                elementValid = false;
                messages.push('必填');
                }
            }
            }

            // email
            else if (rule === 'email') {
            if (element.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)) {
                elementValid = false;
                messages.push('格式錯誤 (Email)');
            }
            }

            // date
            else if (rule === 'date') {
            if (element.value && !/^\d{4}-\d{2}-\d{2}$/.test(element.value)) {
                elementValid = false;
                messages.push('格式錯誤 (YYYY-MM-DD)');
            }
            }

            // time
            else if (rule === 'time') {
            if (element.value && !/^\d{2}:\d{2}$/.test(element.value)) {
                elementValid = false;
                messages.push('格式錯誤 (HH:MM)');
            }
            }

            // regex
            else if (rule.startsWith('regex:')) {
            const pattern = rule.replace('regex:', '');
            const regex = new RegExp(pattern);
            if (element.value && !regex.test(element.value)) {
                elementValid = false;
                messages.push('格式錯誤');
            }
            }
        }

        // 如果有錯誤，插入到 input 下方
        if (!elementValid) {
            valid = false;
            const errorDiv = document.createElement('small');
            errorDiv.className = 'tips';
            errorDiv.textContent = messages.join(', ');

            const wrapper = element.closest('div.iweb-input') || element.parentElement;
            wrapper.classList.add('error');
            wrapper.appendChild(errorDiv);
        }
    }

    return valid;
}

export function revisedFormData(form) {
    const formData = new FormData();

    // 遍歷表單元素
    const processedNames = new Set();
    for (let element of form.elements) {
        if (!element.name) continue;

        if (element.type === "checkbox") {
            if (processedNames.has(element.name)) continue; // 已處理過
            processedNames.add(element.name);

            const checkboxes = form.querySelectorAll(`input[name="${element.name}"]`);
            const values = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
            values.forEach(v => formData.append(element.name + '[]', v));

        } else if (element.type === "radio") {
            if (element.checked) formData.append(element.name, element.value);
        } else {
            formData.append(element.name, element.value);
        }
    }

    return formData;
}