function openPopup() {
    document.getElementById('qrCodePopup').style.display = 'flex';
}

function closePopup() {
    document.getElementById('qrCodePopup').style.display = 'none';
}

function toggleAnonymous() {
    const isAnonymous = document.getElementById('anonymous').checked;
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');

    nameField.disabled = isAnonymous;
    emailField.disabled = isAnonymous;

    nameField.required = !isAnonymous;
    emailField.required = !isAnonymous;
}

function validateFields(name, email, value) {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!document.getElementById('anonymous').checked) {
        if (!nameRegex.test(name)) {
            alert('Por favor, insira um nome válido.');
            return false;
        }

        if (!emailRegex.test(email)) {
            alert('Por favor, insira um email válido.');
            return false;
        }
    }

    if (isNaN(value) || value <= 0) {
        alert('Por favor, insira um valor de doação válido e maior que zero.');
        return false;
    }

    return true;
}

function formatCurrencyInput(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.padStart(3, '0'); 
    const decimalPart = value.slice(-2); 
    input.value = `${parseInt(integerPart, 10)}.${decimalPart}`;
}

document.getElementById('value').addEventListener('input', function (e) {
    formatCurrencyInput(e.target); 
});

async function generateQRCode(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const value = parseFloat(document.getElementById('value').value);

    if (!validateFields(name, email, value)) {
        return; 
    }

    const apiUrl = `https://gerarqrcodepix.com.br/api/v1?nome=${encodeURIComponent(name || 'Anônimo')}&cidade=${encodeURIComponent('')} &saida=qr&chave=chave@exemplo.com&valor=${encodeURIComponent(value)}`;
    document.getElementById('qrCodeContainer').innerHTML = `<img src="${apiUrl}" alt="QR Code de doação">`;
    openPopup();
}


function validateFields(name, address, details, imageInput) {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    if (!nameRegex.test(name)) {
        alert('Por favor, insira um nome válido contendo apenas letras e espaços.');
        return false;
    }

    if (address.trim() === '') {
        alert('Por favor, insira um endereço válido.');
        return false;
    }

    if (details.trim() === '') {
        alert('Por favor, forneça detalhes sobre a situação.');
        return false;
    }

    if (imageInput.files.length > 0 && !validImageTypes.includes(imageInput.files[0].type)) {
        alert('Por favor, selecione um arquivo de imagem válido (JPEG, PNG).');
        return false;
    }

    return true;
}

function sendReport(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const address = document.getElementById('address').value.trim();
    const details = document.getElementById('details').value.trim();
    const imageInput = document.getElementById('image');

    if (!validateFields(name, address, details, imageInput)) {
        return; 
    }

    let formData = {
        from_name: name,
        address: address,
        details: details,
    };

    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            formData.image_base64 = e.target.result.split(',')[1];
            sendEmail(formData);
        };

        reader.readAsDataURL(file);
    } else {
        sendEmail(formData);
    }
}

function sendEmail(formData) {
    emailjs.send('serviceid', 'template_79ttb0v', formData)
        .then(function (response) {
            alert("Denúncia enviada com sucesso!");
        }, function (error) {
            console.error("Erro ao enviar email:", error);
            alert("Houve um erro ao enviar a denúncia. Tente novamente.");
        });
}
