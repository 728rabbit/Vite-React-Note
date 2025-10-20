import { API_URL } from "../global/Config";

export function validateForm(form, transLang) {
    let valid = true;

    // Clear the previous error message first
    const tipsArea = form.querySelector('div.iweb-tips-message');
    if(tipsArea) {
        tipsArea.classList.remove('error', 'success');
        tipsArea.innerHTML = '';
    }

    const existingErrors = form.querySelectorAll('small.tips');
    existingErrors.forEach(err => err.remove());

    // Recursive check once
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
            // Required
            if (rule === 'required') {
                if (element.type === 'checkbox') {
                    if (processedCheckboxes.has(element.name)) continue;
                    processedCheckboxes.add(element.name);
                    const checkboxes = form.querySelectorAll(`input[name="${element.name}"]`);
                    const checked = Array.from(checkboxes).some(cb => cb.checked);
                    if (!checked) {
                        elementValid = false;
                        messages.push(transLang('errorRequired'));
                    }
                } else if (element.type === 'radio') {
                    if (processedRadios.has(element.name)) continue;
                    processedRadios.add(element.name);
                    const radios = form.querySelectorAll(`input[name="${element.name}"]`);
                    const checked = Array.from(radios).some(r => r.checked);
                    if (!checked) {
                        elementValid = false;
                        messages.push(transLang('errorRequired'));
                    }
                } else {
                    if (!element.value || element.value.trim() === '') {
                        elementValid = false;
                        messages.push(transLang('errorRequired'));
                    }
                }
            }

            // Password
            else if (rule === 'password') {
                if (element.value &&  !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(element.value)) {
                    elementValid = false;
                    messages.push(transLang('errorPasswordFormat'));
                }
            }

            // Email
            else if (rule === 'email') {
                if (element.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(element.value)) {
                    elementValid = false;
                    messages.push(transLang('errorEmailFormat'));
                }
            }

            // Date
            else if (rule === 'date') {
                if (element.value && !/^\d{4}-\d{2}-\d{2}$/.test(element.value)) {
                    elementValid = false;
                    messages.push(transLang('errorDateFormat'));
                }
            }

            // Time
            else if (rule === 'time') {
                if (element.value && !/^\d{2}:\d{2}$/.test(element.value)) {
                    elementValid = false;
                    messages.push(transLang('errorTimeFormat'));
                }
            }

            // Number
            else if (rule === 'number') {
                 if (element.value && isNaN(element.value)) {
                    elementValid = false;
                    messages.push(transLang('errorNumberFormat'));
                }
            }

            else if (rule === 'ge0') {
                 if (element.value && !isNaN(element.value) && Number(element.value) < 0) {
                    elementValid = false;
                    messages.push(transLang('errorGE0'));
                }
            }

            else if (rule === 'gt0') {
                 if (element.value && !isNaN(element.value) && Number(element.value) <= 0) {
                    elementValid = false;
                    messages.push(transLang('errorGT0'));
                }
            }

            // Regex
            else if (rule.startsWith('regex:')) {
                const pattern = rule.replace('regex:', '');
                const regex = new RegExp(pattern);
                if (element.value && !regex.test(element.value)) {
                    elementValid = false;
                    messages.push(transLang('errorRequired'));
                }
            }
        }

        // If there is an error, insert below the input
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

    // Traverse the form elements
    const processedNames = new Set();
    for (let element of form.elements) {
        if (!element.name) continue;

        if (element.type === 'checkbox') {
            if (processedNames.has(element.name)) continue; // Processed
            processedNames.add(element.name);
            const checkboxes = form.querySelectorAll(`input[name="${element.name}"]`);
            const values = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
            if (values.length === 1) {
                formData.append(element.name, values[0]);
            }
            else {
                values.forEach(v => formData.append(element.name + '[]', v));
            }
        } 
        else if (element.type === 'radio') {
            if (element.checked) { 
                formData.append(element.name, element.value);
            }
        } 
        else if (element.type === 'file') {
            const files = element.files;
            if (files) {
                if (element.multiple) {
                    for (let i = 0; i < files.length; i++) {
                        formData.append(element.name + '[]', files[i]);
                    }
                } else if (files.length > 0) {
                    formData.append(element.name, files[0]);
                }
            }
        }
        else {
            formData.append(element.name, element.value);
        }
    }

    return formData;
}

let isSubmitting = false;
export function submitForm(e, transLang, callBack, extraFunc, authnToken = '') {
    e.preventDefault();
    if (isSubmitting) { return; }
    isSubmitting = true;

    const form = e.target;
    let valid = validateForm(form, transLang);
    if(valid && typeof extraFunc === 'function') {
        valid = valid && extraFunc();
    }
    if (!valid) { isSubmitting = false; return; }

    // Remove error message if need
    const tipsArea = form.querySelector('div.iweb-tips-message');
    if(tipsArea) {
        tipsArea.classList.remove('error', 'success');
        tipsArea.innerHTML = '';
    }
    const existingErrors = form.querySelectorAll('small.tips');
    existingErrors.forEach(err => err.remove());

    const existingErrorsInput = form.querySelectorAll('div.iweb-input.error');
    existingErrorsInput.forEach(err => err.classList.remove('error'));

    // Show processing
    const spinner = document.createElement('div');
    spinner.className = 'page-processing';
    spinner.innerHTML = '<div class="spinner"></div><div class="tips">Processing...</div>';
    document.body.appendChild(spinner);

    console.log(authnToken);

    // Post form data to api
    const formData = revisedFormData(form);
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${authnToken}`
        },
        body: formData,
    })
    .then(res => res.json())
    .then(data => {
        setTimeout(function(){
            spinner.remove();
            if(data.status === 200) {
                if(typeof callBack === 'function') {
                    callBack(data);
                }
            }
            else {
                if(tipsArea && data.message) {
                    const msgDiv = document.createElement('div');
                    const closeBtn = document.createElement('a');
                    closeBtn.className = 'close';
                    closeBtn.href = 'javascript:void(0)';
                    closeBtn.textContent = '×';
                    closeBtn.addEventListener('click', () => {
                        tipsArea.innerHTML = '';
                        tipsArea.classList.remove('error', 'success');
                    });
                    const span = document.createElement('span');
                    span.textContent = data.message;
                    msgDiv.appendChild(closeBtn);
                    msgDiv.appendChild(span);
                    tipsArea.appendChild(msgDiv);
                    tipsArea.classList.add('error');
                }
                else {
                    alert(data.message);
                }
            }
        }, 500);
    })
    .catch(ex => console.error(ex))
    .finally(() => {
        setTimeout(function(){
            isSubmitting = false;
        }, 1000);
    });
}