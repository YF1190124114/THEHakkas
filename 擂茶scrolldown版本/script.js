// Lei Cha Heritage Story - Interactive Storytelling Script
class HeritageStory {
    constructor() {
        this.currentSection = 'title';
        this.sections = ['title', 'flavor1', 'flavor2', 'flavor3', 'flavor4', 'flavor5', 'ending'];
        this.isScrolling = false;
        this.memories = [];
        this.audioContext = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
        this.setupAudioControls();
        this.setupInteractiveElements();
        this.loadStoredMemories();
        this.hideLoadingScreen();
    }
    
    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('hidden');
            
            // Show navigation after loading
            setTimeout(() => {
                document.getElementById('navigation').classList.remove('nav-hidden');
            }, 500);
        }, 2000);
    }
    
    setupEventListeners() {
        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const targetSection = e.target.dataset.section;
                this.navigateToSection(targetSection);
            });
        });
        
        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                this.navigateToSection('flavor1');
            });
        }
        
        // Memory form
        const memoryForm = document.getElementById('memory-form');
        if (memoryForm) {
            memoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleMemorySubmission(e);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                this.navigateNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigatePrevious();
            }
        });
        
        // Wheel navigation
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (this.isScrolling) return;
            
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.navigateNext();
                } else {
                    this.navigatePrevious();
                }
            }, 150);
        }, { passive: true });
    }
    
    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateCurrentSection(sectionId);
                    this.triggerSectionAnimations(entry.target);
                    this.playAmbientAudio(entry.target);
                }
            });
        }, options);
        
        document.querySelectorAll('.section').forEach(section => {
            observer.observe(section);
        });
    }
    
    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax-layer');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    setupAudioControls() {
        const audioToggle = document.getElementById('audio-toggle');
        const ambientAudio = document.getElementById('ambient-audio');
        
        let isAudioEnabled = false;
        
        audioToggle.addEventListener('click', () => {
            if (isAudioEnabled) {
                ambientAudio.pause();
                audioToggle.textContent = '🔇';
                isAudioEnabled = false;
            } else {
                ambientAudio.play().catch(e => console.log('Audio play failed:', e));
                audioToggle.textContent = '🔊';
                isAudioEnabled = true;
            }
        });
    }
    
    setupInteractiveElements() {
        // Route points in migration map
        const routePoints = document.querySelectorAll('.route-point');
        routePoints.forEach(point => {
            point.addEventListener('click', () => {
                this.animateRouteConnection(point);
            });
        });
        
        // Voice clips for dialects
        const voiceClips = document.querySelectorAll('.voice-clip');
        voiceClips.forEach(clip => {
            clip.addEventListener('click', () => {
                this.playVoiceClip(clip.dataset.audio);
                this.highlightDialect(clip);
            });
        });
        
        // Narration triggers
        const narrationTriggers = document.querySelectorAll('.narration-trigger');
        narrationTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.playNarration(trigger.dataset.narration);
            });
        });
        
        // Worker gravestones
        const gravestones = document.querySelectorAll('.worker-gravestone');
        gravestones.forEach(gravestone => {
            gravestone.addEventListener('mouseenter', () => {
                this.showWorkerInfo(gravestone);
            });
            
            gravestone.addEventListener('mouseleave', () => {
                this.hideWorkerInfo(gravestone);
            });
        });
        
        // Memory leaves
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('memory-leaf')) {
                this.showMemoryDetails(e.target);
            }
        });
    }
    
    navigateToSection(sectionId) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const targetSection = document.getElementById(sectionId);
        
        if (targetSection) {
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update navigation
            this.updateNavigation(sectionId);
            
            setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        }
    }
    
    navigateNext() {
        const currentIndex = this.sections.indexOf(this.currentSection);
        if (currentIndex < this.sections.length - 1) {
            const nextSection = this.sections[currentIndex + 1];
            this.navigateToSection(nextSection);
        }
    }
    
    navigatePrevious() {
        const currentIndex = this.sections.indexOf(this.currentSection);
        if (currentIndex > 0) {
            const prevSection = this.sections[currentIndex - 1];
            this.navigateToSection(prevSection);
        }
    }
    
    updateCurrentSection(sectionId) {
        this.currentSection = sectionId;
        this.updateNavigation(sectionId);
    }
    
    updateNavigation(sectionId) {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionId) {
                item.classList.add('active');
            }
        });
    }
    
    triggerSectionAnimations(section) {
        // Add active class to trigger CSS animations
        section.classList.add('active');
        
        // Specific animations for different sections
        const sectionId = section.id;
        
        switch (sectionId) {
            case 'title':
                this.animateTitleSection(section);
                break;
            case 'flavor1':
                this.animateMigrationMap(section);
                break;
            case 'flavor2':
                this.animateShipJourney(section);
                break;
            case 'flavor3':
                this.animateDialectOverlay(section);
                break;
            case 'flavor4':
                this.animateWalkingFigures(section);
                break;
            case 'flavor5':
                this.animateYouthReflection(section);
                break;
            case 'ending':
                this.animateFamilyTree(section);
                break;
        }
    }
    
    animateTitleSection(section) {
        const bowl = section.querySelector('.porcelain-bowl');
        const steam = section.querySelector('.steam-effect');
        
        if (bowl) {
            setTimeout(() => {
                bowl.style.animation = 'liftBowl 3s ease-out';
            }, 500);
        }
        
        if (steam) {
            setTimeout(() => {
                steam.style.animation = 'steam 2s ease-in-out infinite';
            }, 1000);
        }
    }
    
    animateMigrationMap(section) {
        const routePoints = section.querySelectorAll('.route-point');
        
        routePoints.forEach((point, index) => {
            setTimeout(() => {
                point.style.animation = 'pulse 1s ease-in-out';
                point.style.animationDelay = `${index * 0.5}s`;
            }, index * 500);
        });
        
        // Animate ancestor names
        const ancestorNames = section.querySelector('.ancestor-names');
        if (ancestorNames) {
            setTimeout(() => {
                ancestorNames.style.animation = 'scrollNames 10s linear infinite';
            }, 2000);
        }
    }
    
    animateShipJourney(section) {
        const ship = section.querySelector('.ship-silhouette');
        if (ship) {
            ship.style.animation = 'sailAcross 5s ease-in-out';
        }
        
        // Animate letter unfolding
        const letter = section.querySelector('.old-letter');
        if (letter) {
            setTimeout(() => {
                letter.style.transform = 'rotateY(0deg)';
                letter.style.opacity = '1';
            }, 1500);
        }
    }
    
    animateDialectOverlay(section) {
        const insideTulou = section.querySelector('.inside-tulou');
        const outsideMarket = section.querySelector('.outside-market');
        
        if (insideTulou && outsideMarket) {
            setTimeout(() => {
                insideTulou.style.opacity = '1';
                insideTulou.style.transform = 'translateX(0)';
            }, 500);
            
            setTimeout(() => {
                outsideMarket.style.opacity = '1';
                outsideMarket.style.transform = 'translateX(0)';
            }, 1000);
        }
    }
    
    animateWalkingFigures(section) {
        const figures = section.querySelectorAll('.grandparent-silhouette');
        figures.forEach(figure => {
            figure.style.animation = 'walk 4s ease-in-out infinite';
        });
    }
    
    animateYouthReflection(section) {
        const fire = section.querySelector('.fire-animation');
        const grinding = section.querySelector('.grinding-animation');
        
        if (fire) {
            fire.style.animation = 'flicker 2s ease-in-out infinite';
        }
        
        if (grinding) {
            grinding.style.animation = 'grind 3s linear infinite';
        }
    }
    
    animateFamilyTree(section) {
        const leaves = section.querySelectorAll('.memory-leaf');
        leaves.forEach((leaf, index) => {
            setTimeout(() => {
                leaf.style.opacity = '1';
                leaf.style.transform = 'scale(1)';
            }, index * 300);
        });
        
        // Animate tea bowl ripples
        const ripple = section.querySelector('.ripple-effect');
        if (ripple) {
            ripple.style.animation = 'ripple 3s ease-out infinite';
        }
    }
    
    playAmbientAudio(section) {
        const sectionAudio = section.querySelector('.section-audio');
        if (sectionAudio) {
            // Fade out current audio and fade in new audio
            sectionAudio.volume = 0;
            sectionAudio.play().catch(e => console.log('Section audio play failed:', e));
            
            // Fade in
            let volume = 0;
            const fadeIn = setInterval(() => {
                if (volume < 0.3) {
                    volume += 0.05;
                    sectionAudio.volume = volume;
                } else {
                    clearInterval(fadeIn);
                }
            }, 100);
        }
    }
    
    animateRouteConnection(clickedPoint) {
        // Create animated line connecting route points
        const allPoints = document.querySelectorAll('.route-point');
        const clickedIndex = Array.from(allPoints).indexOf(clickedPoint);
        
        // Highlight the route up to clicked point
        allPoints.forEach((point, index) => {
            if (index <= clickedIndex) {
                point.style.background = 'var(--earth-yellow)';
                point.style.transform = 'scale(1.2)';
            } else {
                point.style.background = 'var(--vermilion-red)';
                point.style.transform = 'scale(1)';
            }
        });
        
        // Show location info
        const locationInfo = clickedPoint.querySelector('.location-info');
        if (locationInfo) {
            locationInfo.style.opacity = '1';
            setTimeout(() => {
                locationInfo.style.opacity = '0';
            }, 3000);
        }
    }
    
    playVoiceClip(audioId) {
        // Simulate playing voice clip (placeholder)
        console.log(`Playing voice clip: ${audioId}`);
        
        // In a real implementation, you would:
        // const audio = new Audio(`audio/${audioId}.mp3`);
        // audio.play();
    }
    
    highlightDialect(clickedClip) {
        // Remove highlight from all clips
        document.querySelectorAll('.voice-clip').forEach(clip => {
            clip.classList.remove('active');
        });
        
        // Highlight clicked clip
        clickedClip.classList.add('active');
        
        // Add visual feedback
        clickedClip.style.background = 'var(--earth-yellow)';
        clickedClip.style.color = 'var(--ink-black)';
        
        setTimeout(() => {
            clickedClip.style.background = 'transparent';
            clickedClip.style.color = 'var(--rice-paper)';
        }, 2000);
    }
    
    playNarration(narrationId) {
        console.log(`Playing narration: ${narrationId}`);
        
        // Show narration text
        const narrationText = document.querySelector('.narration-text');
        if (narrationText) {
            narrationText.style.opacity = '1';
            narrationText.style.transform = 'translateY(0)';
        }
    }
    
    showWorkerInfo(gravestone) {
        const workerInfo = gravestone.querySelector('.worker-info');
        if (workerInfo) {
            workerInfo.style.opacity = '1';
            workerInfo.style.transform = 'translateY(-10px)';
        }
    }
    
    hideWorkerInfo(gravestone) {
        const workerInfo = gravestone.querySelector('.worker-info');
        if (workerInfo) {
            workerInfo.style.opacity = '0';
            workerInfo.style.transform = 'translateY(0)';
        }
    }
    
    handleMemorySubmission(event) {
        const formData = new FormData(event.target);
        const memory = {
            id: Date.now(),
            title: formData.get('title'),
            story: formData.get('story'),
            location: formData.get('location'),
            timestamp: new Date().toISOString()
        };
        
        // Handle image upload (placeholder)
        const imageFile = formData.get('image');
        if (imageFile && imageFile.size > 0) {
            // In a real implementation, you would upload the image
            memory.hasImage = true;
        }
        
        this.addMemoryToTree(memory);
        this.saveMemory(memory);
        
        // Reset form
        event.target.reset();
        
        // Show success message
        this.showSuccessMessage('记忆已添加到家族树中！');
    }
    
    addMemoryToTree(memory) {
        const treeBranches = document.querySelector('.tree-branches');
        const leaf = document.createElement('div');
        leaf.className = 'memory-leaf';
        leaf.dataset.memoryId = memory.id;
        
        // Random position for the leaf
        const randomTop = Math.random() * 60 + 20; // 20% to 80%
        const randomLeft = Math.random() * 80 + 10; // 10% to 90%
        
        leaf.style.top = `${randomTop}%`;
        leaf.style.left = `${randomLeft}%`;
        leaf.innerHTML = `<span class="leaf-title">${memory.title}</span>`;
        
        // Add click handler
        leaf.addEventListener('click', () => {
            this.showMemoryDetails(leaf);
        });
        
        treeBranches.appendChild(leaf);
        
        // Animate leaf appearance
        setTimeout(() => {
            leaf.style.opacity = '1';
            leaf.style.transform = 'scale(1)';
        }, 100);
        
        // Create ripple effect in tea bowl
        this.createTeaBowlRipple();
    }
    
    createTeaBowlRipple() {
        const teaSurface = document.querySelector('.tea-surface');
        if (teaSurface) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            teaSurface.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 3000);
        }
    }
    
    showMemoryDetails(leaf) {
        const memoryId = leaf.dataset.memoryId;
        const memory = this.memories.find(m => m.id == memoryId);
        
        if (memory) {
            // Create modal or popup to show memory details
            const modal = document.createElement('div');
            modal.className = 'memory-modal';
            modal.innerHTML = `
                <div class="memory-modal-content">
                    <button class="close-modal">&times;</button>
                    <h3>${memory.title}</h3>
                    <p><strong>地点:</strong> ${memory.location || '未指定'}</p>
                    <p><strong>时间:</strong> ${new Date(memory.timestamp).toLocaleDateString('zh-CN')}</p>
                    <div class="memory-story">
                        <p>${memory.story}</p>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Close modal handlers
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.remove();
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            });
            
            // Animate modal appearance
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
        }
    }
    
    saveMemory(memory) {
        this.memories.push(memory);
        localStorage.setItem('heritageMemories', JSON.stringify(this.memories));
    }
    
    loadStoredMemories() {
        const stored = localStorage.getItem('heritageMemories');
        if (stored) {
            this.memories = JSON.parse(stored);
            this.memories.forEach(memory => {
                this.addMemoryToTree(memory);
            });
        }
    }
    
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--earth-yellow);
            color: var(--ink-black);
            padding: 1rem 2rem;
            border-radius: 5px;
            font-weight: bold;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            setTimeout(() => {
                successDiv.remove();
            }, 300);
        }, 3000);
    }
}

// Additional CSS for modal and success message
const additionalStyles = `
.memory-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.memory-modal-content {
    background: var(--ink-black);
    border: 2px solid var(--earth-yellow);
    border-radius: 10px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    position: relative;
    color: var(--rice-paper);
}

.close-modal {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: var(--earth-yellow);
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
}

.close-modal:hover {
    color: var(--vermilion-red);
}

.memory-story {
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(168, 165, 160, 0.1);
    border-radius: 5px;
    border-left: 4px solid var(--earth-yellow);
}

/* Additional animations */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

@keyframes sailAcross {
    0% { transform: translateX(-100px) scale(0.8); opacity: 0; }
    50% { transform: translateX(0) scale(1); opacity: 1; }
    100% { transform: translateX(100px) scale(0.8); opacity: 0; }
}

@keyframes flicker {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    25% { opacity: 1; transform: scale(1.05); }
    50% { opacity: 0.9; transform: scale(0.95); }
    75% { opacity: 1; transform: scale(1.02); }
}

.fade-in-slow {
    animation: fadeInSlow 3s ease-out;
}

@keyframes fadeInSlow {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
}

/* Voice clip active state */
.voice-clip.active {
    background: var(--earth-yellow) !important;
    color: var(--ink-black) !important;
    border-color: var(--earth-yellow) !important;
}

/* Narration text animation */
.narration-text {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
}

.narration-text.active {
    opacity: 1;
    transform: translateY(0);
}

/* Worker info tooltip */
.worker-info {
    position: absolute;
    top: -80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.9);
    color: var(--rice-paper);
    padding: 0.5rem;
    border-radius: 5px;
    font-size: 0.8rem;
    white-space: nowrap;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none;
    z-index: 100;
}

.worker-info::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
}

/* Memory leaf initial state */
.memory-leaf {
    opacity: 0;
    transform: scale(0);
    transition: all 0.3s ease;
}

/* Tea bowl ripple variations */
.ripple-effect:nth-child(2) {
    animation-delay: 1s;
}

.ripple-effect:nth-child(3) {
    animation-delay: 2s;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the heritage story when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeritageStory();
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeritageStory;
}