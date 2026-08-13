const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let statusDiv = document.getElementById('formStatus');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'formStatus';
            statusDiv.className = 'hidden rounded-xl p-4 mb-4 text-sm font-medium';
            contactForm.prepend(statusDiv);
        }

        const submitBtn = document.getElementById('submitBtn') || document.getElementById('contactSubmitBtn');
        const btnText = submitBtn ? submitBtn.querySelector('span') : null;

        if (btnText) btnText.textContent = 'Sending...';
        if (submitBtn) submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const rawData = Object.fromEntries(formData.entries());
        
        const data = {
            name: rawData.name || document.getElementById('contactName')?.value || '',
            email: rawData.email || document.getElementById('contactEmail')?.value || '',
            subject: rawData.subject || document.getElementById('contactSubject')?.value || '',
            message: rawData.message || document.getElementById('contactMessage')?.value || ''
        };

        try {
            const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
                ? 'http://localhost:3000'
                : '';

            let sentSuccess = false;

            // Attempt 1: Server endpoint
            try {
                const res = await fetch(`${API_BASE}/api/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const resData = await res.json().catch(() => ({}));

                if (res.ok && resData.success) {
                    sentSuccess = true;
                    if (statusDiv) {
                        statusDiv.className = 'rounded-xl p-4 mb-4 text-sm font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
                        statusDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Your message was sent to <strong>mshahid3845@gmail.com</strong>!`;
                    }
                    contactForm.reset();

                    if (resData.mailtoUrl) {
                        window.location.href = resData.mailtoUrl;
                    }
                }
            } catch (apiErr) {
                console.warn('Backend send attempt failed, trying FormSubmit service directly...', apiErr);
            }

            // Attempt 2: Direct FormSubmit service to mshahid3845@gmail.com
            if (!sentSuccess) {
                const fsRes = await fetch('https://formsubmit.co/ajax/mshahid3845@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: data.name,
                        email: data.email,
                        _subject: `Portfolio Contact from ${data.name}: ${data.subject || 'New Message'}`,
                        message: data.message,
                        _replyto: data.email,
                        _template: "table"
                    })
                });

                if (fsRes.ok) {
                    sentSuccess = true;
                    if (statusDiv) {
                        statusDiv.className = 'rounded-xl p-4 mb-4 text-sm font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
                        statusDiv.innerHTML = `<i class="fas fa-check-circle mr-2"></i> Message sent directly to <strong>mshahid3845@gmail.com</strong>!`;
                    }
                    contactForm.reset();
                } else {
                    // Attempt 3: Mailto fallback
                    const subject = encodeURIComponent(`Portfolio Contact: ${data.subject || 'Message from ' + data.name}`);
                    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
                    const mailtoUrl = `mailto:mshahid3845@gmail.com?subject=${subject}&body=${body}`;

                    window.location.href = mailtoUrl;

                    if (statusDiv) {
                        statusDiv.className = 'rounded-xl p-4 mb-4 text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20';
                        statusDiv.innerHTML = `<i class="fas fa-envelope mr-2"></i> Opening your email application to send to <strong>mshahid3845@gmail.com</strong>...`;
                    }
                    contactForm.reset();
                }
            }
        } catch (error) {
            if (statusDiv) {
                statusDiv.className = 'rounded-xl p-4 mb-4 text-sm font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20';
                statusDiv.textContent = error.message || 'Error sending message. Please try again or email mshahid3845@gmail.com.';
            }
        } finally {
            if (statusDiv) statusDiv.classList.remove('hidden');
            if (btnText) btnText.textContent = 'Send Message';
            if (submitBtn) submitBtn.disabled = false;
            if (statusDiv) setTimeout(() => statusDiv.classList.add('hidden'), 8000);
        }
    });
}

