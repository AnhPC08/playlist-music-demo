/**
 *  1. render song
 *  2. Sroll top
 *  3. play / pause / seek
 *  4. cd rotate
 *  5. next / prev
 *  6. Random
 *  7. Next / repeat when ended
 *  8. active song
 *  9. scroll active song interview
 *  10. play song when click
 */



const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'AnhPC_PLAYER'


const cd = $('.cd');
const heading = $('.header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const btnNext= $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playList = $('.playlist')

const app = {

    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

    songs: [
        {
            name: "Có Ai Hẹn Hò Cùng Em Chưa",
            singer: "Quân A.P x Doãn Hiếu",
            path: "./assets/music/co-ai-hen-ho-cung-em-chua-quan-a-p-official-mv.mp3",
            img: "./assets/imgs/coaihenhochua.png"
        },
        {
            name: "Đừng Làm Trái Tim Anh Đau",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/tp-dung-lam-trai-tim-anh-dau-official-music-video.mp3",
            img: "./assets/imgs/dunglamtimanhdau.png"
        },
        {
            name: " Bước Qua Nhau",
            singer: "Vũ",
            path: "./assets/music/buoc-qua-nhau.mp3",
            img: "./assets/imgs/buocquanhau.jpg"
        },
        {
            name: "Có Ai Hẹn Hò Cùng Em Chưa",
            singer: "Quân A.P x Doãn Hiếu",
            path: "./assets/music/co-ai-hen-ho-cung-em-chua-quan-a-p-official-mv.mp3",
            img: "./assets/imgs/coaihenhochua.png"
        },
        {
            name: "Đừng Làm Trái Tim Anh Đau",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/tp-dung-lam-trai-tim-anh-dau-official-music-video.mp3",
            img: "./assets/imgs/dunglamtimanhdau.png"
        },
        {
            name: " Bước Qua Nhau",
            singer: "Vũ",
            path: "./assets/music/buoc-qua-nhau.mp3",
            img: "./assets/imgs/buocquanhau.jpg"
        },
        {
            name: "Có Ai Hẹn Hò Cùng Em Chưa",
            singer: "Quân A.P x Doãn Hiếu",
            path: "./assets/music/co-ai-hen-ho-cung-em-chua-quan-a-p-official-mv.mp3",
            img: "./assets/imgs/coaihenhochua.png"
        },
        {
            name: "Đừng Làm Trái Tim Anh Đau",
            singer: "Sơn Tùng MTP",
            path: "./assets/music/tp-dung-lam-trai-tim-anh-dau-official-music-video.mp3",
            img: "./assets/imgs/dunglamtimanhdau.png"
        },
        {
            name: " Bước Qua Nhau",
            singer: "Vũ",
            path: "./assets/music/buoc-qua-nhau.mp3",
            img: "./assets/imgs/buocquanhau.jpg"
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                <div class="thumb" 
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');

    },

    currentIndex: 0,

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
          get: function () {
            return this.songs[this.currentIndex];
          }
        })
        
      },

    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    isActiveSong: false,

    handleEvents: function() {
        const _this = this;

        // Xử lí cd quay / dừng:
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000, //10s
            interations: Infinity
        })

        // Xử lí phóng to / thu nhỏ:
        const cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scollTop;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
            
        }

        // Xử lí khi click play:
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()         
            } else {           
                audio.play()                
            }
        }

        // khi song đc play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()

        }

        // khi song đc pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        }

        // Xử lí khi tua song 
        progress.onchange = function(event) {
            const seekTime = audio.duration / 100 * event.target.value
            audio.currentTime = seekTime
        }

        // khi next song
        btnNext.onclick = function() {
            if (_this.isRamdom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // khi prev song
        btnPrev.onclick = function() {
            if (_this.isRamdom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lí bật / tắt random song
        btnRandom.onclick = function() {
            _this.isRamdom = !_this.isRamdom
            _this.setConfig('isRandom', _this.isRamdom)
            btnRandom.classList.toggle('active', _this.isRamdom)
            
        }

        // xử lí next khi kết thúc bài hát / repeat
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
        }

        // Xử lí khi bật / tắt repeat
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }

        // Xử lí khi click vào playlist
        playList.onclick = function(event) {
            const songNode = event.target.closest('.song:not(.active)')
            if ( songNode || event.target.closest('.option') ) {
                // Xử lí khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lí khi click vào song option
                if (event.target.closest('.option') ) {
                    console.log('Sắp ra mắt nhé')
                }
            } 
        }


    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },

    loadConfig: function() {
        this.isRamdom = this.config.isRamdom
        this.isRepeat = this.config.isRepeat
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path

        
    },

    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length
        }
        this.loadCurrentSong()
    },

    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },


    start: function() {
        // gán cấu hình từ config vào ứng dụng (object)
        this.loadConfig()

        this.handleEvents()
        this.render()
        this.defineProperties()
        this.loadCurrentSong()
        this.nextSong()
        this.prevSong()
        this.playRandomSong()

        btnRandom.classList.toggle('active', this.isRamdom)
        btnRepeat.classList.toggle('active', this.isRepeat)

    },


}

app.start()