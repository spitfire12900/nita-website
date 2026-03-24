document.addEventListener("DOMContentLoaded", function() {
    
    // 1. 滾動特效：導覽列浮現 & 首頁文字漸隱
    const mainNav = document.getElementById('mainNav');
    const heroText = document.getElementById('heroText');

    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        
        if (scrollY > 300) { mainNav?.classList.add('scrolled'); } 
        else { mainNav?.classList.remove('scrolled'); }

        // 首頁文字：單純往上滑並漸隱
        if(window.innerWidth > 768 && heroText) {
            let textOpacity = 1 - (scrollY / 400);
            heroText.style.opacity = Math.max(textOpacity, 0);
        }
    });

    // 2. 畫廊渲染
    const galleryContainer = document.getElementById('gallery-container');
    if(galleryContainer && typeof galleryData !== 'undefined') {
        galleryData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'gallery-card';
            card.onclick = () => openModal(index);
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${item.imgUrl}" alt="${item.title}" class="gallery-img">
                </div>
                <div class="card-title">${item.title}</div>
            `;
            galleryContainer.appendChild(card);
        });
    }

    // 3. 探照微光
    const glow = document.getElementById('cursorGlow');
    if(glow) {
        document.addEventListener('mousemove', (e) => {
            glow.style.opacity = '1'; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
        });
        document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    }

    // 4. 特效監聽器：單次淡入 (fade-in)、重複淡入淡出 (fade-io) 與 首頁立繪自動滑出
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { 
                entry.target.classList.add('visible'); 
                if(entry.target.classList.contains('fade-in')) observer.unobserve(entry.target);
            } else {
                if(entry.target.classList.contains('fade-io') || entry.target.id === 'hero-nita') {
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in, .fade-io, #hero-nita').forEach((el) => observer.observe(el));

    // 5. 夥伴彩蛋
    const dialogues = ["你幹嘛RRR", "how do u turn this on", "文字藝術師"];
    const emojis = ['🔭', '📖', '✨'];
    const companion = document.getElementById('companion');
    let isAnimating = false; 
    if(companion) {
        companion.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;
            document.getElementById('speechBubble').innerText = dialogues[Math.floor(Math.random() * dialogues.length)];
            document.getElementById('emojiIcon').innerText = emojis[Math.floor(Math.random() * emojis.length)];
            companion.classList.add('active');
            setTimeout(() => {
                companion.classList.remove('active');
                setTimeout(() => {
                    companion.style.opacity = '0';
                    setTimeout(() => {
                        const maxX = window.innerWidth - 80; const maxY = window.innerHeight - 80;
                        companion.style.bottom = 'auto'; companion.style.right = 'auto';
                        companion.style.left = Math.max(20, Math.floor(Math.random() * maxX)) + 'px';
                        companion.style.top = Math.max(150, Math.floor(Math.random() * maxY)) + 'px';
                        companion.style.opacity = '1'; isAnimating = false;
                    }, 500);
                }, 300);
            }, 5000);
        });
    }
});

// 6. 翻頁邏輯與彈出視窗
let currentIndex = 0;
function openModal(index) { currentIndex = index; updateModalContent(); document.getElementById('myModal').classList.add('active'); }
function closeModal() { document.getElementById('myModal').classList.remove('active'); }
function changeSlide(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = galleryData.length - 1;
    if (currentIndex >= galleryData.length) currentIndex = 0;
    updateModalContent();
}
function updateModalContent() {
    if(typeof galleryData !== 'undefined') {
        const data = galleryData[currentIndex];
        document.getElementById('modalTitle').innerText = data.title;
        document.getElementById('modalStory').innerText = data.story;
        document.getElementById('modalArtist').innerText = data.artist;
        document.getElementById('modalImgPlaceholder').innerHTML = `<img src="${data.imgUrl}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: contain;">`;
    }
}
window.onclick = function(event) { if (event.target == document.getElementById('myModal')) closeModal(); }
function scrollToSection(event, sectionId) {
    event.preventDefault(); 
    const target = document.getElementById(sectionId);
    if (!target) return;
    const headerOffset = 60;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
}
// 🚫 防止圖片被點擊右鍵下載
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
    }
});

// 🚫 防止鍵盤快捷鍵 (F12 開發者工具、Ctrl+S 儲存網頁)
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || 
       (e.ctrlKey && e.shiftKey && e.key === 'I') || 
       (e.ctrlKey && e.key === 's') || 
       (e.metaKey && e.key === 's')) {
        e.preventDefault();
    }
});