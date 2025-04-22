
// json 데이터의 배열 가져오기
function getPuzzleData(index){
	return puzzleData.puzzle[index - 1];
}

// 현재 페이지 퍼즐 가져오기
function getCurrentPuzzleData(){
	const currentStage = getGameStage();
	return getPuzzleData(currentStage);
	
}

function getPuzzleDataLength(){
	return puzzleData.puzzle.length;
}

//// QR코드 숨겨진 장소 가져오기
//function getHiddenPlace(){
//	const currentStage = getGameStage();
//	const puzzle = puzzleData.puzzle[currentStage - 1];
//	return puzzle.hiddenPlace;
//}

// 정답 확인하기
function checkSolution(inputAnswer){
	const currentStage = getGameStage();
	const puzzle = puzzleData.puzzle[currentStage - 1];
	if(isNumberStrict(puzzle.solution)){ // 숫자형인 경우
		if(puzzle.solution == inputAnswer){
			return true;
		}
	}else{ // 문자형인경우 문자열 내의 모든 공백 문자(띄어쓰기, 탭, 줄 바꿈 등)를 제거합니다.
		if(puzzle.solution.replace(/\s/g, "") == inputAnswer.replace(/\s/g, "")){
			return true;
		}
	}
	return false;
}


// 정답 가져오기
function getSolution(){
	const currentStage = getGameStage();
	const puzzle = puzzleData.puzzle[currentStage - 1];
	return puzzle.solution;
}