/**
 * 쿠키 관리
 */

let expiresDay = 7; // 쿠키 만료일
let PASS_WORD = "konny";

// 쿠키 초기화
function initCookieClear(password){
	if(password == PASS_WORD){
		// 현재 도메인 정보
		const domain = window.location.hostname;
		
		// Cookies.remove('ezUserName', { domain: domain });
		// Cookies.remove('ezGameStage', { domain: domain });
		// Cookies.remove('ezStartTime', { domain: domain });
		// Cookies.remove('ezEndTime', { domain: domain });
		// Cookies.remove('ezHintData', { domain: domain });
		// Cookies.remove('ezGameName', { domain: domain });

		// var currentStage = 0;
		// puzzleData.puzzle.forEach(element => {
		// 	currentStage += 1;
		// 	Cookies.remove('ezStage' + currentStage + 'StartTime', { domain: domain });
		// });
		const cookies = Cookies.get(); // 모든 쿠키를 key-value 객체 형태로 가져옵니다.

		for (const cookieName in cookies) {
		if (cookies.hasOwnProperty(cookieName)) {
			Cookies.remove(cookieName, { domain: domain }); // 각 쿠키를 이름(key)을 사용하여 삭제합니다.
		}
		}
		return true;
	}else{
		return false;
	}
}

// 쿠키가 존재 하는지 확인하는 기능
function checkCookieExists(){
	if(Cookies.get('ezUserName') != null && Cookies.get('ezGameStage') != null){
		return true;
	}else{
		return false;
	}
}

// 쿠키에 사용자 이름 추가
function setUserName(name){
	Cookies.set('ezUserName', name, { expires: expiresDay, domain: window.location.hostname });
}

// 쿠키에서 사용자 이름 가져오기
function getUserName(){
	return Cookies.get('ezUserName'); 
}

// 쿠키에 게임 스테이지 추가
function setGameStage(index){
	Cookies.set('ezGameStage', index, { expires: expiresDay, domain: window.location.hostname });
}

// 쿠키에서 게임 스테이지 가져오기
function getGameStage(){
	return parseInt(Cookies.get('ezGameStage')); 
}

// 쿠키에 게임 시작 시간 추가
function setStartTime(){
	Cookies.set('ezStartTime', new Date(), { expires: expiresDay, domain: window.location.hostname });
}

// 쿠키에서 게임 시작 시간 date type으로 변환 하고 가져오기
function getStartTime(){
	const cookie = getStartTimeCookie();
	return new Date(cookie); 
}

// 쿠키에서 게임 시작 시간 쿠키 값 그대로 가져오기
function getStartTimeCookie(){
return Cookies.get('ezStartTime'); 
}

// 쿠키에 게임 종료 시간 추가
function setEndTime(){
	if(isNaN(Cookies.get('ezEndTime'))){
		Cookies.set('ezEndTime', new Date(), { expires: expiresDay, domain: window.location.hostname });

		var currentStage = getGameStage();
		var nextStage = currentStage + 1;
		setGameStage(nextStage);
	}
}

// 쿠키에서 게임 종료 시간 date type으로 변환 하고 가져오기
function getEndTime(){
const cookie = getEndTimeCookie();
	return new Date(cookie); 
}

// 쿠키에서 게임 종료 시간 쿠키 값 그대로 가져오기
function getEndTimeCookie(){
	return Cookies.get('ezEndTime'); 
}

// 스테이지 시작시간 추가
function setStageStartTime(){
	if(getStageStartTimeCookie() == null){
		setStageStartTimeCookie();
	}
}
// 스테이지 시작시간 추가
function setStageStartTimeCookie(){
	var currentStage = getGameStage();
	Cookies.set('ezStage' + currentStage + 'StartTime', new Date(), { expires: expiresDay, domain: window.location.hostname });
}

// 쿠키에서 스테이지 시작시간 date type으로 변환 하고 가져오기
function getStageStartTime(){
const cookie = getStageStartTimeCookie();
	return new Date(cookie); 
}

// 스테이지 시작시간 쿠키 값 그대로 가져오기
function getStageStartTimeCookie(){
	var currentStage = getGameStage();
	return Cookies.get('ezStage' + currentStage + 'StartTime');
}

// 쿠키에 게임 이름 추가
function setGameName(name){
	Cookies.set('ezGameName', name, { expires: expiresDay, domain: window.location.hostname });
}

// 쿠키에서 게임 이름 가져오기
function getGameName(){
	return Cookies.get('ezGameName'); 
}