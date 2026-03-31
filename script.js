/* ============================================
   DBZ Interactive Story Game Engine
   ============================================ */

const game = {
    // Game State
    currentChapter: 0,
    powerLevel: 9000,
    energy: 100,
    rank: 'Academy Trainee',
    battlesWon: 0,
    
    // Story Chapters
    chapters: [
        {
            number: 1,
            title: "The Academy Days",
            icon: "🎓",
            narration: "Our hero begins at the Allan Gray Academy, where young warriors learn the fundamentals of code. Fresh from university with Summa Cum Laude honors, Cheven enters the training grounds ready to prove their worth!",
            stats: { powerLevel: 9000, rank: "Academy Trainee", location: "Cape Town" },
            enemy: { name: "Final Project Boss", avatar: "📚", health: 100, attack: "Deadline Pressure" },
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
            enemy: { name: "Legacy System", avatar: "👾", health: 150, attack: "Spaghetti Code" },
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
            enemy: { name: "Delphi Guardian", avatar: "👹", health: 200, attack: "COBOL Curse" },
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
            enemy: { name: "Monolith Beast", avatar: "🏛️", health: 250, attack: "Tight Coupling" },
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
            enemy: { name: "Banking System Dragon", avatar: "🐲", health: 300, attack: "Transaction Storm" },
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
            if (e.code === 'Space' || e.code === 'Enter') {
                const activeScreen = document.querySelector('.screen.active');
                if (activeScreen.id === 'storyScreen' && !document.getElementById('battleArena').style.display) {
                    this.nextStep();
                }
            }
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
        
        // Update nav
        document.getElementById('navChapter').textContent = `Chapter ${chapter.number}`;
        
        // Show stats
        this.renderStats(chapter.stats);
        
        // Setup battle
        this.setupBattle(chapter.enemy);
        
        // Reset action button
        this.setAction('start-battle', 'BEGIN BATTLE', '⚔️');
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
    
    setupBattle(enemy) {
        this.currentEnemy = { ...enemy, maxHealth: enemy.health };
        this.playerHealth = 100;
        
        document.getElementById('enemyAvatar').textContent = enemy.avatar;
        document.getElementById('enemyName').textContent = enemy.name;
        this.updateHealthBars();
    },
    
    setAction(action, text, icon) {
        const btn = document.getElementById('actionButton');
        btn.onclick = () => this.handleAction(action);
        btn.innerHTML = `<span class="btn-text">${text}</span><span class="btn-icon">${icon}</span>`;
    },
    
    handleAction(action) {
        switch(action) {
            case 'start-battle':
                this.startBattle();
                break;
            case 'next-chapter':
                this.nextChapter();
                break;
        }
    },
    
    // Battle System
    startBattle() {
        document.getElementById('battleArena').style.display = 'block';
        document.getElementById('actionButton').style.display = 'none';
        this.logBattle(`A wild ${this.currentEnemy.name} appears!`);
    },
    
    battleAttack(type) {
        if (!this.currentEnemy || this.currentEnemy.health <= 0) return;
        
        const chapter = this.chapters[this.currentChapter];
        let damage = Math.floor(Math.random() * 20) + 10;
        let moveName = '';
        
        switch(type) {
            case 'code':
                damage *= 1.2;
                moveName = 'Code Strike';
                break;
            case 'debug':
                damage *= 1.5;
                moveName = 'Debug Beam';
                break;
            case 'special':
                damage *= 2;
                moveName = chapter.specialMove;
                break;
        }
        
        damage = Math.floor(damage);
        this.currentEnemy.health -= damage;
        this.logBattle(`You used ${moveName}! Dealt ${damage} damage!`);
        
        // Enemy turn
        if (this.currentEnemy.health > 0) {
            setTimeout(() => {
                const enemyDamage = Math.floor(Math.random() * 15) + 5;
                this.playerHealth -= enemyDamage;
                this.logBattle(`${this.currentEnemy.name} attacks! You take ${enemyDamage} damage!`);
                this.updateHealthBars();
                
                if (this.playerHealth <= 0) {
                    this.logBattle('You were defeated... but you got back up! (Plot armor)');
                    this.playerHealth = 1;
                    this.updateHealthBars();
                }
            }, 500);
        }
        
        this.updateHealthBars();
        
        // Check victory
        if (this.currentEnemy.health <= 0) {
            setTimeout(() => this.winBattle(), 1000);
        }
    },
    
    updateHealthBars() {
        const playerPercent = (this.playerHealth / 100) * 100;
        const enemyPercent = (this.currentEnemy.health / this.currentEnemy.maxHealth) * 100;
        
        document.getElementById('playerHealth').style.width = `${Math.max(0, playerPercent)}%`;
        document.getElementById('enemyHealth').style.width = `${Math.max(0, enemyPercent)}%`;
    },
    
    logBattle(message) {
        const log = document.getElementById('battleLog');
        const entry = document.createElement('p');
        entry.className = 'log-entry';
        entry.textContent = message;
        log.insertBefore(entry, log.firstChild);
    },
    
    winBattle() {
        this.battlesWon++;
        this.powerLevel += this.chapters[this.currentChapter].powerGain;
        this.updatePowerDisplay();
        
        document.getElementById('battleArena').style.display = 'none';
        this.logBattle(`Victory! ${this.chapters[this.currentChapter].victoryText}`);
        
        setTimeout(() => {
            this.showLevelUp();
        }, 1500);
    },
    
    // Level Up
    showLevelUp() {
        const chapter = this.chapters[this.currentChapter];
        this.rank = chapter.nextRank;
        
        document.getElementById('levelUpText').textContent = chapter.victoryText;
        document.getElementById('newRank').textContent = this.rank;
        document.getElementById('newPowerLevel').textContent = this.powerLevel.toLocaleString();
        
        this.switchScreen('levelUp');
    },
    
    continueAdventure() {
        this.switchScreen('story');
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
        // Could implement a home/portfolio view
        console.log('Home clicked');
    },
    
    closeOverlay() {
        document.getElementById('contactOverlay').style.display = 'none';
    }
};

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
