var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;
var currentIndex = 0;
var nextIndex = 1;
var imageUrls = [
    "img/canvas1.jpg",
    "img/canvas2.jpg",
    "img/canvas3.jpg",
    "img/canvas4.jpg",
    "img/canvas5.jpg",
];
var transitionProgress = 0;
var transitionSpeed = 0.003;
var intervalId;

function loadImage(url) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        img.onload = function () {
            resolve(img);
        };
        img.onerror = function () {
            reject(new Error('이미지를 로드할 수 없습니다: ' + url));
        };
        img.src = url;
    });
}

// 이미지 변경 함수
function changeImage() {
    var currentImg;
    var nextImg;

    loadImage(imageUrls[currentIndex]).then(function (img) {
        currentImg = img;
        loadImage(imageUrls[nextIndex]).then(function (img) {
            nextImg = img;
            resizeCanvas(currentImg, nextImg); // 이미지 크기 조정
            animateTransition(currentImg, nextImg);
        });
    });
}

// 캔버스 크기 조정 함수
function resizeCanvas(currentImg, nextImg) {
    canvas.width = currentImg.width; // 캔버스 너비를 현재 이미지의 너비로 설정
    canvas.height = currentImg.height; // 캔버스 높이를 현재 이미지의 높이로 설정
}

// 이미지 전환 애니메이션
function animateTransition(currentImg, nextImg) {
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 현재 이미지 그리기
        ctx.globalAlpha = 1 - transitionProgress;
        ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);

        // 다음 이미지 그리기
        ctx.globalAlpha = transitionProgress;
        ctx.drawImage(nextImg, 0, 0, canvas.width, canvas.height);

        transitionProgress += transitionSpeed;

        if (transitionProgress >= 1) {
            // 전환 완료
            ctx.globalAlpha = 1;
            ctx.drawImage(nextImg, 0, 0, canvas.width, canvas.height);

            // 전환 상태 초기화
            transitionProgress = 0;
            currentImg = nextImg;
            nextIndex = (nextIndex + 1) % imageUrls.length;
            loadImage(imageUrls[nextIndex]).then(function (img) {
                nextImg = img;
            });
        }

        // 애니메이션 반복
        requestAnimationFrame(animate);
    }

    animate();
}

// 다음 이미지로 이동
function nextImage() {
    currentIndex = (currentIndex + 1) % imageUrls.length;
    nextIndex = (currentIndex + 1) % imageUrls.length;
    changeImage();
}

// 이전 이미지로 이동
function prevImage() {
    currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    nextIndex = (currentIndex + 1) % imageUrls.length;
    changeImage();
}

// 자동으로 이미지 변경
function startAutoSlide() {
    intervalId = setInterval(function () {
        nextImage();
    }, 2000); // 2초마다 다음 이미지로 이동
}

// 정지 버튼 클릭 시 자동 슬라이드 중지
function stopAutoSlide() {
    clearInterval(intervalId);
    intervalId = null; // intervalId 재할당
}

// 초기 이미지 표시
changeImage();


