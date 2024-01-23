function matching(user) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: function () {
              return document.querySelector("body").innerText;
          }
      }, function (result) {
          if (chrome.runtime.lastError || !result || !result[0]) {
            console.log(chrome.runtime.lastError.message);
            console.error("스크립트 실행에 문제가 발생했습니다:", chrome.runtime.lastError);
          } else {
            //이 문서에서 body 태그 아래에 있는 모든 텍스트를 가져온다. 그 결과를 bodyText라는 변수에 담는다.
            var bodyText = result[0].result;

            // bodyText의 모든 단어를 추출하고, 그 단어의 숫자를 센다. 그 결과를 bodyNum이라는 변수에 담는다.
            var bodyNum = bodyText.split(' ').length;
            
            //match 메서드는 일치하는 문자열을 찾지 못하면 null을 반환
            //따라서 이 부분에 대한 예외 처리를 추가
            var matches = user? bodyText.match(new RegExp('\\b(' + user + ')\\b', 'gi')):null;
            var myNum = matches ? matches.length : 0;
            //bodyText에서 자신이 알고있는 단어(the)가 몇번 등장하는 지 알아본다. 그 결과를 mynNum이라는 변수에 담는다.
            //var myNum = bodyText.match(new RegExp('\\b(' + user + ')\\b', 'gi')).length;

            //alert(myNum + '/' + bodyNum + '(' + (myNum / bodyNum * 100) + '%)');

            var per = myNum / bodyNum * 100;
            per = per.toFixed(1);

            //id값이 result인 태그에 결과를 추가한다.
            document.querySelector('#result').innerText = myNum + '/' + bodyNum + '(' + (per) + '%)';
          }
      });
  });
}

//크롬 스토리지에 저장된 값을 가져오세요.
chrome.storage.sync.get(function (data) {
  // #user의 값으로 data의 값을 입력해주세요.
  document.querySelector('#user').value = data.userWords;
  matching(data.userWords);
});

//컨텐츠 페이지의 #user 입력된 값이 변경 되었을 '때'
document.querySelector('#user').addEventListener('input', function () {
  //컨텐츠 페이지에 몇개의 단어가 등장하는지 계산해주세요
  var user = document.querySelector('#user').value;

  //크롬 스토리지에 입력값을 저장한다.
  chrome.storage.sync.set({
      userWords: user
  });

  //컨텐츠 페이지를 대상으로 코드를 실행해주세요.
  matching(user);
});



