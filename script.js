// ========== GLOBAL INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Slider for energy calculator
    const sliderPenghuni = document.getElementById('sliderPenghuni');
    const sliderValue = document.getElementById('sliderValue');
    if (sliderPenghuni && sliderValue) {
        sliderPenghuni.addEventListener('input', function() {
            sliderValue.textContent = this.value + ' orang';
        });
    }

    // Initialize chatbot
    initChatbot();
    
    // Initialize project filters
    initProjectFilters();
    
    // Check current page and load appropriate scripts
    if (window.location.pathname.includes('budaya.html') || 
        document.querySelector('.budaya-hero') !== null) {
        initBudayaPage();
    }
    
    // Initialize map page
    const isPetaPage = window.location.pathname.includes('peta.html') || 
                      document.querySelector('.energy-filters') !== null;
    
    if (isPetaPage) {
        initPetaFilters();
    }
    
    // Add CSS animations
    addAnimationStyles();
});

// ========== THEME MANAGEMENT ==========
function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

// ========== VIDEO BACKGROUND ==========
function playVideo() {
    const video = document.getElementById('bgVideo');
    if (video) {
        video.play();
        Swal.fire({
            title: 'Video Dimulai',
            text: 'Video background sedang diputar',
            icon: 'info',
            timer: 2000
        });
    }
}

// ========== MODAL SYSTEM ==========
function showModal(title, content) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        
        const modal = new bootstrap.Modal(document.getElementById('detailModal'));
        modal.show();
    }
}

// ========== ENERGY PAGE FUNCTIONS ==========
function showEnergyDetail(type) {
    const details = {
        solar: {
            title: 'Energi Surya',
            content: 'Jawa Timur memiliki potensi energi surya sebesar 4.8 kWh/m²/hari. Dengan teknologi AI, kita dapat mengoptimalkan penempatan panel surya untuk mendapatkan efisiensi maksimal.'
        },
        wind: {
            title: 'Energi Angin',
            content: 'Kecepatan angin rata-rata di Jawa Timur adalah 5-7 m/detik, cukup untuk pembangkit listrik tenaga angin skala kecil dan menengah.'
        },
        geothermal: {
            title: 'Energi Panas Bumi',
            content: 'Jawa Timur memiliki potensi geothermal lebih dari 1,200 MW. AI dapat membantu monitoring dan prediksi aktivitas geothermal.'
        },
        bioenergy: {
            title: 'Bioenergi',
            content: '40% limbah pertanian di Jawa Timur dapat dikonversi menjadi energi. Sistem AI dapat mengoptimalkan proses konversi.'
        }
    };
    
    const detail = details[type] || details.solar;
    const modalBody = `
        <div class="energy-detail">
            <h4>${detail.title}</h4>
            <p>${detail.content}</p>
            <div class="row mt-3">
                <div class="col-md-6">
                    <h6>Keuntungan:</h6>
                    <ul>
                        <li>Ramah lingkungan</li>
                        <li>Sumber energi berkelanjutan</li>
                        <li>Biaya operasional rendah</li>
                        <li>Cocok untuk Jawa Timur</li>
                    </ul>
                </div>
                <div class="col-md-6">
                    <h6>Implementasi:</h6>
                    <ul>
                        <li>Sistem monitoring berbasis IoT</li>
                        <li>Prediksi dengan Machine Learning</li>
                        <li>Optimisasi dengan algoritma AI</li>
                        <li>Dashboard real-time</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    showModal(detail.title, modalBody);
}

function hitungEnergi() {
    const penghuni = parseInt(document.getElementById('sliderPenghuni').value);
    const lokasi = document.getElementById('selectLokasi').value;
    const luas = parseInt(document.getElementById('luasAtap').value);
    
    const checkboxes = {
        surya: document.getElementById('checkSurya').checked,
        angin: document.getElementById('checkAngin').checked,
        geothermal: document.getElementById('checkGeothermal').checked,
        bioenergy: document.getElementById('checkBioenergy').checked
    };
    
    // Calculate energy potential
    const hasil = {
        surya: checkboxes.surya ? (luas * 4.8 * 0.15 * 30).toFixed(2) : 0,
        angin: checkboxes.angin ? (penghuni * 100 * 0.3).toFixed(2) : 0,
        geothermal: checkboxes.geothermal ? (luas * 0.5).toFixed(2) : 0,
        bioenergy: checkboxes.bioenergy ? (penghuni * 50 * 0.4).toFixed(2) : 0
    };
    
    const total = (parseFloat(hasil.surya) + parseFloat(hasil.angin) + 
                  parseFloat(hasil.geothermal) + parseFloat(hasil.bioenergy)).toFixed(2);
    
    // Display results
    const hasilDetail = document.getElementById('hasilDetail');
    hasilDetail.innerHTML = `
        <div class="alert alert-success">
            <h6>Total Potensi Energi: ${total} kWh/bulan</h6>
            <p>Estimasi untuk ${penghuni} orang di ${lokasi}</p>
        </div>
        <div class="row">
            <div class="col-6">
                <small>Energi Surya:</small>
                <h6>${hasil.surya} kWh</h6>
            </div>
            <div class="col-6">
                <small>Energi Angin:</small>
                <h6>${hasil.angin} kWh</h6>
            </div>
            <div class="col-6">
                <small>Geothermal:</small>
                <h6>${hasil.geothermal} kWh</h6>
            </div>
            <div class="col-6">
                <small>Bioenergi:</small>
                <h6>${hasil.bioenergy} kWh</h6>
            </div>
        </div>
    `;
    
    // Update chart
    updateEnergyChart(hasil);
}

function updateEnergyChart(data) {
    const ctx = document.getElementById('energyChart');
    if (!ctx) return;
    
    if (window.energyChart) {
        window.energyChart.destroy();
    }
    
    window.energyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Surya', 'Angin', 'Geothermal', 'Bioenergi'],
            datasets: [{
                label: 'Potensi Energi (kWh)',
                data: [data.surya, data.angin, data.geothermal, data.bioenergy],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'kWh/bulan'
                    }
                }
            }
        }
    });
}

// ========== MAP PAGE FUNCTIONS ==========
function initPetaFilters() {
    const filterButtons = document.querySelectorAll('.energy-filters button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const type = this.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (type) {
                filterEnergy(type);
            }
        });
    });
}

function showRegionDetail(region) {
    const regions = {
        surabaya: {
            title: 'Surabaya',
            content: 'Kota metropolitan dengan potensi PLTS atap dan mikro grid. Cocok untuk implementasi energi surya skala urban dan angin skala kecil.',
            energy: ['solar', 'wind'],
            potential: 'Tinggi untuk PLTS urban',
            capacity: '500+ MW'
        },
        malang: {
            title: 'Malang',
            content: 'Dataran tinggi dengan potensi geothermal dan PLTS high-efficiency. Suhu yang sejuk meningkatkan efisiensi panel surya.',
            energy: ['solar', 'geothermal'],
            potential: 'Sangat tinggi untuk geothermal',
            capacity: '300+ MW'
        },
        banyuwangi: {
            title: 'Banyuwangi',
            content: 'Wilayah pesisir dengan potensi energi angin dan surya yang besar. Cocok untuk hybrid system.',
            energy: ['solar', 'wind', 'geothermal'],
            potential: 'Tinggi untuk angin dan surya',
            capacity: '800+ MW'
        },
        madura: {
            title: 'Madura',
            content: 'Pulau dengan potensi energi angin besar. Cocok untuk pembangkit listrik tenaga bayu (PLTB).',
            energy: ['solar', 'wind'],
            potential: 'Sangat tinggi untuk angin',
            capacity: '400+ MW'
        },
        ponorogo: {
            title: 'Ponorogo',
            content: 'Daerah agraris dengan potensi bioenergi dari limbah pertanian dan peternakan.',
            energy: ['bioenergy', 'solar'],
            potential: 'Tinggi untuk bioenergi',
            capacity: '200+ MW'
        },
        lumajang: {
            title: 'Lumajang',
            content: 'Wilayah dengan potensi geothermal tinggi karena lokasinya dekat gunung berapi.',
            energy: ['geothermal', 'solar'],
            potential: 'Sangat tinggi untuk geothermal',
            capacity: '600+ MW'
        },
        kediri: {
            title: 'Kediri',
            content: 'Daerah dengan potensi bioenergi dari industri tembakau dan pertanian.',
            energy: ['bioenergy', 'solar'],
            potential: 'Tinggi untuk bioenergi',
            capacity: '250+ MW'
        },
        jember: {
            title: 'Jember',
            content: 'Wilayah dengan potensi geothermal dari pegunungan dan angin dari pantai selatan.',
            energy: ['geothermal', 'wind'],
            potential: 'Tinggi untuk geothermal',
            capacity: '350+ MW'
        },
        tuban: {
            title: 'Tuban',
            content: 'Wilayah pesisir utara dengan potensi angin pantai dan energi surya.',
            energy: ['wind', 'solar'],
            potential: 'Tinggi untuk angin pantai',
            capacity: '300+ MW'
        },
        sidoarjo: {
            title: 'Sidoarjo',
            content: 'Wilayah industri dengan potensi bioenergi dari limbah dan PLTS atap.',
            energy: ['solar', 'bioenergy'],
            potential: 'Tinggi untuk PLTS atap',
            capacity: '400+ MW'
        }
    };
    
    const detail = regions[region] || regions.surabaya;
    const energyIcons = {
        solar: '<i class="fas fa-sun text-warning me-1"></i> Surya',
        wind: '<i class="fas fa-wind text-info me-1"></i> Angin',
        geothermal: '<i class="fas fa-fire text-danger me-1"></i> Geothermal',
        bioenergy: '<i class="fas fa-seedling text-success me-1"></i> Bioenergi'
    };
    
    const modalBody = `
        <div class="region-detail">
            <h4>${detail.title}</h4>
            <p>${detail.content}</p>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="alert alert-warning">
                        <h6><i class="fas fa-bolt me-2"></i>Potensi Energi:</h6>
                        <p class="mb-0">${detail.potential}</p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-info">
                        <h6><i class="fas fa-chart-line me-2"></i>Kapasitas Potensial:</h6>
                        <p class="mb-0">${detail.capacity}</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <h6>Jenis Energi Tersedia:</h6>
                <div class="d-flex flex-wrap gap-2">
                    ${detail.energy.map(type => `
                        <span class="badge ${type === 'solar' ? 'bg-warning' : 
                                            type === 'wind' ? 'bg-info' : 
                                            type === 'geothermal' ? 'bg-danger' : 'bg-success'}">
                            ${energyIcons[type]}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-4">
                <h6>Rekomendasi Pengembangan:</h6>
                <ul>
                    <li>Implementasi sistem monitoring berbasis IoT</li>
                    <li>Penggunaan AI untuk optimasi produksi</li>
                    <li>Kemitraan dengan masyarakat lokal</li>
                    <li>Integrasi dengan jaringan listrik existing</li>
                </ul>
            </div>
        </div>
    `;
    
    showModal(`Potensi Energi: ${detail.title}`, modalBody);
}

function filterEnergy(type) {
    const regions = document.querySelectorAll('.map-region-large');
    const buttons = document.querySelectorAll('.energy-filters button');
    
    // Update button active state
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter regions
    regions.forEach(region => {
        if (type === 'all') {
            region.style.opacity = '1';
            region.style.transform = 'scale(1)';
            setTimeout(() => {
                region.style.display = 'block';
            }, 50);
        } else {
            const regionTypes = region.classList.value;
            if (regionTypes.includes(type)) {
                // Show region
                region.style.opacity = '1';
                region.style.transform = 'scale(1)';
                setTimeout(() => {
                    region.style.display = 'block';
                }, 50);
            } else {
                // Hide region with animation
                region.style.opacity = '0';
                region.style.transform = 'scale(0.5)';
                setTimeout(() => {
                    region.style.display = 'none';
                }, 300);
            }
        }
    });
}

// ========== ETHICS PAGE FUNCTIONS ==========
function showEthicsDetail(type) {
    const ethics = {
        transparency: {
            title: 'Transparansi AI',
            content: 'AI harus dapat menjelaskan keputusan yang dibuatnya dan proses yang dilaluinya.'
        },
        privacy: {
            title: 'Privasi & Keamanan Data',
            content: 'Data pribadi dan budaya harus dilindungi dengan standar keamanan tertinggi.'
        },
        fairness: {
            title: 'Keadilan & Kesetaraan',
            content: 'Algoritma AI harus bebas dari bias dan memberikan hasil yang adil untuk semua.'
        },
        accountability: {
            title: 'Akuntabilitas',
            content: 'Pengembang dan pengguna AI bertanggung jawab atas konsekuensi dari sistem AI.'
        }
    };
    
    const ethic = ethics[type] || ethics.transparency;
    showModal(ethic.title, ethic.content);
}

function testBias() {
    const topic = document.getElementById('cultureTopic').value;
    if (!topic) {
        Swal.fire({
            title: 'Pilih Topik',
            text: 'Silakan pilih topik budaya terlebih dahulu',
            icon: 'warning'
        });
        return;
    }
    
    const topics = {
        batik: {
            title: 'Batik',
            result: 'AI cenderung mengenali pola Batik Jawa Tengah lebih baik daripada Batik Jawa Timur'
        },
        wayang: {
            title: 'Wayang Kulit',
            result: 'Dataset AI lebih banyak berfokus pada Wayang Purwa daripada Wayang kontemporer Jawa Timur'
        },
        gamelan: {
            title: 'Gamelan',
            result: 'AI mampu mengidentifikasi nada dasar tetapi kesulitan dengan variasi lokal'
        },
        bahasa: {
            title: 'Bahasa Daerah',
            result: 'Akurasi AI untuk bahasa Jawa tinggi, tetapi rendah untuk bahasa Madura'
        },
        kuliner: {
            title: 'Kuliner Tradisional',
            result: 'AI sering salah mengidentifikasi makanan khas Jawa Timur sebagai makanan Jawa Tengah'
        }
    };
    
    const result = topics[topic] || topics.batik;
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = `
        <div class="alert alert-warning">
            <h6>Bias Terdeteksi pada: ${result.title}</h6>
            <p>${result.result}</p>
        </div>
        <div class="mt-2">
            <h6>Rekomendasi:</h6>
            <ul>
                <li>Tambahkan dataset yang lebih beragam</li>
                <li>Libatkan ahli budaya lokal</li>
                <li>Lakukan validasi silang dengan komunitas</li>
            </ul>
        </div>
    `;
}

// ========== ARTICLE PAGE FUNCTIONS ==========
function shareArticle() {
    const title = "Artikel AI Nusantara: Sinergi Tiga Pilar";
    const url = window.location.href;
    const text = "Baca artikel menarik tentang integrasi AI, budaya, dan energi terbarukan di Jawa Timur";
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        Swal.fire({
            title: 'Bagikan Artikel',
            html: `
                <div class="text-center">
                    <p>Salin tautan untuk dibagikan:</p>
                    <input type="text" class="form-control" value="${url}" readonly>
                    <button onclick="navigator.clipboard.writeText('${url}')" class="btn btn-primary mt-2">
                        Salin Tautan
                    </button>
                </div>
            `,
            showConfirmButton: true
        });
    }
}

function downloadPDF() {
    Swal.fire({
        title: 'Download PDF',
        text: 'Dokumen PDF sedang dipersiapkan...',
        icon: 'info',
        timer: 2000
    });
    
    // Simulate download
    setTimeout(() => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'PDF artikel berhasil diunduh',
            icon: 'success',
            timer: 2000
        });
    }, 2000);
}

// ========== PROJECT PAGE FUNCTIONS ==========
function initProjectFilters() {
    // Count total projects
    const projects = document.querySelectorAll('.project-item');
    const totalProjects = projects.length;
    document.getElementById('totalProjects').textContent = totalProjects;
    document.getElementById('projectCount').textContent = `${totalProjects} proyek`;
}

function filterProjects(category) {
    const projects = document.querySelectorAll('.project-item');
    const buttons = document.querySelectorAll('.btn-filter');
    const filterInfo = document.getElementById('activeFilterInfo');
    const projectCount = document.getElementById('projectCount');
    
    // Update button active state
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update filter info
    const filterNames = {
        'all': 'Semua Proyek',
        'ai': 'AI & Budaya',
        'energy': 'Energi',
        'ethics': 'Etika AI',
        'web': 'Web & Apps',
        'iot': 'IoT'
    };
    
    filterInfo.textContent = `Menampilkan: ${filterNames[category]}`;
    
    let visibleCount = 0;
    
    // Filter projects with staggered animation
    projects.forEach((project, index) => {
        const shouldShow = category === 'all' || project.dataset.category.includes(category);
        
        if (shouldShow) {
            visibleCount++;
            // Show with staggered delay
            setTimeout(() => {
                project.style.display = 'block';
                setTimeout(() => {
                    project.style.opacity = '1';
                    project.style.transform = 'translateY(0)';
                    project.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                }, 50);
            }, index * 50); // Stagger effect
        } else {
            // Hide with animation
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            project.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
    
    // Update project count
    projectCount.textContent = `${visibleCount} proyek`;
    
    // Add pulse animation
    projectCount.style.animation = 'none';
    setTimeout(() => {
        projectCount.style.animation = 'pulse 0.5s ease';
    }, 10);
    
    // Update total projects count
    document.getElementById('totalProjects').textContent = visibleCount;
}

function loadMoreProjects() {
    const moreProjects = document.getElementById('moreProjects');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (moreProjects.style.display === 'none' || moreProjects.style.display === '') {
        moreProjects.style.display = 'grid';
        moreProjects.style.opacity = '0';
        moreProjects.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            moreProjects.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            moreProjects.style.opacity = '1';
            moreProjects.style.transform = 'translateY(0)';
        }, 100);
        
        loadMoreBtn.innerHTML = '<i class="fas fa-minus me-2"></i>Tampilkan Lebih Sedikit';
        
        // Update project count
        const visibleProjects = document.querySelectorAll('.project-item[style*="display: block"], .project-item:not([style*="display: none"])').length;
        document.getElementById('totalProjects').textContent = visibleProjects + 2; // Add 2 more projects
    } else {
        moreProjects.style.opacity = '0';
        moreProjects.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            moreProjects.style.display = 'none';
            loadMoreBtn.innerHTML = '<i class="fas fa-plus me-2"></i>Muat Lebih Banyak Proyek';
            
            // Update project count
            const visibleProjects = document.querySelectorAll('.project-item[style*="display: block"], .project-item:not([style*="display: none"])').length;
            document.getElementById('totalProjects').textContent = visibleProjects - 2; // Subtract 2 projects
        }, 500);
    }
}

function showProjectDetail(projectId) {
    const projectDetails = {
        wayang: {
            title: 'AI Wayang Digital',
            description: 'Platform digitalisasi wayang kulit menggunakan teknologi AI untuk pelestarian budaya Jawa Timur.',
            details: `
                <div class="project-detail-content">
                    <div class="detail-section">
                        <h6><i class="fas fa-info-circle me-2"></i>Deskripsi Proyek</h6>
                        <p>Proyek ini bertujuan untuk mendigitalisasi wayang kulit tradisional Jawa Timur menggunakan teknologi Computer Vision dan WebGL. Hasilnya adalah museum virtual interaktif yang dapat diakses secara online.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-cogs me-2"></i>Teknologi yang Digunakan</h6>
                        <div class="tech-list">
                            <span class="badge bg-primary mb-2">TensorFlow.js</span>
                            <span class="badge bg-success mb-2">Three.js</span>
                            <span class="badge bg-info mb-2">WebGL</span>
                            <span class="badge bg-warning mb-2">Node.js</span>
                            <span class="badge bg-secondary mb-2">MongoDB</span>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-users me-2"></i>Tim Pengembang</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-user me-2"></i>Adi Wijaya (Ketua)</li>
                                    <li><i class="fas fa-user me-2"></i>Budi Santoso (AI Engineer)</li>
                                    <li><i class="fas fa-user me-2"></i>Citra Dewi (UI/UX Designer)</li>
                                    <li><i class="fas fa-user me-2"></i>Dian Pratama (Backend)</li>
                                    <li><i class="fas fa-user me-2"></i>Eka Putri (Data Analyst)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-chart-line me-2"></i>Progress</h6>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-success" style="width: 85%">85%</div>
                                </div>
                                <p class="mt-2 small">Estimasi selesai: 2 bulan lagi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-trophy me-2"></i>Pencapaian</h6>
                        <ul>
                            <li>Juara 1 Lomba Inovasi Digital Jawa Timur 2023</li>
                            <li>Presentasi di Konferensi AI Nasional 2023</li>
                            <li>Kolaborasi dengan Museum Wayang Indonesia</li>
                        </ul>
                    </div>
                </div>
            `,
            status: 'Aktif',
            duration: '6 bulan',
            teamSize: '5 siswa'
        },
        solar: {
            title: 'Solar Tracker AI',
            description: 'Sistem pelacak matahari berbasis AI untuk mengoptimalkan efisiensi panel surya secara otomatis.',
            details: `
                <div class="project-detail-content">
                    <div class="detail-section">
                        <h6><i class="fas fa-info-circle me-2"></i>Deskripsi Proyek</h6>
                        <p>Sistem ini menggunakan algoritma machine learning untuk memprediksi posisi matahari dan mengatur sudut panel surya secara otomatis. Dapat meningkatkan efisiensi energi hingga 35% dibandingkan panel statis.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-cogs me-2"></i>Teknologi yang Digunakan</h6>
                        <div class="tech-list">
                            <span class="badge bg-primary mb-2">Python</span>
                            <span class="badge bg-success mb-2">TensorFlow</span>
                            <span class="badge bg-info mb-2">Arduino</span>
                            <span class="badge bg-warning mb-2">Raspberry Pi</span>
                            <span class="badge bg-secondary mb-2">IoT Protocols</span>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-users me-2"></i>Tim Pengembang</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-user me-2"></i>Fajar Nugroho (Ketua)</li>
                                    <li><i class="fas fa-user me-2"></i>Gita Maya (ML Engineer)</li>
                                    <li><i class="fas fa-user me-2"></i>Hendra Saputra (Hardware)</li>
                                    <li><i class="fas fa-user me-2"></i>Indah Permata (Software)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-chart-line me-2"></i>Progress</h6>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-primary" style="width: 65%">65%</div>
                                </div>
                                <p class="mt-2 small">Estimasi selesai: 4 bulan lagi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-trophy me-2"></i>Pencapaian</h6>
                        <ul>
                            <li>Prototype berhasil diuji di SMAN 5 Taruna Brawijaya</li>
                            <li>Mendapat hibah penelitian dari Dinas Pendidikan</li>
                            <li>Artikel diterima di Journal of Renewable Energy</li>
                        </ul>
                    </div>
                </div>
            `,
            status: 'Dalam Pengembangan',
            duration: '8 bulan',
            teamSize: '4 siswa'
        },
        chatbot: {
            title: 'Chatbot Budaya Jawa',
            description: 'Asisten virtual yang dapat berinteraksi dan mengajarkan bahasa serta budaya Jawa kepada pengguna.',
            details: `
                <div class="project-detail-content">
                    <div class="detail-section">
                        <h6><i class="fas fa-info-circle me-2"></i>Deskripsi Proyek</h6>
                        <p>Chatbot NLP yang memahami bahasa Jawa dan Madura, dilengkapi dengan database pengetahuan tentang budaya, adat istiadat, dan sejarah Jawa Timur. Mendukung percakapan kontekstual dan pembelajaran interaktif.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-cogs me-2"></i>Teknologi yang Digunakan</h6>
                        <div class="tech-list">
                            <span class="badge bg-primary mb-2">Python NLP</span>
                            <span class="badge bg-success mb-2">Dialogflow</span>
                            <span class="badge bg-info mb-2">FastAPI</span>
                            <span class="badge bg-warning mb-2">React.js</span>
                            <span class="badge bg-secondary mb-2">PostgreSQL</span>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-users me-2"></i>Tim Pengembang</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-user me-2"></i>Joko Susilo (Ketua)</li>
                                    <li><i class="fas fa-user me-2"></i>Kartika Sari (NLP Specialist)</li>
                                    <li><i class="fas fa-user me-2"></i>Lukman Hakim (Backend)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-chart-line me-2"></i>Progress</h6>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-success" style="width: 90%">90%</div>
                                </div>
                                <p class="mt-2 small">Estimasi selesai: 1 bulan lagi</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-trophy me-2"></i>Pencapaian</h6>
                        <ul>
                            <li>Memiliki 500+ pengguna aktif</li>
                            <li>Mendapat sertifikasi dari Google Dialogflow</li>
                            <li>Kolaborasi dengan Dinas Kebudayaan Jawa Timur</li>
                        </ul>
                    </div>
                </div>
            `,
            status: 'Aktif',
            duration: '4 bulan',
            teamSize: '3 siswa'
        },
        bias: {
            title: 'AI Bias Detector',
            description: 'Alat pendeteksi bias dalam algoritma AI untuk memastikan keadilan dan kesetaraan dalam sistem kecerdasan buatan.',
            details: `
                <div class="project-detail-content">
                    <div class="detail-section">
                        <h6><i class="fas fa-info-circle me-2"></i>Deskripsi Proyek</h6>
                        <p>Tool untuk mengaudit dataset dan model AI agar bebas dari bias budaya dan sosial. Menggunakan teknik fairness metrics dan explainable AI untuk meningkatkan transparansi.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-cogs me-2"></i>Teknologi yang Digunakan</h6>
                        <div class="tech-list">
                            <span class="badge bg-primary mb-2">Python</span>
                            <span class="badge bg-success mb-2">Scikit-learn</span>
                            <span class="badge bg-info mb-2">SHAP</span>
                            <span class="badge bg-warning mb-2">Streamlit</span>
                            <span class="badge bg-secondary mb-2">Fairlearn</span>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-users me-2"></i>Tim Pengembang</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-user me-2"></i>Maya Indah (Ketua)</li>
                                    <li><i class="fas fa-user me-2"></i>Nugroho Santoso (Data Scientist)</li>
                                    <li><i class="fas fa-user me-2"></i>Oki Pratama (Frontend)</li>
                                    <li><i class="fas fa-user me-2"></i>Putri Lestari (UX Researcher)</li>
                                    <li><i class="fas fa-user me-2"></i>Rudi Hartono (Backend)</li>
                                    <li><i class="fas fa-user me-2"></i>Sari Dewi (Ethics Specialist)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-chart-line me-2"></i>Progress</h6>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-warning" style="width: 45%">45%</div>
                                </div>
                                <p class="mt-2 small">Estimasi selesai: 6 bulan lagi</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            status: 'Prototype',
            duration: '10 bulan',
            teamSize: '6 siswa'
        },
        wind: {
            title: 'Wind Pattern Analyzer',
            description: 'Analisis pola angin menggunakan machine learning untuk optimasi penempatan turbin angin di Jawa Timur.',
            details: `
                <div class="project-detail-content">
                    <div class="detail-section">
                        <h6><i class="fas fa-info-circle me-2"></i>Deskripsi Proyek</h6>
                        <p>Sistem prediksi pola angin menggunakan time series analysis dan machine learning untuk menentukan lokasi optimal instalasi turbin angin.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-cogs me-2"></i>Teknologi yang Digunakan</h6>
                        <div class="tech-list">
                            <span class="badge bg-primary mb-2">Python</span>
                            <span class="badge bg-success mb-2">Prophet</span>
                            <span class="badge bg-info mb-2">LSTM</span>
                            <span class="badge bg-warning mb-2">Plotly</span>
                            <span class="badge bg-secondary mb-2">GeoPandas</span>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-users me-2"></i>Tim Pengembang</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-user me-2"></i>Tono Wijaya (Ketua)</li>
                                    <li><i class="fas fa-user me-2"></i>Umi Kartika (Data Engineer)</li>
                                    <li><i class="fas fa-user me-2"></i>Vino Pratama (ML Engineer)</li>
                                    <li><i class="fas fa-user me-2"></i>Wulan Sari (GIS Specialist)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-chart-line me-2"></i>Progress</h6>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-secondary" style="width: 30%">30%</div>
                                </div>
                                <p class="mt-2 small">Estimasi selesai: 8 bulan lagi</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            status: 'Riset',
            duration: '7 bulan',
            teamSize: '4 siswa'
        },
        batik: {
            title: 'AI Batik Generator',
            description: 'Generator pola batik menggunakan GAN (Generative Adversarial Network) untuk kreativitas budaya.',
            details: `
                <div class="project-detail-content">
                    <div class="detail-section">
                        <h6><i class="fas fa-info-circle me-2"></i>Deskripsi Proyek</h6>
                        <p>Generative Adversarial Network (GAN) untuk membuat pola batik baru berdasarkan pola tradisional Jawa Timur dengan sentuhan modern.</p>
                    </div>
                    
                    <div class="detail-section">
                        <h6><i class="fas fa-cogs me-2"></i>Teknologi yang Digunakan</h6>
                        <div class="tech-list">
                            <span class="badge bg-primary mb-2">Python</span>
                            <span class="badge bg-success mb-2">TensorFlow</span>
                            <span class="badge bg-info mb-2">StyleGAN2</span>
                            <span class="badge bg-warning mb-2">Flask</span>
                            <span class="badge bg-secondary mb-2">OpenCV</span>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-users me-2"></i>Tim Pengembang</h6>
                                <ul class="list-unstyled">
                                    <li><i class="fas fa-user me-2"></i>Xavier Tan (Ketua)</li>
                                    <li><i class="fas fa-user me-2"></i>Yuni Astuti (AI Artist)</li>
                                    <li><i class="fas fa-user me-2"></i>Zaky Fahmi (Deep Learning)</li>
                                    <li><i class="fas fa-user me-2"></i>Ayu Lestari (Designer)</li>
                                    <li><i class="fas fa-user me-2"></i>Bima Sakti (Developer)</li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-section">
                                <h6><i class="fas fa-chart-line me-2"></i>Progress</h6>
                                <div class="progress" style="height: 10px;">
                                    <div class="progress-bar bg-info" style="width: 60%">60%</div>
                                </div>
                                <p class="mt-2 small">Estimasi selesai: 5 bulan lagi</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            status: 'Eksperimental',
            duration: '9 bulan',
            teamSize: '5 siswa'
        }
    };
    
    const project = projectDetails[projectId] || projectDetails.wayang;
    
    const modalBody = `
        <div class="project-detail-modal">
            <div class="project-header-modal">
                <h4>${project.title}</h4>
                <p class="text-muted">${project.description}</p>
            </div>
            
            <div class="project-info-modal">
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="info-box">
                            <h6><i class="fas fa-calendar me-2"></i>Durasi</h6>
                            <p class="mb-0">${project.duration}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="info-box">
                            <h6><i class="fas fa-users me-2"></i>Tim</h6>
                            <p class="mb-0">${project.teamSize}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="info-box">
                            <h6><i class="fas fa-flag me-2"></i>Status</h6>
                            <p class="mb-0">
                                <span class="badge ${project.status === 'Aktif' ? 'bg-success' : 
                                                project.status === 'Dalam Pengembangan' ? 'bg-primary' : 
                                                project.status === 'Prototype' ? 'bg-warning' : 
                                                project.status === 'Riset' ? 'bg-secondary' : 'bg-info'}">
                                    ${project.status}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                
                ${project.details}
                
                <div class="detail-section mt-4">
                    <h6><i class="fas fa-link me-2"></i>Tautan Terkait</h6>
                    <div class="project-links">
                        <a href="#" class="btn btn-outline-primary btn-sm me-2" onclick="viewSourceCode('${projectId}')">
                            <i class="fab fa-github me-1"></i>Source Code
                        </a>
                        <a href="#" class="btn btn-outline-success btn-sm me-2" onclick="showDemoProject('${projectId}')">
                            <i class="fas fa-play me-1"></i>Live Demo
                        </a>
                        <a href="#" class="btn btn-outline-info btn-sm" onclick="downloadDocs('${projectId}')">
                            <i class="fas fa-file-pdf me-1"></i>Documentation
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(`Detail Proyek: ${project.title}`, modalBody);
}

// Additional functions for projects
function viewSourceCode(projectId) {
    const repos = {
        wayang: 'https://github.com/ai-nusantara/ai-wayang',
        solar: 'https://github.com/ai-nusantara/solar-tracker',
        chatbot: 'https://github.com/ai-nusantara/jawa-chatbot',
        bias: 'https://github.com/ai-nusantara/bias-detector',
        wind: 'https://github.com/ai-nusantara/wind-analyzer',
        batik: 'https://github.com/ai-nusantara/batik-generator'
    };
    
    Swal.fire({
        title: 'Source Code',
        html: `
            <div class="text-center">
                <p>Source code proyek ini tersedia di repository GitHub kami.</p>
                <p><small>Repository: ${repos[projectId] || 'https://github.com/ai-nusantara'}</small></p>
            </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Buka GitHub',
        cancelButtonText: 'Tutup'
    }).then((result) => {
        if (result.isConfirmed) {
            window.open(repos[projectId] || 'https://github.com/ai-nusantara', '_blank');
        }
    });
}

function showDemoProject(projectId) {
    const demos = {
        wayang: 'https://demo.ai-nusantara.wayang',
        solar: 'https://demo.ai-nusantara.solar',
        chatbot: 'https://chat.ai-nusantara.id',
        batik: 'https://demo.ai-nusantara.batik'
    };
    
    Swal.fire({
        title: 'Demo Proyek',
        html: `
            <div class="text-center">
                <p>Demo untuk proyek <strong>${projectId}</strong></p>
                <div class="spinner-border text-primary mt-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 small text-muted">Membuka demo dalam beberapa detik...</p>
            </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 1500
    }).then(() => {
        if (demos[projectId]) {
            window.open(demos[projectId], '_blank');
        } else {
            Swal.fire({
                title: 'Demo Tidak Tersedia',
                text: 'Demo untuk proyek ini sedang dalam pengembangan.',
                icon: 'warning',
                confirmButtonText: 'Mengerti'
            });
        }
    });
}

function downloadDocs(projectId) {
    Swal.fire({
        title: 'Download Dokumentasi',
        text: 'Dokumen PDF sedang dipersiapkan...',
        icon: 'info',
        timer: 2000
    });
    
    setTimeout(() => {
        Swal.fire({
            title: 'Berhasil!',
            text: 'Dokumentasi proyek berhasil diunduh',
            icon: 'success',
            timer: 2000
        });
    }, 2000);
}

// ========== SHARE FUNCTIONS ==========
function shareSocial(platform) {
    const url = window.location.href;
    const text = "Lihat website AI Nusantara: Integrasi AI, Budaya, dan Energi Terbarukan!";
    
    let shareUrl = '';
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'instagram':
            Swal.fire('Instagram', 'Silakan salin tautan dan bagikan di Instagram', 'info');
            return;
        case 'github':
            shareUrl = 'https://github.com/ai-nusantara';
            break;
        case 'youtube':
            shareUrl = 'https://youtube.com';
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank');
    }
}

function contactForm() {
    Swal.fire({
        title: 'Hubungi Kami',
        html: `
            <div class="text-start">
                <div class="mb-3">
                    <label class="form-label">Nama</label>
                    <input type="text" class="form-control" id="contactName" placeholder="Nama Anda">
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" id="contactEmail" placeholder="email@contoh.com">
                </div>
                <div class="mb-3">
                    <label class="form-label">Pesan</label>
                    <textarea class="form-control" id="contactMessage" rows="3" placeholder="Tulis pesan Anda..."></textarea>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Kirim Pesan',
        preConfirm: () => {
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;
            
            if (!name || !email || !message) {
                Swal.showValidationMessage('Harap isi semua field');
                return false;
            }
            
            return { name, email, message };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                'Terima Kasih!',
                'Pesan Anda telah dikirim. Kami akan membalas secepatnya.',
                'success'
            );
        }
    });
}

// ========== CHATBOT SYSTEM ==========
function initChatbot() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.innerHTML = `
            <div class="message bot">
                <p>Halo! Saya Asisten Budaya AI. Saya bisa membantu Anda belajar tentang budaya Jawa Timur dan energi terbarukan.</p>
            </div>
        `;
    }
}

function toggleChatbot() {
    const chatWindow = document.getElementById('chatbotWindow');
    if (chatWindow) {
        chatWindow.classList.toggle('active');
        // Remove notification when chatbot is opened
        const notification = document.getElementById('chatNotification');
        if (notification) {
            notification.style.display = 'none';
        }
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!input || !messagesContainer || !input.value.trim()) return;
    
    const userMessage = input.value.trim();
    
    // Add user message
    messagesContainer.innerHTML += `
        <div class="message user">
            <p>${userMessage}</p>
        </div>
    `;
    
    // Clear input
    input.value = '';
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // AI response
    setTimeout(() => {
        const response = getChatbotResponse(userMessage);
        messagesContainer.innerHTML += `
            <div class="message bot">
                <p>${response}</p>
            </div>
        `;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

function getChatbotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai')) {
        return 'Halo! Ada yang bisa saya bantu tentang budaya Jawa Timur atau energi terbarukan?';
    } else if (lowerMessage.includes('budaya') || lowerMessage.includes('tradisi')) {
        return 'Jawa Timur kaya akan budaya seperti Batik, Wayang Kulit, Reog Ponorogo, dan tari tradisional. AI membantu melestarikan budaya melalui digitalisasi dan arsip digital.';
    } else if (lowerMessage.includes('energi') || lowerMessage.includes('surya')) {
        return 'Jawa Timur memiliki potensi energi terbarukan besar: energi surya (4.8 kWh/m²/hari), angin, geothermal, dan bioenergi. Gunakan kalkulator di halaman energi untuk menghitung potensi!';
    } else if (lowerMessage.includes('proyek') || lowerMessage.includes('ai')) {
        return 'Kami memiliki proyek seperti AI Wayang Digital, Solar Tracker, Chatbot Budaya, dan AI Bias Detector. Lihat di halaman proyek untuk detailnya.';
    } else if (lowerMessage.includes('terima kasih') || lowerMessage.includes('thanks')) {
        return 'Sama-sama! Jika ada pertanyaan lain, jangan ragu untuk bertanya.';
    } else {
        const responses = [
            'Saya fokus pada budaya Jawa Timur dan energi terbarukan. Bisa tanyakan hal spesifik?',
            'Maaf, saya hanya terlatih untuk topik budaya dan energi. Ada pertanyaan lain?',
            'Coba tanyakan tentang Batik, Wayang, atau energi surya di Jawa Timur!'
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// ========== CULTURE PAGE FUNCTIONS ==========
function initBudayaPage() {
    // Load culture data
    loadBudayaData();
    
    // Setup event listeners for demo
    setupDemoListeners();
    
    // Update stats
    updateCultureStats();
    
    console.log('Budaya page initialized');
}

function loadBudayaData() {
    const explorer = document.getElementById('budayaExplorer');
    if (!explorer) return;

    // East Java culture data with Unsplash images
    const budayaData = [
        { 
            name: 'Batik Jawa Timur', 
            image: 'images/batikjatim.jpg', 
            icon: 'fas fa-palette', 
            color: '#1E5631',
            description: 'Batik khas Jawa Timur seperti Batik Madura dan Batik Suroboyo dengan warna cerah dan motif berani.',
            region: 'Seluruh Jawa Timur',
            aiApplications: ['Pattern Recognition', 'Color Analysis', 'Digital Preservation']
        },
        { 
            name: 'Wayang Kulit', 
            image: 'images/wayangkulit.jpg', 
            icon: 'fas fa-theater-masks', 
            color: '#8B4513',
            description: 'Seni pertunjukan wayang kulit dengan cerita Mahabharata dan Ramayana versi Jawa Timur.',
            region: 'Jawa Timur (khususnya Surabaya, Malang)',
            aiApplications: ['Motion Capture', 'Voice Synthesis', '3D Digitization']
        },
        { 
            name: 'Reog Ponorogo', 
            image: 'images/reogponorogo.jpg', 
            icon: 'fas fa-lion', 
            color: '#FF6347',
            description: 'Tarian tradisional dari Ponorogo dengan topeng harimau besar (Singa Barong) yang ikonik.',
            region: 'Ponorogo, Jawa Timur',
            aiApplications: ['Movement Analysis', 'Costume Recognition', 'Performance Simulation']
        },
        { 
            name: 'Gamelan Jawa', 
            image: 'images/gamelan.jpg', 
            icon: 'fas fa-music', 
            color: '#E9C46A',
            description: 'Ansambel musik tradisional Jawa dengan instrumen perkusi dari bronze.',
            region: 'Seluruh Jawa Timur',
            aiApplications: ['Sound Analysis', 'Music Generation', 'Rhythm Recognition']
        },
        { 
            name: 'Bahasa Daerah', 
            image: 'images/bahasadaerah.jpg', 
            icon: 'fas fa-language', 
            color: '#2A9D8F',
            description: 'Bahasa Jawa dan Madura dengan tingkatan bahasa (ngoko, krama, krama inggil) yang kompleks.',
            region: 'Seluruh Jawa Timur',
            aiApplications: ['Speech Recognition', 'NLP Processing', 'Language Preservation']
        },
        { 
            name: 'Kuliner Tradisional', 
            image: 'images/kuliner.jpg', 
            icon: 'fas fa-utensils', 
            color: '#8A2BE2',
            description: 'Makanan khas seperti Rawon, Soto Lamongan, Rujak Cingur, dan Lontong Balap.',
            region: 'Berbagai daerah di Jawa Timur',
            aiApplications: ['Recipe Analysis', 'Flavor Profiling', 'Cultural Documentation']
        }
    ];

    // Clear loading spinner
    explorer.innerHTML = '';
    
    // Add culture items
    budayaData.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="budaya-item" onclick="showBudayaDetail(${index})" data-aos="fade-up" data-aos-delay="${index * 100}">
                <img src="${item.image}" 
                     alt="${item.name}" 
                     loading="lazy"
                     class="img-fluid"
                     onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"150\" viewBox=\"0 0 150 150\"><rect width=\"150\" height=\"150\" fill=\"%23${item.color.substring(1)}\"/><text x=\"50%\" y=\"50%\" font-family=\"Arial\" font-size=\"14\" fill=\"white\" text-anchor=\"middle\" dy=\".3em\">${item.name.charAt(0)}</text></svg>'">
                <h6 class="mt-3">${item.name}</h6>
                <small>${getCultureType(item.name)}</small>
                <span class="culture-badge">${item.region.split(',')[0]}</span>
            </div>
        `;
        explorer.appendChild(col);
    });
}

// Helper function to determine culture type
function getCultureType(name) {
    const types = {
        'Batik Jawa Timur': 'Seni Tekstil Tradisional',
        'Wayang Kulit': 'Seni Pertunjukan',
        'Reog Ponorogo': 'Tari Tradisional',
        'Gamelan Jawa': 'Ansambel Musik',
        'Bahasa Daerah': 'Warisan Linguistik',
        'Kuliner Tradisional': 'Makanan Khas'
    };
    return types[name] || 'Budaya Jawa Timur';
}

// Show culture detail in modal
function showBudayaDetail(index) {
    const budayaData = [
        {
            title: 'Batik Jawa Timur',
            image: 'images/batikjatim.jpg',
            description: 'Batik khas Jawa Timur seperti Batik Madura dan Batik Suroboyo dengan warna cerah dan motif berani.',
            details: `
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-map-marker-alt me-2"></i>Daerah Asal:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-check-circle text-success me-2"></i>Madura (Batik Madura)</li>
                            <li><i class="fas fa-check-circle text-success me-2"></i>Surabaya (Batik Suroboyo)</li>
                            <li><i class="fas fa-check-circle text-success me-2"></i>Ponorogo (Batik Ponorogo)</li>
                            <li><i class="fas fa-check-circle text-success me-2"></i>Tulungagung (Batik Tulungagung)</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-palette me-2"></i>Ciri Khas:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-star text-warning me-2"></i>Warna cerah dan kontras</li>
                            <li><i class="fas fa-star text-warning me-2"></i>Motif berani dan dinamis</li>
                            <li><i class="fas fa-star text-warning me-2"></i>Penggunaan warna merah, hijau, emas</li>
                            <li><i class="fas fa-star text-warning me-2"></i>Motif geometris dan flora-fauna</li>
                        </ul>
                    </div>
                </div>
                <div class="mt-4">
                    <h6><i class="fas fa-robot me-2"></i>Pelestarian dengan AI:</h6>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h6><i class="fas fa-camera me-2"></i>Digitalisasi</h6>
                                    <p class="small mb-0">Scanning pola tradisional dengan resolusi tinggi</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card mb-3">
                                <div class="card-body">
                                    <h6><i class="fas fa-brain me-2"></i>Analisis AI</h6>
                                    <p class="small mb-0">Klasifikasi pola dan warna menggunakan machine learning</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        {
            title: 'Wayang Kulit',
            image: 'images/wayangkulit.jpg',
            description: 'Seni pertunjukan wayang kulit dengan cerita Mahabharata dan Ramayana versi Jawa Timur.',
            details: `
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-user-tie me-2"></i>Dalang Terkenal:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-user text-primary me-2"></i>Ki Manteb Soedharsono</li>
                            <li><i class="fas fa-user text-primary me-2"></i>Ki Anom Suroto</li>
                            <li><i class="fas fa-user text-primary me-2"></i>Ki Enthus Susmono</li>
                            <li><i class="fas fa-user text-primary me-2"></i>Ki Sugino Siswocarito</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-music me-2"></i>Pengiring:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-drum text-success me-2"></i>Gamelan Jawa (selendro & pelog)</li>
                            <li><i class="fas fa-microphone text-success me-2"></i>Sinden (penyanyi tradisional)</li>
                            <li><i class="fas fa-users text-success me-2"></i>Pengrawit (pemain gamelan)</li>
                        </ul>
                    </div>
                </div>
                <div class="mt-4">
                    <h6><i class="fas fa-robot me-2"></i>Digitalisasi dengan AI:</h6>
                    <div class="alert alert-info">
                        <i class="fas fa-lightbulb me-2"></i>
                        <strong>Proyek AI Wayang Digital:</strong> Platform untuk pembelajaran wayang interaktif dengan teknologi AR/VR
                    </div>
                </div>
            `
        },
        {
            title: 'Reog Ponorogo',
            image: 'images/reogponorogo.jpg',
            description: 'Tarian tradisional dari Ponorogo dengan topeng harimau besar (Singa Barong) yang ikonik.',
            details: `
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-weight-hanging me-2"></i>Kelengkapan:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-mask text-danger me-2"></i>Topeng Singa Barong (30-40kg)</li>
                            <li><i class="fas fa-mask text-warning me-2"></i>Topeng Bujang Ganong</li>
                            <li><i class="fas fa-tshirt text-info me-2"></i>Pakaian warok hitam</li>
                            <li><i class="fas fa-drum text-success me-2"></i>Musik pengiring khas</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-users me-2"></i>Pemain:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-user text-primary me-2"></i>Pembarong (pemain singa barong)</li>
                            <li><i class="fas fa-user text-primary me-2"></i>Bujang Ganong (patih)</li>
                            <li><i class="fas fa-user text-primary me-2"></i>Warok (pendekar spiritual)</li>
                            <li><i class="fas fa-user text-primary me-2"></i>Penari latar (30-50 orang)</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: 'Gamelan Jawa',
            image: 'images/gamelan.jpg',
            description: 'Ansambel musik tradisional Jawa dengan instrumen perkusi dari bronze.',
            details: `
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-drum me-2"></i>Instrumen Utama:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-music text-primary me-2"></i>Kendang (drum utama)</li>
                            <li><i class="fas fa-music text-primary me-2"></i>Saron (metallophone)</li>
                            <li><i class="fas fa-music text-primary me-2"></i>Bonang (gong chime)</li>
                            <li><i class="fas fa-music text-primary me-2"></i>Gong ageng (large gong)</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-sliders-h me-2"></i>Laras (Skala):</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-wave-square text-success me-2"></i>Slendro (5 nada)</li>
                            <li><i class="fas fa-wave-square text-success me-2"></i>Pelog (7 nada)</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: 'Bahasa Daerah',
            image: 'images/bahasadaerah.jpg',
            description: 'Bahasa Jawa dan Madura dengan tingkatan bahasa (ngoko, krama, krama inggil) yang kompleks.',
            details: `
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-language me-2"></i>Bahasa Jawa:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-comment text-primary me-2"></i>Ngoko (bahasa kasar)</li>
                            <li><i class="fas fa-comment text-success me-2"></i>Krama (bahasa halus)</li>
                            <li><i class="fas fa-comment text-info me-2"></i>Krama Inggil (sangat halus)</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-language me-2"></i>Bahasa Madura:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-comment-dots text-warning me-2"></i>Enja'-iya (bahasa halus)</li>
                            <li><i class="fas fa-comment-dots text-warning me-2"></i>Enggi-enten (bahasa sedang)</li>
                            <li><i class="fas fa-comment-dots text-warning me-2"></i>Enggi-bunten (bahasa kasar)</li>
                        </ul>
                    </div>
                </div>
            `
        },
        {
            title: 'Kuliner Tradisional',
            image: 'images/kuliner.jpg',
            description: 'Makanan khas seperti Rawon, Soto Lamongan, Rujak Cingur, dan Lontong Balap.',
            details: `
                <div class="row">
                    <div class="col-md-6">
                        <h6><i class="fas fa-utensils me-2"></i>Makanan Khas:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-utensil-spoon text-danger me-2"></i>Rawon (Surabaya)</li>
                            <li><i class="fas fa-utensil-spoon text-success me-2"></i>Soto Lamongan</li>
                            <li><i class="fas fa-utensil-spoon text-warning me-2"></i>Rujak Cingur</li>
                            <li><i class="fas fa-utensil-spoon text-info me-2"></i>Lontong Balap</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h6><i class="fas fa-map-marker-alt me-2"></i>Daerah Asal:</h6>
                        <ul class="list-unstyled">
                            <li><i class="fas fa-map-pin text-primary me-2"></i>Surabaya: Rawon, Rujak Cingur</li>
                            <li><i class="fas fa-map-pin text-success me-2"></i>Lamongan: Soto Lamongan</li>
                            <li><i class="fas fa-map-pin text-warning me-2"></i>Malang: Bakso Malang</li>
                            <li><i class="fas fa-map-pin text-info me-2"></i>Madura: Sate Madura</li>
                        </ul>
                    </div>
                </div>
            `
        }
    ];

    const detail = budayaData[index] || budayaData[0];
    
    const modalBody = `
        <div class="budaya-detail-modal">
            <div class="text-center mb-4">
                <img src="${detail.image}" 
                     alt="${detail.title}" 
                     class="img-fluid rounded shadow" 
                     style="max-height: 250px; object-fit: cover; width: 100%;">
            </div>
            
            <h4 class="text-center mb-3">${detail.title}</h4>
            <p class="text-center mb-4">${detail.description}</p>
            
            ${detail.details}
            
            <div class="alert alert-success mt-4">
                <i class="fas fa-robot me-2"></i>
                <strong>Teknologi AI:</strong> Budaya ini sedang didigitalisasi dan dipelajari menggunakan machine learning untuk pelestarian jangka panjang.
            </div>
        </div>
    `;
    
    showModal(`Detail Budaya: ${detail.title}`, modalBody);
}

// ========== AI DEMO FUNCTIONS ==========
function showDemo() {
    const demoSection = document.getElementById('demoBudaya');
    if (!demoSection) {
        Swal.fire('Error', 'Demo section tidak ditemukan', 'error');
        return;
    }
    
    // Show with animation
    demoSection.style.display = 'block';
    demoSection.style.opacity = '0';
    demoSection.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        demoSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        demoSection.style.opacity = '1';
        demoSection.style.transform = 'translateY(0)';
    }, 100);
    
    // Scroll to demo section
    demoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Generate initial pattern
    generateNewPattern();
    
    // Reset analysis
    resetAnalysis();
    
    // Show notification
    Swal.fire({
        title: 'Demo AI Dimulai',
        text: 'Demo pengenalan pola Batik Jawa Timur dengan AI',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
    });
}

// Generate new batik pattern
function generateNewPattern() {
    const patternBox = document.getElementById('patternBox');
    if (!patternBox) return;
    
    // Traditional East Java Batik colors
    const colors = [
        '#1E5631', // Dark green - fertility symbol
        '#2A9D8F', // Turquoise - freshness
        '#E9C46A', // Gold - prosperity
        '#A0522D', // Soga brown - earth
        '#8B4513', // Dark brown - strength
        '#8A2BE2', // Purple - spirituality
        '#FF6347', // Red - courage
        '#4B0082',  // Indigo - wisdom
        '#FFD700', // Gold yellow - glory
        '#32CD32'  // Light green - growth
    ];
    
    let html = '';
    const patternTypes = ['geometric', 'floral', 'abstract', 'traditional'];
    const selectedPattern = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    // Generate 9 cells with variations
    for (let i = 0; i < 9; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const rotation = Math.floor(Math.random() * 4) * 90;
        const size = Math.random() * 0.5 + 0.5;
        
        let shape = 'square';
        if (selectedPattern === 'floral') {
            shape = 'circle';
        } else if (selectedPattern === 'abstract') {
            shape = Math.random() > 0.5 ? 'circle' : 'square';
        }
        
        html += `
            <div class="pattern-cell" 
                 style="background-color: ${color};
                        transform: rotate(${rotation}deg) scale(${size});
                        border-radius: ${shape === 'circle' ? '50%' : '8px'};
                        ${selectedPattern === 'traditional' ? 'border: 2px solid rgba(255,255,255,0.3);' : ''}">
                ${selectedPattern === 'geometric' ? '<div class="inner-geom"></div>' : ''}
            </div>`;
    }
    
    patternBox.innerHTML = html;
    
    // Update pattern info
    const patternNames = {
        'geometric': 'Geometris',
        'floral': 'Floral',
        'abstract': 'Abstrak',
        'traditional': 'Tradisional'
    };
    
    // Add event listener for cells
    const cells = patternBox.querySelectorAll('.pattern-cell');
    cells.forEach(cell => {
        cell.addEventListener('click', function() {
            this.style.transform += ' scale(1.2)';
            setTimeout(() => {
                this.style.transform = this.style.transform.replace(' scale(1.2)', '');
            }, 300);
        });
    });
    
    // Update stats
    updateDemoStats();
}

// Analyze pattern with AI
function analyzePattern() {
    const aiResult = document.getElementById('aiResult');
    const progressInfo = document.getElementById('progressInfo');
    const analysisProgress = document.getElementById('analysisProgress');
    const progressText = document.getElementById('progressText');
    
    if (!aiResult) return;
    
    // Show progress
    progressInfo.style.display = 'block';
    
    // Simulate analysis process
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        analysisProgress.style.width = progress + '%';
        
        if (progress <= 30) {
            progressText.textContent = 'Memproses gambar...';
        } else if (progress <= 60) {
            progressText.textContent = 'Mengekstrak fitur pola...';
        } else if (progress <= 90) {
            progressText.textContent = 'Menganalisis warna dominan...';
        } else {
            progressText.textContent = 'Menyelesaikan analisis...';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                showAnalysisResult();
                progressInfo.style.display = 'none';
                analysisProgress.style.width = '0%';
            }, 500);
        }
    }, 100);
}

// Show analysis results
function showAnalysisResult() {
    const aiResult = document.getElementById('aiResult');
    if (!aiResult) return;
    
    // East Java batik pattern data
    const batikPatterns = [
        { 
            name: 'Parang Rusak', 
            origin: 'Surakarta/Yogyakarta',
            meaning: 'Simbol perjuangan dan keteguhan hati',
            accuracy: 92,
            color: '#1E5631',
            description: 'Motif berbentuk seperti pedang yang rusak, melambangkan perjuangan dalam kehidupan.'
        },
        { 
            name: 'Kawung', 
            origin: 'Yogyakarta',
            meaning: 'Kesempurnaan dan kemurnian hati',
            accuracy: 88,
            color: '#8B4513',
            description: 'Motif berbentuk seperti buah kawung (sejenis kelapa), simbol kesempurnaan.'
        },
        { 
            name: 'Mega Mendung', 
            origin: 'Cirebon',
            meaning: 'Kesabaran dan ketenangan',
            accuracy: 85,
            color: '#1E90FF',
            description: 'Motif awan yang menggambarkan kesabaran dalam menghadapi cobaan.'
        },
        { 
            name: 'Batik Madura', 
            origin: 'Madura, Jawa Timur',
            meaning: 'Kekuatan dan keberanian',
            accuracy: 95,
            color: '#FF6347',
            description: 'Warna cerah dan motif berani, mencerminkan karakter masyarakat Madura.'
        },
        { 
            name: 'Sido Mukti', 
            origin: 'Surakarta',
            meaning: 'Kemakmuran dan kebahagiaan',
            accuracy: 82,
            color: '#E9C46A',
            description: 'Motif yang sering digunakan dalam upacara pernikahan.'
        },
        { 
            name: 'Truntum', 
            origin: 'Yogyakarta',
            meaning: 'Cinta yang tumbuh kembali',
            accuracy: 78,
            color: '#8A2BE2',
            description: 'Motif bintang-bintang kecil, simbol cinta yang bersemi kembali.'
        }
    ];
    
    // Select pattern randomly (with weight for East Java)
    const patternIndex = Math.floor(Math.random() * batikPatterns.length);
    const pattern = batikPatterns[patternIndex];
    
    // Update statistics
    updateAnalysisStats(pattern.accuracy);
    
    // Display results
    aiResult.innerHTML = `
        <div class="analysis-result animate__animated animate__fadeIn">
            <div class="text-center mb-4">
                <h4 class="text-success">
                    <i class="fas fa-check-circle me-2"></i>Analisis Selesai
                </h4>
                <p class="text-muted">AI berhasil menganalisis pola batik dengan akurasi tinggi</p>
            </div>
            
            <div class="card mb-4 border-success">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-3 text-center">
                            <div class="pattern-sample" 
                                 style="width: 80px; height: 80px; background-color: ${pattern.color}; border-radius: 10px; margin: 0 auto;"></div>
                        </div>
                        <div class="col-md-9">
                            <h5 class="card-title">${pattern.name}</h5>
                            <p class="card-text mb-2">
                                <i class="fas fa-map-marker-alt me-2 text-muted"></i>
                                <strong>Asal:</strong> ${pattern.origin}
                            </p>
                            <div class="progress mb-3" style="height: 25px;">
                                <div class="progress-bar bg-success" 
                                     style="width: ${pattern.accuracy}%">
                                    <span class="fw-bold">${pattern.accuracy}% Akurasi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h6><i class="fas fa-brain me-2 text-primary"></i>Makna Filosofis</h6>
                            <p class="mt-2">${pattern.meaning}</p>
                            <p class="small text-muted mb-0">${pattern.description}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h6><i class="fas fa-chart-bar me-2 text-success"></i>Analisis Teknis</h6>
                            <div class="mt-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Kecocokan Pola:</span>
                                    <span class="fw-bold">${pattern.accuracy}%</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Warna Dominan:</span>
                                    <span class="fw-bold" style="color: ${pattern.color}">${pattern.color}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Kompleksitas:</span>
                                    <span class="fw-bold">${Math.floor(Math.random() * 5) + 6}/10</span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <span>Keunikan:</span>
                                    <span class="fw-bold">${Math.floor(Math.random() * 30) + 70}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-info mt-3">
                <i class="fas fa-lightbulb me-2"></i>
                <strong>Saran AI:</strong> Digitalisasi pola ini ke dalam database budaya Jawa Timur untuk pelestarian digital.
            </div>
            
            <div class="text-center mt-4">
                <button class="btn btn-outline-primary me-2" onclick="savePatternResult()">
                    <i class="fas fa-save me-2"></i>Simpan Hasil
                </button>
                <button class="btn btn-outline-success" onclick="learnMorePattern()">
                    <i class="fas fa-book me-2"></i>Pelajari Lebih Lanjut
                </button>
            </div>
        </div>
    `;
    
    // Add animation
    aiResult.classList.add('animate__animated', 'animate__fadeIn');
}

// Reset analysis
function resetAnalysis() {
    const aiResult = document.getElementById('aiResult');
    const progressInfo = document.getElementById('progressInfo');
    
    if (aiResult) {
        aiResult.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-search fa-4x mb-3 text-muted"></i>
                <h5>Analisis Pola Batik</h5>
                <p class="mb-3">Tekan tombol "Analisis dengan AI" untuk memulai analisis pola Batik tradisional Jawa Timur.</p>
                <div class="alert alert-warning">
                    <i class="fas fa-lightbulb me-2"></i>
                    AI akan mengidentifikasi pola, warna dominan, dan makna filosofis.
                </div>
            </div>
        `;
    }
    
    if (progressInfo) {
        progressInfo.style.display = 'none';
    }
    
    // Reset stats
    document.getElementById('statAccuracy').textContent = '0%';
    document.getElementById('statTime').textContent = '0s';
}

// Update demo statistics
function updateDemoStats() {
    const accuracy = Math.floor(Math.random() * 10) + 88; // 88-98%
    const patterns = Math.floor(Math.random() * 5) + 20; // 20-25
    const time = (Math.random() * 0.5 + 0.5).toFixed(1); // 0.5-1.0s
    
    document.getElementById('statAccuracy').textContent = accuracy + '%';
    document.getElementById('statPatterns').textContent = patterns;
    document.getElementById('statTime').textContent = time + 's';
}

// Update analysis statistics
function updateAnalysisStats(accuracy) {
    document.getElementById('statAccuracy').textContent = accuracy + '%';
    document.getElementById('statPatterns').textContent = parseInt(document.getElementById('statPatterns').textContent) + 1;
    document.getElementById('statTime').textContent = '0.8s';
}

// Helper functions for culture demo
function savePatternResult() {
    Swal.fire({
        title: 'Simpan Hasil',
        text: 'Hasil analisis akan disimpan ke database penelitian budaya.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Tersimpan!', 'Hasil analisis berhasil disimpan.', 'success');
        }
    });
}

function learnMorePattern() {
    Swal.fire({
        title: 'Pelajari Lebih Lanjut',
        html: `
            <div class="text-start">
                <p>Untuk mempelajari lebih lanjut tentang pola batik Jawa Timur:</p>
                <ul>
                    <li>Kunjungi Museum Batik Jawa Timur</li>
                    <li>Baca buku "Batik: Warisan Budaya Indonesia"</li>
                    <li>Ikuti workshop batik tradisional</li>
                    <li>Eksplorasi database digital AI Nusantara</li>
                </ul>
            </div>
        `,
        icon: 'info',
        confirmButtonText: 'Mengerti'
    });
}

function updateCultureStats() {
    // Update culture statistics
    const stats = {
        total: 6,
        digitized: 4,
        accuracy: 92,
        time: '0.8s'
    };
    
    // Save to localStorage for tracking
    localStorage.setItem('cultureStats', JSON.stringify(stats));
}

function setupDemoListeners() {
    // Setup additional event listeners for demo
    const patternBox = document.getElementById('patternBox');
    if (patternBox) {
        patternBox.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 35px var(--shadow-color)';
        });
        
        patternBox.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 8px 25px var(--shadow-color)';
        });
    }
}

// ========== NOTIFICATION SYSTEM ==========
function showNotification(title, message, type = 'info') {
    Swal.fire({
        title: title,
        text: message,
        icon: type,
        timer: 3000,
        showConfirmButton: false
    });
}

// ========== CSS ANIMATION STYLES ==========
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        
        .project-detail-content {
            max-height: 500px;
            overflow-y: auto;
            padding-right: 10px;
        }
        
        .detail-section {
            margin-bottom: 25px;
        }
        
        .detail-section h6 {
            color: var(--primary-color);
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }
        
        .tech-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .info-box {
            background: var(--light-color);
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid var(--border-color);
        }
        
        .info-box h6 {
            color: var(--secondary-color);
            font-size: 0.9rem;
            margin-bottom: 5px;
        }
        
        .project-links {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        /* Smooth transitions for project items */
        .project-item {
            transition: opacity 0.4s ease, transform 0.4s ease;
        }
    `;
    document.head.appendChild(style);
}

// ========== BACKWARD COMPATIBILITY ==========
// Ensure backward compatibility with existing function names
function showDemo(projectId) {
    // Redirect to project demo function
    if (projectId) {
        showDemoProject(projectId);
    } else {
        // This is the culture demo function
        const demoSection = document.getElementById('demoBudaya');
        if (!demoSection) return;
        
        demoSection.style.display = 'block';
        demoSection.scrollIntoView({ behavior: 'smooth' });
        generateNewPattern();
    }
}

console.log('All scripts loaded and organized successfully');