// TypeScript-like typing animation for name
class TypeWriter {
    element;
    words;
    wait;
    isDeleting;
    txt;
    wordIndex;
    typeSpeed;

    constructor(el, words, wait = 3000) {
        this.element = el;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.typeSpeed = 100; // Make typing a bit faster
        this.isDeleting = false;
        this.type();
    }

    type() {
        // Current index of word
        const current = this.wordIndex % this.words.length;
        // Get full text of current word
        const fullTxt = this.words[current];

        // Check if deleting
        if(this.isDeleting) {
            // Remove char
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // Add char
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Insert txt into element with TypeScript-like syntax highlighting
        this.element.innerHTML = this.formatWithTypeScriptSyntax(this.txt);

        // Initial typing speed
        let typeSpeed = this.typeSpeed;

        if(this.isDeleting) {
            typeSpeed /= 2;
        }

        // If word is complete
        if(!this.isDeleting && this.txt === fullTxt) {
            // Make pause at end
            typeSpeed = this.wait;
            // Set delete to true
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // Move to next word
            this.wordIndex++;
            // Pause before start typing
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    formatWithTypeScriptSyntax(text) {
        if (!text) return '';
        
        // TypeScript keyword highlighting
        const keywords = ['interface', 'function', 'extends', 'type', 'class', 'return', 'string', 'number', 'boolean'];
        const operators = ['<', '>', ':', '=', '=>', '[]'];
        
        // Check for special TypeScript patterns
        if (text.includes('<') && text.includes('>')) {
            return this.formatGeneric(text);
        } else if (text.includes('interface')) {
            return this.formatInterface(text);
        } else if (text.includes('function')) {
            return this.formatFunction(text);
        } else if (text.includes(':')) {
            return this.formatTypeAnnotation(text);
        } else {
            // Default formatting for simple name
            const parts = text.split(' ');
            if (parts.length === 1) {
                return `<span style="color: #fff;">${parts[0]}</span>`;
            } else {
                return `<span style="color: #fff;">${parts[0]}</span> <span style="color: var(--primary-color);">${parts[1]}</span>`;
            }
        }
    }
    
    formatGeneric(text) {
        // Format generic type syntax like Ahmad<T extends Dev>
        const parts = text.split('<');
        if (parts.length < 2) return text;
        
        const name = parts[0];
        let generic = parts[1];
        
        // Replace > with highlighted version
        generic = generic.replace('>', '</span>');
        
        return `<span style="color: #fff;">${name}</span><span style="color: #ff79c6;">&lt;</span><span style="color: #8be9fd;">${generic}`;
    }
    
    formatInterface(text) {
        // Format interface syntax
        const interfacePattern = /(interface)\s+(\w+)\s+(\{)(.*?)(\})/;
        const matches = text.match(interfacePattern);
        
        if (!matches) return text;
        
        // Highlight each part
        const keyword = matches[1];
        const name = matches[2];
        const openBrace = matches[3];
        const content = matches[4] || '';
        const closeBrace = matches[5] || '';
        
        // Highlight properties inside the interface
        const highlightedContent = content.replace(/(\w+)(:)\s+(\w+)(\[\])?/g, 
            '<span style="color: #f8f8f2;">$1</span><span style="color: #ff79c6;">$2</span> <span style="color: #8be9fd;">$3$4</span>');
        
        return `<span style="color: #ff79c6;">${keyword}</span> <span style="color: #50fa7b;">${name}</span> <span style="color: #f8f8f2;">${openBrace}</span>${highlightedContent}<span style="color: #f8f8f2;">${closeBrace}</span>`;
    }
    
    formatFunction(text) {
        // Format function syntax
        const functionPattern = /(function)\s+(\w+)\(\)(:)\s+(\w+)(<.*>)?/;
        const matches = text.match(functionPattern);
        
        if (!matches) return text;
        
        const keyword = matches[1];
        const name = matches[2];
        const colon = matches[3];
        const returnType = matches[4];
        const generic = matches[5] || '';
        
        let highlightedGeneric = generic;
        if (generic) {
            highlightedGeneric = generic
                .replace('<', '<span style="color: #ff79c6;">&lt;</span><span style="color: #8be9fd;">')
                .replace('>', '</span><span style="color: #ff79c6;">&gt;</span>');
        }
        
        return `<span style="color: #ff79c6;">${keyword}</span> <span style="color: #50fa7b;">${name}</span>()<span style="color: #ff79c6;">${colon}</span> <span style="color: #8be9fd;">${returnType}</span>${highlightedGeneric}`;
    }
    
    formatTypeAnnotation(text) {
        // Format type annotation like Ahmad: Developer
        const parts = text.split(':');
        if (parts.length < 2) return text;
        
        const name = parts[0].trim();
        const type = parts[1].trim();
        
        return `<span style="color: #f8f8f2;">${name}</span><span style="color: #ff79c6;">:</span> <span style="color: #8be9fd;">${type}</span>`;
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize TypeWriter
    const typewriter = document.getElementById('typewriter');
    if (typewriter) {
        // Create different variations of the name with varying type annotations for a TypeScript feel
        const nameVariations = [
            'Ahmad Muhsi',
            'Ahmad: Developer',
            'Ahmad<T extends Dev>',
            'interface Ahmad { skills: string[] }',
            'function Ahmad(): Muhsi<T>',
            'Ahmad Muhsi'
        ];
        
        new TypeWriter(typewriter, nameVariations, 2000);
    } else {
        console.error('Typewriter element not found!');
    }

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Sticky Navigation
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('sticky', window.scrollY > 0);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple form validation
            if (name && email && subject && message) {
                // In a real project, this would send data to a server
                // For this demo, we'll just show a success message
                
                // Clear form fields
                contactForm.reset();
                
                // Show success message (you'd add this element to the HTML)
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.innerHTML = 'Thank you for your message! I will get back to you soon.';
                
                // Insert success message after the form
                contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
                
                // Remove success message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);
            }
        });
    }

    // Add animation class to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };
    
    // Call once on load
    animateOnScroll();
    
    // Call on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Projects filter - for future enhancement
    // This section can be uncommented and used if you decide to add filter buttons to the projects section
    /*
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class on clicked button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Get filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (!card.classList.contains(filterValue)) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
                }
            });
        });
    });
    */
}); 