// 初始化轮播图
const swiper = new Swiper('.swiper', {
    loop: true,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    autoplay: {
        delay: 2000,
        disableOnInteraction: false
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    speed: 800,
});

// 监听滑动结束事件，隐藏已播放的照片
swiper.on('slideChange', function () {
    const slides = document.querySelectorAll('.swiper-slide');
    // 只隐藏上一张照片
    if (swiper.previousIndex >= 0) {
        slides[swiper.previousIndex].style.opacity = '0';
        slides[swiper.previousIndex].style.transition = 'opacity 0.5s';
    }
    // 当回到第一张时，重置所有照片的透明度
    if (swiper.activeIndex === 0) {
        slides.forEach(slide => {
            slide.style.opacity = '1';
        });
    }
});

// 在初始化时确保所有照片都是可见的
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
        slide.style.opacity = '1';
    });
});

// 更新照片网格
const photoGrid = document.querySelector('.photo-grid');

// 照片数据
const photos = [
    { url: './百天照/198A1040.jpg', title: '熊睿霖百天照1' },
    { url: './百天照/198A1198.jpg', title: '熊睿霖百天照2' },
    { url: './百天照/198A1243.jpg', title: '熊睿霖百天照3' },
    { url: './百天照/CAAC0046.jpg', title: '熊睿霖百天照4' },
    { url: './百天照/CAAC9641.jpg', title: '熊睿霖百天照5' },
    { url: './百天照/CAAC9874.jpg', title: '熊睿霖百天照6' },
    { url: './百天照/CAAC9968.jpg', title: '熊睿霖百天照7' },
    { url: './百天照/CAAC9741.jpg', title: '熊睿霖百天照8' }
];

// 按原始顺序显示照片
photos.forEach(photo => {
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.title;
    img.onerror = () => {
        console.error(`图片加载失败: ${photo.url}`);
    };
    img.onload = () => {
        console.log(`图片加载成功: ${photo.url}`);
    };
    img.addEventListener('mouseenter', () => {
        requestAnimationFrame(() => {
            img.style.transform = 'scale(1.15) translateZ(0)';
            img.style.boxShadow = '0 12px 30px rgba(102, 179, 255, 0.3)';
            img.style.zIndex = '1';
        });
    });
    img.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
            img.style.transform = 'scale(1) translateZ(0)';
            img.style.boxShadow = 'none';
            img.style.zIndex = '0';
        });
    });
    photoGrid.appendChild(img);
});

// 背景音乐控制
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = true;

// 页面加载完成后自动播放音乐
document.addEventListener('DOMContentLoaded', function() {
    bgMusic.play();
    musicToggle.textContent = '⏸';
    musicToggle.classList.add('playing');
    isPlaying = true;
});

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🎵';
        musicToggle.classList.remove('playing');
    } else {
        bgMusic.play();
        musicToggle.textContent = '⏸';
        musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// 留言功能
const messageForm = document.getElementById('messageForm');
const messagesDiv = document.querySelector('.messages');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = messageForm.querySelector('input').value;
    const content = messageForm.querySelector('textarea').value;
    
    const messageId = Date.now().toString();
    
    const messageEl = document.createElement('div');
    messageEl.className = 'message';
    messageEl.dataset.id = messageId;
    messageEl.dataset.author = name;
    messageEl.innerHTML = `
        <strong>${name}</strong>
        <p>${content}</p>
        <small>${new Date().toLocaleString()}</small>
        <button class="delete-btn" title="删除">🗑️</button>
    `;
    
    // 添加删除按钮的事件监听
    const deleteBtn = messageEl.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('确定要删除这条留言吗？')) {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                messagesDiv.removeChild(messageEl);
            }, 300);
        }
    });
    
    messagesDiv.insertBefore(messageEl, messagesDiv.firstChild);
    
    // 添加出现动画
    messageEl.style.opacity = '0';
    messageEl.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'translateY(0)';
    }, 10);
    
    messageForm.reset();
});

// 添加右键菜单功能
document.addEventListener('contextmenu', function(e) {
    const messageEl = e.target.closest('.message');
    if (messageEl) {
        e.preventDefault();
        const author = messageEl.dataset.author;
        
        // 如果是留言作者或管理员
        if (isAdmin || author === messageForm.querySelector('input').value) {
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = `
                <button class="delete-btn">删除留言</button>
            `;
            
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = e.pageX + 'px';
            contextMenu.style.top = e.pageY + 'px';
            
            document.body.appendChild(contextMenu);
            
            // 点击删除按钮
            contextMenu.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('确定要删除这条留言吗？')) {
                    messageEl.style.opacity = '0';
                    messageEl.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        messagesDiv.removeChild(messageEl);
                    }, 300);
                }
                document.body.removeChild(contextMenu);
            });
            
            // 点击其他地方关闭菜单
            setTimeout(() => {
                document.addEventListener('click', function closeMenu() {
                    if (document.body.contains(contextMenu)) {
                        document.body.removeChild(contextMenu);
                    }
                    document.removeEventListener('click', closeMenu);
                });
            }, 0);
        }
    }
});

// 分享功能
document.getElementById('shareToWechat').addEventListener('click', () => {
    if (/MicroMessenger/i.test(navigator.userAgent)) {
        // 在微信内打开时
        if (typeof WeixinJSBridge !== 'undefined') {
            WeixinJSBridge.invoke('shareTimeline', {
                title: '熊睿霖的百天纪念',
                desc: '记录熊睿霖成长的精彩瞬间',
                link: window.location.href,
                imgUrl: photos[0].url
            });
        }
    } else {
        // 不在微信内打开时
        const shareOverlay = document.createElement('div');
        shareOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        const shareContent = document.createElement('div');
        shareContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
        `;
        shareContent.innerHTML = `
            <h3 style="margin-bottom: 1rem;">请使用微信扫描二维码分享</h3>
            <p style="color: #666;">或在微信中打开本页面</p>
            <button style="
                margin-top: 1rem;
                padding: 0.5rem 1rem;
                background: #07C160;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">关闭</button>
        `;
        
        shareOverlay.appendChild(shareContent);
        document.body.appendChild(shareOverlay);
        
        shareOverlay.addEventListener('click', (e) => {
            if (e.target === shareOverlay || e.target.tagName === 'BUTTON') {
                document.body.removeChild(shareOverlay);
            }
        });
    }
});

// 管理员功能
let isAdmin = false;
const adminPassword = '921226';  // 设置管理员密码

document.getElementById('adminLoginBtn').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="modal-header">
            <h3>管理员登录</h3>
            <button class="close-btn">×</button>
        </div>
        <input type="password" placeholder="请输入管理员密码" id="adminPassword">
        <button id="loginBtn">登录</button>
    `;
    
    document.body.appendChild(modal);
    
    // 添加关闭按钮事件
    modal.querySelector('.close-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    document.getElementById('loginBtn').addEventListener('click', () => {
        const password = document.getElementById('adminPassword').value;
        if (password === adminPassword) {
            isAdmin = true;
            alert('登录成功！现在您可以删除任何留言。');
            document.body.removeChild(modal);
        } else {
            alert('密码错误！');
        }
    });
}); 