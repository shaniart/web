document.addEventListener('DOMContentLoaded', () => {
    console.log('SHANI Art website loaded');

    // Simple interaction for buttons
    const buyBtns = document.querySelectorAll('.buy-now-btn, .add-to-cart-btn');
    buyBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const originalText = this.innerText;

            if (this.classList.contains('buy-now-btn')) {
                alert('Thank you! This would take you to checkout.');
            } else {
                this.innerText = 'ADDED!';
                this.style.backgroundColor = '#ccc';
                this.style.borderColor = '#ccc';
                this.style.color = '#fff';

                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.backgroundColor = '';
                    this.style.borderColor = '';
                    this.style.color = '';
                }, 2000);
            }
        });
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('.main-nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }



    // Add to Basket Buttons (Shop & Product Pages)
    const addToBasketBtns = document.querySelectorAll('.btn-shop-add, .add-to-cart-btn');
    addToBasketBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = btn.closest('.product-card')?.querySelector('h4')?.innerText || 'Product';
            alert(`Added ${productName} to your basket!`);
        });
    });

    // Buy Now Button (Product Page)
    const buyNowBtn = document.querySelector('.buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            alert('Proceeding to checkout...');
        });
    }

    // Contact Form & Newsletter Subscription
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'SUBMIT';

            // Check if this is a Formspree AJAX form (or any form with an action pointing to formspree.io)
            const hasFormspreeAction = form.action && form.action.includes('formspree.io');

            // Create or find status container
            let statusDiv = form.querySelector('.form-status');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.className = 'form-status';
                // Insert at the top of the form
                form.insertBefore(statusDiv, form.firstChild);
            }

            // Hide previous status
            statusDiv.className = 'form-status';
            statusDiv.style.display = 'none';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'SENDING...';
            }

            if (hasFormspreeAction) {
                // Submit to Formspree via AJAX
                const data = new FormData(form);
                fetch(form.action, {
                    method: form.method || 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        statusDiv.innerText = 'Thank you! Your message has been sent successfully.';
                        statusDiv.className = 'form-status success show';
                        form.reset();
                    } else {
                        response.json().then(data => {
                            if (data && data.errors) {
                                statusDiv.innerText = data.errors.map(error => error.message).join(', ');
                            } else {
                                statusDiv.innerText = 'Oops! There was a problem submitting your form.';
                            }
                            statusDiv.className = 'form-status error show';
                        }).catch(() => {
                            statusDiv.innerText = 'Oops! There was a problem submitting your form.';
                            statusDiv.className = 'form-status error show';
                        });
                    }
                })
                .catch(error => {
                    statusDiv.innerText = 'Oops! There was a network error. Please check your connection and try again.';
                    statusDiv.className = 'form-status error show';
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalBtnText;
                    }
                });
            } else {
                // For non-Formspree forms (like the newsletter form, which doesn't have an action endpoint)
                setTimeout(() => {
                    const isNewsletter = form.querySelector('input[type="email"]')?.placeholder.toLowerCase().includes('email');
                    if (isNewsletter) {
                        statusDiv.innerText = 'Thank you for subscribing to our newsletter!';
                    } else {
                        statusDiv.innerText = 'Thank you for your message! We will get back to you soon.';
                    }
                    statusDiv.className = 'form-status success show';
                    form.reset();

                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalBtnText;
                    }
                }, 800); // Simulate network delay for premium feel
            }
        });
    });
});
