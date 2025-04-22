let startTime = Date.now(); // 페이지 로드 시 시작 시간 기록

$(document).ready(function() {
	if(!checkTestMode()){ // 테스트모드가 아닌 경우
		checkUserPage(); // 현재 페이지 확인
		$('#userNameLink').text(getUserName() + '님');
		setUserStageInfo();
		setHiddenPlace();
		setPuzzleImg();
		setInitHintUsed();
	//	setInitInput();
		startTime = getStartTime(); // 페이지 로드 시 시작 시간 기록
	
		updateDisplay(); // 1초 딜레이 없애기
		setInterval(updateDisplay, 1000); // 1초 간격으로 업데이트
		
		$('.hint-area .hint-levels .btn').click(function(){ // 힌트버튼 클릭
			if($(this).hasClass('btn-primary')){ // 이미 사용한 버튼은 팝업 안 띄우기
				showExistHint($(this).attr("data-hint-level"));
			}else{
				showHint($(this).attr("data-hint-level"), $(this));
			}
		});
	
		$('#userNameLink').click(function(){ // 이름 버튼 클릭
			location.href = "../start.html";
		});
	}else{ // 테스트모드 인 경우
		$('header').hide();
		$('footer').hide();
	}
});

// 정답 입력창에 포커스가 있으면 footer 숨기기
function setInitInput(){
	const $inputElement = $('.answer-input-group input:text, .answer-input-group textarea'); // 텍스트 입력창과 텍스트 영역 모두 선택
	const $footerElement = $('footer'); // 푸터 태그 선택 (ID나 클래스로 특정할 수도 있습니다.)

	// 입력창에 포커스가 들어왔을 때
	$inputElement.on('focus', function() {
		$footerElement.hide(); // 푸터를 숨깁니다.
	});

	// 입력창에서 포커스가 벗어났을 때
	$inputElement.on('blur', function() {
		$footerElement.show(); // 푸터를 다시 표시합니다.
	});
}


// 스테이지 정보 세팅
function setUserStageInfo(){
	const currentStage = getGameStage();
	$('#stageNum').text(currentStage + "번 문제");
}

// QR코드 숨겨진 장소
function setHiddenPlace(){
//	$('#hiddenPlace').text(getHiddenPlace());
	const puzzle = getCurrentPuzzleData();
	$('#hiddenPlace').text(puzzle.hiddenPlace);
}

// 퍼즐 이미지
function setPuzzleImg(){
	const puzzle = getCurrentPuzzleData();
	if(puzzle.imgUrl != ""){
		$("#puzzleImg").attr("src", puzzle.imgUrl);
	}else{
		$("#puzzleImg").hide();
	}
	if(puzzle.content != ""){
		$("#puzzleContent").text(puzzle.content);
	}else{
		$("#puzzleContent").hide();
	}
//	$('#hiddenPlace').text(getHiddenPlace());
}

// 시계 화면 업데이트
function updateDisplay() {
    const currentTime = Date.now() - startTime;
    $("#display").text(timeToString(currentTime));
}

// 힌트 보기
function showHint(hintLevel, obj) {
//	if($(obj).hasClass('btn-primary')){ // 이미 사용한 버튼은 팝업 안 띄우기
//		return;
//	}
	var currentStage = getGameStage();
	// 팝업 내용 동적 생성 및 추가
	const contentWrapper = $('<div>').attr('id', 'content-wrapper'); // 추가된 wrapper div

	const content = $('<p>' + hintLevel  + '단계의 코드번호를 입력하세요</p>');
    const inputContainer = $('<div>').attr('id', 'input-container').attr('class', 'input-group w-100 m-0');
    const nameInput = $('<input>').attr({
        type: 'text',
        id: 'hint-code-input',
        class: 'form-control',
        placeholder: '힌트코드를 입력하세요'
    });
	
    // 확인 버튼 클릭시
 	function executeEvent() {
        const inputHintCode = $('#hint-code-input').val().replace(/-/g, '');
		var currentHintUsed = getHintUsed();
//		var hintVal = getValueByIndexAndKey(currentHintUsed, currentStage-1, 'code' + hintLevel);
		var hintVal = getValueByIndexAndKey(hintConData, currentStage-1, 'code' + hintLevel);
		var hintContent = getValueByIndexAndKey(hintConData, currentStage-1, 'hint' + hintLevel);
        if (inputHintCode == hintVal) {
//        	initCookieClear(adminPass);
			$('#result-message').text(hintContent);
			$('#popup-title').text(hintLevel + '단계 힌트 조회');
			$('#content-wrapper p').remove();
			$('#input-container').remove();
			setHintUsed(currentHintUsed, currentStage-1,'is' + hintLevel, obj);
//			closePopup();
        } else if(inputHintCode != hintVal){
        	$('#result-message').text('잘못된 힌트코드입니다.');
        } else {
            $('#result-message').text('힌트코드를 입력해주세요.');
        }
    }
    const eventButton = $('<button>').attr('id', 'event-button').attr('class','btn btn-primary ms-2').text('확인').click(executeEvent);
    const resultMessage = $('<div id="result-message"></div>');

    inputContainer.append(nameInput, eventButton);
    contentWrapper.append(content, inputContainer, resultMessage); // inputContainer를 contentWrapper에 추가
    openPopupDynamic("힌트코드 입력", contentWrapper);
}

// 열어 본 적 있는 힌트 보기
function showExistHint(hintLevel){
	var currentStage = getGameStage();
	var currentHintUsed = getHintUsed();
	var hintContent = getValueByIndexAndKey(hintConData, currentStage-1, 'hint' + hintLevel);
	const content = $('<p>' + hintContent  + '</p>');
	const title = hintLevel + '단계 힌트 조회';
	openPopup(title, content);
}

// 현재 페이지 확인
function checkUserPage() {
	if(checkTestMode()){
		return true;
	}
	if(getEndTimeCookie() != null){ // 게임이 끝난 경우
		location.href = "/pages/play/Final.html";
	}else if(isNaN(getStartTime()) || getStartTimeCookie() == null){ // 시작 한 적이 없는 경우(접속 url 잘못 입력)
		goErrorPage();
	}
	var currentStage = getGameStage();
	var currentPuzzle = getPuzzleData(currentStage);
	if (currentPuzzle != null && !isCurrentPage("start.html")) {
		var currentPuzzle = getPuzzleData(currentStage);
		if (currentPuzzle.stage != currentStage) {
			goErrorPage();
		}
	}
}

// 페이지 테스트 인지 확인
function checkTestMode(){
	const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
	// const mode = $('#testMode').attr('data-param-value');
	if(mode != null && mode == "test"){
		return true;
	}else{
		return false;
	}
}

// 자물쇠 버튼 클릭하면 소리 재생
function playButtonClickSound(){
	var audio = new Audio('../../sound/mouse_click.mp3'); // 재생할 오디오 파일 경로를 지정합니다.

	// 2. 재생 시작
	audio.play().then(() => {
		// 재생이 성공적으로 시작되었을 때 실행할 코드 (선택 사항)
		console.log('오디오 재생 시작!');
	}).catch((error) => {
		// 재생이 실패했을 때 실행할 코드 (주로 자동 재생 정책 위반)
		console.error('오디오 재생 실패:', error);
		// 사용자에게 재생 버튼을 표시하거나, 오류 메시지를 보여줄 수 있습니다.
	});
}


const imageCount = 11;
var randomIndex = Math.floor(Math.random() * imageCount) + 1;
	
function showExciting(){
	$("#exciting").show();
	$("header").hide();
	$("main").hide();
	$("footer").hide();
	$("#div-exciting").css({
		"display" : "flex",
		"justify-content" : "center",
		"align-items" : "center",
		"min-height" : "100vh",
	});
	$("#div-exciting").show();

	showRandomImageAndRedirect();
}

function getRandomImageSource() {
	return "../../img/exciting/play_" + randomIndex + '.gif';
}

function getRandomSoundSource() {
	return "../../sound/sound_" + randomIndex + '.mp3';
}

function setSoundIndex() {
	
}

function showRandomImageAndRedirect() {
	var randomImageSrc = getRandomImageSource();
	$('#random-image').attr('src', randomImageSrc);
	var randomAudioSrc = getRandomSoundSource();
// 		$('#exciting-audio source')[0].attr('src', randomAudioSrc);
//         $('#exciting-audio')[0].play();
	
	var audio = new Audio(randomAudioSrc); // 재생할 오디오 파일 경로를 지정합니다.

 // 2. 재생 시작
	audio.play().then(() => {
	 // 재생이 성공적으로 시작되었을 때 실행할 코드 (선택 사항)
		console.log('오디오 재생 시작!');
   })
	.catch((error) => {
	 // 재생이 실패했을 때 실행할 코드 (주로 자동 재생 정책 위반)
		console.error('오디오 재생 실패:', error);
	 // 사용자에게 재생 버튼을 표시하거나, 오류 메시지를 보여줄 수 있습니다.
   });

	setTimeout(function() {
		if (!checkTestMode()) { // 테스트 모드가 아닌 경우
			goNextPage();
		}
	}, 2000);
}

// fetch header load된 다음 실행
function initHeader(){
	$('#userNameLink').text(getUserName() + '님');
	
	$('#userNameLink').click(function(){ // 이름 버튼 클릭
		location.href = "start.html";
	});
	setUserStageInfo();
}