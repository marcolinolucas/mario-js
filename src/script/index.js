const mario = document.querySelector('.mario');
const marioJumpAudio = document.getElementById('mario-jump-audio');
const marioDeathAudio = document.getElementById('mario-death-audio');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const playerScore = document.querySelector('.player-score');

let gameRunning = true;
let settingScore = false;

function jumpMario() {
	const alreadyJumping = mario.classList.contains('mario-jump')
	if (!gameRunning || alreadyJumping) return;

	marioJumpAudio.play()
	mario.classList.add('mario-jump');
 
	setTimeout(() => {
		mario.classList.remove('mario-jump')
		marioJumpAudio.pause();
		marioJumpAudio.currentTime = 0;
	}, 500);
}

document.addEventListener('keydown', (event) => {
	const pressSpace = event.code === 'Space' || event.code === 32;
	const pressArrowUp = event.code === 'ArrowUp' || event.code === 40;
	const pressSpaceOrArrowUp = pressSpace || pressArrowUp;

	if (pressSpaceOrArrowUp) jumpMario();
});

function stopAnimationAtPosition({ element, positionDirection, position }) {
	if (!positionDirection && !position) {
		element.classList.add('paused')
		return;
	}

	element.style.animation = 'none';
	element.style[positionDirection] = `${position}px`;
}

function changeMarioToDead() {
	mario.src = './assets/game-over.png'
	mario.style.width = '90px';
	mario.style.left = '55px';
}

function finishGame({ interval, pipeXPosition, marioYPosition }) {
	stopAnimationAtPosition({
		element: pipe,
		positionDirection: 'left',
		position: pipeXPosition,
	});
	stopAnimationAtPosition({
		element: mario,
		positionDirection: 'bottom',
		position: marioYPosition,
	});
	stopAnimationAtPosition({
		element: clouds,
	});

	marioDeathAudio.play();
	
	changeMarioToDead();
	gameRunning = false;
	clearInterval(interval);

	setTimeout(() => {
		window.location.reload();
	}, 3000);
}

function sumScore() {
	playerScore.innerHTML = parseInt(playerScore.innerHTML) + 1;
}

const gameValidation = setInterval(() => {
	const marioWidth = 150;
	const pipeHeight = 80;
	const pipeXPosition = pipe.offsetLeft;
	const marioBottom = window.getComputedStyle(mario).bottom;
	const marioYPosition = parseFloat(marioBottom.replace('px', ''));

	const pipeInMarioPosition = pipeXPosition <= marioWidth && pipeXPosition > 0;
	const marioIsJumping = marioYPosition > pipeHeight;
	const marioHitPipe = pipeInMarioPosition && !marioIsJumping;

	if (marioHitPipe) {
		finishGame({
			interval: gameValidation,
			pipeXPosition,
			marioYPosition,
		});
	} else if (pipeInMarioPosition && !settingScore) {
		settingScore = true;
		setTimeout(() => {
			if (gameRunning) sumScore()
			settingScore = false;
		}, 200);
	}
}, 10);