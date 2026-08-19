// particles.js - 独立粒子背景脚本
(function() {
    function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return; // 防止找不到元素报错

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = -1000, mouseY = -1000;

        // 画布自适应
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // 粒子类
        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                // 鼠标微弱排斥
                const dx = mouseX - this.x, dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.x -= dx * 0.005;
                    this.y -= dy * 0.005;
                }
                // 边界反弹
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                // 自动适配深色模式（检测 <html data-theme="dark">）
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                ctx.fillStyle = isDark ? `rgba(96,165,250,${this.opacity})` : `rgba(26,86,219,${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // 初始化粒子（根据屏幕密度动态调整数量）
        const count = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
        for (let i = 0; i < count; i++) particles.push(new Particle());

        // 绘制连线
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                        const alpha = isDark ? 0.1 * (1 - dist / 120) : 0.15 * (1 - dist / 120);
                        ctx.strokeStyle = isDark ? `rgba(96,165,250,${alpha})` : `rgba(26,86,219,${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animate);
        }

        // 鼠标追踪
        canvas.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
        canvas.addEventListener('mouseleave', () => { mouseX = -1000; mouseY = -1000; });

        animate();
    }

    // 等待 DOM 加载完成后执行，确保 canvas 元素已存在
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
})();