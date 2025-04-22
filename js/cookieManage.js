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
		
		Cookies.remove('ezUserName', { domain: domain });
		Cookies.remove('ezGameStage', { domain: domain });
		Cookies.remove('ezStartTime', { domain: domain });
		Cookies.remove('ezEndTime', { domain: domain });
		Cookies.remove('ezHintData', { domain: domain });
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
	Cookies.set('ezUserName', name, { expires: expiresDay });
}

// 쿠키에서 사용자 이름 가져오기
function getUserName(){
	return Cookies.get('ezUserName'); 
}

// 쿠키에 게임 스테이지 추가
function setGameStage(index){
	Cookies.set('ezGameStage', index, { expires: expiresDay });
}

// 쿠키에서 게임 스테이지 가져오기
function getGameStage(){
	return parseInt(Cookies.get('ezGameStage')); 
}

// 쿠키에 게임 시작 시간 추가
function setStartTime(){
	Cookies.set('ezStartTime', new Date(), { expires: expiresDay });
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
		Cookies.set('ezEndTime', new Date(), { expires: expiresDay });

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