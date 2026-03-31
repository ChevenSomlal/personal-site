/* ============================================
   DBZ Fighting Game Engine v2
   Enhanced with animated sprites & effects
   ============================================ */

const game = {
    // Game State
    currentChapter: 0,
    powerLevel: 9000,
    energy: 100,
    rank: 'Academy Trainee',
    battlesWon: 0,
    fightGame: null,
    
    // Story Chapters
    chapters: [
        {
            number: 1,
            title: "The Academy Days",
            icon: "🎓",
            narration: "Our hero begins at the Allan Gray Academy, where young warriors learn the fundamentals of code. Fresh from university with Summa Cum Laude honors, Cheven enters the training grounds ready to prove their worth!",
            stats: { powerLevel: 9000, rank: "Academy Trainee", location: "Cape Town" },
            enemy: { name: "Final Project Boss", avatar: "📚", health: 100, attack: "Deadline Pressure", speed: 0.5, color: '#8B4513' },
            specialMove: "All-Nighter Combo",
            victoryText: "Victory! The academy is conquered!",
            powerGain: 6000,
            nextRank: "Junior Developer"
        },
        {
            number: 2,
            title: "First Mission - De Beers",
            icon: "💎",
            narration: "The first real battle begins! Entelect assigns our hero to the legendary De Beers mission. A customer-facing portal must be built, and an internal sales planning system for the diamond industry awaits!",
            stats: { powerLevel: 15000, rank: "Junior Developer", location: "Johannesburg" },
            enemy: { name: "Legacy System", avatar: "👾", health: 120, attack: "Spaghetti Code", speed: 0.6, color: '#4B0082' },
            specialMove: "Diamond Cut Technique",
            victoryText: "The diamond system shines bright!",
            powerGain: 8000,
            nextRank: "Intermediate Warrior"
        },
        {
            number: 3,
            title: "The TransUnion Saga",
            icon: "📊",
            narration: "A new challenge emerges! The ancient Delphi system has guarded its secrets for decades. Our hero must rewrite this legacy using modern jutsu and migrate it to the cloud!",
            stats: { powerLevel: 23000, rank: "Intermediate Warrior", location: "Remote" },
            enemy: { name: "Delphi Guardian", avatar: "👹", health: 140, attack: "COBOL Curse", speed: 0.7, color: '#8B0000' },
            specialMove: "Cloud Migration Beam",
            victoryText: "The cloud welcomes another soul!",
            powerGain: 10000,
            nextRank: "Senior Developer"
        },
        {
            number: 4,
            title: "Assupol Transformation",
            icon: "🔄",
            narration: "The .NET Framework monolith stands tall! Our hero must perform the forbidden technique - migrating critical functionalities to standalone .NET 6 while enhancing the front-end!",
            stats: { powerLevel: 33000, rank: "Senior Developer", location: "Cape Town" },
            enemy: { name: "Monolith Beast", avatar: "🏛️", health: 160, attack: "Tight Coupling", speed: 0.75, color: '#2F4F4F' },
            specialMove: "Microservices Storm",
            victoryText: "The monolith crumbles!",
            powerGain: 12000,
            nextRank: "Elite Jonin"
        },
        {
            number: 5,
            title: "Capitec Ascension",
            icon: "🏦",
            narration: "The ultimate test! Capitec Bank calls for a Software Engineer III. Full-stack development missions await. Our hero must defend the village's digital infrastructure!",
            stats: { powerLevel: 45000, rank: "Elite Jonin", location: "Cape Town" },
            enemy: { name: "Banking System Dragon", avatar: "🐲", health: 200, attack: "Transaction Storm", speed: 0.85, color: '#006400' },
            specialMove: "Kafka Stream Kamehameha",
            victoryText: "The bank's systems stand strong!",
            powerGain: 15000,
            nextRank: "Super Saiyan"
        }
    ],
    
    // DOM Elements
    screens: {
        start: document.getElementById('startScreen'),
        story: document.getElementById('storyScreen'),
        levelUp: document.getElementById('levelUpScreen'),
        victory: document.getElementById('victoryScreen')
    },
    
    // Initialize Game
    init() {
        this.updatePowerDisplay();
        this.setupEventListeners();
    },
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (this.fightGame && this.fightGame.active) {
                this.fightGame.handleKeyDown(e);
            } else if (e.code === 'Space' || e.code === 'Enter') {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen.id === 'storyScreen' && !document.getElementById('fightingArena').style.display) {
                    this.nextStep();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.fightGame && this.fightGame.active) {
                this.fightGame.handleKeyUp(e);
            }
        });
        
        // Mobile controls
        document.querySelectorAll('.dpad-btn, .action-btn').forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.fightGame && this.fightGame.active) {
                    this.fightGame.handleKeyDown({ 
                        key: btn.dataset.key,
                        preventDefault: () => {}
                    });
                }
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (this.fightGame && this.fightGame.active) {
                    this.fightGame.handleKeyUp({ key: btn.dataset.key });
                }
            });
        });
    },
    
    // Start Adventure
    startAdventure() {
        this.switchScreen('story');
        document.getElementById('navbar').style.display = 'block';
        this.loadChapter(0);
    },
    
    // Load Chapter
    loadChapter(index) {
        if (index >= this.chapters.length) {
            this.showVictory();
            return;
        }
        
        this.currentChapter = index;
        const chapter = this.chapters[index];
        
        // Update UI
        document.getElementById('chapterNumber').textContent = `Chapter ${chapter.number}`;
        document.getElementById('chapterTitle').textContent = chapter.title;
        document.getElementById('storyImage').innerHTML = `<div class="scene-icon">${chapter.icon}</div>`;
        document.getElementById('storyNarration').textContent = chapter.narration;
        document.getElementById('enemyNameDisplay').textContent = chapter.enemy.name;
        
        // Update nav
        document.getElementById('navChapter').textContent = `Chapter ${chapter.number}`;
        
        // Show stats
        this.renderStats(chapter.stats);
        
        // Setup action button
        this.setAction('start-fight', 'ENTER ARENA', '⚔️');
    },
    
    renderStats(stats) {
        const statsContainer = document.getElementById('storyStats');
        statsContainer.innerHTML = `
            <div class="stat-box">
                <span class="stat-box-label">Power Level</span>
                <span class="stat-box-value">${stats.powerLevel.toLocaleString()}</span>
            </div>
            <div class="stat-box">
                <span class="stat-box-label">Rank</span>
                <span class="stat-box-value">${stats.rank}</span>
            </div>
            <div class="stat-box">
                <span class="stat-box-label">Location</span>
                <span class="stat-box-value">${stats.location}</span>
            </div>
        `;
    },
    
    setAction(action, text, icon) {
        const btn = document.getElementById('actionButton');
        btn.onclick = () => this.handleAction(action);
        btn.innerHTML = `<span class="btn-text">${text}</span><span class="btn-icon">${icon}</span>`;
    },
    
    handleAction(action) {
        switch(action) {
            case 'start-fight':
                this.startFight();
                break;
            case 'next-chapter':
                this.nextChapter();
                break;
        }
    },
    
    // Fighting Game System
    startFight() {
        console.log('startFight called');
        const arena = document.getElementById('fightingArena');
        const actionBtn = document.getElementById('actionButton');
        
        if (arena) {
            console.log('Arena found, showing');
            arena.style.display = 'block';
        } else {
            console.error('Arena not found!');
            return;
        }
        if (actionBtn) actionBtn.style.display = 'none';
        
        // Hide the story content section
        const storySection = document.querySelector('.story-content');
        if (storySection) storySection.style.display = 'none';
        
        const chapter = this.chapters[this.currentChapter];
        console.log('Starting fight with chapter:', chapter.title);
        this.fightGame = new FightingGame(chapter, () => this.onFightVictory(), () => this.onFightDefeat());
    },
    
    onFightVictory() {
        const chapter = this.chapters[this.currentChapter];
        this.battlesWon++;
        this.powerLevel += chapter.powerGain;
        this.rank = chapter.nextRank;
        this.updatePowerDisplay();
        
        setTimeout(() => {
            document.getElementById('fightingArena').style.display = 'none';
            this.showLevelUp();
        }, 1500);
    },
    
    onFightDefeat() {
        // Plot armor - auto revive with low health
        if (this.fightGame) {
            this.fightGame.player.health = 20;
            this.fightGame.player.ki = 50;
            this.fightGame.showDamageText('PLOT ARMOR ACTIVATED!', 'orange');
        }
    },
    
    // Level Up
    showLevelUp() {
        const chapter = this.chapters[this.currentChapter];
        
        document.getElementById('levelUpText').textContent = chapter.victoryText;
        document.getElementById('newRank').textContent = this.rank;
        document.getElementById('newPowerLevel').textContent = this.powerLevel.toLocaleString();
        
        this.switchScreen('levelUp');
    },
    
    continueAdventure() {
        this.switchScreen('story');
        const arena = document.getElementById('fightingArena');
        const actionBtn = document.getElementById('actionButton');
        const storySection = document.querySelector('.story-content');
        
        if (arena) arena.style.display = 'none';
        if (actionBtn) actionBtn.style.display = 'inline-flex';
        if (storySection) storySection.style.display = 'block';
        
        this.loadChapter(this.currentChapter + 1);
    },
    
    nextChapter() {
        this.loadChapter(this.currentChapter + 1);
    },
    
    // Victory
    showVictory() {
        document.getElementById('finalPowerLevel').textContent = this.powerLevel.toLocaleString();
        document.getElementById('battlesWon').textContent = this.battlesWon;
        document.getElementById('navbar').style.display = 'none';
        this.switchScreen('victory');
    },
    
    restart() {
        this.currentChapter = 0;
        this.powerLevel = 9000;
        this.energy = 100;
        this.rank = 'Academy Trainee';
        this.battlesWon = 0;
        this.updatePowerDisplay();
        this.startAdventure();
    },
    
    // Utilities
    switchScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
    },
    
    updatePowerDisplay() {
        document.getElementById('powerLevel').textContent = this.powerLevel.toLocaleString();
        document.getElementById('rankBadge').textContent = this.rank;
        document.getElementById('navPower').textContent = `PL: ${this.powerLevel.toLocaleString()}`;
        
        // Update energy bar
        const energyPercent = (this.energy / 100) * 100;
        document.getElementById('energyFill').style.width = `${energyPercent}%`;
    },
    
    showHome() {
        console.log('Home clicked');
    },
    
    closeOverlay() {
        document.getElementById('contactOverlay').style.display = 'none';
    }
};

/* ============================================
   Enhanced Fighting Game Engine
   With DBZ-style sprites and effects
   ============================================ */

class FightingGame {
    constructor(chapter, onVictory, onDefeat) {
        console.log('FightingGame constructor called');
        this.canvas = document.getElementById('fightCanvas');
        if (!this.canvas) {
            console.error('Fight canvas not found!');
            this.active = false;
            return;
        }
        try {
            this.ctx = this.canvas.getContext('2d');
        } catch(e) {
            console.error('Failed to get canvas context:', e);
            this.active = false;
            return;
        }
        this.chapter = chapter;
        this.onVictory = onVictory;
        this.onDefeat = onDefeat;
        
        // Game state
        this.active = true;
        this.timeLeft = 60;
        this.lastTime = 0;
        
        console.log('FightingGame initialized for chapter:', chapter.title);
        console.log('Canvas:', this.canvas.width, 'x', this.canvas.height);
        
        // Player - Goku-style warrior
        this.player = {
            x: 100,
            y: 300,
            width: 60,
            height: 100,
            vx: 0,
            vy: 0,
            speed: 6,
            jumpPower: -18,
            health: 100,
            maxHealth: 100,
            ki: 100,
            maxKi: 100,
            isGrounded: false,
            isAttacking: false,
            isBlocking: false,
            isCharging: false,
            attackType: null,
            attackCooldown: 0,
            combo: 0,
            direction: 1,
            frame: 0,
            frameTimer: 0,
            auraIntensity: 0,
            transform: 'base', // base, super
            hairColor: '#000000',
            skinColor: '#FFDAB9',
            giColor: '#FF6600',
            beltColor: '#0066CC'
        };
        
        // Enemy AI
        this.enemy = {
            x: 650,
            y: 300,
            width: 60,
            height: 100,
            vx: 0,
            vy: 0,
            speed: chapter.enemy.speed * 4,
            jumpPower: -15,
            health: chapter.enemy.health,
            maxHealth: chapter.enemy.health,
            ki: 100,
            maxKi: 100,
            isGrounded: false,
            isAttacking: false,
            isBlocking: false,
            attackType: null,
            attackCooldown: 0,
            direction: -1,
            frame: 0,
            frameTimer: 0,
            auraIntensity: 0,
            avatar: chapter.enemy.avatar,
            aiTimer: 0,
            aiState: 'idle',
            color: chapter.enemy.color || '#8B0000'
        };
        
        // Effects
        this.projectiles = [];
        this.particles = [];
        this.hitEffects = [];
        this.damageTexts = [];
        this.auraParticles = [];
        this.speedLines = [];
        this.impactFlashes = [];
        
        // Input state
        this.keys = {};
        
        // Ground level
        this.groundY = 380;
        
        // Start game loop
        this.init();
    }
    
    init() {
        console.log('FightingGame.init() called');
        
        // Wait for DOM to be ready
        setTimeout(() => {
            this.updateHealthBars();
            this.resizeCanvas();
            this.gameLoop(0);
        }, 100);
        
        // Timer countdown
        this.timerInterval = setInterval(() => {
            if (!this.active) return;
            this.timeLeft--;
            const timerEl = document.getElementById('timerDisplay');
            if (timerEl) timerEl.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame('timeout');
            }
        }, 1000);
        
        // Spawn initial aura particles
        this.spawnAuraParticles();
    }
    
    resizeCanvas() {
        try {
            const container = this.canvas.parentElement;
            if (container) {
                const rect = container.getBoundingClientRect();
                this.canvas.width = rect.width || 800;
                this.canvas.height = 400;
                console.log('Canvas resized:', this.canvas.width, 'x', this.canvas.height);
            }
        } catch(e) {
            console.error('Error resizing canvas:', e);
        }
    }
    
    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;
        e.preventDefault();
        
        // Jump
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && this.player.isGrounded) {
            this.player.vy = this.player.jumpPower;
            this.player.isGrounded = false;
        }
        
        // Charge KI
        if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && this.player.isGrounded) {
            this.player.isCharging = true;
            this.player.auraIntensity = 1;
        }
        
        // Punch
        if ((e.key === 'z' || e.key === 'Z' || e.key === 'k' || e.key === 'K') && this.player.attackCooldown <= 0) {
            this.performAttack('punch', 10, 5);
        }
        
        // Kick
        if ((e.key === 'x' || e.key === 'X' || e.key === 'l' || e.key === 'L') && this.player.attackCooldown <= 0) {
            this.performAttack('kick', 15, 8);
        }
        
        // Block
        if ((e.key === 'c' || e.key === 'C' || e.key === 'i' || e.key === 'I')) {
            this.player.isBlocking = true;
            this.updateMoveIndicator('BLOCKING');
        }
        
        // Ki Blast
        if ((e.key === 'v' || e.key === 'V' || e.key === 'j' || e.key === 'J') && this.player.ki >= 20) {
            this.fireKiBlast();
        }
        
        // Special Move (Super Saiyan Kamehameha)
        if (e.key === ' ' && this.player.ki >= 50) {
            this.performSpecial();
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
        
        if (e.key === 'c' || e.key === 'C' || e.key === 'i' || e.key === 'I') {
            this.player.isBlocking = false;
            this.updateMoveIndicator('Ready!');
        }
        
        if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
            this.player.isCharging = false;
            this.player.auraIntensity = 0;
        }
    }
    
    performAttack(type, damage, kiCost) {
        this.player.isAttacking = true;
        this.player.attackType = type;
        this.player.attackCooldown = 30;
        this.player.ki = Math.max(0, this.player.ki - kiCost);
        
        // Create attack particles
        this.createAttackParticles(type);
        
        // Check hit
        const hit = this.checkAttackHit(type);
        if (hit) {
            this.player.combo++;
            const actualDamage = this.enemy.isBlocking ? damage * 0.2 : damage;
            const multiplier = 1 + (this.player.combo * 0.1);
            const finalDamage = Math.floor(actualDamage * multiplier);
            this.enemy.health = Math.max(0, this.enemy.health - finalDamage);
            this.showDamageText(`${finalDamage}`, 'red');
            this.createHitEffect(this.enemy.x, this.enemy.y);
            this.createImpactFlash(this.enemy.x, this.enemy.y);
            this.updateComboDisplay();
            
            // Knockback
            this.enemy.x += this.player.direction * 20;
            
            if (this.enemy.health <= 0) {
                this.endGame('victory');
            }
        }
        
        setTimeout(() => {
            this.player.isAttacking = false;
            this.player.attackType = null;
        }, 200);
        
        this.updateHealthBars();
    }
    
    performSpecial() {
        this.player.ki -= 50;
        this.player.isAttacking = true;
        this.player.attackType = 'special';
        this.player.transform = 'super';
        this.player.hairColor = '#FFD700'; // Super Saiyan gold
        this.player.auraIntensity = 2;
        
        // Create massive energy burst
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: this.player.x + this.player.width / 2,
                y: this.player.y + this.player.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
                radius: Math.random() * 8 + 4,
                color: '#FFD700',
                life: 60,
                alpha: 1
            });
        }
        
        // Create Kamehameha beam
        this.projectiles.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
            vx: 20,
            vy: 0,
            width: 100,
            height: 50,
            damage: 50,
            isPlayer: true,
            color: '#00BFFF',
            type: 'beam'
        });
        
        this.showDamageText(this.chapter.specialMove, 'gold');
        
        setTimeout(() => {
            this.player.isAttacking = false;
            this.player.attackType = null;
            this.player.transform = 'base';
            this.player.hairColor = '#000000';
            this.player.auraIntensity = 0;
        }, 1000);
        
        this.updateHealthBars();
    }
    
    fireKiBlast() {
        this.player.ki -= 20;
        
        // Create charging particles
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.player.x + this.player.width,
                y: this.player.y + this.player.height / 2,
                vx: Math.random() * 5 + 5,
                vy: (Math.random() - 0.5) * 3,
                radius: Math.random() * 4 + 2,
                color: '#00D4FF',
                life: 30,
                alpha: 1
            });
        }
        
        this.projectiles.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
            vx: 15,
            vy: 0,
            width: 40,
            height: 20,
            damage: 15,
            isPlayer: true,
            color: '#00D4FF',
            type: 'blast'
        });
        
        this.updateHealthBars();
    }
    
    createAttackParticles(type) {
        const count = type === 'kick' ? 15 : 10;
        const color = type === 'kick' ? '#FF4500' : '#FF6347';
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: this.player.x + (this.player.direction === 1 ? this.player.width : 0),
                y: this.player.y + Math.random() * this.player.height,
                vx: this.player.direction * (Math.random() * 8 + 4),
                vy: (Math.random() - 0.5) * 6,
                radius: Math.random() * 4 + 2,
                color: color,
                life: 20,
                alpha: 1
            });
        }
    }
    
    checkAttackHit(type) {
        const range = type === 'kick' ? 80 : 60;
        const hitX = this.player.direction === 1 ? 
            this.player.x + this.player.width : 
            this.player.x - range;
        
        return hitX < this.enemy.x + this.enemy.width &&
               hitX + range > this.enemy.x &&
               this.player.y < this.enemy.y + this.enemy.height &&
               this.player.y + this.player.height > this.enemy.y;
    }
    
    createHitEffect(x, y) {
        this.hitEffects.push({
            x: x,
            y: y,
            radius: 10,
            maxRadius: 60,
            alpha: 1,
            color: '#FFD700'
        });
        
        // Add spark particles
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 12,
                vy: (Math.random() - 0.5) * 12,
                radius: Math.random() * 4 + 2,
                color: '#FFFF00',
                life: 25,
                alpha: 1
            });
        }
    }
    
    createImpactFlash(x, y) {
        this.impactFlashes.push({
            x: x,
            y: y,
            radius: 80,
            alpha: 0.8,
            life: 10
        });
    }
    
    spawnAuraParticles() {
        // Continuously spawn aura particles
        if (this.active) {
            // Player aura
            if (this.player.auraIntensity > 0 || this.player.isCharging) {
                for (let i = 0; i < 3; i++) {
                    this.auraParticles.push({
                        x: this.player.x + Math.random() * this.player.width,
                        y: this.player.y + Math.random() * this.player.height,
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 5 - 3,
                        radius: Math.random() * 5 + 3,
                        color: this.player.transform === 'super' ? '#FFD700' : '#00BFFF',
                        life: 40,
                        alpha: 0.8
                    });
                }
            }
            
            // Enemy aura
            if (this.enemy.health < this.enemy.maxHealth * 0.5) {
                for (let i = 0; i < 2; i++) {
                    this.auraParticles.push({
                        x: this.enemy.x + Math.random() * this.enemy.width,
                        y: this.enemy.y + Math.random() * this.enemy.height,
                        vx: (Math.random() - 0.5) * 2,
                        vy: -Math.random() * 5 - 3,
                        radius: Math.random() * 5 + 3,
                        color: '#FF4500',
                        life: 40,
                        alpha: 0.8
                    });
                }
            }
            
            setTimeout(() => this.spawnAuraParticles(), 50);
        }
    }
    
    showDamageText(text, color) {
        this.damageTexts.push({
            text: text,
            x: this.enemy.x,
            y: this.enemy.y - 50,
            alpha: 1,
            color: color,
            vy: -3,
            scale: 1.5
        });
    }
    
    updateComboDisplay() {
        document.getElementById('comboDisplay').textContent = `COMBO: ${this.player.combo}`;
    }
    
    updateMoveIndicator(text) {
        document.getElementById('moveIndicator').textContent = text;
    }
    
    updateHealthBars() {
        const playerHealthPercent = (this.player.health / this.player.maxHealth) * 100;
        const enemyHealthPercent = (this.enemy.health / this.enemy.maxHealth) * 100;
        const playerKiPercent = (this.player.ki / this.player.maxKi) * 100;
        const enemyKiPercent = (this.enemy.ki / this.enemy.maxKi) * 100;
        
        const playerHealthBar = document.getElementById('playerHealthBar');
        const enemyHealthBar = document.getElementById('enemyHealthBar');
        const playerKiBar = document.getElementById('playerKiBar');
        const enemyKiBar = document.getElementById('enemyKiBar');
        
        if (playerHealthBar) playerHealthBar.style.width = `${playerHealthPercent}%`;
        if (enemyHealthBar) enemyHealthBar.style.width = `${enemyHealthPercent}%`;
        if (playerKiBar) playerKiBar.style.width = `${playerKiPercent}%`;
        if (enemyKiBar) enemyKiBar.style.width = `${enemyKiPercent}%`;
    }
    
    // AI Logic
    updateAI(deltaTime) {
        this.enemy.aiTimer += deltaTime;
        
        const distance = Math.abs(this.enemy.x - this.player.x);
        
        if (this.enemy.aiTimer > 500) {
            this.enemy.aiTimer = 0;
            
            const rand = Math.random();
            
            if (distance > 200) {
                this.enemy.vx = this.enemy.direction * this.enemy.speed;
            } else if (rand < 0.3) {
                if (this.enemy.attackCooldown <= 0 && this.enemy.ki >= 5) {
                    this.enemy.isAttacking = true;
                    this.enemy.attackType = 'punch';
                    this.enemy.attackCooldown = 40;
                    this.enemy.ki -= 5;
                    
                    if (this.checkEnemyHit()) {
                        const damage = this.player.isBlocking ? 3 : 8;
                        this.player.health = Math.max(0, this.player.health - damage);
                        this.showDamageText(`${damage}`, 'orange');
                        this.player.combo = 0;
                        this.updateComboDisplay();
                        this.createHitEffect(this.player.x, this.player.y);
                        
                        if (this.player.health <= 0) {
                            this.onDefeat();
                        }
                    }
                    
                    setTimeout(() => {
                        this.enemy.isAttacking = false;
                        this.enemy.attackType = null;
                    }, 200);
                }
            } else if (rand < 0.5 && this.enemy.ki >= 20) {
                this.projectiles.push({
                    x: this.enemy.x,
                    y: this.enemy.y + this.enemy.height / 2,
                    vx: -12,
                    vy: 0,
                    width: 40,
                    height: 20,
                    damage: 12,
                    isPlayer: false,
                    color: '#FF4500',
                    type: 'blast'
                });
                this.enemy.ki -= 20;
            } else if (rand < 0.6) {
                if (this.enemy.isGrounded) {
                    this.enemy.vy = this.enemy.jumpPower;
                    this.enemy.isGrounded = false;
                }
            } else if (rand < 0.7) {
                this.enemy.isBlocking = true;
                setTimeout(() => {
                    this.enemy.isBlocking = false;
                }, 1000);
            }
            
            this.updateHealthBars();
        }
        
        if (distance > 150) {
            this.enemy.direction = this.player.x < this.enemy.x ? -1 : 1;
            this.enemy.vx = this.enemy.direction * this.enemy.speed * 0.5;
        } else {
            this.enemy.vx = 0;
        }
    }
    
    checkEnemyHit() {
        const hitX = this.enemy.direction === 1 ? 
            this.enemy.x + this.enemy.width : 
            this.enemy.x - 50;
        
        return hitX < this.player.x + this.player.width &&
               hitX + 50 > this.player.x &&
               this.enemy.y < this.player.y + this.player.height &&
               this.enemy.y + this.enemy.height > this.player.y;
    }
    
    // Physics & Collision
    update(deltaTime) {
        if (!this.active) return;
        
        // Player movement
        this.player.vx = 0;
        if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.vx = -this.player.speed;
            this.player.direction = -1;
        }
        if (this.keys['arrowright'] || this.keys['d']) {
            this.player.vx = this.player.speed;
            this.player.direction = 1;
        }
        
        // Charging KI
        if (this.player.isCharging && this.player.isGrounded) {
            this.player.ki = Math.min(this.player.maxKi, this.player.ki + 0.5);
            this.updateHealthBars();
        }
        
        // Apply gravity
        this.player.vy += 0.8;
        this.enemy.vy += 0.8;
        
        // Update positions
        this.player.x += this.player.vx;
        this.player.y += this.player.vy;
        this.enemy.x += this.enemy.vx;
        this.enemy.y += this.enemy.vy;
        
        // Ground collision
        if (this.player.y + this.player.height >= this.groundY) {
            this.player.y = this.groundY - this.player.height;
            this.player.vy = 0;
            this.player.isGrounded = true;
        } else {
            this.player.isGrounded = false;
        }
        
        if (this.enemy.y + this.enemy.height >= this.groundY) {
            this.enemy.y = this.groundY - this.enemy.height;
            this.enemy.vy = 0;
            this.enemy.isGrounded = true;
        } else {
            this.enemy.isGrounded = false;
        }
        
        // Boundary checks
        this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, this.player.x));
        this.enemy.x = Math.max(0, Math.min(this.canvas.width - this.enemy.width, this.enemy.x));
        
        // Cooldowns
        if (this.player.attackCooldown > 0) this.player.attackCooldown--;
        if (this.enemy.attackCooldown > 0) this.enemy.attackCooldown--;
        
        // Ki regeneration
        if (this.player.ki < this.player.maxKi) this.player.ki += 0.1;
        if (this.enemy.ki < this.enemy.maxKi) this.enemy.ki += 0.05;
        
        // Update AI
        this.updateAI(deltaTime);
        
        // Update projectiles
        this.projectiles = this.projectiles.filter(proj => {
            proj.x += proj.vx;
            
            const target = proj.isPlayer ? this.enemy : this.player;
            if (proj.x < target.x + target.width &&
                proj.x + proj.width > target.x &&
                proj.y < target.y + target.height &&
                proj.y + proj.height > target.y) {
                
                const damage = target.isBlocking ? proj.damage * 0.2 : proj.damage;
                target.health = Math.max(0, target.health - damage);
                this.showDamageText(`${Math.floor(damage)}`, proj.isPlayer ? 'red' : 'orange');
                this.createHitEffect(target.x, target.y);
                this.createImpactFlash(target.x, target.y);
                this.updateHealthBars();
                
                if (target.health <= 0 && proj.isPlayer) {
                    this.endGame('victory');
                }
                
                return false;
            }
            
            return proj.x > -100 && proj.x < this.canvas.width + 100;
        });
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // gravity
            p.life--;
            p.alpha = p.life / 60;
            return p.life > 0;
        });
        
        // Update aura particles
        this.auraParticles = this.auraParticles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            p.alpha = p.life / 40;
            return p.life > 0;
        });
        
        // Update hit effects
        this.hitEffects = this.hitEffects.filter(effect => {
            effect.radius += 3;
            effect.alpha -= 0.05;
            return effect.alpha > 0;
        });
        
        // Update impact flashes
        this.impactFlashes = this.impactFlashes.filter(flash => {
            flash.radius += 5;
            flash.alpha -= 0.08;
            flash.life--;
            return flash.life > 0;
        });
        
        // Update damage texts
        this.damageTexts = this.damageTexts.filter(text => {
            text.y += text.vy;
            text.alpha -= 0.02;
            return text.alpha > 0;
        });
        
        // Animation frames
        this.player.frameTimer++;
        if (this.player.frameTimer > 5) {
            this.player.frame = (this.player.frame + 1) % 4;
            this.player.frameTimer = 0;
        }
        
        this.enemy.frameTimer++;
        if (this.enemy.frameTimer > 5) {
            this.enemy.frame = (this.enemy.frame + 1) % 4;
            this.enemy.frameTimer = 0;
        }
        
        this.updateHealthBars();
    }
    
    // Rendering
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        bgGradient.addColorStop(0, '#0a0a1a');
        bgGradient.addColorStop(0.5, '#1a1a3e');
        bgGradient.addColorStop(1, '#0f0f2d');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground with DBZ arena style
        this.drawArenaGround();
        
        // Draw speed lines
        this.drawSpeedLines();
        
        // Draw aura particles
        this.auraParticles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha * 0.6;
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw particles
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw player character
        this.drawFighter(this.player);
        
        // Draw enemy character
        this.drawFighter(this.enemy);
        
        // Draw projectiles
        this.projectiles.forEach(proj => {
            this.drawProjectile(proj);
        });
        
        // Draw hit effects
        this.hitEffects.forEach(effect => {
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = effect.color;
            this.ctx.lineWidth = 4;
            this.ctx.globalAlpha = effect.alpha;
            this.ctx.stroke();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw impact flashes
        this.impactFlashes.forEach(flash => {
            const gradient = this.ctx.createRadialGradient(
                flash.x, flash.y, 0,
                flash.x, flash.y, flash.radius
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${flash.alpha})`);
            gradient.addColorStop(0.5, `rgba(255, 215, 0, ${flash.alpha * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(flash.x, flash.y, flash.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Draw damage texts
        this.damageTexts.forEach(text => {
            this.ctx.save();
            this.ctx.fillStyle = text.color;
            this.ctx.globalAlpha = text.alpha;
            this.ctx.font = 'bold 32px Impact, sans-serif';
            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 3;
            this.ctx.translate(text.x, text.y);
            this.ctx.scale(text.scale, text.scale);
            this.ctx.strokeText(text.text, 0, 0);
            this.ctx.fillText(text.text, 0, 0);
            this.ctx.restore();
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawArenaGround() {
        // DBZ tournament arena floor
        const gradient = this.ctx.createLinearGradient(0, this.groundY, 0, this.canvas.height);
        gradient.addColorStop(0, '#FF6600');
        gradient.addColorStop(0.3, '#CC5500');
        gradient.addColorStop(1, '#8B4500');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        // Arena ring pattern
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundY + 10);
        this.ctx.lineTo(this.canvas.width, this.groundY + 10);
        this.ctx.stroke();
    }
    
    drawSpeedLines() {
        // Dynamic speed lines for action feel
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const length = Math.random() * 100 + 50;
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x - length, y);
            this.ctx.stroke();
        }
    }
    
    drawProjectile(proj) {
        if (proj.type === 'beam') {
            // Kamehameha-style beam
            const gradient = this.ctx.createLinearGradient(proj.x, proj.y, proj.x + proj.width, proj.y);
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(0.2, proj.color);
            gradient.addColorStop(0.5, '#00FFFF');
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.shadowColor = proj.color;
            this.ctx.shadowBlur = 30;
            
            // Draw beam with energy waves
            for (let i = 0; i < 3; i++) {
                const yOffset = Math.sin(Date.now() / 100 + i) * 5;
                this.ctx.beginPath();
                this.ctx.ellipse(
                    proj.x + proj.width / 2,
                    proj.y + yOffset,
                    proj.width / 2,
                    proj.height / 2 + i * 3,
                    0, 0, Math.PI * 2
                );
                this.ctx.fill();
            }
            this.ctx.shadowBlur = 0;
        } else {
            // Ki blast
            const gradient = this.ctx.createRadialGradient(
                proj.x + proj.width / 2, proj.y + proj.height / 2, 0,
                proj.x + proj.width / 2, proj.y + proj.height / 2, proj.width
            );
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(0.3, proj.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.shadowColor = proj.color;
            this.ctx.shadowBlur = 20;
            this.ctx.beginPath();
            this.ctx.arc(
                proj.x + proj.width / 2,
                proj.y + proj.height / 2,
                proj.width / 2,
                0, Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }
    
    drawFighter(fighter) {
        const ctx = this.ctx;
        const x = fighter.x;
        const y = fighter.y;
        const w = fighter.width;
        const h = fighter.height;
        
        ctx.save();
        
        // Draw aura if charging or powered up
        if (fighter.auraIntensity > 0 || fighter.isCharging) {
            const auraColor = fighter.transform === 'super' ? '#FFD700' : '#00BFFF';
            const auraSize = fighter.auraIntensity > 0 ? 30 : 15;
            
            // Pulsing aura
            const pulse = Math.sin(Date.now() / 200) * 5 + auraSize;
            const auraGradient = ctx.createRadialGradient(
                x + w / 2, y + h / 2, w / 2,
                x + w / 2, y + h / 2, w / 2 + pulse
            );
            auraGradient.addColorStop(0, `${auraColor}40`);
            auraGradient.addColorStop(0.5, `${auraColor}20`);
            auraGradient.addColorStop(1, 'transparent');
            
            ctx.fillStyle = auraGradient;
            ctx.beginPath();
            ctx.ellipse(x + w / 2, y + h / 2, w / 2 + pulse, h / 2 + pulse, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Rising energy particles
            for (let i = 0; i < 5; i++) {
                const px = x + Math.random() * w;
                const py = y + h - Math.random() * h;
                ctx.fillStyle = auraColor;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(px, py, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        
        // Flip sprite based on direction
        ctx.translate(x + w / 2, y + h / 2);
        if (fighter.direction === -1) {
            ctx.scale(-1, 1);
        }
        
        // Animation bob
        const bob = Math.sin(fighter.frame * Math.PI / 2) * 3;
        
        // Draw DBZ-style character
        if (fighter === this.player) {
            this.drawGokuStyle(ctx, w, h, bob, fighter);
        } else {
            this.drawEnemyStyle(ctx, w, h, bob, fighter);
        }
        
        ctx.restore();
        
        // Block shield
        if (fighter.isBlocking) {
            ctx.strokeStyle = '#00D4FF';
            ctx.lineWidth = 4;
            ctx.shadowColor = '#00D4FF';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            const shieldX = fighter.direction === 1 ? w : -20;
            ctx.arc(shieldX + w / 2, h / 2, h / 2 + 10, -Math.PI / 2, Math.PI / 2, fighter.direction !== 1);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
        // Attack effect
        if (fighter.isAttacking) {
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 20;
            const effectX = fighter.direction === 1 ? w : -30;
            ctx.fillRect(effectX, h / 2 - 10, 30, 20);
            ctx.shadowBlur = 0;
        }
    }
    
    drawGokuStyle(ctx, w, h, bob, fighter) {
        // Spiky hair
        ctx.fillStyle = fighter.hairColor;
        ctx.beginPath();
        ctx.moveTo(-w / 4, -h / 4 + bob);
        ctx.lineTo(-w / 2, -h / 2 + bob);
        ctx.lineTo(-w / 4, -h / 3 + bob);
        ctx.lineTo(0, -h / 1.8 + bob);
        ctx.lineTo(w / 4, -h / 3 + bob);
        ctx.lineTo(w / 2, -h / 2 + bob);
        ctx.lineTo(w / 4, -h / 4 + bob);
        ctx.closePath();
        ctx.fill();
        
        // Head
        ctx.fillStyle = fighter.skinColor;
        ctx.beginPath();
        ctx.ellipse(0, -h / 6 + bob, w / 4, h / 5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body (Gi)
        ctx.fillStyle = fighter.giColor;
        ctx.beginPath();
        ctx.moveTo(-w / 3, 0);
        ctx.lineTo(w / 3, 0);
        ctx.lineTo(w / 4, h / 2);
        ctx.lineTo(-w / 4, h / 2);
        ctx.closePath();
        ctx.fill();
        
        // Belt
        ctx.fillStyle = fighter.beltColor;
        ctx.fillRect(-w / 3, h / 4, w / 1.5, h / 8);
        
        // Arms (animated based on attack)
        ctx.fillStyle = fighter.skinColor;
        if (fighter.isAttacking && fighter.attackType === 'punch') {
            // Punching arm
            ctx.beginPath();
            ctx.moveTo(w / 4, h / 6);
            ctx.lineTo(w / 1.5, h / 6);
            ctx.lineWidth = w / 6;
            ctx.strokeStyle = fighter.skinColor;
            ctx.stroke();
        } else if (fighter.isAttacking && fighter.attackType === 'kick') {
            // Kicking leg
            ctx.fillStyle = fighter.giColor;
            ctx.beginPath();
            ctx.moveTo(0, h / 3);
            ctx.lineTo(w / 2, h / 6);
            ctx.lineWidth = w / 5;
            ctx.strokeStyle = fighter.giColor;
            ctx.stroke();
        } else {
            // Idle arms
            ctx.beginPath();
            ctx.moveTo(-w / 4, h / 6);
            ctx.lineTo(-w / 3, h / 3);
            ctx.moveTo(w / 4, h / 6);
            ctx.lineTo(w / 3, h / 3);
            ctx.lineWidth = w / 8;
            ctx.strokeStyle = fighter.skinColor;
            ctx.stroke();
        }
        
        // Legs
        ctx.fillStyle = fighter.giColor;
        ctx.fillRect(-w / 6, h / 2, w / 5, h / 3);
        ctx.fillRect(w / 12, h / 2, w / 5, h / 3);
        
        // Boots
        ctx.fillStyle = '#0066CC';
        ctx.fillRect(-w / 6, h * 0.75, w / 5, h / 6);
        ctx.fillRect(w / 12, h * 0.75, w / 5, h / 6);
        
        // Eyes (determined expression)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(w / 8, -h / 6 + bob, 3, 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawEnemyStyle(ctx, w, h, bob, fighter) {
        // Enemy silhouette with glowing effects
        const gradient = ctx.createRadialGradient(0, 0, w / 4, 0, 0, w / 2);
        gradient.addColorStop(0, fighter.color);
        gradient.addColorStop(1, '#000000');
        
        ctx.fillStyle = gradient;
        
        // Menacing figure
        ctx.beginPath();
        ctx.moveTo(0, -h / 2 + bob);
        ctx.lineTo(w / 3, -h / 6);
        ctx.lineTo(w / 2, h / 3);
        ctx.lineTo(w / 6, h / 2);
        ctx.lineTo(-w / 6, h / 2);
        ctx.lineTo(-w / 2, h / 3);
        ctx.lineTo(-w / 3, -h / 6);
        ctx.closePath();
        ctx.fill();
        
        // Glowing eyes
        ctx.fillStyle = '#FF0000';
        ctx.shadowColor = '#FF0000';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(-w / 6, -h / 8 + bob, 4, 0, Math.PI * 2);
        ctx.arc(w / 6, -h / 8 + bob, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Avatar symbol
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(fighter.avatar, 0, 0);
    }
    
    endGame(result) {
        this.active = false;
        clearInterval(this.timerInterval);
        
        if (result === 'victory') {
            this.showDamageText('K.O.!', 'gold');
            // Victory explosion
            for (let i = 0; i < 50; i++) {
                this.particles.push({
                    x: this.enemy.x + this.enemy.width / 2,
                    y: this.enemy.y + this.enemy.height / 2,
                    vx: (Math.random() - 0.5) * 20,
                    vy: (Math.random() - 0.5) * 20,
                    radius: Math.random() * 8 + 4,
                    color: '#FFD700',
                    life: 80,
                    alpha: 1
                });
            }
            setTimeout(() => this.onVictory(), 2000);
        } else if (result === 'timeout') {
            if (this.player.health > this.enemy.health) {
                this.onVictory();
            } else {
                this.onDefeat();
            }
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.draw();
        
        if (this.active) {
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    game.init();
});

// Add some visual flair
document.addEventListener('mousemove', (e) => {
    const aura = document.querySelector('.saiyan-aura');
    if (aura) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        aura.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 215, 0, 0.15) 0%, transparent 50%)`;
    }
});
