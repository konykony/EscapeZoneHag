/**
 * 공통함수
 */

$(document).ready(function() {
	// 팝업 닫기 버튼 이벤트 연결
	$('#popup-close-btn').click(closePopup);
});

// URL 파라미터 값을 가져오는 함수
function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// 현재 페이지 이름 확인 ex) pathNm = index.html
function isCurrentPage(pathNm) {
	// 현재 페이지의 전체 URL을 가져옵니다.
	const fullPath = window.location.href;

	//	// URL의 마지막 부분을 가져옵니다. (경로명)
	//	const pathName = window.location.pathname;
	//
	//	// URL 또는 경로명이 "index.html"로 끝나는지 확인합니다.
	//	return currentURL.endsWith(pathNm) || pathName === "/" || pathName === "/" + pathNm;

	const pageWithExtension = fullPath.substring(fullPath.lastIndexOf('/') + 1);
	console.log(pageWithExtension);
	if (pageWithExtension.replace(/#/g, '') == pathNm) {
		return true;
	} else {
		return false;
	}
}

// 현재 페이지로 이동
function goCurrentPage() {
	var currentStage = getGameStage();
	var currentPuzzle = getPuzzleData(currentStage);
	if (currentStage == 0) { // 프롤로그 페이지로 이동
		// location.href = getProloguePage();
		location.href = "prologue.html"
	} else if (currentStage > getPuzzleDataLength()) {// 마지막 퍼즐을 마친 경우
		location.href = "final.html"
	} else if (currentPuzzle != null) {
		setGameStage(currentStage);
		location.href = currentPuzzle.lock;
	}
}

// 다음 페이지로 이동
function goNextPage() {

	var currentStage = getGameStage();
	if (isCurrentPage("prologue.html") && currentStage == 0 && (isNaN(getStartTime()) || getStartTimeCookie() == null)) { // 프롤로그 페이지인 경우
		setStartTime(); // 시작시간 추가하기
	}
	var currentStage = getGameStage();
	var nextStage = currentStage + 1;
	var nextPuzzle = getPuzzleData(nextStage);
	if (nextStage > getPuzzleDataLength()) {// 마지막 퍼즐을 마친 경우
		location.href = "final.html"
		setEndTime();
	} else if (nextPuzzle != null) {
		setGameStage(nextStage);
		location.href = nextPuzzle.lock;
	}
}

// 신나는 이모티콘 보여주기 페이지로 이동
function goExcitingPage() {
	var currentStage = getGameStage();
	var nextStage = currentStage + 1;
	var nextPuzzle = getPuzzleData(nextStage);
	if (nextStage > getPuzzleDataLength()) {// 마지막 퍼즐을 마친 경우
		location.href = "final.html"
		setEndTime();
	} else if (nextPuzzle != null) {
		setGameStage(nextStage);
		location.href = "exciting.html";
	}
}

// 잘못된 접근 페이지
function goErrorPage() {
	location.href = "error.html";
}

// 내 기록 조회 페이지 주소 얻기
function getFinalPage() {
	return "";
}

// 프롤로그 페이지 주소 얻기
function getProloguePage() {
	return "prologue.html";
}

// 팝업 열기 함수
window.openPopup = function(title, content) {
	$('#popup-title').text(title || ''); // 제목과 내용 업데이트
	$('#popup-inner-content').html(content || '');
	$('#popup-overlay').fadeIn();// 팝업 표시
};

// 팝업 열기 함수
window.openPopupDynamic = function(title, nameInput, eventButton, resultMessage) {
	$('#popup-title').text(title || '알림');
	$('#popup-inner-content').empty().append(nameInput, eventButton, resultMessage);
	$('#popup-overlay').fadeIn();
};

// 팝업 닫기 함수
window.closePopup = function() {
	$('#popup-overlay').fadeOut();
};

// JSON 값을 변경하는 함수 (예시: 특정 hint의 isHint 값을 변경)
function changeHintValue(hintIndex, hintKey, newValue) {
	if (hintNumData.hint[hintIndex] && hintNumData.hint[hintIndex].hasOwnProperty(hintKey)) {
		hintNumData.hint[hintIndex][hintKey] = newValue;
		console.log("JSON 데이터 변경:", hintNumData);
	} else {
		console.error("해당하는 hint 또는 키를 찾을 수 없습니다.");
	}
}

// JSON을 쿠키에 저장하는 함수
function setJsonToCookie(cookieName, jsonData) {
	const jsonString = JSON.stringify(jsonData);
	//	document.cookie = cookieName + "=" + encodeURIComponent(jsonString) + "; path=/";

	const domain = window.location.hostname;
	Cookies.remove(cookieName, { domain: domain });
	Cookies.set(cookieName, encodeURIComponent(jsonString), { expires: expiresDay });
	console.log("JSON 데이터가 쿠키에 저장되었습니다:", cookieName);
}

// 쿠키에 저장된 JSON을 가져와서 JSON 객체로 변환하는 함수
function getJsonFromCookie(cookieName) {
	//	const name = cookieName + "=";
	//	const decodedCookie = decodeURIComponent(document.cookie);
	const cookie = Cookies.get(cookieName);
	const decodedCookie = decodeURIComponent(cookie);
	try {
		return JSON.parse(decodedCookie);
	} catch (error) {
		return null;
	}
	//	const ca = decodedCookie.split(';');
	//	for (let i = 0; i < ca.length; i++) {
	//		let c = ca[i];
	//		while (c.charAt(0) === ' ') {
	//			c = c.substring(1);
	//		}
	//		if (c.indexOf(name) === 0) {
	//			const jsonString = c.substring(name.length, c.length);
	//			try {
	//				return JSON.parse(jsonString);
	//			} catch (error) {
	//				console.error("쿠키에서 JSON 파싱 오류:", error);
	//				return null;
	//			}
	//		}
	//	}
}

// 쿠키이름, index, key를 이용해 값 가져오기
function getValueByIndexAndKey(jsonData, index, key) {

	// index가 유효한지 확인
	if (index >= 0 && index < jsonData.hint.length) {
		const hint = jsonData.hint[index];

		// key가 유효한지 확인
		if (hint.hasOwnProperty(key)) {
			return hint[key];  // 해당 key에 대한 값을 반환
		} else {
			console.log("Invalid key");
			return null;  // key가 없으면 null 반환
		}
	} else {
		console.log("Invalid index");
		return null;  // index가 범위 밖이면 null 반환
	}
}

// hint사용여부 json 초기값을 cookie에 저장하기
function initHintUsed() {
	const hintArray = [];
	for (let i = 0; i < hintConData.hint.length; i++) {
		hintArray.push({
			"is1": "N",
			"is2": "N",
			"is3": "N",
		});
	}
	const hintNumData = {"hint" : hintArray};
	setJsonToCookie('ezHintData', hintNumData);
}

// hint사용여부 json을 cookie에서 가져오기
function getHintUsed() {
	return getJsonFromCookie('ezHintData');
}

// 힌트 사용하면 json 값 변경 후 쿠키에 다시 저장
function setHintUsed(jsonData, index, key, obj) {
	if (jsonData.hint[index] && jsonData.hint[index].hasOwnProperty(key)) {
		jsonData.hint[index][key] = "Y";
		setJsonToCookie('ezHintData', jsonData);
		$(obj).removeClass('btn-outline-secondary').addClass('btn-primary');
		console.log("JSON 데이터 변경:", jsonData);
	}
}

// hint 사용여부 쿠키에서 확인한 뒤 버튼에 사용여부 체크하기
function setInitHintUsed() {
	var currentHintUsed = getHintUsed();
	const currentStage = getGameStage();
	currentHintUsed.hint.forEach(function(item, index) {
		console.log(`Item ${index + 1}:`);
		// 각 항목에서 1, 2, 3 키와 is1, is2, is3 값을 출력
		for (let i = 1; i <= 3; i++) {
			const hintKey = i.toString(); // '1', '2', '3'
			const isKey = 'is' + i;       // 'is1', 'is2', 'is3'

			if (item[isKey] == 'Y' && currentStage == index + 1) { // 힌트를 사용한 적이 있는 경우
				setHintBtnUsed(i);
			}

			// hint 값과 is 값 출력
			console.log(`  hint${hintKey}: ${item[hintKey]}, ${isKey}: ${item[isKey]}`);
		}
	});
}

// 사용 했던 버튼은 class 변경하기
function setHintBtnUsed(level) {
	$('.hint-area .hint-levels .btn').each(function() {
		if ($(this).attr('data-hint-level') == level) {
			$(this).removeClass('btn-outline-secondary').addClass('btn-primary');
		}
		//        // 현재 버튼에 'btn' 클래스를 가지고 있는지 확인
		//        if ($(this).hasClass('btn-primary')) {
		//            console.log($(this).text() + " 버튼은 'btn' 클래스를 가지고 있습니다.");
		//        } else {
		//            console.log($(this).text() + " 버튼은 'btn' 클래스를 가지고 있지 않습니다.");
		//        }
	});
}

// 시간을 string형태로 가져오기
function timeToString(time) {
	const diffInHrs = Math.floor(time / (1000 * 60 * 60));
	const diffInMins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
	const diffInSecs = Math.floor((time % (1000 * 60)) / 1000);

	const formattedHrs = String(diffInHrs).padStart(2, '0');
	const formattedMins = String(diffInMins).padStart(2, '0');
	const formattedSecs = String(diffInSecs).padStart(2, '0');

	return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
}

// 숫자형인지 확인
function isNumberStrict(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}