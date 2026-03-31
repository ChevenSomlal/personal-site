/* ============================================
   DBZ Fighting Game Engine
   Real-time combat with AI opponent
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
            enemy: { name: "Final Project Boss", avatar: "📚", health: 100, attack: "Deadline Pressure", speed: 0.5 },
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
            enemy: { name: "Legacy System", avatar: "👾", health: 120, attack: "Spaghetti Code", speed: 0.6 },
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
            enemy: { name: "Delphi Guardian", avatar: "👹", health: 140, attack: "COBOL Curse", speed: 0.7 },
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
            enemy: { name: "Monolith Beast", avatar: "🏛️", health: 160, attack: "Tight Coupling", speed: 0.75 },
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
            enemy: { name: "Banking System Dragon", avatar: "🐲", health: 200, attack: "Transaction Storm", speed: 0.85 },
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
        const arena = document.getElementById('fightingArena');
        const actionBtn = document.getElementById('actionButton');
        const storyContent = document.getElementById('storyContent');
        
        if (arena) arena.style.display = 'block';
        if (actionBtn) actionBtn.style.display = 'none';
        if (storyContent) storyContent.style.display = 'none';
        
        const chapter = this.chapters[this.currentChapter];
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
        const storyContent = document.getElementById('storyContent');
        
        if (arena) arena.style.display = 'none';
        if (actionBtn) actionBtn.style.display = 'inline-flex';
        if (storyContent) storyContent.style.display = 'block';
        
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
   Fighting Game Engine
   ============================================ */

class FightingGame {
    constructor(chapter, onVictory, onDefeat) {
        this.canvas = document.getElementById('fightCanvas');
        if (!this.canvas) {
            console.error('Fight canvas not found!');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.chapter = chapter;
        this.onVictory = onVictory;
        this.onDefeat = onDefeat;
        
        // Game state
        this.active = true;
        this.timeLeft = 60;
        this.lastTime = 0;
        
        console.log('FightingGame initialized for chapter:', chapter.title);
        
        // Player
        this.player = {
            x: 100,
            y: 300,
            width: 50,
            height: 80,
            vx: 0,
            vy: 0,
            speed: 5,
            jumpPower: -15,
            health: 100,
            maxHealth: 100,
            ki: 100,
            maxKi: 100,
            isGrounded: false,
            isAttacking: false,
            isBlocking: false,
            attackType: null,
            attackCooldown: 0,
            combo: 0,
            direction: 1,
            avatar: '🥋'
        };
        
        // Enemy AI
        this.enemy = {
            x: 650,
            y: 300,
            width: 50,
            height: 80,
            vx: 0,
            vy: 0,
            speed: chapter.enemy.speed * 3,
            jumpPower: -12,
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
            avatar: chapter.enemy.avatar,
            aiTimer: 0,
            aiState: 'idle'
        };
        
        // Projectiles
        this.projectiles = [];
        
        // Hit effects
        this.hitEffects = [];
        this.damageTexts = [];
        
        // Input state
        this.keys = {};
        
        // Ground level
        this.groundY = 380;
        
        // Start game loop
        this.init();
    }
    
    init() {
        console.log('FightingGame.init() called');
        this.updateHealthBars();
        this.resizeCanvas();
        this.gameLoop(0);
        
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
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (container) {
            const rect = container.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = 400;
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
        
        // Special Move
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
    }
    
    performAttack(type, damage, kiCost) {
        this.player.isAttacking = true;
        this.player.attackType = type;
        this.player.attackCooldown = 30;
        this.player.ki = Math.max(0, this.player.ki - kiCost);
        
        // Check hit
        const hit = this.checkAttackHit(type);
        if (hit) {
            this.player.combo++;
            const actualDamage = this.player.isBlocking ? damage * 0.2 : damage;
            const multiplier = 1 + (this.player.combo * 0.1);
            const finalDamage = Math.floor(actualDamage * multiplier);
            this.enemy.health = Math.max(0, this.enemy.health - finalDamage);
            this.showDamageText(`${finalDamage}`, 'red');
            this.createHitEffect(this.enemy.x, this.enemy.y);
            this.updateComboDisplay();
            
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
        
        // Special is a powerful ki blast
        this.projectiles.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
            vx: 15,
            vy: 0,
            width: 60,
            height: 30,
            damage: 30,
            isPlayer: true,
            color: '#ffd700'
        });
        
        this.showDamageText(this.chapter.specialMove, 'gold');
        
        setTimeout(() => {
            this.player.isAttacking = false;
            this.player.attackType = null;
        }, 500);
        
        this.updateHealthBars();
    }
    
    fireKiBlast() {
        this.player.ki -= 20;
        this.projectiles.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2,
            vx: 12,
            vy: 0,
            width: 30,
            height: 15,
            damage: 15,
            isPlayer: true,
            color: '#00d4ff'
        });
        
        this.updateHealthBars();
    }
    
    checkAttackHit(type) {
        const range = type === 'kick' ? 70 : 50;
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
            maxRadius: 50,
            alpha: 1
        });
    }
    
    showDamageText(text, color) {
        this.damageTexts.push({
            text: text,
            x: this.enemy.x,
            y: this.enemy.y - 50,
            alpha: 1,
            color: color,
            vy: -2
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
        
        document.getElementById('playerHealthBar').style.width = `${playerHealthPercent}%`;
        document.getElementById('enemyHealthBar').style.width = `${enemyHealthPercent}%`;
        document.getElementById('playerKiBar').style.width = `${playerKiPercent}%`;
        document.getElementById('enemyKiBar').style.width = `${enemyKiPercent}%`;
    }
    
    // AI Logic
    updateAI(deltaTime) {
        this.enemy.aiTimer += deltaTime;
        
        // Simple AI states
        const distance = Math.abs(this.enemy.x - this.player.x);
        
        if (this.enemy.aiTimer > 500) {
            this.enemy.aiTimer = 0;
            
            // Decide action
            const rand = Math.random();
            
            if (distance > 200) {
                // Move towards player
                this.enemy.vx = this.enemy.direction * this.enemy.speed;
            } else if (rand < 0.3) {
                // Attack
                if (this.enemy.attackCooldown <= 0 && this.enemy.ki >= 5) {
                    this.enemy.isAttacking = true;
                    this.enemy.attackType = 'punch';
                    this.enemy.attackCooldown = 40;
                    this.enemy.ki -= 5;
                    
                    // Check if AI hits player
                    if (this.checkEnemyHit()) {
                        const damage = this.player.isBlocking ? 3 : 8;
                        this.player.health = Math.max(0, this.player.health - damage);
                        this.showDamageText(`${damage}`, 'orange');
                        this.player.combo = 0;
                        this.updateComboDisplay();
                        
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
                // Fire projectile
                this.projectiles.push({
                    x: this.enemy.x,
                    y: this.enemy.y + this.enemy.height / 2,
                    vx: -10,
                    vy: 0,
                    width: 30,
                    height: 15,
                    damage: 12,
                    isPlayer: false,
                    color: '#ff4444'
                });
                this.enemy.ki -= 20;
            } else if (rand < 0.6) {
                // Jump
                if (this.enemy.isGrounded) {
                    this.enemy.vy = this.enemy.jumpPower;
                    this.enemy.isGrounded = false;
                }
            } else if (rand < 0.7) {
                // Block
                this.enemy.isBlocking = true;
                setTimeout(() => {
                    this.enemy.isBlocking = false;
                }, 1000);
            }
            
            this.updateHealthBars();
        }
        
        // Apply AI velocity
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
            
            // Check collision
            const target = proj.isPlayer ? this.enemy : this.player;
            if (proj.x < target.x + target.width &&
                proj.x + proj.width > target.x &&
                proj.y < target.y + target.height &&
                proj.y + proj.height > target.y) {
                
                const damage = target.isBlocking ? proj.damage * 0.2 : proj.damage;
                target.health = Math.max(0, target.health - damage);
                this.showDamageText(`${Math.floor(damage)}`, proj.isPlayer ? 'red' : 'orange');
                this.createHitEffect(target.x, target.y);
                this.updateHealthBars();
                
                if (target.health <= 0) {
                    if (proj.isPlayer) {
                        this.endGame('victory');
                    }
                }
                
                return false;
            }
            
            return proj.x > -100 && proj.x < this.canvas.width + 100;
        });
        
        // Update hit effects
        this.hitEffects = this.hitEffects.filter(effect => {
            effect.radius += 2;
            effect.alpha -= 0.05;
            return effect.alpha > 0;
        });
        
        // Update damage texts
        this.damageTexts = this.damageTexts.filter(text => {
            text.y += text.vy;
            text.alpha -= 0.02;
            return text.alpha > 0;
        });
        
        this.updateHealthBars();
    }
    
    // Rendering
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = 'rgba(10, 10, 26, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        const gradient = this.ctx.createLinearGradient(0, this.groundY, 0, this.canvas.height);
        gradient.addColorStop(0, '#f97c00');
        gradient.addColorStop(1, '#c95a00');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, this.groundY, this.canvas.width, this.canvas.height - this.groundY);
        
        // Draw player
        this.drawFighter(this.player);
        
        // Draw enemy
        this.drawFighter(this.enemy);
        
        // Draw projectiles
        this.projectiles.forEach(proj => {
            this.ctx.fillStyle = proj.color;
            this.ctx.shadowColor = proj.color;
            this.ctx.shadowBlur = 20;
            this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
            this.ctx.shadowBlur = 0;
        });
        
        // Draw hit effects
        this.hitEffects.forEach(effect => {
            this.ctx.beginPath();
            this.ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 215, 0, ${effect.alpha})`;
            this.ctx.fill();
        });
        
        // Draw damage texts
        this.damageTexts.forEach(text => {
            this.ctx.fillStyle = text.color;
            this.ctx.globalAlpha = text.alpha;
            this.ctx.font = 'bold 24px Inter';
            this.ctx.fillText(text.text, text.x, text.y);
            this.ctx.globalAlpha = 1;
        });
    }
    
    drawFighter(fighter) {
        // Aura effect
        if (fighter.isAttacking && fighter.attackType === 'special') {
            this.ctx.beginPath();
            this.ctx.arc(fighter.x + fighter.width/2, fighter.y + fighter.height/2, 60, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            this.ctx.fill();
        }
        
        // Block shield
        if (fighter.isBlocking) {
            this.ctx.strokeStyle = '#00d4ff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            const shieldX = fighter.direction === 1 ? 
                fighter.x + fighter.width : fighter.x - 20;
            this.ctx.arc(shieldX + 10, fighter.y + fighter.height/2, 40, -Math.PI/2, Math.PI/2, fighter.direction !== 1);
            this.ctx.stroke();
        }
        
        // Draw avatar
        this.ctx.font = '60px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Flip sprite based on direction
        this.ctx.save();
        this.ctx.translate(fighter.x + fighter.width/2, fighter.y + fighter.height/2);
        if (fighter.direction === -1) {
            this.ctx.scale(-1, 1);
        }
        
        // Attack pose
        if (fighter.isAttacking) {
            this.ctx.translate(fighter.direction * 10, 0);
        }
        
        this.ctx.fillText(fighter.avatar, 0, 0);
        this.ctx.restore();
        
        // Attack effect
        if (fighter.isAttacking) {
            this.ctx.fillStyle = '#ffd700';
            const effectX = fighter.direction === 1 ? 
                fighter.x + fighter.width : fighter.x - 30;
            this.ctx.fillRect(effectX, fighter.y + 30, 30, 20);
        }
    }
    
    endGame(result) {
        this.active = false;
        clearInterval(this.timerInterval);
        
        if (result === 'victory') {
            this.showDamageText('K.O.!', 'gold');
            setTimeout(() => this.onVictory(), 1500);
        } else if (result === 'timeout') {
            // Time over - whoever has more health wins
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
